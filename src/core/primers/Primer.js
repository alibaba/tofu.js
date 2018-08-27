import {
  Mesh,
} from 'three';

/**
 * base primer class, provide primering paint
 */
class Primer extends Mesh {
  /**
   * post some config to primer
   * @param {*} geo have not be used
   * @param {*} mat config primer status
   * @param {*} options config primer status
   */
  constructor(geo, mat, options) {
    super(geo, mat);

    const {
      frameAspect = 1,
      targetAspect = 1,
      backgroundSize = 'COVER',
    } = options;

    /**
     * frame aspect, same with texture aspect (width / height)
     */
    this.frameAspect = frameAspect;

    /**
     * viewport aspect, same with viewport aspect (width / height)
     */
    this.targetAspect = targetAspect;

    /**
     * background aspect, fill with 'COVER' or 'CONTAIN'
     */
    this.backgroundSize = backgroundSize;
  }

  /**
   * set the target viewport aspect
   * @param {Number} targetAspect target viewport aspect
   */
  setAspect(targetAspect) {
    console.trace('aaa');
    this.targetAspect = targetAspect;
    if (this.loaded) this._updateAttributes();
  }

  /**
   * update attribute
   * @private
   */
  _updateAttributes() {
    const { width, height } = this._cs();
    this._setPositions(this.geometry.attributes.position, width, height);
  }

  /**
   * calculation the size for geometry in this frameAspect
   * @return {Object} size
   * @private
   */
  _cs() {
    const scale = this.frameAspect / this.targetAspect;
    const size = {
      width: 1,
      height: 1,
    };
    if (this.backgroundSize === 'COVER') {
      this._cover(size, scale);
    } else if (this.backgroundSize === 'CONTAIN') {
      this._contain(size, scale);
    } else {
      this._cover(size, scale);
    }
    return size;
  }

  /**
   * calculate background size with 'COVER' mode
   * @param {*} size size
   * @param {*} scale scale
   * @return {Object} size
   * @private
   */
  _cover(size, scale) {
    if (this.targetAspect > this.frameAspect) {
      size.height = 1 / scale;
    } else {
      size.width = scale;
    }
    return size;
  }

  /**
   * calculate background size with 'CONTAIN' mode
   * @param {*} size size
   * @param {*} scale scale
   * @return {Object} size
   * @private
   */
  _contain(size, scale) {
    if (this.frameAspect > this.targetAspect) {
      size.height = 1 / scale;
    } else {
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
   * resize layer size when viewport has change
   * @param {number} width layer buffer width
   * @param {number} height layer buffer height
   */
  setSize(width, height) {
    this.setAspect(width / height);
  }
}

export default Primer;
