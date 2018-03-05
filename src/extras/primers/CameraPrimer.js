import {
  Mesh,
  UniformsUtils,
  ShaderMaterial,
  DataTexture,
  Color,
} from 'three';
import Primer from './Primer';
import YUVShader from '../../shader/YUVShader';
import YCbCrShader from '../../shader/YCbCrShader';

const FORMAT_MAP = {
  3: YUVShader,
  4: YCbCrShader,
  5: YCbCrShader,
};

/**
 * camera-primer, for ali webar framework
 */
class CameraPrimer extends Primer {
  /**
   * required displayTarget to get frame
   * @param {DisplayTarget} displayTarget webar DisplayTarget class
   * @param {Object} options primer config
   * @param {Color} [options.color=0xffffff] tint color
   * @param {Boolean} [options.depthTest=false] enbale depth test
   * @param {Boolean} [options.depthWrite=false] enbale depth write
   */
  constructor(displayTarget, options) {
    super(displayTarget, options);

    const { color = 0xffffff, depthTest = false, depthWrite = false } = options || {};

    /**
     * cache the displayTarget
     * @member {DisplayTarget}
     */
    this.displayTarget = displayTarget;

    /**
     * set primer tint color
     * @member {Color}
     */
    this.color = color;

    /**
     * whether enbale depth test or not
     * @member {Boolean}
     * @private
     */
    this._depthTest = depthTest || false;

    /**
     * whether enbale depth write or not
     * @member {Boolean}
     * @private
     */
    this._depthWrite = depthWrite || false;

    this.init(this.getFrames());
  }

  /**
   * get frame data from displayTarget
   * @return {frameData} camera frame data
   */
  getFrames() {
    return this.displayTarget.getFrames();
  }

  /**
   * init set something
   * @param {frameData} frameData camera frame data
   * @private
   */
  init({ format, dataArray, width, height }) {
    this.shader = FORMAT_MAP[format];

    this.uniforms = UniformsUtils.clone(this.shader.uniforms);

    this.shader.texOrder.forEach((tex, idx) => {
      const { ss, format } = this.uniforms[tex];
      this.uniforms[tex].value = new DataTexture(dataArray[idx], width * ss, height * ss, format);
    });

    this.uniforms.diffuse.value = new Color(this.color);

    this.pigmentMat = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.shader.vertexShader,
      fragmentShader: this.shader.fragmentShader,
      depthTest: this._depthTest,
      depthWrite: this._depthWrite,
    });

    this.pigment = new Mesh(this.pigmentGeo, this.pigmentMat);
    this.pigment.frustumCulled = false;

    this._correctUv(this.pigmentGeo.attributes.uv);

    this.scene.add(this.pigment);

    this._setAspect(height / width);
  }

  /**
   * update shader uniforms and aspect itself
   * @param {frameData} frameData camera frame data
   * @private
   */
  updateFrame({ dataArray, width, height }) {
    this.shader.texOrder.forEach((tex, idx) => {
      if (this.uniforms[tex].value.needsUpdate) return;
      const { ss } = this.uniforms[tex];
      this.uniforms[tex].value.image.data = dataArray[idx];
      this.uniforms[tex].value.image.width = width * ss;
      this.uniforms[tex].value.image.height = height * ss;
      this.uniforms[tex].value.needsUpdate = true;
    });
    this._setAspect(height / width);
  }

  /**
   * update attribute and frame
   */
  update() {
    if (this.autoCover) this._updateAttributes();
    if (!this.displayTarget.isDirty) return;
    this.updateFrame(this.getFrames());
  }

  /**
   * render this primer
   * @param {WebGLRenderer} renderer put webgl renderer
   * @param {WebGLRenderTarget} rednerTarget render to which buffer
   */
  render(renderer, rednerTarget) {
    this.update();
    renderer.render(this.scene, this.camera, rednerTarget);
  }
}

export default CameraPrimer;
