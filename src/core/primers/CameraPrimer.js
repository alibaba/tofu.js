import {
  Mesh,
  UniformsUtils,
  ShaderMaterial,
  DataTexture,
  Color,
  Vector3,
  Matrix3,
} from 'three';
import Primer from './Primer';
import YUVShader from '../../shader/YUVShader';
import YCbCrShader from '../../shader/YCbCrShader';
import Utils from '../../utils/Utils';

const FORMAT_MAP = {
  3: YUVShader,
  4: YCbCrShader,
  5: YCbCrShader,
};

const LANDSCAPE_MAP = {
  NONE: 0,
  CW: Utils.DTR(-90),
  CCW: Utils.DTR(90),
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
     * frame landscape orientation
     * @member {Number}
     * @private
     */
    this.landscape = Utils.isString(options.landscape) && LANDSCAPE_MAP[options.landscape] ?
      LANDSCAPE_MAP[options.landscape] : LANDSCAPE_MAP.CW;

    /**
     * this frame need to flip with y-axis
     * @member {Boolean}
     * @private
     */
    this.flip = Utils.isBoolean(options.flip) ? options.flip : true;

    /**
     * uv matrix
     * @member {Matrix3}
     * @private
     */
    this.uvMatrix = new Matrix3();

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

  /**
   * correct uv buffer
   * @param {BufferAttribute} uv uv bufferAttribute
   * @return {BufferAttribute} corrected BufferAttribute
   */
  _correctUv(uv) {
    const v1 = new Vector3();
    this.uvMatrix.identity();
    this.uvMatrix.translate(-0.5, -0.5);
    this.uvMatrix.rotate(this.landscape);
    if (this.flip) this.uvMatrix.scale(1, -1);
    this.uvMatrix.translate(0.5, 0.5);
    for (let i = 0, l = uv.count; i < l; i++) {
      v1.x = uv.getX(i);
      v1.y = uv.getY(i);
      v1.z = 1;

      v1.applyMatrix3(this.uvMatrix);
      uv.setXY(i, v1.x, v1.y);
    }
    uv.needsUpdate = true;
    return uv;
  }
}

export default CameraPrimer;
