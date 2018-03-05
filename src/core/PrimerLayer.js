import Layer from './Layer';

/**
 * primerLayer, use to display primers content, support after-effects
 */
class PrimerLayer extends Layer {
  /**
   * required renderer, and you can set config for WebGLRenderTarget
   * @param {WebGLRenderer} renderer webgl renderer
   * @param {Object} options config for renderTarget
   */
  constructor(renderer, options) {
    super(renderer, options);

    this.primers = [];
  }

  /**
   * update timeline
   * @param {Number} snippet time snippet
   * @private
   */
  updateTimeline(snippet) {
    this.scene.updateTimeline(snippet);

    this.primers.forEach(primer => {
      primer.updateTimeline(snippet);
    });
  }

  /**
   * render primerLayer to buffer
   * @param {PerspectiveCamera} camera use which Perspective-Camera to look around the world
   */
  render() {
    const renderTarget = this.renderToScreen ? null : this.afterEffects.readBuffer;

    if (this.autoClear) this.clear();

    const length = this.primers.length;
    for (let i = 0; i < length; i++) {
      const primer = this.primers[i];
      if (primer.enabled) primer.render(this.renderer, renderTarget);
    }

    if (this.isAeOpen) {
      this.afterEffects.render(this.aeDelta);
    }
  }

  /**
   * push a display object into primerLayer scene
   *
   * @param {THREE.Object3D} object display object, which will be rendering
   * @return {this} this
   */
  add(object) {
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) {
        this.add(arguments[ i ]);
      }
      return this;
    }

    if ((object && object.isPrimer)) {
      if (object.parent !== null) {
        object.parent.remove(object);
      }

      object.parent = this;

      this.primers.push(object);
    } else {
      console.error('PrimerLayer.add: object not an instance of Primer.', object);
    }
    return this;
  }

  /**
   * remove a display object from primerLayer scene
   *
   * @param {THREE.Object3D} object display object, which will be rendering
   * @return {this} this
   */
  remove(object) {
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) {
        this.remove(arguments[ i ]);
      }
      return this;
    }
    const index = this.primers.indexOf(object);

    if (index !== -1) {
      object.parent = null;
      this.primers.splice(index, 1);
    }
    return this;
  }

  /**
   * get primers status
   */
  get isEmpty() {
    const length = this.primers.length;
    const none = length === 0;
    let invalid = true;
    for (let i = 0; i < length; i++) {
      if (this.primers[i].enabled) {
        invalid = false;
        break;
      }
    }
    return none || invalid;
  }
}

export default PrimerLayer;
