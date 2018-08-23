import {
  WebGLRenderer,
  EventDispatcher,
  Vector4,
} from 'three';
import EffectComposer from './EffectComposer';
import InteractionLayer from 'three.interaction/src/interaction/InteractionLayer';
// import GraphicsLayer from './GraphicsLayer';
// import PrimerLayer from './PrimerLayer';
import LayerCompositor from './LayerCompositor';
import ViewConfig from './ViewConfig';
import EffectPack from './EffectPack';
import Utils from '../utils/Utils';

/**
 * a `UC-AR` renderer framework, help you building AR-APP fastly
 * @extends EventDispatcher
 * @param {Object} options config for `Viewer` render view-port
 * @param {canvas} options.canvas `canvas-dom` or canvas `css-selector`
 * @param {Number} [options.vrmode=false] whether init with vrmode.
 * @param {Number} [options.updateStyle=false] need update canvas style size.
 * @param {Number} [options.pixelRatio=1] render buffer resolution.
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
    super();

    const { pixelRatio = 1, width = 300, height = 150, updateStyle = false, vrmode = false } = options;

    this.width = width;

    this.height = height;

    this.viewBox = { width: width * pixelRatio, height: height * pixelRatio };

    /**
     * `WebGL` renderer object, base on `three.js` gl context
     * @member {WebGLRenderer}
     */
    this.renderer = new WebGLRenderer(new ViewConfig(options));

    /**
     * init set pixelRatio
     * @private
     */
    // this.renderer.setPixelRatio(pixelRatio);

    /**
     * init set renderer size
     * @private
     */
    // this.renderer.setSize(width, height, updateStyle);

    /**
     * render effect kit to carry render content and some data
     */
    this.effectPack = new EffectPack(this.viewBox);

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
     * whether update ticker is working or not
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
     * effect composer, for postprogressing
     * @member {EffectComposer}
     */
    this.effectComposer = new EffectComposer(this.viewBox);

    /**
     * compositor primerLayer and graphicsLayer with zIndex order
     * @member {LayerCompositor}
     */
    this.layerCompositor = new LayerCompositor();

    /**
     * store layers array, all content layer list
     * @member {layer}
     */
    this.layers = [];

    /**
     * 3d-view interaction manager
     * TODO: should fix interaction bug when vrmode
     */
    this.interactionLayer = new InteractionLayer(this.renderer);

    this.setPixelRatio(pixelRatio, updateStyle);

    this.viewport = new Vector4();

    this._vrmode = null;

    this.vrmodeOnChange = () => {
      this.emit('vrmodeChange');
      this.setPassesSize();
      this.setComposerSize();
      this.setLayersSize();
    };

    this.vrmode = vrmode;

    this.session = {
      viewport: this.viewport,
    };
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
    snippet = this.timeScale * snippet;

    this.emit('pretimeline', {
      snippet,
    });

    let i = 0;
    const layers = this.layers;
    const length = layers.length;
    while (i < length) {
      layers[i].updateTimeline(snippet);
      i++;
    }

    this.emit('posttimeline', {
      snippet,
    });
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
   * set render rectangle area
   * @param {number} x rectangle left-top point x-position
   * @param {number} y rectangle left-top point y-position
   * @param {number} width rectangle width
   * @param {number} height rectangle height
   */
  setSV(x, y, width, height) {
    this.viewport.set(x, y, width, height);
    this.renderer.setScissor(x, y, width, height);
    this.renderer.setViewport(x, y, width, height);
  }

  /**
   * render all 3d stage, should be overwrite by sub-class
   */
  render() {
    if (this.autoClear) this.clear(null);
    const size = this.viewBox;
    if (this.vrmode) {
      const hw = size.width / 2;
      this.session.mode = 'VR';

      this.renderer.setScissorTest(true);

      this.setSV(0, 0, hw, size.height);
      this.session.eye = 'LEFT';
      this.xrRender();

      this.setSV(hw, 0, hw, size.height);
      this.session.eye = 'RIGHT';
      this.xrRender();

      this.renderer.setScissorTest(false);
    } else {
      this.session.mode = 'NORMAL';
      this.session.eye = '';
      this.setSV(0, 0, size.width, size.height);
      this.xrRender();
    }

  }

  /**
   * render every layer to it's render buffer
   * @private
   */
  xrRender() {
    this.renderLayers(this.session);
    this.layerEffect();
    this.composition();
  }

  /**
   * render every layer to it's render buffer
   * @param {object} session a renderer session
   * @private
   */
  renderLayers(session) {
    if (this.needSort) {
      this._sortList();
      this.needSort = false;
    }
    const ll = this.layers.length;
    for (let i = 0; i < ll; i++) {
      const layer = this.layers[i];
      if (!layer.isEmpty) layer.render(this.renderer, session);
    }
  }

  /**
   * process every layer effect magic
   *
   * @private
   */
  layerEffect() {
    const ll = this.layers.length;
    for (let i = 0; i < ll; i++) {
      const layer = this.layers[i];
      if (layer.effectPack.isAeOpen) this.effectComposer.render(this.renderer, layer.effectPack);
    }
  }

  /**
   * composition every layer to a single layer or render to screen
   *
   * @private
   */
  composition() {
    const isAeOpen = this.effectPack.isAeOpen;
    const renderTarget = isAeOpen ? this.effectPack.renderTarget : null;
    this.layerCompositor.composition(this.renderer, renderTarget);
    if (isAeOpen) {
      this.viewEffect();
    }
  }

  /**
   * if this view has pass effect, do magic again
   *
   * @private
   */
  viewEffect() {
    this.effectComposer.render(this.renderer, this.effectPack, true);
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
    let snippet = Date.now() - this.pt;
    if (!this.pt || snippet > 200) {
      this.pt = Date.now();
      snippet = Date.now() - this.pt;
    }
    this.pt += snippet;
    this.snippet = snippet;
  }

  /**
   * start update engine
   * @return {this} this
   */
  start() {
    if (this.ticking) return;
    this.ticking = true;
    this.pt = Date.now();
    if (this.fps >= 60) {
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
   * sort layer, because array.sort was not stable-sort, so use bubble sort
   *
   * @private
   */
  _sortList() {
    Utils.bubbleSort(this.layers, el => el.zIndex);
  }

  /**
   * add a layer into layer compositor
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
      this.layerCompositor.add(layer.quad);
      this.setLayerSize(layer);
      this.needSort = true;
    } else {
      console.error('Compositor.add: layer not an instance of Layer.', layer);
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
      this.layerCompositor.remove(layer.quad);
    }
    return this;
  }

  /**
   * add a after-effects pass to this layer
   * @param {Pass} pass pass process
   */
  addPass() {
    this.effectPack.addPass.apply(this.effectPack, arguments);
  }

  /**
   * insert a after-effects pass to this layer
   * @param {Pass} pass pass process
   * @param {Number} index insert which position
   */
  insertPass() {
    this.effectPack.insertPass.apply(this.effectPack, arguments);
  }

  getPortSize() {
    let { width, height } = this.viewBox;
    if (this.vrmode) {
      width = width / 2;
    }
    return { width, height };
  }

  setLayersSize() {
    const { width, height } = this.getPortSize();
    const l = this.layers.length;
    for (let i = 0; i < l; i++) {
      const layer = this.layers[i];
      layer.setSize(width, height);
    }
  }

  setPassesSize() {
    const { width, height } = this.getPortSize();
    this.effectPack.setSize(width, height);
  }

  setLayerSize(layer) {
    const { width, height } = this.getPortSize();
    layer.setSize(width, height);
  }

  setComposerSize() {
    const { width, height } = this.getPortSize();
    this.effectComposer.setSize(width, height);
  }

  /**
   * resize window when view box has change
   * @param {number} width render buffer width
   * @param {number} height render buffer height
   * @param {boolean} updateStyle update style or not
   */
  setSize(width, height, updateStyle = false) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height, updateStyle);
    this.viewBox = this.renderer.getDrawingBufferSize();

    this.setPassesSize();
    this.setComposerSize();
    this.setLayersSize();
  }

  setPixelRatio(pixelRatio, updateStyle) {
    this.renderer.setPixelRatio(pixelRatio);
    this.setSize(this.width, this.height, updateStyle);
  }

  createLayer(layerClass, options) {
    const { width, height } = this.getPortSize();
    options = Object.assign({ width, height }, options);
    const layer = new layerClass(options);
    this.add(layer);
    return layer;
  }

  setEventLayer(layer) {
    this.interactionLayer.setLayer(layer);
  }

  /**
   * getter whether scene interactively or not
   */
  get vrmode() {
    return this._vrmode;
  }

  /**
   * setter whether scene interactively or not
   * @param {Boolean} value is interactively ?
   */
  set vrmode(value) {
    if (value !== this.vrmode) {
      this._vrmode = value;
      this.vrmodeOnChange();
    }
  }
}

export default Viewer;
