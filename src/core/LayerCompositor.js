import {
  OrthographicCamera,
  Scene,
} from 'three';

/**
 * layer compositor, use to merge primerLayer and graphicsLayer
 */
class LayerCompositor {
  constructor(options) {
    const { width = 300, height = 150 } = options;
    this.width = width;
    this.height = height;

    /**
     * framebuffer will auto clear
     * @member {Boolean}
     */
    this.autoClear = true;

    /**
     * orthographic camera, for composite draw
     * @member {OrthographicCamera}
     */
    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    /**
     * scene, for composite draw
     * @member {Scene}
     */
    this.scene = new Scene();
  }

  composition(renderer, renderTarget) {
    if (this.autoClear) this.clear(renderer, renderTarget);
    renderer.render(this.scene, this.camera, renderTarget);
  }

  /**
   * clear framebuffer
   * @param {WebGLRender} renderer renderer from view
   * @param {WebGLRenderTarget} renderTarget clear which render target
   */
  clear(renderer, renderTarget) {
    renderer.setRenderTarget(renderTarget);
    renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
  }

  /**
   * resize window when viewport has change
   * @param {number} width render buffer width
   * @param {number} height render buffer height
   */
  setSize(width, height) {
    console.log(width, height);
  }
}

export default LayerCompositor;
