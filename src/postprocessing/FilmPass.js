import {
  UniformsUtils,
  ShaderMaterial,
  OrthographicCamera,
  Scene,
  Mesh,
  PlaneBufferGeometry,
} from 'three';
import Pass from './Pass';
import FilmShader from '../shader/FilmShader';

/**
 * @author alteredq / http://alteredqualia.com/
 * @private
 */
export default class FilmPass extends Pass {
  constructor(noiseIntensity, scanlinesIntensity, scanlinesCount, grayscale) {
    super();

    if (FilmShader === undefined) console.error('FilmPass relies on FilmShader');

    const shader = FilmShader;

    this.uniforms = UniformsUtils.clone(shader.uniforms);

    this.material = new ShaderMaterial({

      uniforms: this.uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,

    });

    if (grayscale !== undefined)	this.uniforms.grayscale.value = grayscale;
    if (noiseIntensity !== undefined) this.uniforms.nIntensity.value = noiseIntensity;
    if (scanlinesIntensity !== undefined) this.uniforms.sIntensity.value = scanlinesIntensity;
    if (scanlinesCount !== undefined) this.uniforms.sCount.value = scanlinesCount;

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene = new Scene();

    this.quad = new Mesh(new PlaneBufferGeometry(2, 2), null);
    this.quad.frustumCulled = false; // Avoid getting clipped
    this.scene.add(this.quad);
  }

  render(renderer, writeBuffer, readBuffer, delta) {

    this.uniforms.tDiffuse.value = readBuffer.texture;
    this.uniforms.time.value += delta;

    this.quad.material = this.material;

    if (this.renderToScreen) {

      renderer.render(this.scene, this.camera);

    } else {

      renderer.render(this.scene, this.camera, writeBuffer, this.clear);

    }

  }
}
