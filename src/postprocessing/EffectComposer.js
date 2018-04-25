import { LinearFilter, RGBAFormat, WebGLRenderTarget } from 'three';
import CopyShader from '../shader/CopyShader';
import ShaderPass from './ShaderPass';
import MaskPass from './MaskPass';
import ClearMaskPass from './ClearMaskPass';

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
  constructor(renderer, autoToScreen) {
    this.cw = 0;
    this.ch = 0;

    this.renderer = renderer;

    this.autoToScreen = autoToScreen || false;

    const size = renderer.getDrawingBufferSize();
    this.cw = size.width;
    this.ch = size.height;
    this.renderTarget1 = new WebGLRenderTarget(size.width, size.height, parameters);
    this.renderTarget1.texture.name = 'EffectComposer.rt1';

    this.renderTarget2 = this.renderTarget1.clone();
    this.renderTarget2.texture.name = 'EffectComposer.rt2';

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

    this.passes = [];

    // dependencies

    if (CopyShader === undefined) {
      console.error('EffectComposer relies on CopyShader');
    }

    if (ShaderPass === undefined) {
      console.error('EffectComposer relies on ShaderPass');
    }

    this.copyPass = new ShaderPass(CopyShader);

  }

  swapBuffers() {
    const tmp = this.readBuffer;
    this.readBuffer = this.writeBuffer;
    this.writeBuffer = tmp;
  }

  addPass(pass) {
    this.passes.push(pass);

    const size = this.renderer.getDrawingBufferSize();
    pass.setSize(size.width, size.height);
  }

  insertPass(pass, index) {
    this.passes.splice(index, 0, pass);
  }

  render(delta) {
    let maskActive = false;
    const il = this.passes.length;

    if (this.autoToScreen) this.setRTS();

    for (let i = 0; i < il; i++) {
      const pass = this.passes[i];
      if (pass.enabled === false) continue;
      pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive);

      if (pass.needsSwap) {
        if (maskActive) {
          const context = this.renderer.context;
          context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);
          this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta);
          context.stencilFunc(context.EQUAL, 1, 0xffffffff);
        }
        this.swapBuffers();
      }

      if (MaskPass !== undefined) {
        if (pass instanceof MaskPass) {
          maskActive = true;
        } else if (pass instanceof ClearMaskPass) {
          maskActive = false;
        }
      }
    }
  }

  setRTS() {
    let l = this.passes.length - 1;
    let first = true;

    for (; l >= 0; l--) {
      const pass = this.passes[l];
      if (pass.enabled && first) {
        pass.renderToScreen = true;
        first = false;
      } else {
        pass.renderToScreen = false;
      }
    }
  }

  reset(renderTarget) {
    if (renderTarget === undefined) {
      const size = this.renderer.getDrawingBufferSize();
      renderTarget = this.renderTarget1.clone();
      renderTarget.setSize(size.width, size.height);
    }

    this.renderTarget1.dispose();
    this.renderTarget2.dispose();
    this.renderTarget1 = renderTarget;
    this.renderTarget2 = renderTarget.clone();

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

  }

  setSize(width, height) {
    if (width === this.cw && height === this.ch) return;

    this.renderTarget1.setSize(width, height);
    this.renderTarget2.setSize(width, height);

    for (let i = 0; i < this.passes.length; i++) {
      this.passes[i].setSize(width, height);
    }
    this.cw = width;
    this.ch = height;
  }

  get isActive() {
    const length = this.passes.length;
    const hasPass = length > 0;
    let invalid = false;
    for (let i = 0; i < length; i++) {
      if (this.passes[i].enabled) {
        invalid = true;
        break;
      }
    }
    return hasPass && invalid;
  }
}
