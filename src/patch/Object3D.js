import { Object3D } from 'three';
import { TimelineAnimations } from '../animation/TimelineAnimations';
import Utils from '../utils/Utils';

/**
 * timeline scale, effect this display-node and it's children
 */
Object3D.prototype.timeScale = 1;

/**
 * whether pause the timeline update with this display-node and it's children
 */
Object3D.prototype.paused = false;

/**
 * scale display-object with xyz together
 *
 */
Object.defineProperty(Object3D.prototype, 'scaleXYZ', {
  get() {
    return this.scale.x;
  },
  set(scale) {
    this.scale.x = this.scale.y = this.scale.z = scale;
  },
});

/**
 * animate animation, let a display-object move from a pose to another pose
 *
 * ```js
 * model.animate({
 *   from: { 'position.x': 100 },
 *   to: { 'position.x': 200 },
 *   ease: Tween.Bounce.Out, // use which timing-function default: `Tween.Ease.InOut`
 *   repeats: 10, // repeat 10 times, after compelete this animation loop
 *   infinite: true, // infinite repeat forevery
 *   alternate: true, // repeat with alternate, just like yoyo
 *   duration: 1000, // animation duration 1000ms
 *   wait: 100, // animation await sometime
 *   onUpdate: function(state,rate){}, // will be invoked when update pose
 *   onComplete: function(){ console.log('end'); } // will be invoked when update last pose (complete)
 * });
 * ```
 *
 * @param {Object} options animate animation config
 * @param {Object} [options.from] which pose state this animate start with
 * @param {Object} options.to which pose state this animate to
 * @param {Tween} [options.ease=Tween.Ease.InOut] use which timing-function
 * @param {Number} [options.repeats=0] whether animate repeat some times, it's weight lower than `options.infinite`
 * @param {Number} [options.duration=300] animate duration
 * @param {Number} [options.wait=0] animate wait time before first start, not effect next repeat
 * @param {Number} [options.delay=0] animate delay time before start or restart, effect at repeat if it have
 * @param {Boolean} [options.infinite=false] whether animate infinite repeat, it's weight higher than `options.repeats`
 * @param {Boolean} [options.alternate=false] whether animate paly with alternate, just like yoyo
 * @param {Function} [options.onUpdate] will be invoked when update pose
 * @param {Function} [options.onComplete] will be invoked when update last pose (complete)
 * @param {Boolean} clear whether clear display-object's animation queue
 * @return {Animate} animate object
 */
Object3D.prototype.animate = function(options, clear) {
  if (!this.timelineAnimations) this.initTimeline();
  return this.timelineAnimations.animate(options, clear);
};

/**
 * combine animation, let a display-object do animate one by one
 *
 * ```js
 * display.runners({
 *   runners: [
 *     { from: {}, to: {} },
 *     { path: JC.BezierCurve([ point1, point2, point3, point4 ]) },
 *   ],
 *   repeats: 10, // repeat 10 times, after compelete this animation loop
 *   infinite: true, // infinite repeat forevery
 *   alternate: true, // repeat with alternate, just like yoyo
 *   duration: 1000, // animation duration 1000ms
 *   onUpdate: function(state,rate){}, // will be invoked when update pose
 *   onComplete: function(){ console.log('end'); } // will be invoked when update last pose (complete)
 * });
 * ```
 *
 * @param {Object} options combine animation config
 * @param {Array} options.runners combine animation, support `animate`、`motion`
 * @param {Number} [options.repeats=0] whether animate repeat some times, it's weight lower than `options.infinite`
 * @param {Number} [options.duration=300] animate duration
 * @param {Number} [options.wait=0] animate wait time before first start, not effect next repeat
 * @param {Number} [options.delay=0] animate delay time before start or restart, effect at repeat if it have
 * @param {Boolean} [options.infinite=false] whether animate infinite repeat, it's weight higher than `options.repeats`
 * @param {Boolean} [options.alternate=false] whether animate paly with alternate, just like yoyo
 * @param {Function} [options.onUpdate] will be invoked when update pose
 * @param {Function} [options.onComplete] will be invoked when update last pose (complete)
 * @param {Boolean} clear whether clear display-object's animation queue
 * @return {Animate} Animate
 */
