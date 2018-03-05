import { OrthographicCamera, Scene, PlaneBufferGeometry, Matrix3, Vector3 } from 'three';
import Utils from '../../utils/Utils';

const LANDSCAPE_MAP = {
  NONE: 0,
  CW: Utils.DTR(-90),
  CCW: Utils.DTR(90),
};

/**
 * base primer class, provide primering paint
 */
class Primer {
  /**
   * post some config to primer
   * @param {*} _ have not be used
   * @param {*} options config primer status
   */
  constructor(_, options) {
    options = options || {};

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
     * primer tag
     * @member {Boolean}
     */
    this.isPrimer = true;

    /**
     * this primer is enable
     * @member {Boolean}
     */
    this.enabled = true;

    /**
     * the parent of this parent
     * @member {Layer}
     * @private
     */
    this.parent = null;

    /**
     * scene for this 2D context
     * @member {Scene}
     * @private
     */
    this.scene = new Scene();

    /**
     * camera for this 2D context
     * @member {OrthographicCamera}
     * @private
     */
    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    /**
     * geometry for this 2D context
     * @member {PlaneBufferGeometry}
     * @private
     */
    this.pigmentGeo = new PlaneBufferGeometry(2, 2);

    /**
     * whether auto-cover to target viewport
     * @member {Boolean}
     */
    this.autoCover = options.autoCover || false;

    if (this.autoCover && options.targetAspect) {
      this.setTargetAspect(options.targetAspect);
    }
  }

  /**
   * update timeline
   */
  updateTimeline() {

  }

  /**
   * render function, need overwrite by sub-class
   */
  render() {
    console.warn('should be overwrite by sub-class');
  }

  /**
   * set the target viewport aspect
   * @param {Number} aspect target viewport aspect
   */
  setTargetAspect(aspect) {
    this.targetAspect = aspect;
    if (this.autoCover) this.needsUpdateAttributes = true;
  }

  /**
   * update attribute
   * @private
   */
  _updateAttributes() {
    if (!this.needsUpdateAttributes) return;
    const { width, height } = this._cs();
    this._setPositions(this.pigmentGeo.attributes.position, width, height);
    this.needsUpdateAttributes = false;
  }

  /**
   * update aspect itself
   * @param {Number} aspect target viewport aspect
   * @private
   */
  _setAspect(aspect) {
    this.aspect = aspect;
    if (this.autoCover) this.needsUpdateAttributes = true;
  }

  /**
   * calculation the size for geometry in this targetAspect
   * @return {Object} size
   * @private
   */
  _cs() {
    const scale = this.aspect / this.targetAspect;
    const size = {
      width: 1,
      height: 1,
    };
    if (this.targetAspect > this.aspect) {
      size.height = 1 / scale;
    } else if (this.targetAspect < this.aspect) {
      size.width = scale;
    }
    return size;
  }

  /**
   * resize geometry size
   * @param {BufferAttribute} positions positions buffer
   * @param {Number} width target width
   * @param {Number} height target height
   * @return {BufferAttribute} updated BufferAttribute
   */
  _setPositions(positions, width, height) {
    const coefficient = [ -1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0 ];
    for (let i = 0; i < positions.count; i++) {
      const item = positions.itemSize * i;
      positions.array[item] = coefficient[item] * width;
      positions.array[item + 1] = coefficient[item + 1] * height;
    }
    positions.needsUpdate = true;
    return positions;
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

  /**
   * get autoCover status
   */
  get autoCover() {
    return this._autoCover;
  }

  /**
   * set autoCover status
   * @param {Boolean} autoCover whether autoCover or not
   */
  set autoCover(autoCover) {
    if (autoCover !== this.autoCover) {
      this._autoCover = autoCover;
      if (autoCover) this.needsUpdateAttributes = true;
    }
  }
}

export default Primer;
