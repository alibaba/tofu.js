import {
  Mesh,
  Scene,
  PlaneBufferGeometry,
  MeshBasicMaterial,
} from 'three';
import EffectPack from '../EffectPack';

/**
 * render layer, for multi-function render pipeline, support after-effects
 */
class Layer {
  /**
   * layer required a renderer
   * @param {Object} options options
   */
  constructor(options) {
    const { width, height } = options;

    /**
     * the parent of this layer, sometime was compositor
     * @member {Compositor}
     */
    this.parent = null;

    /**
     * zIndex order, for render list
     * @member {Number}
     * @private
     */
    this._zIndex = 0;

    /**
     * layer tag, fast check isLayer
     * @member {Boolean}
     */
    this.isLayer = true;

    /**
     * framebuffer will auto clear
     * @member {Boolean}
     */
    this.autoClear = true;

    /**
     * time-scale for timeline
     *
     * @member {Number}
     */
    this.timeScale = 1;

    /**
     * after effect update delta TODO: link to effect pack
     * @member {Number}
     */
    this.aeDelta = 0;

    /**
     * render effect kit to carry render content and some data
     */
    this.effectPack = new EffectPack({ width, height });

    /**
     * camera, for composite draw
     * @member {Camera}
     */
    this.camera = null;

    /**
     * scene, for composite draw
     * @member {Scene}
     */
    this.scene = new Scene();

    /**
     * quad, for composite draw
     * @member {Mesh}
     */
    this.quad = new Mesh(
      new PlaneBufferGeometry(2, 2),
      new MeshBasicMaterial({
        transparent: true,
        map: this.effectPack.renderTarget.texture,
        depthTest: false,
        depthWrite: false,
      })
    );

    this.interactive = false;
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

  /**
   * update timeline
   * @param {Number} snippet time snippet
   * @private
   */
  updateTimeline(snippet) {
    snippet = this.timeScale * snippet;
    this.scene.updateTimeline(snippet);
  }

  render(renderer) {
    if (this.autoClear) this.clear(renderer, this.effectPack.renderTarget);

    renderer.render(this.scene, this.camera, this.effectPack.renderTarget);
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
   * add a after-effects pass to this layer
   * @param {Pass} pass pass process
   */
  addPass() {
    this.effectPack.addPass.apply(this.effectPack, arguments);
  }

  /**
   * insert a after-effects pass to this layer
   * @param {Pass} pass pass process
   * @param {Number} index insert which position
   */
  insertPass() {
    this.effectPack.insertPass.apply(this.effectPack, arguments);
  }

  /**
   * resize layer size when viewport has change
   * @param {number} width layer buffer width
   * @param {number} height layer buffer height
   */
  setSize(width, height) {
    this.effectPack.setSize(width, height);
  }

  /**
   * get zIndex
   * @return {Number} zIndex
   */
  get zIndex() {
    return this._zIndex;
  }

  /**
   * set zIndex
   * @param {Number} index zIndex
   */
  set zIndex(index) {
    if (this._zIndex !== index) {
      this._zIndex = index;
      this.quad.renderOrder = index;
      if (this.parent) {
        this.parent.needSort = true;
      }
    }
  }

  /**
   * get primers status
   */
  get isEmpty() {
    return this.scene.children.length === 0;
  }
}

export default Layer;
