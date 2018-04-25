import { Scene } from 'three';
import Layer from './Layer';

/**
 * graphicsLayer, use to display 3d scene, support after-effects
 */
class GraphicsLayer extends Layer {
  /**
   * required renderer, and you can set config for WebGLRenderTarget
   * @param {WebGLRenderer} renderer webgl renderer
   * @param {Object} options config for renderTarget
   */
  constructor(renderer, options) {
    super(renderer, options);

    /**
     * graphics 3d scene
     * @member {Scene}
     */
    this.graphics = new Scene();
  }

  /**
   * update timeline
   * @param {Number} snippet time snippet
   * @private
   */
  updateTimeline(snippet) {
    this.scene.updateTimeline(snippet);
    this.graphics.updateTimeline(snippet);
  }

  /**
   * render graphicsLayer to buffer
   * @param {PerspectiveCamera} camera use which Perspective-Camera to look the world
   */
  render(camera) {
    const renderTarget = this.renderToScreen ? null : this.afterEffects.readBuffer;

    if (this.autoClear) this.clear();

    this.renderer.render(this.graphics, camera, renderTarget);

    if (this.isAeOpen) {
      this.afterEffects.render(this.aeDelta);
    }
  }

  /**
   * push a display object into graphics
   *
   * @param {THREE.Object3D} child display object, which will be rendering
   * @return {this} this
   */
  add() {
    this.graphics.add.apply(this.graphics, arguments);
    return this;
  }

  /**
   * remove a display object from graphics
   *
   * @param {THREE.Object3D} child display object, which you had push it at before
   * @return {this} this
   */
  remove() {
    this.graphics.remove.apply(this.graphics, arguments);
    return this;
  }

  /**
   * get primers status
   */
  get isEmpty() {
    return this.graphics.children.length === 0;
  }
}

export default GraphicsLayer;

