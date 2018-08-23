import { LinearFilter, RGBAFormat, WebGLRenderTarget } from 'three';
import CopyShader from '../shader/CopyShader';
import ShaderPass from './ShaderPass';

const parameters = {
  minFilter: LinearFilter,
  magFilter: LinearFilter,
  format: RGBAFormat,
  stencilBuffer: false,
};

/**
 * @author alteredq / http://alteredqualia.com/
 * @private
 */
export default class EffectComposer {
  constructor(options) {
    const { width, height } = options;

    this.renderTarget1 = new WebGLRenderTarget(width, height, parameters);
    this.renderTarget1.texture.name = 'RT1';

    this.renderTarget2 = this.renderTarget1.clone();
    this.renderTarget2.texture.name = 'RT2';

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

    // dependencies ShaderPass and CopyShader
    this.copyPass = new ShaderPass(CopyShader);
  }

  swapBuffers() {
    const tmp = this.readBuffer;
    this.readBuffer = this.writeBuffer;
    this.writeBuffer = tmp;
  }

  render(renderer, effectPack, toScreen) {
    const il = effectPack.passes.length;
    const delta = effectPack.delta || 10;

    // copy content to readBuffer
    this.copyPass.render(renderer, this.readBuffer, effectPack.renderTarget);

    // add effect like yoyo
    for (let i = 0; i < il; i++) {
      const pass = effectPack.passes[i];
      if (pass.enabled === false) continue;

      pass.render(renderer, this.writeBuffer, this.readBuffer, delta);

      if (pass.needsSwap) {
        this.swapBuffers();
      }
    }

    // copy content back to layer buffer
    const renderTarget = toScreen ? null : effectPack.renderTarget;
    this.copyPass.render(renderer, renderTarget, this.readBuffer);
  }

  /**
   * resize buffer size when viewport has change
   * @param {number} width render buffer width
   * @param {number} height render buffer height
   */
  setSize(width, height) {
    this.renderTarget1.setSize(width, height);
    this.renderTarget2.setSize(width, height);
  }

}
