import EffectComposer from '../postprocessing/EffectComposer';

/**
 * compositor, use to merge primerLayer and graphicsLayer
 */
class Compositor {
  /**
   * compositor required a renderer
   * @param {WebGLRenderer} renderer webgl renderer
   */
  constructor(renderer) {
    /**
     * cache renderer object in local
     * @member {WebGLRenderer}
     */
    this.renderer = renderer;

    /**
     * whether sort layers or not
     * @member {Boolean}
     */
    this.needSort = false;

    /**
     * framebuffer will auto clear
     * @member {Boolean}
     */
    this.autoClear = true;

    /**
     * store layers
     * @member {Array}
     */
    this.layers = [];

    /**
     * effect composer, for postprogressing
     * @member {EffectComposer}
     */
    this.afterEffects = new EffectComposer(this.renderer, true);

    /**
     * after effect update delta
     * @member {Number}
     */
    this.aeDelta = 0;
  }

  /**
   * merge layer with zIndex order, and add after effects
   * @param {PerspectiveCamera} camera use which Perspective-Camera to look the world
   */
  render(camera) {
    if (this.needSort) this._sortList();
    this.renderLayers(camera);
    this.composition();
  }

  renderLayers(camera) {
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      layer.render(camera);
    }
  }

  composition() {
    const isAeOpen = this.isAeOpen;

    const renderTarget = isAeOpen ? this.afterEffects.readBuffer : null;

    if (this.autoClear) this.clear(renderTarget);

    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      layer.draw(renderTarget);
    }

    if (isAeOpen) {
      this.afterEffects.render(this.aeDelta);
    }
  }

  /**
   * clear framebuffer
   * @param {WebGLRenderTarget} renderTarget clear which render target
   */
  clear(renderTarget) {
    this.renderer.setRenderTarget(renderTarget);
    this.renderer.clear(this.renderer.autoClearColor, this.renderer.autoClearDepth, this.renderer.autoClearStencil);
  }

  /**
   * add a layer into compositor
   *
   * @param {Layer} layer primerLayer or graphicsLayer
   * @return {this} this
   */
  add(layer) {
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) {
        this.add(arguments[ i ]);
      }
      return this;
    }

    if ((layer && layer.isLayer)) {
      if (layer.parent !== null) {
        layer.parent.remove(layer);
      }

      layer.parent = this;

      this.layers.push(layer);
      this.needSort = true;
    } else {
      console.error('Compositor.add: layer not an instance of PrimerLayer or GraphicsLayer.', layer);
    }
    return this;
  }

  /**
   * remove a layer from compositor
   *
   * @param {Layer} layer primerLayer or graphicsLayer
   * @return {this} this
   */
  remove(layer) {
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) {
        this.remove(arguments[ i ]);
      }
      return this;
    }
    const index = this.layers.indexOf(layer);

    if (index !== -1) {
      layer.parent = null;
      this.layers.splice(index, 1);
    }
    return this;
  }

  /**
   * add a after-effects pass to this compositor
   * @param {Pass} pass pass process
   */
  addPass(pass) {
    this.afterEffects.addPass(pass);
  }

  /**
   * insert a after-effects pass to this compositor
   * @param {Pass} pass pass process
   * @param {Number} index insert to which position
   */
  insertPass(pass, index) {
    this.afterEffects.insertPass(pass, index);
  }

  /**
   * sort layer, because array.sort was not stable-sort, so use bubble sort
   * @private
   */
  _sortList() {
    const layers = this.layers;
    const length = layers.length;
    let i;
    let j;
    let temp;
    for (i = 0; i < length - 1; i++) {
      for (j = 0; j < length - 1 - i; j++) {
        if (layers[j].zIndex > layers[j + 1].zIndex) {
          temp = layers[j];
          layers[j] = layers[j + 1];
          layers[j + 1] = temp;
        }
      }
    }
    this.needSort = false;
  }

  /**
   * get after-effects was active
   * @return {Boolean} active or not
   */
  get isAeOpen() {
    return this.afterEffects.isActive;
  }
}

export default Compositor;
