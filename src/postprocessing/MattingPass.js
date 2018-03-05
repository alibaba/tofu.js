import {
  LinearFilter,
  RGBAFormat,
  WebGLRenderTarget,
  UniformsUtils,
  ShaderMaterial,
  AdditiveBlending,
  Vector2,
  OrthographicCamera,
  Scene,
  Mesh,
  PlaneBufferGeometry,
} from 'three';
import Pass from './Pass';
import CopyShader from '../shader/CopyShader';
import MattingShader from '../shader/MattingShader';
import EdgeBlur from '../shader/EdgeBlur';

export default class MattingPass extends Pass {
  constructor(primer, options) {
    super();

    const { width, height, strength = 1.0, hueStart = 0.0, hueEnd = 1.0, lightnessStart = 0.6, lightnessEnd = 1.0 } = options || {};

    this.primer = primer;

    // render targets

    const pars = { minFilter: LinearFilter, magFilter: LinearFilter, format: RGBAFormat };

    this.renderTargetX = new WebGLRenderTarget(width, height, pars);
    this.renderTargetX.texture.name = 'MattingPass.x';
    this.renderTargetY = new WebGLRenderTarget(width, height, pars);
    this.renderTargetY.texture.name = 'MattingPass.y';

    // copy material

    if (CopyShader === undefined) console.error('MattingPass relies on CopyShader');

    const copyShader = CopyShader;

    this.copyUniforms = UniformsUtils.clone(copyShader.uniforms);

    this.copyUniforms.opacity.value = strength;

    this.materialCopy = new ShaderMaterial({
      uniforms: this.copyUniforms,
      vertexShader: copyShader.vertexShader,
      fragmentShader: copyShader.fragmentShader,
      blending: AdditiveBlending,
      transparent: true,
    });

    // matting material

    if (MattingShader === undefined) console.error('MattingPass relies on MattingShader');

    this.mattingUniforms = UniformsUtils.clone(MattingShader.uniforms);

    this.mattingUniforms.hueStart.value = hueStart;
    this.mattingUniforms.hueEnd.value = hueEnd;
    this.mattingUniforms.lightnessStart.value = lightnessStart;
    this.mattingUniforms.lightnessEnd.value = lightnessEnd;

    this.materialMatting = new ShaderMaterial({
      uniforms: this.mattingUniforms,
      vertexShader: MattingShader.vertexShader,
      fragmentShader: MattingShader.fragmentShader,
      blending: AdditiveBlending,
      transparent: true,
    });

    this.edgeBlurUniforms = UniformsUtils.clone(EdgeBlur.uniforms);
    this.edgeBlurUniforms.frameSize.value = new Vector2(width, height);


    this.materialEdgeBlur = new ShaderMaterial({
      uniforms: this.edgeBlurUniforms,
      vertexShader: EdgeBlur.vertexShader,
      fragmentShader: EdgeBlur.fragmentShader,
      blending: AdditiveBlending,
      transparent: true,
    });

    this.needsSwap = false;

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene = new Scene();

    this.quad = new Mesh(new PlaneBufferGeometry(2, 2), null);
    this.quad.frustumCulled = false; // Avoid getting clipped
    this.scene.add(this.quad);
  }

  render(renderer, writeBuffer, readBuffer, delta, maskActive) {

    if (maskActive) renderer.context.disable(renderer.context.STENCIL_TEST);

    this.primer.render(renderer, this.renderTargetX);

    this.quad.material = this.materialMatting;
    this.mattingUniforms.tDiffuse.value = this.renderTargetX.texture;
    renderer.render(this.scene, this.camera, this.renderTargetY, true);


    this.quad.material = this.materialEdgeBlur;
    this.edgeBlurUniforms.tDiffuse.value = this.renderTargetY.texture;
    renderer.render(this.scene, this.camera, null, this.clear);

    // Render quad with blured scene into texture (convolution pass 2)

    // this.convolutionUniforms.tDiffuse.value = this.renderTargetX.texture;
    // this.convolutionUniforms.uImageIncrement.value = MattingPass.blurY;

    // renderer.render(this.scene, this.camera, this.renderTargetY, true);

    // // Render original scene with superimposed blur to texture

    // this.quad.material = this.materialCopy;

    // this.copyUniforms.tDiffuse.value = this.renderTargetY.texture;

    if (maskActive) renderer.context.enable(renderer.context.STENCIL_TEST);

    // renderer.render(this.scene, this.camera, readBuffer, this.clear);

  }
}
