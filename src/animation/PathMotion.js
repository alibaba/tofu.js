import { Curve } from 'three';
import Animate from './Animate';
import Utils from '../utils/Utils';
import Tween from '../utils/Tween';

/**
 * PathMotion class
 * @private
 */
class PathMotion extends Animate {
  constructor(options) {
    super(options);
    if (!options.path || !(options.path instanceof Curve)) {
      console.warn('path is not instanceof Curve');
    }

    /**
     * path, extend curve
     */
    this.path = options.path;

    /**
     * timing function
     */
    this.ease = options.ease || Tween.Ease.InOut;

    /**
     * use lengthMode or not
     */
    this.lengthMode = Utils.isBoolean(options.lengthMode) ?
      options.lengthMode :
      false;

    /**
     * progress need clamp with [0, 1]
     */
    this.needClamp = Utils.isBoolean(options.needClamp) ?
      options.needClamp :
      true;

    /**
     * object need attach tangent
     */
    this.attachTangent = Utils.isBoolean(options.attachTangent) ?
      options.attachTangent :
      false;
  }

  /**
   * caculation next pose
   * @return {Vector3} position
   */
  nextPose() {
    let t = this.ease(this.progress / this.duration);
    if (this.needClamp) {
      t = Utils.clamp(t, 0, 1);
    }
    const position = this.lengthMode ?
      this.path.getPointAt(t) :
      this.path.getPoint(t);

    this.object.position.copy(position);
    if (this.attachTangent) {
      const direction = this.lengthMode ?
        this.path.getTangentAt(t) :
        this.path.getTangent(t);
      this.object.lookAt(position.add(direction));
    }
    return position;
  }
}

export default PathMotion;
