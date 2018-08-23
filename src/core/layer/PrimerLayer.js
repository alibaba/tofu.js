import { OrthographicCamera } from 'three';
import Layer from './Layer';

class PrimerLayer extends Layer {
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
     * camera for this 2D context
     *
     * @member {OrthographicCamera}
     */
    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
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
  render(renderer, session) {
    if (this.autoClear) this.clear(renderer, this.effectPack.renderTarget);
    const { sx, sy, rtw, rth } = this.updateViewport();
    const { x, y, z, w } = session.viewport;

    renderer.setViewport(sx, sy, rtw, rth);
    renderer.render(this.scene, this.camera, this.effectPack.renderTarget);
    renderer.setViewport(x, y, z, w);
  }

  /**
   * resize layer size when viewport has change
   * @param {number} width layer buffer width
   * @param {number} height layer buffer height
   */
  setSize(width, height) {
    this.effectPack.setSize(width, height);
  }
}

export default PrimerLayer;
