import {
  LuminanceFormat,
  LuminanceAlphaFormat,
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
const YCbCrShader = {

  texOrder: [ 'uYTex', 'uCTex' ],

  uniforms: {

    uYTex: { value: null, ss: 1, format: LuminanceFormat },
    uCTex: { value: null, ss: 0.5, format: LuminanceAlphaFormat },

    diffuse: { value: new Color(0xffffff) },

  },

  vertexShader: `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,

  fragmentShader: `
  uniform sampler2D uYTex;
  uniform sampler2D uCTex;
  uniform vec3 diffuse;

  varying vec2 vUv;

  const mat3 mYCbCrToRGB = mat3(
    1.0,      1.0,     1.0,
    0.0,     -0.18732, 1.8556,
    1.57481, -.46813,  0.0
  );

  void main(){
    vec3 YCbCr;
    YCbCr.x  = texture2D(uYTex, vUv).r;
    YCbCr.yz = texture2D(uCTex, vUv).ra - 0.5;
    gl_FragColor = vec4(diffuse * diffuse * (mYCbCrToRGB * YCbCr), 1.0);
  }`,
};

export default YCbCrShader;
