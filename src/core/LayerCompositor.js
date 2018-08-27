import {
  OrthographicCamera,
  Scene,
} from 'three';

/**
 * layer compositor, use to merge primerLayer and graphicsLayer
 */
class LayerCompositor {
  constructor() {
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

  /**
   * push a display object into scene
   *
   * @param {THREE.Object3D} child display object, which will be rendering
   * @return {this} this
   */
  add() {
    this.scene.add.apply(this.scene, arguments);
    return this;
  }

  /**
   * remove a display object from scene
   *
   * @param {THREE.Object3D} child display object, which you had push it at before
   * @return {this} this
   */
  remove() {
    this.scene.remove.apply(this.scene, arguments);
    return this;
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
}

export default LayerCompositor;
