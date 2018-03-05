import {
  Object3D,
} from 'three';
import Utils from '../utils/Utils';

/**
 * used to link 3d-model with reality world, an ar-glue
 *
 * @param {Object} options config
 * @param {String} options.name ar-glue name, same with `setMarkers` name-id
 * @param {Boolean} [options.autoHide=true] whether auto-hide when marker have not detected
 */
class ARGlue extends Object3D {
  constructor(options) {
    super();
    options = options || {};

    /**
     * unique name in all ar-glue object
     *
     * @member {String}
     */
    this.name = options.name;

    /**
     * whether auto-hide when marker have not detected
     *
     * @member {Boolean}
     */
    this.autoHide = Utils.isBoolean(options.autoHide) ? options.autoHide : true;

    /**
     * close this object matrixAutoUpdate, just recive matrix from `UC-AR`
     *
     * @member {Boolean}
     */
    this.matrixAutoUpdate = false;

    /**
     * class type, a mark to distinguish ar-glue and normal display-object
     *
     * @member {String}
     */
    this.type = 'ARGlue';

    if (!options.name) {
      console.error('ARGlue: this glue must have a name');
    }
  }

  /**
   * update this glue pose matrix
   * @param {Array} matrix pose matrix
   * @param {Boolean} isDetected whether detected at this tick
   */
  updatePose(matrix, isDetected) {
    if (this.autoHide && !isDetected) {
      this.visible = false;
    } else {
      this.visible = true;
    }
    this.matrix.fromArray(matrix);
  }
}

export default ARGlue;
