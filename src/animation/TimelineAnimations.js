import Transition from './Transition';
import AnimateRunner from './AnimateRunner';
import PathMotion from './PathMotion';

/**
 * timeline animations class
 * @private
 */
class TimelineAnimations {
  constructor(object) {
    /**
     * display object cache it for use after
     */
    this.object = object;

    /**
     * object's all animates queue
     *
     * @member {Array}
     */
    this.animates = [];

    /**
     * object's timeline update time-scale
     *
     * @member {Number}
     */
    this.timeScale = 1;

    /**
     * pause the object's timeline update
     *
     * @member {Boolean}
     */
    this.paused = false;
  }

  /**
   * update this object animates queue
   * @param {Number} snippet time snippet
   */
  update(snippet) {
    if (this.paused) return;
    snippet = this.timeScale * snippet;
    const cache = this.animates.slice(0);
    for (let i = 0; i < cache.length; i++) {
      if (!cache[i].living && !cache[i].resident) {
        this.animates.splice(i, 1);
      }
      cache[i].update(snippet);
    }
  }

  /**
   * create a `animate` animation
   *
   * @private
   * @param {object} options config for animate
   * @param {boolean} clear whether clear all animation at before
   * @return {Transition} transition animator
   */
  animate(options, clear) {
    options.object = this.object;
    return this._addMove(new Transition(options), clear);
  }

  /**
   * create a `motion` animation
   *
   * @private
   * @param {object} options config for motion
   * @param {boolean} clear whether clear all animation at before
   * @return {PathMotion} pathMotion animator
   */
  motion(options, clear) {
    options.object = this.object;
    return this._addMove(new PathMotion(options), clear);
  }

  /**
   * create a `runners` animation
   * @private
   * @param {object} options config for motion
   * @param {boolean} clear whether clear all animation at before
   * @return {AnimateRunner} animateRunner animator
   */
  runners(options, clear) {
    options.object = this.object;
    return this._addMove(new AnimateRunner(options), clear);
  }

  /**
   * create a `keyFrames` animation
   * @private
   * @param {object} options config for motion
   * @param {boolean} clear whether clear all animation at before
   * @return {KeyFrames} keyFrames animator
   */
  // keyFrames(options, clear) {
  //   options.object = this.object;
  //   return this._addMove(new KeyFrames(options), clear);
  // }

  /**
   * add animator into animates queue
   * @private
   * @param {object} animate animator
   * @param {boolean} clear whether clear all animation at before
   * @return {Transition} animator
   */
  _addMove(animate, clear) {
    if (clear) this.clear();
    this.animates.push(animate);
    return animate;
  }

  /**
   * pause animates
   */
  pause() {
    this.paused = true;
  }

  /**
   * restore animates play
   */
  restart() {
    this.paused = false;
  }

  /**
   * set this queue's timeScale
   * @param {Number} speed set timescale
   */
  setSpeed(speed) {
    this.timeScale = speed;
  }

  /**
   * clear all animates
   * @private
   */
  clear() {
    this.animates.length = 0;
  }
}

export { TimelineAnimations };
