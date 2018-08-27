import { OrthographicCamera } from 'three';
import Layer from './Layer';

class PrimerLayer extends Layer {
  constructor(options) {
    super(options);

    /**
     * camera for this 2D context
     *
     * @member {OrthographicCamera}
     */
    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
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
    this.scene.children.forEach(child => {
      child.setSize && child.setSize(width, height);
    });
  }
}

export default PrimerLayer;