Object3D.prototype.runners = function(options, clear) {
  if (!this.timelineAnimations) this.initTimeline();
  return this.timelineAnimations.runners(options, clear);
};

/**
 * motion animation, let a display-object move along with the path
 *
 * ```js
 * display.motion({
 *   path: new SvgCurve('M10 10 H 90 V 90 H 10 L 10 10), // path, should instance of Curve
 *   attachTangent: true, // whether display-object should attach tangent or not
 *   ease: Tween.Bounce.Out, // use which timing-function default: `Tween.Ease.InOut`
 *   repeats: 10, // repeat 10 times, after compelete this animation loop
 *   infinite: true, // infinite repeat forevery
 *   alternate: true, // repeat with alternate, just like yoyo
 *   duration: 1000, // animation duration 1000ms
 *   wait: 100, // animation await sometime
 *   onUpdate: function(state,rate){}, // will be invoked when update pose
 *   onComplete: function(){ console.log('end'); } // will be invoked when update last pose (complete)
 * });
 * ```
 * @param {Object} options motion animation config
 * @param {Curve} options.path path, should instance of Curve
 * @param {Boolean} [options.attachTangent=false] whether display-object should attach tangent or not
 * @param {Boolean} [options.lengthMode=false] whether move with length-mode or not
 * @param {Tween} [options.ease=Tween.Ease.InOut] use which timing-function
 * @param {Number} [options.repeats=0] whether animate repeat some times, it's weight lower than `options.infinite`
 * @param {Number} [options.duration=300] animate duration
 * @param {Number} [options.wait=0] animate wait time before first start, not effect next repeat
 * @param {Number} [options.delay=0] animate delay time before start or restart, effect at repeat if it have
 * @param {Boolean} [options.infinite=false] whether animate infinite repeat, it's weight higher than `options.repeats`
 * @param {Boolean} [options.alternate=false] whether animate paly with alternate, just like yoyo
 * @param {Function} [options.onUpdate] will be invoked when update pose
 * @param {Function} [options.onComplete] will be invoked when update last pose (complete)
 * @param {Boolean} clear whether clear display-object's animation queue
 * @return {Animate} Animate
 */
Object3D.prototype.motion = function(options, clear) {
  if (!this.timelineAnimations) this.initTimeline();
  return this.timelineAnimations.motion(options, clear);
};

/**
 * initial timeline when it was not created
 *
 * @private
 */
Object3D.prototype.initTimeline = function() {
  this.timelineAnimations = new TimelineAnimations(this);
};

/**
 * update display-object animation
 *
 * @private
 * @param {Number} snippet time snippet
 */
Object3D.prototype.updateAnimations = function(snippet) {
  if (!this.timelineAnimations) return;
  this.timelineAnimations.update(snippet);
};

/**
 * update display-object timeline
 *
 * @param {Number} snippet time snippet
 */
Object3D.prototype.updateTimeline = function(snippet) {
  if (this.paused) return;
  snippet = this.timeScale * snippet;

  this.emit('pretimeline', {
    snippet,
  });

  this.updateAnimations(snippet);

  let i = 0;
  const children = this.children;
  const length = children.length;
  while (i < length) {
    children[i].updateTimeline(snippet);
    i++;
  }

  this.emit('posttimeline', {
    snippet,
  });
};

/**
 * get depth property from this object
 *
 * @private
 * @param {String} key property chain
 * @param {Number} value want set which value
 * @return {Number} return number
 */
Object3D.prototype.props = function(key, value) {
  if (!key) return;

  const rawKeys = key.split('.');

  if (rawKeys.length === 0) {
    if (Utils.isUndefined(value)) {
      return this[key];
    }
    this[key] = value;
    return value;
  }

  const prop = rawKeys.pop();
  const head = rawKeys.join('.');

  if (!this.keysMaps || !this.keysMaps[head]) {
    this.linkProp(head, rawKeys);
  }

  if (Utils.isUndefined(value)) {
    return this.keysMaps[head][prop];
  }
  this.keysMaps[head][prop] = value;
  return value;
};

Object3D.prototype.linkProp = function(head, rawKeys) {
  if (!this.keysMaps) this.keysMaps = {};
  let prop = this;
  for (let i = 0; i < rawKeys.length; i++) {
    const key = rawKeys[i];
    prop = prop[key];
  }
  this.keysMaps[head] = prop;
};

