import { EventDispatcher } from 'three';
import Utils from '../utils/Utils';

/**
 * an animate class, root class
 * @private
 */
class Animate extends EventDispatcher {
  /**
   * config your animation
   * @param {Object} options animate config
   * @private
   */
  constructor(options) {
    super();
    this.object = options.object || {};
    this.duration = options.duration || 300;
    this.living = true;
    this.resident = options.resident || false;

    this.infinite = options.infinite || false;
    this.alternate = options.alternate || false;
    this.repeats = options.repeats || 0;
    this.delay = options.delay || 0;
    this.wait = options.wait || 0;
    this.timeScale = Utils.isNumber(options.timeScale) ?
      options.timeScale :
      1;

    if (options.onComplete) {
      this.on('complete', options.onComplete.bind(this));
    }
    if (options.onUpdate) {
      this.on('update', options.onUpdate.bind(this));
    }

    this.init();

    this.paused = false;
  }

  /**
   * init animate state
   * @private
   */
  init() {
    this.direction = 1;
    this.progress = 0;
    this.repeatsCut = this.repeats;
    this.delayCut = this.delay;
    this.waitCut = this.wait;
  }

  /**
   * update the timeline and get pose
   *
   * @private
   * @param {Number} snippet time snippet
   * @return {Object} pose state
   */
  update(snippet) {
    const snippetCache = this.direction * this.timeScale * snippet;
    if (this.waitCut > 0) {
      this.waitCut -= Math.abs(snippetCache);
      return;
    }
    if (this.paused || !this.living || this.delayCut > 0) {
      if (this.delayCut > 0) this.delayCut -= Math.abs(snippetCache);
      return;
    }

    this.progress += snippetCache;
    let isEnd = false;
    const progressCache = this.progress;

    if (this.spill()) {
      if (this.repeatsCut > 0 || this.infinite) {
        if (this.repeatsCut > 0) --this.repeatsCut;
        this.delayCut = this.delay;
        if (this.alternate) {
          this.direction *= -1;
          this.progress = Utils.codomainBounce(this.progress, 0, this.duration);
        } else {
          this.direction = 1;
          this.progress = Utils.euclideanModulo(this.progress, this.duration);
        }
      } else {
        isEnd = true;
      }
    }

    let pose;
    if (!isEnd) {
      pose = this.nextPose();
      this.emit('update', pose, this.progress / this.duration);
    } else {
      if (!this.resident) this.living = false;
      this.progress = Utils.clamp(progressCache, 0, this.duration);
      pose = this.nextPose();
      this.emit('complete', pose, Math.abs(progressCache - this.progress));
    }
    return pose;
  }

  /**
   * check progress was spill
   *
   * @private
   * @return {Boolean} whether spill or not
   */
  spill() {
    const bSpill = this.progress <= 0 && this.direction === -1;
    const tSpill = this.progress >= this.duration && this.direction === 1;
    return bSpill || tSpill;
  }

  /**
   * get next pose, should be overwrite by sub-class
   * @private
   */
  nextPose() {
    console.warn('should be overwrite');
  }

  /**
   * linear interpolation
   * @private
   * @param {number} p0 start value
   * @param {number} p1 end value
   * @param {number} t  time rate
   * @return {Number} interpolation value
   */
  linear(p0, p1, t) {
    return (p1 - p0) * t + p0;
  }

  /**
   * pause this animate
   */
  pause() {
    this.paused = true;
  }

  /**
   * restore this animate play
   */
  restart() {
    this.paused = false;
  }

  /**
   * stop this animate at last frame, will trigger `complete` event
   */
  stop() {
    this.repeats = 0;
    this.infinite = false;
    this.progress = this.duration;
  }

  /**
   * set this queue's timeScale
   * @param {Number} speed set timescale
   */
  setSpeed(speed) {
    this.timeScale = speed;
  }

  /**
   * cancle this animate, will not trigger `complete` event
   */
  cancle() {
    this.living = false;
  }
}

export default Animate;
