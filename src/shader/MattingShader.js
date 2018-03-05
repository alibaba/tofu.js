/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Focus shader
 * based on PaintEffect postprocess from ro.me
 * http://code.google.com/p/3-dreams-of-black/source/browse/deploy/js/effects/PaintEffect.js
 * @private
 */
const MattingShader = {

  uniforms: {

    tDiffuse: { value: null },

    hueStart: { value: 0.0 },
    hueEnd: { value: 1.0 },
    lightnessStart: { value: 0.4 },
    lightnessEnd: { value: 1.0 },

  },

  vertexShader: `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`,

  fragmentShader: `
  uniform float hueStart;
  uniform float hueEnd;
  uniform float lightnessStart;
  uniform float lightnessEnd;

  uniform sampler2D tDiffuse;

  varying vec2 vUv;

  vec3 rgb2hsv(vec3 c){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }

  void main() {
    float lightnessCenter = (lightnessStart + lightnessEnd) / 2.0;
    float lightnessRadius = (lightnessEnd - lightnessStart) / 2.0;

    vec4 rgbColor = texture2D( tDiffuse, vUv );

    vec3 hsv = rgb2hsv(rgbColor.rgb);

    float alpha = 1.0;

    // if (hsv.x > hueStart && hsv.x < hueEnd) {
      float distance = abs(hsv.z - lightnessCenter) / lightnessRadius;
      alpha = clamp(distance, 0.0, 1.0);
    // }
    gl_FragColor = vec4(rgbColor.rgb, alpha * alpha);

  }`,
};

export default MattingShader;
