import { WebGLRenderer, EventDispatcher } from 'three';
import GraphicsLayer from './GraphicsLayer';
import PrimerLayer from './PrimerLayer';
import Compositor from './Compositor';
import ViewPort from './ViewPort';
import Utils from '../utils/Utils';

/**
 * a `UC-AR` renderer framework, help you building AR-APP fastly
 * @extends EventDispatcher
 * @param {Object} options config for `Viewer` render view-port
 * @param {canvas} options.canvas `canvas-dom` or canvas `css-selector`
 * @param {Boolean} [options.autoClear=true] whether the renderer should automatically clear its output before rendering a frame.
 * @param {Boolean} [options.alpha=false] whether the canvas contains an alpha (transparency) buffer or not.
 * @param {Boolean} [options.antialias=false] whether to perform antialiasing.
 * @param {String} [options.precision='highp'] Shader precision, Can be `highp`, `mediump` or `lowp`.
 * @param {Boolean} [options.premultipliedAlpha=true] whether the renderer will assume that colors have premultiplied alpha.
 * @param {Boolean} [options.stencil=true] whether the drawing buffer has a stencil buffer of at least 8 bits.
 * @param {Boolean} [options.preserveDrawingBuffer=false] whether to preserve the buffers until manually cleared or overwritten.
 * @param {Boolean} [options.depth=true] whether the drawing buffer has a depth buffer of at least 16 bits.
 * @param {Boolean} [options.logarithmicDepthBuffer] whether to use a logarithmic depth buffer.
 */
class Viewer extends EventDispatcher {
  constructor(options) {

    const { width = 300, height = 150, updateStyle = false } = options;

    super();

    /**
     * view-port camera object, a perspective camera
     *
     * @member {Camera}
     */
    this.camera = null;

    /**
     * `WebGL` renderer object, base on `three.js` gl context
     * @member {WebGLRenderer}
     */
    this.renderer = new WebGLRenderer(new ViewPort(options));

    /**
     * init set renderer size
     * @private
     */
    this.renderer.setSize(width, height, updateStyle);

    /**
     * close auto-clear, and change
     * @private
     */
    this.renderer.autoClear = false;

    /**
     * whether the renderer should automatically clear its output before rendering a frame.
     *
     * @member {Boolean}
     */
    this.autoClear = Utils.isBoolean(options.autoClear) ? options.autoClear : true;

    /**
     * whether update is working or not
     *
     * @member {Boolean}
     */
    this.ticking = false;

    /**
     * pre-time cache
     *
     * @member {Number}
     * @private
     */
    this.pt = 0;

    /**
     * how long the time through, at this tick
     *
     * @member {Number}
     * @private
     */
    this.snippet = 0;

    /**
     * set it when you hope engine update at a fixed fps, default 60/fps
     *
     * @member {Number}
     */
    this.fps = options.fps || 60;

    /**
     * time-scale for timeline
     *
     * @member {Number}
     */
    this.timeScale = 1;

    /**
     * primer paint a plane as a background or foreground
     * @member {PrimerLayer}
     */
    this.primerLayer = new PrimerLayer(this.renderer);

    /**
     * 3d Graphics layer, for render 3d scene
     * @member {GraphicsLayer}
     */
    this.graphicsLayer = new GraphicsLayer(this.renderer);

    /**
     * compositor primerLayer and graphicsLayer with zIndex order
     * @member {Compositor}
     */
    this.compositor = new Compositor(this.renderer);

    /**
     * add primerLayer and graphicsLayer to compositor
     */
    this.compositor.add(this.primerLayer, this.graphicsLayer);
  }

  /**
   * update timeline and update render
   */
  update() {
    this.timeline();
    const snippet = this.snippet;

    this.emit('pretimeline', {
      snippet,
    });
    this.updateTimeline(snippet);
    this.emit('posttimeline', {
      snippet,
    });

    this.emit('prerender', {
      snippet,
    });
    this.render();
    this.emit('postrender', {
      snippet,
    });
  }

  /**
   * update timeline
   * @param {Number} snippet time snippet
   * @private
   */
  updateTimeline(snippet) {
    this.primerLayer.updateTimeline(snippet);
    this.graphicsLayer.updateTimeline(snippet);
  }

  /**
   * render all 3d stage, should be overwrite by sub-class
   */
  render() {
    console.warn('should be overwrite by sub-class');
  }

  /**
   * render primerLayer and graphicsLayer, if you have not use primerLayer, we will direct render graphicsLayer
   * @param {PerspectiveCamera} camera use which perspective-camera
   */
  renderLayer(camera) {
    this.compositor.render(camera);
  }

  /**
   * render loop, trigger one and one tick
   *
   * @private
   */
  tick() {
    const This = this;
    /**
     * render loop
     */
    (function render() {
      This.update();
      This.loop = RAF(render);
    })();
  }

  /**
   * update loop with fixed fps, maybe case a performance problem
   *
   * @private
   */
  tickFixedFPS() {
    const This = this;
    this.loop = setInterval(function() {
      This.update();
    }, 1000 / this.fps);
    This.update();
  }

  /**
   * get timeline snippet
   *
   * @private
   */
  timeline() {
    const snippet = Date.now() - this.pt;
    this.pt += snippet;
    this.snippet = snippet * this.timeScale;
  }

  /**
   * start update engine
   * @return {this} this
   */
  start() {
    if (this.ticking) return;
    this.ticking = true;
    this.pt = Date.now();
    if (this.fps === 60) {
      this.tick();
    } else {
      this.tickFixedFPS();
    }
    return this;
  }

  /**
   * stop update engine
   * @return {this} this
   */
  stop() {
    CAF(this.loop);
    clearInterval(this.loop);
    this.ticking = false;
    return this;
  }

  /**
   * add a primer to primerLayer
   * @return {this} this
   */
  addPrimer() {
    this.primerLayer.add.apply(this.primerLayer, arguments);
    return this;
  }

  /**
   * remove a primer from primerLayer
   * @return {this} this
   */
  removePrimer() {
    this.primerLayer.remove.apply(this.primerLayer, arguments);
    return this;
  }
}

export default Viewer;
