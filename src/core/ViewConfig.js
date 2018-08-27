import Utils from '../utils/Utils';

function setDefault(check, value, spare) {
  return check(value) ? value : spare;
}

/**
 * ViewConfig class, a default config for WebGLRenderer with-in UC-AR
 *
 * @private
 * @param {Object} options custom config for WebGLRenderer
 * @param {String|canvas} options.canvas `canvas-dom` or canvas `css-selector`
 * @param {Boolean} [options.alpha=false] whether the canvas contains an alpha (transparency) buffer or not.
 * @param {Boolean} [options.antialias=false] whether to perform antialiasing.
 * @param {String} [options.precision='highp'] Shader precision, Can be `highp`, `mediump` or `lowp`.
 * @param {Boolean} [options.premultipliedAlpha=true] whether the renderer will assume that colors have premultiplied alpha.
 * @param {Boolean} [options.stencil=true] whether the drawing buffer has a stencil buffer of at least 8 bits.
 * @param {Boolean} [options.preserveDrawingBuffer=false] whether to preserve the buffers until manually cleared or overwritten.
 * @param {Boolean} [options.depth=true] whether the drawing buffer has a depth buffer of at least 16 bits.
 * @param {Boolean} [options.logarithmicDepthBuffer] whether to use a logarithmic depth buffer.
 */
export default class ViewConfig {
  constructor(options) {
    /**
     * canvas dom element
     *
     * @member {canvas}
     */
    this.canvas = Utils.isString(options.canvas) ?
      document.getElementById(options.canvas) ||
      document.querySelector(options.canvas) :
      options.canvas;

    /**
     * Shader precision
     *
     * @member {String}
     */
    this.precision = options.precision;

    /**
     * canvas contains an alpha (transparency) buffer or not
     *
     * @member {Boolean}
     */
    this.alpha = setDefault(Utils.isBoolean, options.alpha, true);

    /**
     * whether to perform antialiasing
     *
     * @member {Boolean}
     */
    this.antialias = setDefault(Utils.isBoolean, options.antialias, true);

    /**
     * whether the renderer will assume that colors have premultiplied alpha.
     *
     * @member {Boolean}
     */
    this.premultipliedAlpha = options.premultipliedAlpha;

    /**
     * whether the drawing buffer has a stencil buffer of at least 8 bits.
     *
     * @member {Boolean}
     */
    this.stencil = options.stencil;

    /**
     * whether to preserve the buffers until manually cleared or overwritten.
     *
     * @member {Boolean}
     */
    this.preserveDrawingBuffer = options.preserveDrawingBuffer;

    /**
     * whether the drawing buffer has a depth buffer of at least 16 bits.
     *
     * @member {Boolean}
     */
    this.depth = options.depth;

    /**
     * whether to use a logarithmic depth buffer.
     *
     * @member {Boolean}
     */
    this.logarithmicDepthBuffer = options.logarithmicDepthBuffer;
  }
}
