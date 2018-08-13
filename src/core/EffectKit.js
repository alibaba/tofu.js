import {
  LinearFilter,
  RGBAFormat,
  WebGLRenderTarget,
} from 'three';

const parameters = {
  minFilter: LinearFilter,
  magFilter: LinearFilter,
  format: RGBAFormat,
  stencilBuffer: false,
};

class EffectPack {
  constructor(options) {
    const { width = 300, height = 150 } = options;

    this.width = width;

    this.height = height;

    /**
     * render buffer to carry render content
     */
    this.renderTarget = new WebGLRenderTarget(this.width, this.height, parameters);

    /**
     * after effect update delta
     * @member {Number}
     */
    this.aeDelta = 0;

    /**
     * store pass array, all effect pass list
     * @member {pass}
     */
    this.passes = [];
  }

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
   * get after-effects was active
   * @return {Boolean} active or not
   */
  get isAeOpen() {
    const length = this.passes.length;
    if (length === 0) return false;
    for (let i = 0; i < length; i++) {
      if (this.passes[i].enabled) return true;
    }
    return false;
  }
}

export default EffectPack;
