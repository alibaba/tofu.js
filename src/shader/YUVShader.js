import {
  LuminanceFormat,
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
const YUVShader = {

  texOrder: [ 'uYTex', 'uUTex', 'uVTex' ],

  uniforms: {

    uYTex: { value: null, ss: 1, format: LuminanceFormat },
    uUTex: { value: null, ss: 0.5, format: LuminanceFormat },
    uVTex: { value: null, ss: 0.5, format: LuminanceFormat },

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
  uniform sampler2D uUTex;
  uniform sampler2D uVTex;

  uniform vec3 diffuse;

  varying vec2 vUv;

  const mat3 mYUV2RGB = mat3(
    1.0,   1.0,     1.0,
    0.0,  -0.395,  2.032,
    1.40, -0.581,   0.0
  );

  void main(){
    vec3 YUV;
    YUV.x = 1.1643 * (texture2D(uYTex, vUv).r - 0.0625);
    YUV.y = texture2D(uUTex, vUv).r - 0.5;
    YUV.z = texture2D(uVTex, vUv).r - 0.5;

    gl_FragColor = vec4(diffuse * diffuse * (mYUV2RGB * YUV), 1.0);
  }`,
};

export default YUVShader;
