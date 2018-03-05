import {
  Color,
} from 'three';

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Focus shader
 * based on PaintEffect postprocess from ro.me
 * http://code.google.com/p/3-dreams-of-black/source/browse/deploy/js/effects/PaintEffect.js
 * @private
 */
const EdgeBlurShader = {

  uniforms: {

    tDiffuse: { value: null },

    frameSize: { value: [] },

    cKernel: { value: [
      0.045, 0.122, 0.045,
      0.122, 0.332, 0.122,
      0.045, 0.122, 0.045,
    ] },

  },

  vertexShader: `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`,

  fragmentShader: `
  uniform float cKernel[9];

  uniform vec2 frameSize;

  uniform sampler2D tDiffuse;

  varying vec2 vUv;

  void main() {
    vec2 onePixel = vec2(1.0, 1.0) / frameSize;

    vec4 rgbColor =
      texture2D(tDiffuse, vUv + onePixel * vec2(-1, -1)) * cKernel[0] +
      texture2D(tDiffuse, vUv + onePixel * vec2( 0, -1)) * cKernel[1] +
      texture2D(tDiffuse, vUv + onePixel * vec2( 1, -1)) * cKernel[2] +
      texture2D(tDiffuse, vUv + onePixel * vec2(-1,  0)) * cKernel[3] +
      texture2D(tDiffuse, vUv + onePixel * vec2( 0,  0)) * cKernel[4] +
      texture2D(tDiffuse, vUv + onePixel * vec2( 1,  0)) * cKernel[5] +
      texture2D(tDiffuse, vUv + onePixel * vec2(-1,  1)) * cKernel[6] +
      texture2D(tDiffuse, vUv + onePixel * vec2( 0,  1)) * cKernel[7] +
      texture2D(tDiffuse, vUv + onePixel * vec2( 1,  1)) * cKernel[8] ;

    gl_FragColor = rgbColor;
  }`,
};

export default EdgeBlurShader;
