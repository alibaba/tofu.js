import { PerspectiveCamera, StereoCamera } from 'three';
import Viewer from './Viewer';
import InteractionManager from 'three.interaction/src/interaction/InteractionManager';
import SphereWorld from '../extras/panorama/SphereWorld';
import CylinderWorld from '../extras/panorama/CylinderWorld';
import Utils from '../utils/Utils';
import Orienter from '../utils/Orienter';

/**
 * `XR-Viewer` a `UC-VR` or `UC-3D` renderer framework
 * @extends Viewer
 * @param {Object} options config for `XR-Viewer` render view-port
 * @param {canvas} options.canvas `canvas-dom` or canvas `css-selector`
 * @param {Number} [options.width=300] init renderer width.
 * @param {Number} [options.height=150] init renderer height.
 * @param {Number} [options.updateStyle=false] auto update css style when setSize.
 * @param {Number} [options.fov=60] Camera frustum vertical field of view.
 * @param {Number} [options.aspect=width/height] Camera frustum aspect ratio.
 * @param {Number} [options.near=0.1] Camera frustum near plane.
 * @param {Number} [options.far=1000] Camera frustum far plane.
 * @param {Number} [options.vrmode=false] whether init with vrmode.
 * @param {Number} [options.stereoAspect=0.5] stereo camera aspect for vrmode.
 * @param {Number} [options.vrsensor=false] whether init with vrsensor.
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
class XRViewer extends Viewer {
  constructor(options) {
    super(options);

    const { width, height } = this.renderer.getSize();

    const { vrmode, vrsensor, fov = 60, aspect = width / height, near = 0.1, far = 1000 } = options;

    /**
     * view-port camera object, a perspective camera
     *
     * @member {Camera}
     */
    this.camera = new PerspectiveCamera(fov, aspect, near, far);

    /**
     * stereo camera object
     *
     * @member {StereoCamera}
     */
    this.stereo = new StereoCamera();
    this.stereo.aspect = options.stereoAspect || 0.5;

    /**
     * enable vr-mode or not
     *
     * @member {Boolean}
     */
    this.vrmode = vrmode || false;

    /**
     * use orientation sensor or not
     *
     * @member {Boolean}
     */
    this.vrsensor = vrsensor || false;

    /**
     * device orientation sensor, control camera look around
     *
     * @member {Orienter}
     */
    this.sensorCTL = new Orienter();

    // update sensor state before update timeline
    this.sensorCTL.on('deviceorientation', ({ quaternion }) => {
      if (this.vrsensor) {
        this.camera.quaternion.copy(quaternion);
      }
    });

    /**
     * 3d-view interaction manager
     * TODO: should fix interaction bug when vrmode
     */
    this.interactionManager = new InteractionManager(this.renderer, this.graphicsLayer.graphics, this.camera);

    // update interaction in every tick
    const interactionUpdate = ({ snippet }) => {
      this.interactionManager.update(snippet);
    };

    /**
     * whether all 3d-view is interactively or not
     *
     * @member {boolean}
     * @private
     */
    this._interactive = null;

    this.interactiveOnChange = function() {
      if (this.interactive) {
        this.on('pretimeline', interactionUpdate);
        this.interactionManager.addEvents();
      } else {
        this.off('pretimeline', interactionUpdate);
        this.interactionManager.removeEvents();
      }
    };

    /**
     * whether all 3d-view is interactively or not
     *
     * @member {boolean}
     */
    this.interactive = Utils.isBoolean(options.interactive) ?
      options.interactive :
      true;
  }

  /**
   * scene background
   */
  get background() {
    return this._background;
  }

  /**
   * set scene background
   * @param {SphereWorld|CylinderWorld} bg scene background
   */
  set background(bg) {
    if (bg instanceof SphereWorld || bg instanceof CylinderWorld) {
      this._background = bg;

      if (bg.needCamera) {
        bg.setCamera(this.camera);
      }
      if (bg.needMount) {
        this.add(bg);
      }
    } else {
      console.log('unexpected background instance, only support SphereWorld、CylinderWorld');
    }
  }

  /**
   * getter whether scene interactively or not
   */
  get interactive() {
    return this._interactive;
  }

  /**
   * setter whether scene interactively or not
   * @param {Boolean} value is interactively ?
   */
  set interactive(value) {
    if (value !== this.interactive) {
      this._interactive = value;
      this.interactiveOnChange();
    }
  }

  /**
   * render all scene
   */
  render() {
    if (this.autoClear) {
      this.renderer.setRenderTarget(null);
      this.renderer.clear(this.renderer.autoClearColor, this.renderer.autoClearDepth, this.renderer.autoClearStencil);
    }

    this.xrrender();
  }

  /**
   * auto switch render-mode, use vrmode or not
   */
  xrrender() {
    const size = this.renderer.getDrawingBufferSize();
    if (this.vrmode) {
      const hw = size.width / 2;
      this.updateStereo();

      this.renderer.setScissorTest(true);

      this.setSV(0, 0, hw, size.height);
      this.renderLayer(this.stereo.cameraL);

      this.setSV(hw, 0, hw, size.height);
      this.renderLayer(this.stereo.cameraR);

      this.renderer.setScissorTest(false);
    } else {
      this.setSV(0, 0, size.width, size.height);

      this.renderLayer(this.camera);
    }
  }

  /**
   * update stereo camera
   */
  updateStereo() {
    if (this.camera.parent === null) this.camera.updateMatrixWorld();
    this.stereo.update(this.camera);
  }

  /**
   * set render rectangle area
   * @param {*} x rectangle left-top point x-position
   * @param {*} y rectangle left-top point y-position
   * @param {*} width rectangle width
   * @param {*} height rectangle height
   */
  setSV(x, y, width, height) {
    this.renderer.setScissor(x, y, width, height);
    this.renderer.setViewport(x, y, width, height);
  }

  /**
   * push a display object into graphicsLayer scene
   *
   * @param {THREE.Object3D} child display object, which will be rendering
   * @return {this} this
   */
  add() {
    this.graphicsLayer.add.apply(this.graphicsLayer, arguments);
    return this;
  }

  /**
   * remove a display object from graphicsLayer scene
   *
   * @param {THREE.Object3D} child display object, which you had push it at before
   * @return {this} this
   */
  remove() {
    this.graphicsLayer.remove.apply(this.graphicsLayer, arguments);
    return this;
  }
}

export default XRViewer;
