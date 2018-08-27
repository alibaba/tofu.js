import { PerspectiveCamera, StereoCamera } from 'three';
import Orienter from '../../utils/Orienter';
import Layer from './Layer';

class XRLayer extends Layer {
  constructor(options) {
    super(options);
    const { width, height, vrsensor, fov = 60, aspect = width / height, near = 0.1, far = 1000 } = options;
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
    // this.stereo.aspect = options.stereoAspect || 0.5;

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

    this.interactive = true;
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
    if (this.autoClear) this.clear(renderer, this.effectPack.renderTarget);

    if (session.mode === 'VR') {
      this.updateStereo();
      const camera = session.eye === 'LEFT' ? this.stereo.cameraL : this.stereo.cameraR;
      renderer.render(this.scene, camera, this.effectPack.renderTarget);
    } else {
      renderer.render(this.scene, this.camera, this.effectPack.renderTarget);
    }
  }

  /**
   * resize layer size when viewport has change
   * @param {number} width layer buffer width
   * @param {number} height layer buffer height
   */
  setSize(width, height) {
    this.effectPack.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
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
