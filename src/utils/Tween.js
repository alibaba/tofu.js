import { BezierEasing } from '../math/BezierEasing';
/* eslint no-cond-assign: "off" */
/* eslint new-cap: 0 */
/* eslint max-len: 0 */


/**
 * Tween 缓动时间运动函数集合
 *
 * ```js
 * dispay.animate({
 *   from: {x: 100},
 *   to: {x: 200},
 *   ease: JC.Tween.Ease.In, // 配置要调用的运动函数
 * })
 * ```
 * @namespace Tween
 */

const Tween = {

  Linear: {

    None(k) {
      return k;
    },

  },

  Ease: {

    In: (function() {
      const bezier = new BezierEasing(0.42, 0, 1, 1);
      return function(k) {
        return bezier.get(k);
      };
    })(),

    Out: (function() {
      const bezier = new BezierEasing(0, 0, 0.58, 1);
      return function(k) {
        return bezier.get(k);
      };
    })(),

    InOut: (function() {
      const bezier = new BezierEasing(0.42, 0, 0.58, 1);
      return function(k) {
        return bezier.get(k);
      };
    })(),

    Bezier(x1, y1, x2, y2) {
      const bezier = new BezierEasing(x1, y1, x2, y2);
      return function(k) {
        return bezier.get(k);
      };
    },

  },

  Elastic: {

    In(k) {
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
    },

    Out(k) {
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
    },

    InOut(k) {
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      k *= 2;
      if (k < 1) {
        return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
      }
      return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
    },

  },

  Back: {

    In(k) {
      const s = 1.70158;
      return k * k * ((s + 1) * k - s);
    },

    Out(k) {
      const s = 1.70158;
      return --k * k * ((s + 1) * k + s) + 1;
    },

    InOut(k) {
      const s = 1.70158 * 1.525;
      if ((k *= 2) < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s));
      }
      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    },

  },

  Bounce: {

    In(k) {
      return 1 - Tween.Bounce.Out(1 - k);
    },

    Out(k) {
      if (k < (1 / 2.75)) {
        return 7.5625 * k * k;
      } else if (k < (2 / 2.75)) {
        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
      } else if (k < (2.5 / 2.75)) {
        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
      }
      return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;

    },

    InOut(k) {
      if (k < 0.5) {
        return Tween.Bounce.In(k * 2) * 0.5;
      }
      return Tween.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
    },
  },
};

export default Tween;
