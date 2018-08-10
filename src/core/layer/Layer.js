import { OrthographicCamera, Scene, Mesh, PlaneBufferGeometry, MeshBasicMaterial } from 'three';
import EffectComposer from '../postprocessing/EffectComposer';

/**
 * render layer, for multi-function render pipeline, support after-effects
 */
class Layer {
  /**
   * layer required a renderer
   * @param {WebGLRenderer} renderer webgl renderer
   * @param {Object} options options
   */
  constructor(renderer) {
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
     * cache renderer object in local
     * @member {WebGLRenderer}
     */
    this.renderer = renderer;

    /**
     * Not Recommend set it to true, if it was true, this layer will forced rendering to the screen,
     * you should make sure why you set renderToScreen with true.
     * @member {Boolean}
     */
    this.renderToScreen = false;

    /**
     * framebuffer will auto clear
     * @member {Boolean}
     */
    this.autoClear = true;

    /**
     * effect composer, for postprogressing
     * @member {EffectComposer}
     */
    this.afterEffects = new EffectComposer(this.renderer);

    /**
     * after effect update delta
     * @member {Number}
     */
    this.aeDelta = 0;

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

    const readBuffer = this.afterEffects.readBuffer;
    /**
     * quad, for composite draw
     * @member {Mesh}
     */
    this.quad = new Mesh(
      new PlaneBufferGeometry(2, 2),
      new MeshBasicMaterial({
        transparent: true,
        map: readBuffer.texture,
        depthTest: false,
        depthWrite: false,
      }));

    this.scene.add(this.quad);
  }

  /**
   * clear framebuffer
   */
  clear() {
    this.renderer.setRenderTarget(this.afterEffects.readBuffer);
    this.renderer.clear(this.renderer.autoClearColor, this.renderer.autoClearDepth, this.renderer.autoClearStencil);
  }

  /**
   * composite draw, use it when need composition
   * @param {WebGLRenderTarget} renderTarget render to which buffer
   * @private
   */
  draw(renderTarget) {
    this.renderer.render(this.scene, this.camera, renderTarget);
  }

  /**
   * add a after-effects pass to this layer
   * @param {Pass} pass pass process
   */
  addPass(pass) {
    this.afterEffects.addPass(pass);
  }

  /**
   * insert a after-effects pass to this layer
   * @param {Pass} pass pass process
   * @param {Number} index insert which position
   */
  insertPass(pass, index) {
    this.afterEffects.insertPass(pass, index);
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
      if (this.parent) {
        this.parent.needSort = true;
      }
    }
  }

  /**
   * get after-effects was active
   * @return {Boolean} active or not
   */
  get isAeOpen() {
    return this.afterEffects.isActive;
  }
}

export default Layer;
