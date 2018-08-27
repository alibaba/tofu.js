import { PerspectiveCamera, Vector4 } from 'three';
import Layer from './Layer';

class ARLayer extends Layer {
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
    this.scene.add(object);
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
    this.scene.remove(object);
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
   * @return {Object} view port
   */
  updateViewport() {
    const { width, height } = this.effectPack;
    const rw = width / this.frameWidth;
    const rh = height / this.frameHeight;
    const ratio = Math.max(rw, rh);
    const rtw = this.frameWidth * ratio;
    const rth = this.frameHeight * ratio;

    let sx = 0;
    let sy = 0;

    if (rw < rh) {
      sx = -(rtw - width) / 2;
    } else if (rw > rh) {
      sy = -(rth - height) / 2;
    }

    // this.renderer.setViewport(sx, sy, rtw, rth);
    return { sx, sy, rtw, rth };
  }

  /**
   * render all scene
   * @param {WebGLRender} renderer renderer context
   * @param {object} session renderer session
   */
  render(renderer) {
    if (this.autoClear) this.clear(renderer, this.effectPack.renderTarget);

    renderer.render(this.scene, this.camera, this.effectPack.renderTarget);
  }

  /**
   * resize layer size when viewport has change
   * @param {number} width layer buffer width
   * @param {number} height layer buffer height
   */
  setSize(width, height) {
    this.effectPack.setSize(width, height);

    const { sx, sy, rtw, rth } = this.updateViewport();
    this.effectPack.renderTarget.viewport = new Vector4(sx, sy, rtw, rth);
  }
}

export default ARLayer;
