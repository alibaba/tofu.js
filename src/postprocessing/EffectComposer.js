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
    const { width = 300, height = 150 } = options;
    this.width = width;
    this.height = height;

    this.renderTarget1 = new WebGLRenderTarget(this.width, this.height, parameters);
    this.renderTarget1.texture.name = 'EffectComposer.rt1';

    this.renderTarget2 = this.renderTarget1.clone();
    this.renderTarget2.texture.name = 'EffectComposer.rt2';

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

  render(renderer, layer, delta) {
    const il = layer.passes.length;

    // copy content to readBuffer
    this.copyPass.render(renderer, this.readBuffer, layer.renderTarget);

    // add effect like yoyo
    for (let i = 0; i < il; i++) {
      const pass = layer.passes[i];
      if (pass.enabled === false) continue;

      pass.render(renderer, this.writeBuffer, this.readBuffer, delta);

      if (pass.needsSwap) {
        this.swapBuffers();
      }
    }

    // copy content back to layer buffer
    this.copyPass.render(renderer, layer.renderTarget, this.readBuffer);
  }

  setSize(width, height) {
    this.renderTarget1.setSize(width, height);
    this.renderTarget2.setSize(width, height);

    this.width = width;
    this.height = height;
  }

}
