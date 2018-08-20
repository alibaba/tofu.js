import { PerspectiveCamera, StereoCamera } from 'three';
// import InteractionManager from 'three.interaction/src/interaction/InteractionManager';
import Orienter from '../utils/Orienter';
// import Utils from '../utils/Utils';
import Layer from './Layer';

class XRLayer extends Layer {
  constructor(options) {
    super(options);
    const { vrsensor, fov = 60, aspect = this.width / this.height, near = 0.1, far = 1000 } = options;
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
  }

  /**
   * update stereo camera
   */
  updateStereo() {
    if (this.camera.parent === null) this.camera.updateMatrixWorld();
    this.stereo.update(this.camera);
  }

  /**
   * render all scene
   * @param {WebGLRender} renderer renderer context
   * @param {object} session renderer session
   */
  render(renderer, session) {
    if (this.autoClear) {
      renderer.setRenderTarget(this.effectPack.renderTarget);
      renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
    }

    if (session.mode === 'VR') {
      const camera = session.eye === 'LEFT' ? this.stereo.cameraL : this.stereo.cameraR;
      renderer.render(this.scene, camera, this.effectPack.renderTarget);
    } else {
      renderer.render(this.scene, this.camera, this.effectPack.renderTarget);
    }
  }

  /**
   * set render rectangle area
   * @param {WebGLRender} renderer rectangle left-top point x-position
   * @param {number} x rectangle left-top point x-position
   * @param {number} y rectangle left-top point y-position
   * @param {number} width rectangle width
   * @param {number} height rectangle height
   */
  setSV(renderer, x, y, width, height) {
    renderer.setScissor(x, y, width, height);
    renderer.setViewport(x, y, width, height);
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
   * getter whether scene interactively or not
   */
  get vrmode() {
    return this._vrmode;
  }

  /**
   * setter whether scene interactively or not
   * @param {Boolean} value is interactively ?
   */
  set vrmode(value) {
    if (value !== this.vrmode) {
      this._vrmode = value;
      this.vrmodeOnChange();
    }
  }
}

export default XRLayer;
