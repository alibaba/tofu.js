import {
  LinearFilter,
  RGBAFormat,
  OrthographicCamera,
  Scene,
  WebGLRenderTarget,
  Mesh,
  PlaneBufferGeometry,
  MeshBasicMaterial,
} from 'three';
// import EffectComposer from '../postprocessing/EffectComposer';

const parameters = {
  minFilter: LinearFilter,
  magFilter: LinearFilter,
  format: RGBAFormat,
  stencilBuffer: false,
};

/**
 * render layer, for multi-function render pipeline, support after-effects
 */
class Layer {
  /**
   * layer required a renderer
   * @param {Object} options options
   */
  constructor(options) {
    const { width = 300, height = 150 } = options;

    this.width = width;

    this.height = height;

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
    // this.renderer = renderer;

    /**
     * Not Recommend set it to true, if it was true, this layer will forced rendering to the screen,
     * you should make sure why you set renderToScreen with true.
     * @member {Boolean}
     */
    // this.renderToScreen = false;

    /**
     * framebuffer will auto clear
     * @member {Boolean}
     */
    // this.autoClear = true;

    /**
     * effect composer, for postprogressing
     * @member {EffectComposer}
     */
    // this.afterEffects = new EffectComposer(this.renderer);

    /**
     * after effect update delta
     * @member {Number}
     */
    this.aeDelta = 0;

    /**
     * render buffer to carry render content
     */
    this.renderTarget = new WebGLRenderTarget(this.width, this.height, parameters);

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

    /**
     * store pass array, all effect pass list
     * @member {pass}
     */
    this.passes = [];

    /**
     * quad, for composite draw
     * @member {Mesh}
     */
    this.quad = new Mesh(
      new PlaneBufferGeometry(2, 2),
      new MeshBasicMaterial({
        transparent: true,
        map: this.renderTarget.texture,
        depthTest: false,
        depthWrite: false,
      })
    );
  }

  /**
   * update timeline
   * @param {Number} snippet time snippet
   * @private
   */
  updateTimeline(snippet) {
    this.scene.updateTimeline(snippet);
  }

  render(renderer) {
    renderer.render(this.scene, this.camera, this.renderTarget);
  }

  /**
   * clear framebuffer
   */
  // clear() {
  //   this.renderer.setRenderTarget(this.afterEffects.readBuffer);
  //   this.renderer.clear(this.renderer.autoClearColor, this.renderer.autoClearDepth, this.renderer.autoClearStencil);
  // }

  /**
   * composite draw, use it when need composition
   * @param {WebGLRenderTarget} renderTarget render to which buffer
   * @private
   */
  // draw(renderTarget) {
  //   this.renderer.render(this.scene, this.camera, renderTarget);
  // }

  /**
   * add a after-effects pass to this layer
   * @param {Pass} pass pass process
   */
  addPass(pass) {
    this.passes.push(pass);
    pass.setSize(this.width, this.height);
  }

  /**
   * insert a after-effects pass to this layer
   * @param {Pass} pass pass process
   * @param {Number} index insert which position
   */
  insertPass(pass, index) {
    this.passes.splice(index, 0, pass);
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
