import {
  UniformsUtils,
  ShaderMaterial,
  OrthographicCamera,
  Scene,
  Mesh,
  PlaneBufferGeometry,
  DataTexture,
  RGBFormat,
  FloatType,
} from 'three';
import Pass from './Pass';
import DigitalGlitch from '../shader/DigitalGlitch';
import Utils from '../utils/Utils';

/**
 * @author alteredq / http://alteredqualia.com/
 * @private
 */
export default class GlitchPass extends Pass {
  constructor(dt_size) {
    super();
    if (DigitalGlitch === undefined) console.error('GlitchPass relies on DigitalGlitch');

    const shader = DigitalGlitch;
    this.uniforms = UniformsUtils.clone(shader.uniforms);

    if (dt_size === undefined) dt_size = 64;


    this.uniforms.tDisp.value = this.generateHeightmap(dt_size);


    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
    });

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene = new Scene();

    this.quad = new Mesh(new PlaneBufferGeometry(2, 2), null);
    this.quad.frustumCulled = false; // Avoid getting clipped
    this.scene.add(this.quad);

    this.goWild = false;
    this.curF = 0;
    this.generateTrigger();
  }
  render(renderer, writeBuffer, readBuffer) {

    this.uniforms.tDiffuse.value = readBuffer.texture;
    this.uniforms.seed.value = Math.random(); // default seeding
    this.uniforms.byp.value = 0;

    if (this.curF % this.randX === 0 || this.goWild === true) {

      this.uniforms.amount.value = Math.random() / 30;
      this.uniforms.angle.value = Utils.random(-Math.PI, Math.PI);
      this.uniforms.seed_x.value = Utils.random(-1, 1);
      this.uniforms.seed_y.value = Utils.random(-1, 1);
      this.uniforms.distortion_x.value = Utils.random(0, 1);
      this.uniforms.distortion_y.value = Utils.random(0, 1);
      this.curF = 0;
      this.generateTrigger();

    } else if (this.curF % this.randX < this.randX / 5) {

      this.uniforms.amount.value = Math.random() / 90;
      this.uniforms.angle.value = Utils.random(-Math.PI, Math.PI);
      this.uniforms.distortion_x.value = Utils.random(0, 1);
      this.uniforms.distortion_y.value = Utils.random(0, 1);
      this.uniforms.seed_x.value = Utils.random(-0.3, 0.3);
      this.uniforms.seed_y.value = Utils.random(-0.3, 0.3);

    } else if (this.goWild === false) {

      this.uniforms.byp.value = 1;

    }

    this.curF++;
    this.quad.material = this.material;

    if (this.renderToScreen) {

      renderer.render(this.scene, this.camera);

    } else {

      renderer.render(this.scene, this.camera, writeBuffer, this.clear);

    }

  }

  generateTrigger() {

    this.randX = Utils.random(120, 240) >> 0;

  }

  generateHeightmap(dt_size) {

    const data_arr = new Float32Array(dt_size * dt_size * 3);
    const length = dt_size * dt_size;

    for (let i = 0; i < length; i++) {

      const val = Utils.random(0, 1);
      data_arr[ i * 3 + 0 ] = val;
      data_arr[ i * 3 + 1 ] = val;
      data_arr[ i * 3 + 2 ] = val;

    }

    const texture = new DataTexture(data_arr, dt_size, dt_size, RGBFormat, FloatType);
    texture.needsUpdate = true;
    return texture;

  }
}
