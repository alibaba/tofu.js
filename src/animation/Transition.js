import Animate from './Animate';
import Tween from '../utils/Tween';
import Utils from '../utils/Utils';

/* eslint guard-for-in: "off" */

/**
 * transition class
 * @private
 */
class Transition extends Animate {
  constructor(options) {
    super(options);

    // collect from pose, when from was not complete
    options.from = options.from || {};
    for (const i in options.to) {
      if (Utils.isUndefined(options.from[i])) options.from[i] = this.object.props(i);
    }

    /**
     * timing function
     */
    this.ease = options.ease || Tween.Ease.InOut;

    /**
     * from pose
     */
    this.from = options.from;

    /**
     * to pose
     */
    this.to = options.to;
  }

  /**
   * calculate next frame pose
   * @private
   * @return {object} pose state
   */
  nextPose() {
    const pose = {};
    const t = this.ease(this.progress / this.duration);
    for (const i in this.to) {
      pose[i] = this.linear(this.from[i], this.to[i], t);
      this.object.props(i, pose[i]);
    }
    return pose;
  }
}

export default Transition;
