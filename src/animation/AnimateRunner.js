import Animate from './Animate';
import Transition from './Transition';
// import Utils from '../utils/Utils';
import PathMotion from './PathMotion';

/**
 * AnimateRunner, composer any animation type
 *
 * @private
 */
class AnimateRunner extends Animate {
  /**
   * config a runner animation
   * @param {object} [options] runners config
   */
  constructor(options) {
    super(options);
    this.runners = options.runners;
    this.cursor = 0;
    this.queues = [];
    this.alternate = false;

    this.length = this.runners.length;

    // TODO: Is it necessary to exist ?
    // this.propsMap = [];
    // this.prepare();
  }

  // prepare() {
  //   let i = 0;
  //   let j = 0;
  //   for (i = 0; i < this.runners.length; i++) {
  //     const runner = this.runners[i];
  //     if (Utils.isUndefined(runner.to)) continue;
  //     const keys = Object.keys(runner.to);
  //     for (j = 0; j < keys.length; j++) {
  //       const prop = keys[j];
  //       if (this.propsMap.indexOf(prop) === -1) this.propsMap.push(prop);
  //     }
  //   }
  //   for (i = 0; i < this.runners.length; i++) {
  //     const runner = this.runners[i];
  //     if (!runner.to) continue;
  //     for (j = 0; j < this.propsMap.length; j++) {
  //       const prop = this.propsMap[j];
  //       if (Utils.isUndefined(runner.to[prop])) runner.to[prop] = this.object.props(prop);
  //     }
  //   }
  // }

  /**
   * init a runner
   * @private
   */
  initRunner() {
    const runner = this.runners[this.cursor];
    runner.infinite = false;
    runner.resident = true;
    runner.object = this.object;

    let animate = null;
    if (runner.path) {
      animate = new PathMotion(runner);
    } else if (runner.to) {
      animate = new Transition(runner);
    }
    if (animate !== null) {
      animate.on('complete', this.nextRunner.bind(this));
      this.queues.push(animate);
    }
  }

  /**
   * step to next `runner`
   * @param {Object} _ is hold for pose
   * @param {Number} time time snippet
   * @private
   */
  nextRunner(_, time) {
    this.queues[this.cursor].init();
    this.cursor += this.direction;
    this.timeSnippet = time;
  }

  /**
   * get next pose
   * @param {Number} snippetCache time snippet
   * @return {Object} pose
   */
  nextPose(snippetCache) {
    if (!this.queues[this.cursor] && this.runners[this.cursor]) {
      this.initRunner();
    }
    if (this.timeSnippet >= 0) {
      snippetCache += this.timeSnippet;
      this.timeSnippet = 0;
    }
    return this.queues[this.cursor].update(snippetCache);
  }

  /**
   * update state
   * @param {Number} snippet time snippet
   * @return {Object} pose
   */
  update(snippet) {
    if (this.wait > 0) {
      this.wait -= Math.abs(snippet);
      return;
    }
    if (this.paused || !this.living || this.delayCut > 0) {
      if (this.delayCut > 0) this.delayCut -= Math.abs(snippet);
      return;
    }

    const cc = this.cursor;

    const pose = this.nextPose(this.direction * this.timeScale * snippet);

    this.emit('update', {
      index: cc,
      pose,
    }, this.progress / this.duration);

    if (this.spill()) {
      if (this.repeats > 0 || this.infinite) {
        if (this.repeats > 0) --this.repeats;
        this.delayCut = this.delay;
        this.direction = 1;
        this.cursor = 0;
      } else {
        if (!this.resident) this.living = false;
        this.emit('complete', pose);
      }
    }
    return pose;
  }

  /**
   * check progress is spill?
   * @return {Boolean} is spill
   */
  spill() {
    // TODO: 这里应该保留溢出，不然会导致时间轴上的误差
    const topSpill = this.cursor >= this.length;
    return topSpill;
  }
}

export default AnimateRunner;
