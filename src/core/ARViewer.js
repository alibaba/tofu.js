import { PerspectiveCamera } from 'three';
import Viewer from './Viewer';

/**
 * AR-Viewer a UC-AR renderer framework
 * @extends Viewer
 * @param {Object} options config for `AR-Viewer` render view-port
 * @param {canvas} options.canvas `canvas-dom` or canvas `css-selector`
 * @param {Number} [options.width=300] init renderer width.
 * @param {Number} [options.height=150] init renderer height.
 * @param {Number} [options.frameWidth=480] set ar-video-frame width.
 * @param {Number} [options.frameHeight=640] set ar-video-frame height.
 * @param {Number} [options.updateStyle=false] auto update css style when setSize.
 * @param {Boolean} [options.interactive=true] whether interactive with scene.
 * @param {Number} [options.fps=60] render frame rate.
 * @param {Boolean} [options.autoClear=true] whether the renderer should automatically clear its output before rendering a frame.
 * @param {Boolean} [options.alpha=false] whether the canvas contains an alpha (transparency) buffer or not.
 * @param {Boolean} [options.antialias=false] whether to perform antialiasing.
 * @param {String} [options.precision='highp'] Shader precision, Can be `highp`, `mediump` or `lowp`.
 * @param {Boolean} [options.premultipliedAlpha=true] whether the renderer will assume that colors have premultiplied alpha.
 * @param {Boolean} [options.stencil=true] whether the drawing buffer has a stencil buffer of at least 8 bits.
 * @param {Boolean} [options.preserveDrawingBuffer=false] whether to preserve the buffers until manually cleared or overwritten.
 * @param {Boolean} [options.depth=true] whether the drawing buffer has a depth buffer of at least 16 bits.
 * @param {Boolean} [options.logarithmicDepthBuffer] whether to use a logarithmic depth buffer.
 */
class ARViewer extends Viewer {
  constructor(options) {
    super(options);

    const { frameWidth = 480, frameHeight = 640 } = options;

    /**
     * video frame width
     * @member {Number}
     */
    this.frameWidth = frameWidth;

    /**
     * video frame height
     * @member {Number}
     */
    this.frameHeight = frameHeight;

    // init update viewport for ar-video-frame
    this.updateViewport();

    /**
     * view-port camera object, a perspective camera
     *
     * @member {PerspectiveCamera}
     */
    this.camera = new PerspectiveCamera();
    this.camera.matrixAutoUpdate = false;

    /**
     * tracking object `<markerName-arGlue>` map
     *
     * @member {Object}
     */
    this.ar_map = {};
  }

  /**
   * render layers
   */
  render() {
    if (this.autoClear) {
      this.renderer.setRenderTarget(null);
      this.renderer.clear(this.renderer.autoClearColor, this.renderer.autoClearDepth, this.renderer.autoClearStencil);
    }

    this.renderLayer(this.camera);
  }

  /**
   * add display-object like `ARGlue` or `THREE.Object3D` object
   *
   * @param {ARGlue|THREE.Object3D} object display-object which you want show
   * @return {this} this
   */
  add(object) {
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) {
        this.add(arguments[i]);
      }
      return this;
    }

    if (object.type === 'ARGlue') {
      const name = object.name;
      this.ar_map[name] = object;
    }
    this.graphicsLayer.add(object);
    return this;
  }

  /**
   * remove `ARGlue` or `THREE.Object3D` object
   *
   * @param {ARGlue|THREE.Object3D} object display-object which you had add before
   * @return {this} this
   */
  remove(object) {
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) {
        this.remove(arguments[i]);
      }
      return this;
    }

    if (object.type === 'ARGlue') {
      const name = object.name;
      this.ar_map[name] = null;
    }
    this.graphicsLayer.remove(object);
    return this;
  }

  /**
   * update tracking-display-object's pose state, poses get from `UC-AR`
   *
   * @param {Array} poses poses matrix array
   */
  updatePoses(poses) {
    poses.forEach(({ name, matrix, isDetected }) => {
      const glue = this.ar_map[name];
      if (glue) {
        glue.updatePose(matrix, isDetected);
      }
    });
  }

  /**
   * update camera internal parama matrix, this matrix get from `UC-AR`
   *
   * @param {Array} matrix 4*4 matrix
   */
  updateCameraMatrix(matrix) {
    this.camera.projectionMatrix.fromArray(matrix);
  }

  /**
   * adjust viewport, when frameWidth frameHeight or renderer.getSize had change
   */
  updateViewport() {
    const { width, height } = this.renderer.getSize();
    const rw = width / this.frameWidth;
    const rh = height / this.frameHeight;
    const ratio = Math.max(rw, rh);
    const rtw = this.frameWidth * ratio;
    const rth = this.frameHeight * ratio;

    let x = 0;
    let y = 0;

    if (rw < rh) {
      x = -(rtw - width) / 2;
    } else if (rw > rh) {
      y = -(rth - height) / 2;
    }

    this.renderer.setViewport(x, y, rtw, rth);
  }
}

export default ARViewer;
