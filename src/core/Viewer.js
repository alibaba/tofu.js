import {
  WebGLRenderer,
  EventDispatcher,
} from 'three';
import EffectComposer from '../postprocessing/EffectComposer';
// import GraphicsLayer from './GraphicsLayer';
// import PrimerLayer from './PrimerLayer';
import LayerCompositor from './LayerCompositor';
import ViewPort from './ViewPort';
import EffectPack from './EffectPack';
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

    this.width = width;
    this.height = height;

    /**
     * render effect kit to carry render content and some data
     */
    this.effectPack = new EffectPack({ width, height });

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
    this.effectComposer = new EffectComposer(options);

    /**
     * compositor primerLayer and graphicsLayer with zIndex order
     * @member {LayerCompositor}
     */
    this.layerCompositor = new LayerCompositor(options);

    /**
     * store layers array, all content layer list
     * @member {layer}
     */
    this.layers = [];
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
   * render all 3d stage, should be overwrite by sub-class
   */
  render() {
    console.warn('should be overwrite by sub-class');
  }

  /**
   * render every layer to it's render buffer
   *
   * @private
   */
  renderLayers() {
    if (this.needSort) {
      this._sortList();
      this._sortLayerQuad();
      this.needSort = false;
    }
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      if (!layer.isEmpty) layer.render(this.renderer);
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
   * sort layer, because array.sort was not stable-sort, so use bubble sort
   *
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
  }

  /**
   * sort layer's quad order, mapping with layerCompositor.scene
   *
   * @private
   */
  _sortLayerQuad() {
    const quads = this.layerCompositor.scene.children;
    const length = quads.length;
    let i;
    let j;
    let temp;
    for (i = 0; i < length - 1; i++) {
      for (j = 0; j < length - 1 - i; j++) {
        if (quads[j].root.zIndex > quads[j + 1].root.zIndex) {
          temp = quads[j];
          quads[j] = quads[j + 1];
          quads[j + 1] = temp;
        }
      }
    }
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
      this.layerCompositor.scene.add(layer.quad);
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
      this.layerCompositor.scene.remove(layer.quad);
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

  /**
   * resize window when viewport has change
   * @param {number} width render buffer width
   * @param {number} height render buffer height
   */
  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.effectComposer.setSize(width, height);
    this.layerCompositor.setSize(width, height);
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

export default Viewer;
