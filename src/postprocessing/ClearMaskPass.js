import Pass from './Pass';

export default class ClearMaskPass extends Pass {
  constructor() {
    super();
    this.needsSwap = false;
  }

  render(renderer) {
    renderer.state.buffers.stencil.setTest(false);
  }
}
