(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
	typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
	(factory((global.Tofu = global.Tofu || {}),global.THREE));
}(this, (function (exports,three) { 'use strict';

(function () {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }

  window.RAF = window.requestAnimationFrame;
  window.CAF = window.cancelAnimationFrame;
})();

/**
 * 返回数据类型
 * @param {*} val 需要判定的类型
 * @return {String} 数据类型
 */
function _rt(val) {
  return Object.prototype.toString.call(val);
}

/**
 * Utils 常用工具箱
 *
 * @namespace Utils
 */
var Utils = {
  /**
   * 简单拷贝纯数据的JSON对象
   *
   * @static
   * @memberof Utils
   * @param {JSON} json 待拷贝的纯数据JSON
   * @return {JSON} 拷贝后的纯数据JSON
   */
  copyJSON: function copyJSON(json) {
    return JSON.parse(JSON.stringify(json));
  },


  /**
   * 将角度转化成弧度
   *
   * @static
   * @memberof Utils
   * @param {Number} degree 角度数
   * @return {Number} 弧度数
   */
  DTR: function DTR(degree) {
    return degree * Math.PI / 180;
  },


  /**
   * 将弧度转化成角度
   *
   * @static
   * @memberof Utils
   * @param {Number} radius 弧度数
   * @return {Number} 角度数
   */
  RTD: function RTD(radius) {
    return radius * 180 / Math.PI;
  },


  /**
   * 判断变量是否为数组类型
   *
   * @static
   * @method
   * @memberof Utils
   * @param {Array} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isArray: function () {
    var ks = _rt([]);
    return function (variable) {
      return _rt(variable) === ks;
    };
  }(),

  /**
   * 判断变量是否为对象类型
   *
   * @static
   * @method
   * @memberof Utils
   * @param {Object} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isObject: function () {
    var ks = _rt({});
    return function (variable) {
      return _rt(variable) === ks;
    };
  }(),

  /**
   * 判断变量是否为字符串类型
   *
   * @static
   * @method
   * @memberof Utils
   * @param {String} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isString: function () {
    var ks = _rt('s');
    return function (variable) {
      return _rt(variable) === ks;
    };
  }(),

  /**
   * 判断变量是否为数字类型
   *
   * @static
   * @method
   * @memberof Utils
   * @param {Number} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isNumber: function () {
    var ks = _rt(1);
    return function (variable) {
      return _rt(variable) === ks;
    };
  }(),

  /**
   * 判断变量是否为函数类型
   *
   * @static
   * @method
   * @memberof Utils
   * @param {Function} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isFunction: function () {
    var ks = _rt(function () {});
    return function (variable) {
      return _rt(variable) === ks;
    };
  }(),

  /**
   * 判断变量是否为undefined
   *
   * @static
   * @method
   * @memberof Utils
   * @param {Function} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isUndefined: function isUndefined(variable) {
    return typeof variable === 'undefined';
  },


  /**
   * 判断变量是否为布尔型
   *
   * @static
   * @method
   * @memberof Utils
   * @param {Function} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isBoolean: function () {
    var ks = _rt(true);
    return function (variable) {
      return _rt(variable) === ks;
    };
  }(),

  /**
   * 强化的随机数，可以随机产生给定区间内的数字、随机输出数字内的项
   *
   * @static
   * @method
   * @memberof Utils
   * @param {Array | Number} min 当只传入一个变量时变量应该为数字，否则为所给定区间较小的数字
   * @param {Number} max 所给定区间较大的数字
   * @return {ArrayItem | Number} 返回数组中大一项或者给定区间内的数字
   */
  random: function random(min, max) {
    if (this.isArray(min)) return min[~~(Math.random() * min.length)];
    if (!this.isNumber(max)) {
      max = min || 1;
      min = 0;
    }
    return min + Math.random() * (max - min);
  },


  /**
   * 阿基米德求模
   *
   * @static
   * @method
   * @memberof Utils
   * @param {Number} n 当前值
   * @param {Number} m 模
   * @return {Number} 映射到模长内的值
   */
  euclideanModulo: function euclideanModulo(n, m) {
    return (n % m + m) % m;
  },


  /**
   * 边界值域镜像
   *
   * @static
   * @method
   * @memberof Utils
   * @param {Number} n 当前值
   * @param {Number} min 值域下边界
   * @param {Number} max 值域上边界
   * @return {Number} 值域内反射到的值
   */
  codomainBounce: function codomainBounce(n, min, max) {
    if (n < min) return 2 * min - n;
    if (n > max) return 2 * max - n;
    return n;
  },


  /**
   * 数字区间闭合，避免超出区间
   *
   * @static
   * @method
   * @memberof Utils
   * @param {Number} x 待闭合到值
   * @param {Number} a 闭合区间左边界
   * @param {Number} b 闭合区间右边界
   * @return {Number} 闭合后的值
   */
  clamp: function clamp(x, a, b) {
    return x < a ? a : x > b ? b : x;
  },


  /**
   * 线性插值
   *
   * @static
   * @method
   * @memberof Utils
   * @param {Number} x 输入的值
   * @param {Number} min 输入值的下区间
   * @param {Number} max 输入值的上区间
   * @return {Number} 返回的值在区间[0,1]内
   */
  linear: function linear(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;
    x = (x - min) / (max - min);
    return x;
  },


  /**
   * 平滑插值
   *
   * @static
   * @method
   * @memberof Utils
   * @param {Number} x 输入的值
   * @param {Number} min 输入值的下区间
   * @param {Number} max 输入值的上区间
   * @return {Number} 返回的值在区间[0,1]内
   */
  smoothstep: function smoothstep(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;
    x = (x - min) / (max - min);
    return x * x * (3 - 2 * x);
  },


  /**
   * 更平滑的插值
   *
   * @static
   * @method
   * @memberof Utils
   * @param {Number} x 输入的值
   * @param {Number} min 输入值的下区间
   * @param {Number} max 输入值的上区间
   * @return {Number} 返回的值在区间[0,1]内
   */
  smootherstep: function smootherstep(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;
    x = (x - min) / (max - min);
    return x * x * x * (x * (x * 6 - 15) + 10);
  },


  /**
   * sort list use bubble sort
   * @param {array} list list array
   * @param {function} fn list array
   */
  bubbleSort: function bubbleSort(list, fn) {
    var length = list.length;
    var i = void 0;
    var j = void 0;
    var temp = void 0;
    for (i = 0; i < length - 1; i++) {
      for (j = 0; j < length - 1 - i; j++) {
        var m1 = fn(list[j]);
        var m2 = fn(list[j + 1]);
        if (m1 > m2) {
          temp = list[j];
          list[j] = list[j + 1];
          list[j + 1] = temp;
        }
      }
    }
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * an animate class, root class
 * @private
 */

var Animate = function (_EventDispatcher) {
  inherits(Animate, _EventDispatcher);

  /**
   * config your animation
   * @param {Object} options animate config
   * @private
   */
  function Animate(options) {
    classCallCheck(this, Animate);

    var _this = possibleConstructorReturn(this, (Animate.__proto__ || Object.getPrototypeOf(Animate)).call(this));

    _this.object = options.object || {};
    _this.duration = options.duration || 300;
    _this.living = true;
    _this.resident = options.resident || false;

    _this.infinite = options.infinite || false;
    _this.alternate = options.alternate || false;
    _this.repeats = options.repeats || 0;
    _this.delay = options.delay || 0;
    _this.wait = options.wait || 0;
    _this.timeScale = Utils.isNumber(options.timeScale) ? options.timeScale : 1;

    if (options.onComplete) {
      _this.on('complete', options.onComplete.bind(_this));
    }
    if (options.onUpdate) {
      _this.on('update', options.onUpdate.bind(_this));
    }

    _this.init();

    _this.paused = false;
    return _this;
  }

  /**
   * init animate state
   * @private
   */


  createClass(Animate, [{
    key: 'init',
    value: function init() {
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

  }, {
    key: 'update',
    value: function update(snippet) {
      var snippetCache = this.direction * this.timeScale * snippet;
      if (this.waitCut > 0) {
        this.waitCut -= Math.abs(snippetCache);
        return;
      }
      if (this.paused || !this.living || this.delayCut > 0) {
        if (this.delayCut > 0) this.delayCut -= Math.abs(snippetCache);
        return;
      }

      this.progress += snippetCache;
      var isEnd = false;
      var progressCache = this.progress;

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

      var pose = void 0;
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

  }, {
    key: 'spill',
    value: function spill() {
      var bSpill = this.progress <= 0 && this.direction === -1;
      var tSpill = this.progress >= this.duration && this.direction === 1;
      return bSpill || tSpill;
    }

    /**
     * get next pose, should be overwrite by sub-class
     * @private
     */

  }, {
    key: 'nextPose',
    value: function nextPose() {
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

  }, {
    key: 'linear',
    value: function linear(p0, p1, t) {
      return (p1 - p0) * t + p0;
    }

    /**
     * pause this animate
     */

  }, {
    key: 'pause',
    value: function pause() {
      this.paused = true;
    }

    /**
     * restore this animate play
     */

  }, {
    key: 'restart',
    value: function restart() {
      this.paused = false;
    }

    /**
     * stop this animate at last frame, will trigger `complete` event
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.repeats = 0;
      this.infinite = false;
      this.progress = this.duration;
    }

    /**
     * set this queue's timeScale
     * @param {Number} speed set timescale
     */

  }, {
    key: 'setSpeed',
    value: function setSpeed(speed) {
      this.timeScale = speed;
    }

    /**
     * cancle this animate, will not trigger `complete` event
     */

  }, {
    key: 'cancle',
    value: function cancle() {
      this.living = false;
    }
  }]);
  return Animate;
}(three.EventDispatcher);

/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */

var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;

var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

var float32ArraySupported = typeof Float32Array === 'function';

/* eslint new-cap: 0 */

/**
 * 公因式A
 *
 * @param {number} aA1 控制分量
 * @param {number} aA2 控制分量
 * @return {number} 整个公式中的A公因式的值
 */
function A(aA1, aA2) {
  return 1.0 - 3.0 * aA2 + 3.0 * aA1;
}

/**
 * 公因式B
 *
 * @param {number} aA1 控制分量1
 * @param {number} aA2 控制分量2
 * @return {number} 整个公式中的B公因式的值
 */
function B(aA1, aA2) {
  return 3.0 * aA2 - 6.0 * aA1;
}

/**
 * 公因式C
 *
 * @param {number} aA1 控制分量1
 * @param {number} aA2 控制分量2
 * @return {number} 整个公式中的C公因式的值
 */
function C(aA1) {
  return 3.0 * aA1;
}

/**
 * 获取aT处的值
 *
 * @param {number} aT 三次贝塞尔曲线的t自变量
 * @param {number} aA1 控制分量1
 * @param {number} aA2 控制分量2
 * @return {number} 三次贝塞尔公式的因变量
 */
function calcBezier(aT, aA1, aA2) {
  return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
}

/**
 * 获取aT处的斜率
 * @param {number} aT 三次贝塞尔曲线的t自变量
 * @param {number} aA1 控制分量1
 * @param {number} aA2 控制分量2
 * @return {number} 三次贝塞尔公式的导数
 */
function getSlope(aT, aA1, aA2) {
  return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
}

/**
 *
 * @param {number} aX x
 * @param {number} aA a
 * @param {number} aB b
 * @param {number} mX1 min x
 * @param {number} mX2 max x
 * @return {number} 二分法猜测t的值
 */
function binarySubdivide(aX, aA, aB, mX1, mX2) {
  var currentX = void 0;
  var currentT = void 0;
  var i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

/**
 * 牛顿迭代算法，进一步的获取精确的T值
 * @param {number} aX x
 * @param {number} aGuessT guess t
 * @param {number} mX1 min x
 * @param {number} mX2 max x
 * @return {number} 获取更精确的T值
 */
function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
  for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
    var currentSlope = getSlope(aGuessT, mX1, mX2);
    if (currentSlope === 0.0) {
      return aGuessT;
    }
    var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }
  return aGuessT;
}

/**
 * cubic-bezier曲线的两个控制点，默认起始点为 0，结束点为 1
 *
 * @class
 * @param {number} mX1 控制点1的x分量
 * @param {number} mY1 控制点1的y分量
 * @param {number} mX2 控制点2的x分量
 * @param {number} mY2 控制点2的y分量
 */
function BezierEasing(mX1, mY1, mX2, mY2) {
  if (!(mX1 >= 0 && mX1 <= 1 && mX2 >= 0 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }
  this.mX1 = mX1;
  this.mY1 = mY1;
  this.mX2 = mX2;
  this.mY2 = mY2;
  this.sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

  this._preCompute();
}

BezierEasing.prototype._preCompute = function () {
  // Precompute samples table
  if (this.mX1 !== this.mY1 || this.mX2 !== this.mY2) {
    for (var i = 0; i < kSplineTableSize; ++i) {
      this.sampleValues[i] = calcBezier(i * kSampleStepSize, this.mX1, this.mX2);
    }
  }
};

BezierEasing.prototype._getTForX = function (aX) {
  var intervalStart = 0.0;
  var currentSample = 1;
  var lastSample = kSplineTableSize - 1;

  for (; currentSample !== lastSample && this.sampleValues[currentSample] <= aX; ++currentSample) {
    intervalStart += kSampleStepSize;
  }
  --currentSample;

  // Interpolate to provide an initial guess for t
  var dist = (aX - this.sampleValues[currentSample]) / (this.sampleValues[currentSample + 1] - this.sampleValues[currentSample]);
  var guessForT = intervalStart + dist * kSampleStepSize;

  var initialSlope = getSlope(guessForT, this.mX1, this.mX2);
  if (initialSlope >= NEWTON_MIN_SLOPE) {
    return newtonRaphsonIterate(aX, guessForT, this.mX1, this.mX2);
  } else if (initialSlope === 0.0) {
    return guessForT;
  }
  return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, this.mX1, this.mX2);
};

/**
 * 通过x轴近似获取y的值
 *
 * @param {number} x x轴的偏移量
 * @return {number} 与输入值x对应的y值
 */
BezierEasing.prototype.get = function (x) {
  if (this.mX1 === this.mY1 && this.mX2 === this.mY2) return x;
  if (x === 0) {
    return 0;
  }
  if (x === 1) {
    return 1;
  }
  return calcBezier(this._getTForX(x), this.mY1, this.mY2);
};

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

var Tween = {

  Linear: {
    None: function None(k) {
      return k;
    }
  },

  Ease: {

    In: function () {
      var bezier = new BezierEasing(0.42, 0, 1, 1);
      return function (k) {
        return bezier.get(k);
      };
    }(),

    Out: function () {
      var bezier = new BezierEasing(0, 0, 0.58, 1);
      return function (k) {
        return bezier.get(k);
      };
    }(),

    InOut: function () {
      var bezier = new BezierEasing(0.42, 0, 0.58, 1);
      return function (k) {
        return bezier.get(k);
      };
    }(),

    Bezier: function Bezier(x1, y1, x2, y2) {
      var bezier = new BezierEasing(x1, y1, x2, y2);
      return function (k) {
        return bezier.get(k);
      };
    }
  },

  Elastic: {
    In: function In(k) {
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
    },
    Out: function Out(k) {
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
    },
    InOut: function InOut(k) {
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
    }
  },

  Back: {
    In: function In(k) {
      var s = 1.70158;
      return k * k * ((s + 1) * k - s);
    },
    Out: function Out(k) {
      var s = 1.70158;
      return --k * k * ((s + 1) * k + s) + 1;
    },
    InOut: function InOut(k) {
      var s = 1.70158 * 1.525;
      if ((k *= 2) < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s));
      }
      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    }
  },

  Bounce: {
    In: function In(k) {
      return 1 - Tween.Bounce.Out(1 - k);
    },
    Out: function Out(k) {
      if (k < 1 / 2.75) {
        return 7.5625 * k * k;
      } else if (k < 2 / 2.75) {
        return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
      } else if (k < 2.5 / 2.75) {
        return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
      }
      return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
    },
    InOut: function InOut(k) {
      if (k < 0.5) {
        return Tween.Bounce.In(k * 2) * 0.5;
      }
      return Tween.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
    }
  }
};

/* eslint guard-for-in: "off" */

/**
 * transition class
 * @private
 */

var Transition = function (_Animate) {
  inherits(Transition, _Animate);

  function Transition(options) {
    classCallCheck(this, Transition);

    // collect from pose, when from was not complete
    var _this = possibleConstructorReturn(this, (Transition.__proto__ || Object.getPrototypeOf(Transition)).call(this, options));

    options.from = options.from || {};
    for (var i in options.to) {
      if (Utils.isUndefined(options.from[i])) options.from[i] = _this.object.props(i);
    }

    /**
     * timing function
     */
    _this.ease = options.ease || Tween.Ease.InOut;

    /**
     * from pose
     */
    _this.from = options.from;

    /**
     * to pose
     */
    _this.to = options.to;
    return _this;
  }

  /**
   * calculate next frame pose
   * @private
   * @return {object} pose state
   */


  createClass(Transition, [{
    key: 'nextPose',
    value: function nextPose() {
      var pose = {};
      var t = this.ease(this.progress / this.duration);
      for (var i in this.to) {
        pose[i] = this.linear(this.from[i], this.to[i], t);
        this.object.props(i, pose[i]);
      }
      return pose;
    }
  }]);
  return Transition;
}(Animate);

/**
 * PathMotion class
 * @private
 */

var PathMotion = function (_Animate) {
  inherits(PathMotion, _Animate);

  function PathMotion(options) {
    classCallCheck(this, PathMotion);

    var _this = possibleConstructorReturn(this, (PathMotion.__proto__ || Object.getPrototypeOf(PathMotion)).call(this, options));

    if (!options.path || !(options.path instanceof three.Curve)) {
      console.warn('path is not instanceof Curve');
    }

    /**
     * path, extend curve
     */
    _this.path = options.path;

    /**
     * timing function
     */
    _this.ease = options.ease || Tween.Ease.InOut;

    /**
     * use lengthMode or not
     */
    _this.lengthMode = Utils.isBoolean(options.lengthMode) ? options.lengthMode : false;

    /**
     * progress need clamp with [0, 1]
     */
    _this.needClamp = Utils.isBoolean(options.needClamp) ? options.needClamp : true;

    /**
     * object need attach tangent
     */
    _this.attachTangent = Utils.isBoolean(options.attachTangent) ? options.attachTangent : false;
    return _this;
  }

  /**
   * caculation next pose
   * @return {Vector3} position
   */


  createClass(PathMotion, [{
    key: 'nextPose',
    value: function nextPose() {
      var t = this.ease(this.progress / this.duration);
      if (this.needClamp) {
        t = Utils.clamp(t, 0, 1);
      }
      var position = this.lengthMode ? this.path.getPointAt(t) : this.path.getPoint(t);

      this.object.position.copy(position);
      if (this.attachTangent) {
        var direction = this.lengthMode ? this.path.getTangentAt(t) : this.path.getTangent(t);
        this.object.lookAt(position.add(direction));
      }
      return position;
    }
  }]);
  return PathMotion;
}(Animate);

// import Utils from '../utils/Utils';
/**
 * AnimateRunner, composer any animation type
 *
 * @private
 */

var AnimateRunner = function (_Animate) {
  inherits(AnimateRunner, _Animate);

  /**
   * config a runner animation
   * @param {object} [options] runners config
   */
  function AnimateRunner(options) {
    classCallCheck(this, AnimateRunner);

    var _this = possibleConstructorReturn(this, (AnimateRunner.__proto__ || Object.getPrototypeOf(AnimateRunner)).call(this, options));

    _this.runners = options.runners;
    _this.cursor = 0;
    _this.queues = [];
    _this.alternate = false;

    _this.length = _this.runners.length;

    // TODO: Is it necessary to exist ?
    // this.propsMap = [];
    // this.prepare();
    return _this;
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


  createClass(AnimateRunner, [{
    key: 'initRunner',
    value: function initRunner() {
      var runner = this.runners[this.cursor];
      runner.infinite = false;
      runner.resident = true;
      runner.object = this.object;

      var animate = null;
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

  }, {
    key: 'nextRunner',
    value: function nextRunner(_, time) {
      this.queues[this.cursor].init();
      this.cursor += this.direction;
      this.timeSnippet = time;
    }

    /**
     * get next pose
     * @param {Number} snippetCache time snippet
     * @return {Object} pose
     */

  }, {
    key: 'nextPose',
    value: function nextPose(snippetCache) {
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

  }, {
    key: 'update',
    value: function update(snippet) {
      if (this.wait > 0) {
        this.wait -= Math.abs(snippet);
        return;
      }
      if (this.paused || !this.living || this.delayCut > 0) {
        if (this.delayCut > 0) this.delayCut -= Math.abs(snippet);
        return;
      }

      var cc = this.cursor;

      var pose = this.nextPose(this.direction * this.timeScale * snippet);

      this.emit('update', {
        index: cc,
        pose: pose
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

  }, {
    key: 'spill',
    value: function spill() {
      // TODO: 这里应该保留溢出，不然会导致时间轴上的误差
      var topSpill = this.cursor >= this.length;
      return topSpill;
    }
  }]);
  return AnimateRunner;
}(Animate);

/**
 * timeline animations class
 * @private
 */

var TimelineAnimations = function () {
  function TimelineAnimations(object) {
    classCallCheck(this, TimelineAnimations);

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


  createClass(TimelineAnimations, [{
    key: 'update',
    value: function update(snippet) {
      if (this.paused) return;
      snippet = this.timeScale * snippet;
      var cache = this.animates.slice(0);
      for (var i = 0; i < cache.length; i++) {
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

  }, {
    key: 'animate',
    value: function animate(options, clear) {
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

  }, {
    key: 'motion',
    value: function motion(options, clear) {
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

  }, {
    key: 'runners',
    value: function runners(options, clear) {
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

  }, {
    key: '_addMove',
    value: function _addMove(animate, clear) {
      if (clear) this.clear();
      this.animates.push(animate);
      return animate;
    }

    /**
     * pause animates
     */

  }, {
    key: 'pause',
    value: function pause() {
      this.paused = true;
    }

    /**
     * restore animates play
     */

  }, {
    key: 'restart',
    value: function restart() {
      this.paused = false;
    }

    /**
     * set this queue's timeScale
     * @param {Number} speed set timescale
     */

  }, {
    key: 'setSpeed',
    value: function setSpeed(speed) {
      this.timeScale = speed;
    }

    /**
     * clear all animates
     * @private
     */

  }, {
    key: 'clear',
    value: function clear() {
      this.animates.length = 0;
    }
  }]);
  return TimelineAnimations;
}();

/**
 * timeline scale, effect this display-node and it's children
 */
three.Object3D.prototype.timeScale = 1;

/**
 * whether pause the timeline update with this display-node and it's children
 */
three.Object3D.prototype.paused = false;

/**
 * scale display-object with xyz together
 *
 */
Object.defineProperty(three.Object3D.prototype, 'scaleXYZ', {
  get: function get() {
    return this.scale.x;
  },
  set: function set(scale) {
    this.scale.x = this.scale.y = this.scale.z = scale;
  }
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
three.Object3D.prototype.animate = function (options, clear) {
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
three.Object3D.prototype.runners = function (options, clear) {
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
three.Object3D.prototype.motion = function (options, clear) {
  if (!this.timelineAnimations) this.initTimeline();
  return this.timelineAnimations.motion(options, clear);
};

/**
 * initial timeline when it was not created
 *
 * @private
 */
three.Object3D.prototype.initTimeline = function () {
  this.timelineAnimations = new TimelineAnimations(this);
};

/**
 * update display-object animation
 *
 * @private
 * @param {Number} snippet time snippet
 */
three.Object3D.prototype.updateAnimations = function (snippet) {
  if (!this.timelineAnimations) return;
  this.timelineAnimations.update(snippet);
};

/**
 * update display-object timeline
 *
 * @param {Number} snippet time snippet
 */
three.Object3D.prototype.updateTimeline = function (snippet) {
  if (this.paused) return;
  snippet = this.timeScale * snippet;

  this.emit('pretimeline', {
    snippet: snippet
  });

  this.updateAnimations(snippet);

  var i = 0;
  var children = this.children;
  var length = children.length;
  while (i < length) {
    children[i].updateTimeline(snippet);
    i++;
  }

  this.emit('posttimeline', {
    snippet: snippet
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
three.Object3D.prototype.props = function (key, value) {
  if (!key) return;

  var rawKeys = key.split('.');

  if (rawKeys.length === 0) {
    if (Utils.isUndefined(value)) {
      return this[key];
    }
    this[key] = value;
    return value;
  }

  var prop = rawKeys.pop();
  var head = rawKeys.join('.');

  if (!this.keysMaps || !this.keysMaps[head]) {
    this.linkProp(head, rawKeys);
  }

  if (Utils.isUndefined(value)) {
    return this.keysMaps[head][prop];
  }
  this.keysMaps[head][prop] = value;
  return value;
};

three.Object3D.prototype.linkProp = function (head, rawKeys) {
  if (!this.keysMaps) this.keysMaps = {};
  var prop = this;
  for (var i = 0; i < rawKeys.length; i++) {
    var key = rawKeys[i];
    prop = prop[key];
  }
  this.keysMaps[head] = prop;
};

var Smooth = function () {
  function Smooth(object, options) {
    classCallCheck(this, Smooth);

    options = options || {};
    this.object = object;
    this.to = new three.Vector3().copy(object);
    this.now = this.to.clone();
    this.speed = options.speed || 0.02;
    this.noise = options.noise || 0.000001;
  }

  createClass(Smooth, [{
    key: 'goto',
    value: function goto(x, y, z) {
      this.to.set(x, y, z);
    }
  }, {
    key: 'update',
    value: function update() {
      var space = this.to.clone().sub(this.now).multiplyScalar(this.speed);
      if (space.length() < this.noise) return;
      this.now.add(space);
      this.object.x = this.now.x;
      this.object.y = this.now.y;
      this.object.z = this.now.z;
    }
  }]);
  return Smooth;
}();

var zee = new three.Vector3(0, 0, 1);

var euler = new three.Euler();

var q0 = new three.Quaternion();

var q1 = new three.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

var ROTATE_ORDER = 'YXZ';

var Orienter = function (_EventDispatcher) {
  inherits(Orienter, _EventDispatcher);

  function Orienter(options) {
    classCallCheck(this, Orienter);

    var _this = possibleConstructorReturn(this, (Orienter.__proto__ || Object.getPrototypeOf(Orienter)).call(this));

    options = options || {};

    _this._orient = _this._orient.bind(_this);
    _this._change = _this._change.bind(_this);

    _this.needFix = Utils.isBoolean(options.needFix) ? options.needFix : true;
    _this.fix = 0;
    _this.timing = 8;

    _this.alpha = 0;
    _this.beta = 0;
    _this.gamma = 0;
    _this.lon = 0;
    _this.lat = 0;
    _this.direction = 0;
    _this.quaternion = new three.Quaternion();

    _this.eared = false;
    _this.nodce = true;
    _this.connect();
    return _this;
  }

  createClass(Orienter, [{
    key: 'connect',
    value: function connect() {
      this._change();
      if (this.eared) return;
      this.eared = true;
      window.addEventListener('deviceorientation', this._orient, false);
      window.addEventListener('orientationchange', this._change, false);
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      this.eared = false;
      window.removeEventListener('deviceorientation', this._orient, false);
      window.removeEventListener('orientationchange', this._change, false);
    }
  }, {
    key: '_orient',
    value: function _orient(event) {
      if (!Utils.isNumber(event.alpha) || !Utils.isNumber(event.beta) || !Utils.isNumber(event.gamma)) {
        this.nodce = true;
        return;
      }
      if (this.needFix) {
        if (this.timing === 0) {
          this.needFix = false;
          this.fix = event.alpha;
        }
        this.timing--;
      } else {
        this.alpha = Utils.euclideanModulo(event.alpha - this.fix, 360);
      }
      this.nodce = false;

      this.beta = event.beta;
      this.gamma = event.gamma;

      this.update();

      this.emit('deviceorientation', {
        alpha: this.alpha,
        beta: this.beta,
        gamma: this.gamma,
        lon: this.lon,
        lat: this.lat,
        quaternion: this.quaternion
      });
    }
  }, {
    key: 'update',
    value: function update() {
      if (!this.eared || this.nodce) return;
      var alpha = Utils.DTR(this.alpha);
      var beta = Utils.DTR(this.beta);
      var gamma = Utils.DTR(this.gamma);
      euler.set(beta, alpha, -gamma, ROTATE_ORDER); // 'ZXY' for the device, but 'YXZ' for us

      this.quaternion.setFromEuler(euler); // orient the device
      this.quaternion.multiply(q1); // camera looks out the back of the device, not the top
      this.quaternion.multiply(q0.setFromAxisAngle(zee, -this.direction)); // adjust for screen orientation

      this.calculation();
    }
  }, {
    key: 'calculation',
    value: function calculation() {
      this.lon = Utils.euclideanModulo(this.alpha + this.gamma, 360);

      var face = new three.Vector3(0, 0, -1);
      face.applyQuaternion(this.quaternion);
      var xzFace = new three.Vector3(face.x, 0, face.z);
      var cos = Utils.clamp(xzFace.dot(face), -1, 1);
      var nor = face.y >= 0 ? 1 : -1;
      var degree = Utils.RTD(Math.acos(cos));
      this.lat = this.beta < 0 ? nor * (180 - degree) : nor * degree;
    }
  }, {
    key: '_change',
    value: function _change() {
      this.direction = window.orientation || 0;
      this.update();
    }
  }]);
  return Orienter;
}(three.EventDispatcher);

/* eslint no-unused-vars: 0 */

var Pass = function () {
  function Pass() {
    classCallCheck(this, Pass);

    // if set to true, the pass is processed by the composer
    this.enabled = true;

    // if set to true, the pass indicates to swap read and write buffer after rendering
    this.needsSwap = true;

    // if set to true, the pass clears its buffer before rendering
    this.clear = false;

    // if set to true, the result of the pass is rendered to screen
    this.renderToScreen = false;
  }

  createClass(Pass, [{
    key: 'setSize',
    value: function setSize(width, height) {}
  }, {
    key: 'render',
    value: function render(renderer, writeBuffer, readBuffer, delta) {
      console.error('Pass: .render() must be implemented in derived pass.');
    }
  }]);
  return Pass;
}();

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 * @private
 */

var CopyShader = {

  uniforms: {

    tDiffuse: { value: null },
    opacity: { value: 1.0 }

  },

  vertexShader: "\n  varying vec2 vUv;\n  void main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  }",

  fragmentShader: "\n  uniform float opacity;\n  uniform sampler2D tDiffuse;\n  varying vec2 vUv;\n  void main() {\n    vec4 texel = texture2D( tDiffuse, vUv );\n    gl_FragColor = opacity * texel;\n  }"

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Convolution shader
 * ported from o3d sample to WebGL / GLSL
 * http://o3d.googlecode.com/svn/trunk/samples/convolution.html
 * @private
 */
var ConvolutionShader = {

  defines: {

    KERNEL_SIZE_FLOAT: '25.0',
    KERNEL_SIZE_INT: '25'

  },

  uniforms: {

    tDiffuse: { value: null },
    uImageIncrement: { value: new three.Vector2(0.001953125, 0.0) },
    cKernel: { value: [] }

  },

  vertexShader: '\n  uniform vec2 uImageIncrement;\n  varying vec2 vUv;\n  void main() {\n    vUv = uv - ( ( KERNEL_SIZE_FLOAT - 1.0 ) / 2.0 ) * uImageIncrement;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  }',

  fragmentShader: '\n  uniform float cKernel[ KERNEL_SIZE_INT ];\n  uniform sampler2D tDiffuse;\n  uniform vec2 uImageIncrement;\n  varying vec2 vUv;\n  void main() {\n    vec2 imageCoord = vUv;\n    vec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );\n    for( int i = 0; i < KERNEL_SIZE_INT; i ++ ) {\n      sum += texture2D( tDiffuse, imageCoord ) * cKernel[ i ];\n      imageCoord += uImageIncrement;\n    }\n    gl_FragColor = sum;\n  }',

  buildKernel: function buildKernel(sigma) {

    // We lop off the sqrt(2 * pi) * sigma term, since we're going to normalize anyway.

    function gauss(x, sigma) {

      return Math.exp(-(x * x) / (2.0 * sigma * sigma));
    }

    var i = void 0;
    var sum = void 0;
    var kMaxKernelSize = 25;
    var kernelSize = 2 * Math.ceil(sigma * 3.0) + 1;

    if (kernelSize > kMaxKernelSize) kernelSize = kMaxKernelSize;
    var halfWidth = (kernelSize - 1) * 0.5;

    var values = new Array(kernelSize);
    sum = 0.0;
    for (i = 0; i < kernelSize; ++i) {

      values[i] = gauss(i - halfWidth, sigma);
      sum += values[i];
    }

    // normalize the kernel

    for (i = 0; i < kernelSize; ++i) {
      values[i] /= sum;
    }return values;
  }
};

var BloomPass = function (_Pass) {
  inherits(BloomPass, _Pass);

  function BloomPass(strength, kernelSize, sigma, resolution) {
    classCallCheck(this, BloomPass);

    var _this = possibleConstructorReturn(this, (BloomPass.__proto__ || Object.getPrototypeOf(BloomPass)).call(this));

    strength = strength !== undefined ? strength : 1;
    kernelSize = kernelSize !== undefined ? kernelSize : 25;
    sigma = sigma !== undefined ? sigma : 4.0;
    resolution = resolution !== undefined ? resolution : 256;

    // render targets

    var pars = { minFilter: three.LinearFilter, magFilter: three.LinearFilter, format: three.RGBAFormat };

    _this.renderTargetX = new three.WebGLRenderTarget(resolution, resolution, pars);
    _this.renderTargetX.texture.name = 'BloomPass.x';
    _this.renderTargetY = new three.WebGLRenderTarget(resolution, resolution, pars);
    _this.renderTargetY.texture.name = 'BloomPass.y';

    // copy material

    if (CopyShader === undefined) console.error('BloomPass relies on CopyShader');

    var copyShader = CopyShader;

    _this.copyUniforms = three.UniformsUtils.clone(copyShader.uniforms);

    _this.copyUniforms.opacity.value = strength;

    _this.materialCopy = new three.ShaderMaterial({
      uniforms: _this.copyUniforms,
      vertexShader: copyShader.vertexShader,
      fragmentShader: copyShader.fragmentShader,
      blending: three.AdditiveBlending,
      transparent: true
    });

    // convolution material

    if (ConvolutionShader === undefined) console.error('BloomPass relies on ConvolutionShader');

    var convolutionShader = ConvolutionShader;

    _this.convolutionUniforms = three.UniformsUtils.clone(convolutionShader.uniforms);

    _this.convolutionUniforms.uImageIncrement.value = BloomPass.blurX;
    _this.convolutionUniforms.cKernel.value = ConvolutionShader.buildKernel(sigma);

    _this.materialConvolution = new three.ShaderMaterial({
      uniforms: _this.convolutionUniforms,
      vertexShader: convolutionShader.vertexShader,
      fragmentShader: convolutionShader.fragmentShader,
      defines: {
        KERNEL_SIZE_FLOAT: kernelSize.toFixed(1),
        KERNEL_SIZE_INT: kernelSize.toFixed(0)
      }
    });

    _this.needsSwap = false;

    _this.camera = new three.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    _this.scene = new three.Scene();

    _this.quad = new three.Mesh(new three.PlaneBufferGeometry(2, 2), null);
    _this.quad.frustumCulled = false; // Avoid getting clipped
    _this.scene.add(_this.quad);
    return _this;
  }

  createClass(BloomPass, [{
    key: 'render',
    value: function render(renderer, writeBuffer, readBuffer, delta, maskActive) {

      if (maskActive) renderer.context.disable(renderer.context.STENCIL_TEST);

      // Render quad with blured scene into texture (convolution pass 1)

      this.quad.material = this.materialConvolution;

      this.convolutionUniforms.tDiffuse.value = readBuffer.texture;
      this.convolutionUniforms.uImageIncrement.value = BloomPass.blurX;

      renderer.render(this.scene, this.camera, this.renderTargetX, true);

      // Render quad with blured scene into texture (convolution pass 2)

      this.convolutionUniforms.tDiffuse.value = this.renderTargetX.texture;
      this.convolutionUniforms.uImageIncrement.value = BloomPass.blurY;

      renderer.render(this.scene, this.camera, this.renderTargetY, true);

      // Render original scene with superimposed blur to texture

      this.quad.material = this.materialCopy;

      this.copyUniforms.tDiffuse.value = this.renderTargetY.texture;

      if (maskActive) renderer.context.enable(renderer.context.STENCIL_TEST);

      renderer.render(this.scene, this.camera, readBuffer, this.clear);
    }
  }]);
  return BloomPass;
}(Pass);

BloomPass.blurX = new three.Vector2(0.001953125, 0.0);
BloomPass.blurY = new three.Vector2(0.0, 0.001953125);

var ClearMaskPass = function (_Pass) {
  inherits(ClearMaskPass, _Pass);

  function ClearMaskPass() {
    classCallCheck(this, ClearMaskPass);

    var _this = possibleConstructorReturn(this, (ClearMaskPass.__proto__ || Object.getPrototypeOf(ClearMaskPass)).call(this));

    _this.needsSwap = false;
    return _this;
  }

  createClass(ClearMaskPass, [{
    key: 'render',
    value: function render(renderer) {
      renderer.state.buffers.stencil.setTest(false);
    }
  }]);
  return ClearMaskPass;
}(Pass);

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Film grain & scanlines shader
 *
 * - ported from HLSL to WebGL / GLSL
 * http://www.truevision3d.com/forums/showcase/staticnoise_colorblackwhite_scanline_shaders-t18698.0.html
 *
 * Screen Space Static Postprocessor
 *
 * Produces an analogue noise overlay similar to a film grain / TV static
 *
 * Original implementation and noise algorithm
 * Pat 'Hawthorne' Shearon
 *
 * Optimized scanlines + noise version with intensity scaling
 * Georg 'Leviathan' Steinrohder
 *
 * This version is provided under a Creative Commons Attribution 3.0 License
 * http://creativecommons.org/licenses/by/3.0/
 * @private
 */
var FilmShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0.0 },
    nIntensity: { value: 0.5 },
    sIntensity: { value: 0.05 },
    sCount: { value: 4096 },
    grayscale: { value: 1 }
  },

  vertexShader: "\n  varying vec2 vUv;\n  void main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  }",

  fragmentShader: "\n  #include <common>\n  // control parameter\n  uniform float time;\n\n  uniform bool grayscale;\n\n  // noise effect intensity value (0 = no effect, 1 = full effect)\n  uniform float nIntensity;\n\n  // scanlines effect intensity value (0 = no effect, 1 = full effect)\n  uniform float sIntensity;\n\n  // scanlines effect count value (0 = no effect, 4096 = full effect)\n  uniform float sCount;\n\n  uniform sampler2D tDiffuse;\n\n  varying vec2 vUv;\n\n  void main() {\n    // sample the source\n    vec4 cTextureScreen = texture2D( tDiffuse, vUv );\n\n    // make some noise\n    float dx = rand( vUv + time );\n\n    // add noise\n    vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx, 0.0, 1.0 );\n\n    // get us a sine and cosine\n    vec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );\n\n    // add scanlines\n    cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;\n\n    // interpolate between source and result by intensity\n    cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );\n\n    // convert to grayscale if desired\n    if( grayscale ) {\n\n      cResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );\n\n    }\n\n    gl_FragColor =  vec4( cResult, cTextureScreen.a );\n\n  }"

};

/**
 * @author alteredq / http://alteredqualia.com/
 * @private
 */

var FilmPass = function (_Pass) {
  inherits(FilmPass, _Pass);

  function FilmPass(noiseIntensity, scanlinesIntensity, scanlinesCount, grayscale) {
    classCallCheck(this, FilmPass);

    var _this = possibleConstructorReturn(this, (FilmPass.__proto__ || Object.getPrototypeOf(FilmPass)).call(this));

    if (FilmShader === undefined) console.error('FilmPass relies on FilmShader');

    var shader = FilmShader;

    _this.uniforms = three.UniformsUtils.clone(shader.uniforms);

    _this.material = new three.ShaderMaterial({

      uniforms: _this.uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader

    });

    if (grayscale !== undefined) _this.uniforms.grayscale.value = grayscale;
    if (noiseIntensity !== undefined) _this.uniforms.nIntensity.value = noiseIntensity;
    if (scanlinesIntensity !== undefined) _this.uniforms.sIntensity.value = scanlinesIntensity;
    if (scanlinesCount !== undefined) _this.uniforms.sCount.value = scanlinesCount;

    _this.camera = new three.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    _this.scene = new three.Scene();

    _this.quad = new three.Mesh(new three.PlaneBufferGeometry(2, 2), null);
    _this.quad.frustumCulled = false; // Avoid getting clipped
    _this.scene.add(_this.quad);
    return _this;
  }

  createClass(FilmPass, [{
    key: 'render',
    value: function render(renderer, writeBuffer, readBuffer, delta) {

      this.uniforms.tDiffuse.value = readBuffer.texture;
      this.uniforms.time.value += delta;

      this.quad.material = this.material;

      if (this.renderToScreen) {

        renderer.render(this.scene, this.camera);
      } else {

        renderer.render(this.scene, this.camera, writeBuffer, this.clear);
      }
    }
  }]);
  return FilmPass;
}(Pass);

/**
 * @author felixturner / http://airtight.cc/
 *
 * RGB Shift Shader
 * Shifts red and blue channels from center in opposite directions
 * Ported from http://kriss.cx/tom/2009/05/rgb-shift/
 * by Tom Butterworth / http://kriss.cx/tom/
 *
 * amount: shift distance (1 is width of input)
 * angle: shift angle in radians
 * @private
 */
var DigitalGlitch = {

  uniforms: {

    tDiffuse: { value: null }, // diffuse texture
    tDisp: { value: null }, // displacement texture for digital glitch squares
    byp: { value: 0 }, // apply the glitch ?
    amount: { value: 0.08 },
    angle: { value: 0.02 },
    seed: { value: 0.02 },
    seed_x: { value: 0.02 }, // -1,1
    seed_y: { value: 0.02 }, // -1,1
    distortion_x: { value: 0.5 },
    distortion_y: { value: 0.6 },
    col_s: { value: 0.05 }
  },

  vertexShader: "\n  varying vec2 vUv;\n  void main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  }",

  fragmentShader: "\n  uniform int byp; // should we apply the glitch ?\n\n  uniform sampler2D tDiffuse;\n  uniform sampler2D tDisp;\n\n  uniform float amount;\n  uniform float angle;\n  uniform float seed;\n  uniform float seed_x;\n  uniform float seed_y;\n  uniform float distortion_x;\n  uniform float distortion_y;\n  uniform float col_s;\n\n  varying vec2 vUv;\n\n\n  float rand(vec2 co){\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n  }\n\n  void main() {\n    if(byp<1) {\n      vec2 p = vUv;\n      float xs = floor(gl_FragCoord.x / 0.5);\n      float ys = floor(gl_FragCoord.y / 0.5);\n      // based on staffantans glitch shader for unity https://github.com/staffantan/unityglitch\n      vec4 normal = texture2D (tDisp, p*seed*seed);\n      if(p.y<distortion_x+col_s && p.y>distortion_x-col_s*seed) {\n        if(seed_x>0.){\n          p.y = 1. - (p.y + distortion_y);\n        }\n        else {\n          p.y = distortion_y;\n        }\n      }\n      if(p.x<distortion_y+col_s && p.x>distortion_y-col_s*seed) {\n        if(seed_y>0.){\n          p.x=distortion_x;\n        }\n        else {\n          p.x = 1. - (p.x + distortion_x);\n        }\n      }\n      p.x+=normal.x*seed_x*(seed/5.);\n      p.y+=normal.y*seed_y*(seed/5.);\n      // base from RGB shift shader\n      vec2 offset = amount * vec2( cos(angle), sin(angle));\n      vec4 cr = texture2D(tDiffuse, p + offset);\n      vec4 cga = texture2D(tDiffuse, p);\n      vec4 cb = texture2D(tDiffuse, p - offset);\n      gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);\n      // add noise\n      vec4 snow = 200.*amount*vec4(rand(vec2(xs * seed,ys * seed*50.))*0.2);\n      gl_FragColor = gl_FragColor+ snow;\n    }\n    else {\n      gl_FragColor=texture2D (tDiffuse, vUv);\n    }\n  }"

};

/**
 * @author alteredq / http://alteredqualia.com/
 * @private
 */

var GlitchPass = function (_Pass) {
  inherits(GlitchPass, _Pass);

  function GlitchPass(dt_size) {
    classCallCheck(this, GlitchPass);

    var _this = possibleConstructorReturn(this, (GlitchPass.__proto__ || Object.getPrototypeOf(GlitchPass)).call(this));

    if (DigitalGlitch === undefined) console.error('GlitchPass relies on DigitalGlitch');

    var shader = DigitalGlitch;
    _this.uniforms = three.UniformsUtils.clone(shader.uniforms);

    if (dt_size === undefined) dt_size = 64;

    _this.uniforms.tDisp.value = _this.generateHeightmap(dt_size);

    _this.material = new three.ShaderMaterial({
      uniforms: _this.uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader
    });

    _this.camera = new three.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    _this.scene = new three.Scene();

    _this.quad = new three.Mesh(new three.PlaneBufferGeometry(2, 2), null);
    _this.quad.frustumCulled = false; // Avoid getting clipped
    _this.scene.add(_this.quad);

    _this.goWild = false;
    _this.curF = 0;
    _this.generateTrigger();
    return _this;
  }

  createClass(GlitchPass, [{
    key: 'render',
    value: function render(renderer, writeBuffer, readBuffer) {

      this.uniforms.tDiffuse.value = readBuffer.texture;
      this.uniforms.seed.value = Math.random(); // default seeding
      this.uniforms.byp.value = 0;

      if (this.curF % this.randX === 0 || this.goWild === true) {

        this.uniforms.amount.value = Math.random() / 30;
        this.uniforms.angle.value = Utils.random(-Math.PI, Math.PI);
        this.uniforms.seed_x.value = Utils.random(-1, 1);
        this.uniforms.seed_y.value = Utils.random(-1, 1);
        this.uniforms.distortion_x.value = Utils.random(0, 1);
        this.uniforms.distortion_y.value = Utils.random(0, 1);
        this.curF = 0;
        this.generateTrigger();
      } else if (this.curF % this.randX < this.randX / 5) {

        this.uniforms.amount.value = Math.random() / 90;
        this.uniforms.angle.value = Utils.random(-Math.PI, Math.PI);
        this.uniforms.distortion_x.value = Utils.random(0, 1);
        this.uniforms.distortion_y.value = Utils.random(0, 1);
        this.uniforms.seed_x.value = Utils.random(-0.3, 0.3);
        this.uniforms.seed_y.value = Utils.random(-0.3, 0.3);
      } else if (this.goWild === false) {

        this.uniforms.byp.value = 1;
      }

      this.curF++;
      this.quad.material = this.material;

      if (this.renderToScreen) {

        renderer.render(this.scene, this.camera);
      } else {

        renderer.render(this.scene, this.camera, writeBuffer, this.clear);
      }
    }
  }, {
    key: 'generateTrigger',
    value: function generateTrigger() {

      this.randX = Utils.random(120, 240) >> 0;
    }
  }, {
    key: 'generateHeightmap',
    value: function generateHeightmap(dt_size) {

      var data_arr = new Float32Array(dt_size * dt_size * 3);
      var length = dt_size * dt_size;

      for (var i = 0; i < length; i++) {

        var val = Utils.random(0, 1);
        data_arr[i * 3 + 0] = val;
        data_arr[i * 3 + 1] = val;
        data_arr[i * 3 + 2] = val;
      }

      var texture = new three.DataTexture(data_arr, dt_size, dt_size, three.RGBFormat, three.FloatType);
      texture.needsUpdate = true;
      return texture;
    }
  }]);
  return GlitchPass;
}(Pass);

/**
 * @author alteredq / http://alteredqualia.com/
 * @private
 */

var MaskPass = function (_Pass) {
  inherits(MaskPass, _Pass);

  function MaskPass(scene, camera) {
    classCallCheck(this, MaskPass);

    var _this = possibleConstructorReturn(this, (MaskPass.__proto__ || Object.getPrototypeOf(MaskPass)).call(this));

    _this.scene = scene;
    _this.camera = camera;

    _this.clear = true;
    _this.needsSwap = false;
    _this.inverse = false;
    return _this;
  }

  createClass(MaskPass, [{
    key: 'render',
    value: function render(renderer, writeBuffer, readBuffer) {

      var context = renderer.context;
      var state = renderer.state;

      // don't update color or depth

      state.buffers.color.setMask(false);
      state.buffers.depth.setMask(false);

      // lock buffers

      state.buffers.color.setLocked(true);
      state.buffers.depth.setLocked(true);

      // set up stencil

      var writeValue = void 0;
      var clearValue = void 0;

      if (this.inverse) {

        writeValue = 0;
        clearValue = 1;
      } else {

        writeValue = 1;
        clearValue = 0;
      }

      state.buffers.stencil.setTest(true);
      state.buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE);
      state.buffers.stencil.setFunc(context.ALWAYS, writeValue, 0xffffffff);
      state.buffers.stencil.setClear(clearValue);

      // draw into the stencil buffer

      renderer.render(this.scene, this.camera, readBuffer, this.clear);
      renderer.render(this.scene, this.camera, writeBuffer, this.clear);

      // unlock color and depth buffer for subsequent rendering

      state.buffers.color.setLocked(false);
      state.buffers.depth.setLocked(false);

      // only render where stencil is set to 1

      state.buffers.stencil.setFunc(context.EQUAL, 1, 0xffffffff); // draw if == 1
      state.buffers.stencil.setOp(context.KEEP, context.KEEP, context.KEEP);
    }
  }]);
  return MaskPass;
}(Pass);

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Focus shader
 * based on PaintEffect postprocess from ro.me
 * http://code.google.com/p/3-dreams-of-black/source/browse/deploy/js/effects/PaintEffect.js
 * @private
 */
var MattingShader = {

  uniforms: {

    tDiffuse: { value: null },

    hueStart: { value: 0.0 },
    hueEnd: { value: 1.0 },
    lightnessStart: { value: 0.4 },
    lightnessEnd: { value: 1.0 }

  },

  vertexShader: "\n  varying vec2 vUv;\n  void main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  }",

  fragmentShader: "\n  uniform float hueStart;\n  uniform float hueEnd;\n  uniform float lightnessStart;\n  uniform float lightnessEnd;\n\n  uniform sampler2D tDiffuse;\n\n  varying vec2 vUv;\n\n  vec3 rgb2hsv(vec3 c){\n    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n\n    float d = q.x - min(q.w, q.y);\n    float e = 1.0e-10;\n    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);\n  }\n\n  void main() {\n    float lightnessCenter = (lightnessStart + lightnessEnd) / 2.0;\n    float lightnessRadius = (lightnessEnd - lightnessStart) / 2.0;\n\n    vec4 rgbColor = texture2D( tDiffuse, vUv );\n\n    vec3 hsv = rgb2hsv(rgbColor.rgb);\n\n    float alpha = 1.0;\n\n    // if (hsv.x > hueStart && hsv.x < hueEnd) {\n      float distance = abs(hsv.z - lightnessCenter) / lightnessRadius;\n      alpha = clamp(distance, 0.0, 1.0);\n    // }\n    gl_FragColor = vec4(rgbColor.rgb, alpha * alpha);\n\n  }"
};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Focus shader
 * based on PaintEffect postprocess from ro.me
 * http://code.google.com/p/3-dreams-of-black/source/browse/deploy/js/effects/PaintEffect.js
 * @private
 */
var EdgeBlurShader = {

  uniforms: {

    tDiffuse: { value: null },

    frameSize: { value: [] },

    cKernel: { value: [0.045, 0.122, 0.045, 0.122, 0.332, 0.122, 0.045, 0.122, 0.045] }

  },

  vertexShader: '\n  varying vec2 vUv;\n  void main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  }',

  fragmentShader: '\n  uniform float cKernel[9];\n\n  uniform vec2 frameSize;\n\n  uniform sampler2D tDiffuse;\n\n  varying vec2 vUv;\n\n  void main() {\n    vec2 onePixel = vec2(1.0, 1.0) / frameSize;\n\n    vec4 rgbColor =\n      texture2D(tDiffuse, vUv + onePixel * vec2(-1, -1)) * cKernel[0] +\n      texture2D(tDiffuse, vUv + onePixel * vec2( 0, -1)) * cKernel[1] +\n      texture2D(tDiffuse, vUv + onePixel * vec2( 1, -1)) * cKernel[2] +\n      texture2D(tDiffuse, vUv + onePixel * vec2(-1,  0)) * cKernel[3] +\n      texture2D(tDiffuse, vUv + onePixel * vec2( 0,  0)) * cKernel[4] +\n      texture2D(tDiffuse, vUv + onePixel * vec2( 1,  0)) * cKernel[5] +\n      texture2D(tDiffuse, vUv + onePixel * vec2(-1,  1)) * cKernel[6] +\n      texture2D(tDiffuse, vUv + onePixel * vec2( 0,  1)) * cKernel[7] +\n      texture2D(tDiffuse, vUv + onePixel * vec2( 1,  1)) * cKernel[8] ;\n\n    gl_FragColor = rgbColor;\n  }'
};

var MattingPass = function (_Pass) {
  inherits(MattingPass, _Pass);

  function MattingPass(primer, options) {
    classCallCheck(this, MattingPass);

    var _this = possibleConstructorReturn(this, (MattingPass.__proto__ || Object.getPrototypeOf(MattingPass)).call(this));

    var _ref = options || {},
        width = _ref.width,
        height = _ref.height,
        _ref$strength = _ref.strength,
        strength = _ref$strength === undefined ? 1.0 : _ref$strength,
        _ref$hueStart = _ref.hueStart,
        hueStart = _ref$hueStart === undefined ? 0.0 : _ref$hueStart,
        _ref$hueEnd = _ref.hueEnd,
        hueEnd = _ref$hueEnd === undefined ? 1.0 : _ref$hueEnd,
        _ref$lightnessStart = _ref.lightnessStart,
        lightnessStart = _ref$lightnessStart === undefined ? 0.6 : _ref$lightnessStart,
        _ref$lightnessEnd = _ref.lightnessEnd,
        lightnessEnd = _ref$lightnessEnd === undefined ? 1.0 : _ref$lightnessEnd;

    _this.primer = primer;

    // render targets

    var pars = { minFilter: three.LinearFilter, magFilter: three.LinearFilter, format: three.RGBAFormat };

    _this.renderTargetX = new three.WebGLRenderTarget(width, height, pars);
    _this.renderTargetX.texture.name = 'MattingPass.x';
    _this.renderTargetY = new three.WebGLRenderTarget(width, height, pars);
    _this.renderTargetY.texture.name = 'MattingPass.y';

    // copy material

    if (CopyShader === undefined) console.error('MattingPass relies on CopyShader');

    var copyShader = CopyShader;

    _this.copyUniforms = three.UniformsUtils.clone(copyShader.uniforms);

    _this.copyUniforms.opacity.value = strength;

    _this.materialCopy = new three.ShaderMaterial({
      uniforms: _this.copyUniforms,
      vertexShader: copyShader.vertexShader,
      fragmentShader: copyShader.fragmentShader,
      blending: three.AdditiveBlending,
      transparent: true
    });

    // matting material

    if (MattingShader === undefined) console.error('MattingPass relies on MattingShader');

    _this.mattingUniforms = three.UniformsUtils.clone(MattingShader.uniforms);

    _this.mattingUniforms.hueStart.value = hueStart;
    _this.mattingUniforms.hueEnd.value = hueEnd;
    _this.mattingUniforms.lightnessStart.value = lightnessStart;
    _this.mattingUniforms.lightnessEnd.value = lightnessEnd;

    _this.materialMatting = new three.ShaderMaterial({
      uniforms: _this.mattingUniforms,
      vertexShader: MattingShader.vertexShader,
      fragmentShader: MattingShader.fragmentShader,
      blending: three.AdditiveBlending,
      transparent: true
    });

    _this.edgeBlurUniforms = three.UniformsUtils.clone(EdgeBlurShader.uniforms);
    _this.edgeBlurUniforms.frameSize.value = new three.Vector2(width, height);

    _this.materialEdgeBlur = new three.ShaderMaterial({
      uniforms: _this.edgeBlurUniforms,
      vertexShader: EdgeBlurShader.vertexShader,
      fragmentShader: EdgeBlurShader.fragmentShader,
      blending: three.AdditiveBlending,
      transparent: true
    });

    _this.needsSwap = false;

    _this.camera = new three.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    _this.scene = new three.Scene();

    _this.quad = new three.Mesh(new three.PlaneBufferGeometry(2, 2), null);
    _this.quad.frustumCulled = false; // Avoid getting clipped
    _this.scene.add(_this.quad);
    return _this;
  }

  createClass(MattingPass, [{
    key: 'render',
    value: function render(renderer, writeBuffer, readBuffer, delta, maskActive) {

      if (maskActive) renderer.context.disable(renderer.context.STENCIL_TEST);

      this.primer.render(renderer, this.renderTargetX);

      this.quad.material = this.materialMatting;
      this.mattingUniforms.tDiffuse.value = this.renderTargetX.texture;
      renderer.render(this.scene, this.camera, this.renderTargetY, true);

      this.quad.material = this.materialEdgeBlur;
      this.edgeBlurUniforms.tDiffuse.value = this.renderTargetY.texture;
      renderer.render(this.scene, this.camera, null, this.clear);

      // Render quad with blured scene into texture (convolution pass 2)

      // this.convolutionUniforms.tDiffuse.value = this.renderTargetX.texture;
      // this.convolutionUniforms.uImageIncrement.value = MattingPass.blurY;

      // renderer.render(this.scene, this.camera, this.renderTargetY, true);

      // // Render original scene with superimposed blur to texture

      // this.quad.material = this.materialCopy;

      // this.copyUniforms.tDiffuse.value = this.renderTargetY.texture;

      if (maskActive) renderer.context.enable(renderer.context.STENCIL_TEST);

      // renderer.render(this.scene, this.camera, readBuffer, this.clear);
    }
  }]);
  return MattingPass;
}(Pass);

var RenderPass = function (_Pass) {
  inherits(RenderPass, _Pass);

  function RenderPass(scene, camera, overrideMaterial, clearColor, clearAlpha) {
    classCallCheck(this, RenderPass);

    var _this = possibleConstructorReturn(this, (RenderPass.__proto__ || Object.getPrototypeOf(RenderPass)).call(this));

    _this.scene = scene;
    _this.camera = camera;

    _this.overrideMaterial = overrideMaterial;

    _this.clearColor = clearColor;
    _this.clearAlpha = clearAlpha !== undefined ? clearAlpha : 0;

    _this.clear = false;
    _this.clearDepth = false;
    _this.needsSwap = false;
    return _this;
  }

  createClass(RenderPass, [{
    key: 'render',
    value: function render(renderer, writeBuffer, readBuffer) {

      var oldAutoClear = renderer.autoClear;
      renderer.autoClear = false;

      this.scene.overrideMaterial = this.overrideMaterial;

      var oldClearColor = void 0;
      var oldClearAlpha = void 0;

      if (this.clearColor) {

        oldClearColor = renderer.getClearColor().getHex();
        oldClearAlpha = renderer.getClearAlpha();

        renderer.setClearColor(this.clearColor, this.clearAlpha);
      }

      if (this.clearDepth) {

        renderer.clearDepth();
      }

      renderer.render(this.scene, this.camera, this.renderToScreen ? null : readBuffer, this.clear);

      if (this.clearColor) {

        renderer.setClearColor(oldClearColor, oldClearAlpha);
      }

      this.scene.overrideMaterial = null;
      renderer.autoClear = oldAutoClear;
    }
  }]);
  return RenderPass;
}(Pass);

/**
 * @author alteredq / http://alteredqualia.com/
 * @private
 */

var ShaderPass = function (_Pass) {
  inherits(ShaderPass, _Pass);

  function ShaderPass(shader, textureID) {
    classCallCheck(this, ShaderPass);

    var _this = possibleConstructorReturn(this, (ShaderPass.__proto__ || Object.getPrototypeOf(ShaderPass)).call(this));

    _this.textureID = textureID !== undefined ? textureID : 'tDiffuse';

    if (shader instanceof three.ShaderMaterial) {

      _this.uniforms = shader.uniforms;

      _this.material = shader;
    } else if (shader) {

      _this.uniforms = three.UniformsUtils.clone(shader.uniforms);

      _this.material = new three.ShaderMaterial({

        defines: shader.defines || {},
        uniforms: _this.uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader

      });
    }

    _this.camera = new three.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    _this.scene = new three.Scene();

    _this.quad = new three.Mesh(new three.PlaneBufferGeometry(2, 2), null);
    _this.quad.frustumCulled = false; // Avoid getting clipped
    _this.scene.add(_this.quad);
    return _this;
  }

  createClass(ShaderPass, [{
    key: 'render',
    value: function render(renderer, writeBuffer, readBuffer) {

      if (this.uniforms[this.textureID]) {
        this.uniforms[this.textureID].value = readBuffer.texture;
      }

      this.quad.material = this.material;

      if (this.renderToScreen) {
        renderer.render(this.scene, this.camera);
      } else {
        renderer.render(this.scene, this.camera, writeBuffer, this.clear);
      }
    }
  }]);
  return ShaderPass;
}(Pass);

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Focus shader
 * based on PaintEffect postprocess from ro.me
 * http://code.google.com/p/3-dreams-of-black/source/browse/deploy/js/effects/PaintEffect.js
 * @private
 */
var FocusShader = {

  uniforms: {

    tDiffuse: { value: null },
    screenWidth: { value: 1024 },
    screenHeight: { value: 1024 },
    sampleDistance: { value: 0.94 },
    waveFactor: { value: 0.00125 }

  },

  vertexShader: "\n  varying vec2 vUv;\n  void main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  }",

  fragmentShader: "\n  uniform float screenWidth;\n  uniform float screenHeight;\n  uniform float sampleDistance;\n  uniform float waveFactor;\n\n  uniform sampler2D tDiffuse;\n\n  varying vec2 vUv;\n\n  void main() {\n\n    vec4 color, org, tmp, add;\n    float sample_dist, f;\n    vec2 vin;\n    vec2 uv = vUv;\n\n    add = color = org = texture2D( tDiffuse, uv );\n\n    vin = ( uv - vec2( 0.5 ) ) * vec2( 1.4 );\n    sample_dist = dot( vin, vin ) * 2.0;\n\n    f = ( waveFactor * 100.0 + sample_dist ) * sampleDistance * 4.0;\n\n    vec2 sampleSize = vec2(  1.0 / screenWidth, 1.0 / screenHeight ) * vec2( f );\n\n    add += tmp = texture2D( tDiffuse, uv + vec2( 0.111964, 0.993712 ) * sampleSize );\n    if( tmp.b < color.b ) color = tmp;\n\n    add += tmp = texture2D( tDiffuse, uv + vec2( 0.846724, 0.532032 ) * sampleSize );\n    if( tmp.b < color.b ) color = tmp;\n\n    add += tmp = texture2D( tDiffuse, uv + vec2( 0.943883, -0.330279 ) * sampleSize );\n    if( tmp.b < color.b ) color = tmp;\n\n    add += tmp = texture2D( tDiffuse, uv + vec2( 0.330279, -0.943883 ) * sampleSize );\n    if( tmp.b < color.b ) color = tmp;\n\n    add += tmp = texture2D( tDiffuse, uv + vec2( -0.532032, -0.846724 ) * sampleSize );\n    if( tmp.b < color.b ) color = tmp;\n\n    add += tmp = texture2D( tDiffuse, uv + vec2( -0.993712, -0.111964 ) * sampleSize );\n    if( tmp.b < color.b ) color = tmp;\n\n    add += tmp = texture2D( tDiffuse, uv + vec2( -0.707107, 0.707107 ) * sampleSize );\n    if( tmp.b < color.b ) color = tmp;\n\n    color = color * vec4( 2.0 ) - ( add / vec4( 8.0 ) );\n    color = color + ( add / vec4( 8.0 ) - color ) * ( vec4( 1.0 ) - vec4( sample_dist * 0.5 ) );\n\n    gl_FragColor = vec4( color.rgb * color.rgb * vec3( 0.95 ) + color.rgb, 1.0 );\n\n  }"
};

/**
 * used to link 3d-model with reality world, an ar-glue
 *
 * @param {Object} options config
 * @param {String} options.name ar-glue name, same with `setMarkers` name-id
 * @param {Boolean} [options.autoHide=true] whether auto-hide when marker have not detected
 */

var ARGlue = function (_Object3D) {
  inherits(ARGlue, _Object3D);

  function ARGlue(options) {
    classCallCheck(this, ARGlue);

    var _this = possibleConstructorReturn(this, (ARGlue.__proto__ || Object.getPrototypeOf(ARGlue)).call(this));

    options = options || {};

    /**
     * unique name in all ar-glue object
     *
     * @member {String}
     */
    _this.name = options.name;

    /**
     * whether auto-hide when marker have not detected
     *
     * @member {Boolean}
     */
    _this.autoHide = Utils.isBoolean(options.autoHide) ? options.autoHide : true;

    /**
     * close this object matrixAutoUpdate, just recive matrix from `UC-AR`
     *
     * @member {Boolean}
     */
    _this.matrixAutoUpdate = false;

    /**
     * class type, a mark to distinguish ar-glue and normal display-object
     *
     * @member {String}
     */
    _this.type = 'ARGlue';

    if (!options.name) {
      console.error('ARGlue: this glue must have a name');
    }
    return _this;
  }

  /**
   * update this glue pose matrix
   * @param {Array} matrix pose matrix
   * @param {Boolean} isDetected whether detected at this tick
   */


  createClass(ARGlue, [{
    key: 'updatePose',
    value: function updatePose(matrix, isDetected) {
      if (this.autoHide && !isDetected) {
        this.visible = false;
      } else {
        this.visible = true;
      }
      this.matrix.fromArray(matrix);
    }
  }]);
  return ARGlue;
}(three.Object3D);

var parameters = {
  minFilter: three.LinearFilter,
  magFilter: three.LinearFilter,
  format: three.RGBAFormat,
  stencilBuffer: false
};

/**
 * @author alteredq / http://alteredqualia.com/
 * @private
 */

var EffectComposer = function () {
  function EffectComposer(options) {
    classCallCheck(this, EffectComposer);
    var width = options.width,
        height = options.height;

    this.autoClear = true;

    this.renderTarget1 = new three.WebGLRenderTarget(width, height, parameters);
    this.renderTarget1.texture.name = 'RT1';

    this.renderTarget2 = this.renderTarget1.clone();
    this.renderTarget2.texture.name = 'RT2';

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

    // dependencies ShaderPass and CopyShader
    this.copyPass = new ShaderPass(CopyShader);
  }

  createClass(EffectComposer, [{
    key: 'swapBuffers',
    value: function swapBuffers() {
      var tmp = this.readBuffer;
      this.readBuffer = this.writeBuffer;
      this.writeBuffer = tmp;
    }
  }, {
    key: 'render',
    value: function render(renderer, effectPack, toScreen) {
      var il = effectPack.passes.length;
      var delta = effectPack.delta;

      // copy content to readBuffer
      this.copyPass.render(renderer, this.readBuffer, effectPack.renderTarget);

      // add effect like yoyo
      for (var i = 0; i < il; i++) {
        var pass = effectPack.passes[i];
        if (pass.enabled === false) continue;

        pass.render(renderer, this.writeBuffer, this.readBuffer, delta);

        if (pass.needsSwap) {
          this.swapBuffers();
        }
      }

      // copy content back to layer buffer
      var renderTarget = toScreen ? null : effectPack.renderTarget;
      this.copyPass.render(renderer, renderTarget, this.readBuffer);
    }

    /**
     * resize buffer size when viewport has change
     * @param {number} width render buffer width
     * @param {number} height render buffer height
     */

  }, {
    key: 'setSize',
    value: function setSize(width, height) {
      this.renderTarget1.setSize(width, height);
      this.renderTarget2.setSize(width, height);
    }
  }]);
  return EffectComposer;
}();

/**
 * get variable type
 * @param {*} val a variable which you want to get the type
 * @return {String} variable-type
 */
function _rt$1(val) {
  return Object.prototype.toString.call(val);
}

/**
 * Utils tool box
 *
 * @namespace Utils
 */
var Utils$2 = {
  /**
   * determine whether it is a `Function`
   *
   * @static
   * @method
   * @memberof Utils
   * @param {*} variable a variable which you want to determine
   * @return {Boolean} type result
   */
  isFunction: function () {
    var ks = _rt$1(function () {});
    return function (variable) {
      return _rt$1(variable) === ks;
    };
  }(),

  /**
   * determine whether it is a `undefined`
   *
   * @static
   * @method
   * @memberof Utils
   * @param {*} variable a variable which you want to determine
   * @return {Boolean} type result
   */
  isUndefined: function isUndefined(variable) {
    return typeof variable === 'undefined';
  }
};

/**
 * proxy `addEventListener` function
 *
 * @param {String} type event type, evnet name
 * @param {Function} fn callback
 * @return {this} this
 */
three.EventDispatcher.prototype.on = function (type, fn) {
  if (!Utils$2.isFunction(fn)) return;
  if (this instanceof three.Object3D) this.interactive = true;
  this.addEventListener(type, fn);
  return this;
};

/**
 * proxy `removeEventListener` function
 *
 * @param {String} type event type, evnet name
 * @param {Function} fn callback, which you had bind before
 * @return {this} this
 */
three.EventDispatcher.prototype.off = function (type, fn) {
  this.removeEventListener(type, fn);
  return this;
};

/**
 * binding a once event, just emit once time
 *
 * @param {String} type event type, evnet name
 * @param {Function} fn callback
 * @return {this} this
 */
three.EventDispatcher.prototype.once = function (type, fn) {
  var _this = this;

  if (!Utils$2.isFunction(fn)) return;
  var cb = function cb(ev) {
    fn(ev);
    _this.off(type, cb);
  };
  this.on(type, cb);
  return this;
};

/**
 * emit a event
 *
 * @param {String} type event type, evnet name
 * @return {this} this
 */
three.EventDispatcher.prototype.emit = function (type) {
  if (this._listeners === undefined || Utils$2.isUndefined(this._listeners[type])) return;
  var cbs = this._listeners[type] || [];
  var cache = cbs.slice(0);

  for (var _len = arguments.length, argument = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    argument[_key - 1] = arguments[_key];
  }

  for (var i = 0; i < cache.length; i++) {
    cache[i].apply(this, argument);
  }
  return this;
};

/**
 * whether displayObject is interactively
 */
three.Object3D.prototype.interactive = false;

/**
 * whether displayObject's children is interactively
 */
three.Object3D.prototype.interactiveChildren = true;

/**
 * whether displayObject had touchstart
 * @private
 */
three.Object3D.prototype.started = false;

/**
 * tracked event cache, like: touchend、mouseout、pointerout which decided by primary-event
 */
Object.defineProperty(three.Object3D.prototype, 'trackedPointers', {
  get: function get() {
    if (!this._trackedPointers) this._trackedPointers = {};
    return this._trackedPointers;
  }
});

/**
 * dispatch a raycast
 *
 * @param {Raycaster} raycaster Raycaster object, get from THREE.Raycaster
 * @return {Object|Boolean} had pass hit-test
 */
three.Object3D.prototype.raycastTest = function (raycaster) {
  var result = [];
  this.raycast(raycaster, result);

  if (result.length > 0) {
    return result[0];
  }

  return false;
};

/**
 * Holds all information related to an Interaction event
 *
 * @class
 */

var InteractionData = function () {
  /**
   * InteractionData constructor
   */
  function InteractionData() {
    classCallCheck(this, InteractionData);

    /**
     * This point stores the global coords of where the touch/mouse event happened
     *
     * @member {Vector2}
     */
    this.global = new three.Vector2();

    /**
     * The target DisplayObject that was interacted with
     *
     * @member {Object3D}
     */
    this.target = null;

    /**
     * When passed to an event handler, this will be the original DOM Event that was captured
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
     * @see https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent
     * @member {MouseEvent|TouchEvent|PointerEvent}
     */
    this.originalEvent = null;

    /**
     * Unique identifier for this interaction
     *
     * @member {number}
     */
    this.identifier = null;

    /**
     * Indicates whether or not the pointer device that created the event is the primary pointer.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary
     * @type {Boolean}
     */
    this.isPrimary = false;

    /**
     * Indicates which button was pressed on the mouse or pointer device to trigger the event.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
     * @type {number}
     */
    this.button = 0;

    /**
     * Indicates which buttons are pressed on the mouse or pointer device when the event is triggered.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
     * @type {number}
     */
    this.buttons = 0;

    /**
     * The width of the pointer's contact along the x-axis, measured in CSS pixels.
     * radiusX of TouchEvents will be represented by this value.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width
     * @type {number}
     */
    this.width = 0;

    /**
     * The height of the pointer's contact along the y-axis, measured in CSS pixels.
     * radiusY of TouchEvents will be represented by this value.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height
     * @type {number}
     */
    this.height = 0;

    /**
     * The angle, in degrees, between the pointer device and the screen.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX
     * @type {number}
     */
    this.tiltX = 0;

    /**
     * The angle, in degrees, between the pointer device and the screen.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY
     * @type {number}
     */
    this.tiltY = 0;

    /**
     * The type of pointer that triggered the event.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType
     * @type {string}
     */
    this.pointerType = null;

    /**
     * Pressure applied by the pointing device during the event. A Touch's force property
     * will be represented by this value.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure
     * @type {number}
     */
    this.pressure = 0;

    /**
     * From TouchEvents (not PointerEvents triggered by touches), the rotationAngle of the Touch.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Touch/rotationAngle
     * @type {number}
     */
    this.rotationAngle = 0;

    /**
     * Twist of a stylus pointer.
     * @see https://w3c.github.io/pointerevents/#pointerevent-interface
     * @type {number}
     */
    this.twist = 0;

    /**
     * Barrel pressure on a stylus pointer.
     * @see https://w3c.github.io/pointerevents/#pointerevent-interface
     * @type {number}
     */
    this.tangentialPressure = 0;
  }

  /**
   * The unique identifier of the pointer. It will be the same as `identifier`.
   * @readonly
   * @member {number}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId
   */


  createClass(InteractionData, [{
    key: '_copyEvent',


    /**
     * Copies properties from normalized event data.
     *
     * @param {Touch|MouseEvent|PointerEvent} event The normalized event data
     * @private
     */
    value: function _copyEvent(event) {
      // isPrimary should only change on touchstart/pointerdown, so we don't want to overwrite
      // it with "false" on later events when our shim for it on touch events might not be
      // accurate
      if (event.isPrimary) {
        this.isPrimary = true;
      }
      this.button = event.button;
      this.buttons = event.buttons;
      this.width = event.width;
      this.height = event.height;
      this.tiltX = event.tiltX;
      this.tiltY = event.tiltY;
      this.pointerType = event.pointerType;
      this.pressure = event.pressure;
      this.rotationAngle = event.rotationAngle;
      this.twist = event.twist || 0;
      this.tangentialPressure = event.tangentialPressure || 0;
    }

    /**
     * Resets the data for pooling.
     *
     * @private
     */

  }, {
    key: '_reset',
    value: function _reset() {
      // isPrimary is the only property that we really need to reset - everything else is
      // guaranteed to be overwritten
      this.isPrimary = false;
    }
  }, {
    key: 'pointerId',
    get: function get$$1() {
      return this.identifier;
    }
  }]);
  return InteractionData;
}();

/**
 * Event class that mimics native DOM events.
 *
 * @class
 */
var InteractionEvent = function () {
  /**
   * InteractionEvent constructor
   */
  function InteractionEvent() {
    classCallCheck(this, InteractionEvent);

    /**
     * Whether this event will continue propagating in the tree
     *
     * @member {boolean}
     */
    this.stopped = false;

    /**
     * The object which caused this event to be dispatched.
     *
     * @member {Object3D}
     */
    this.target = null;

    /**
     * The object whose event listener’s callback is currently being invoked.
     *
     * @member {Object3D}
     */
    this.currentTarget = null;

    /**
     * Type of the event
     *
     * @member {string}
     */
    this.type = null;

    /**
     * InteractionData related to this event
     *
     * @member {InteractionData}
     */
    this.data = null;

    /**
     * ray caster detial from 3d-mesh
     *
     * @member {Intersect}
     */
    this.intersect = null;
  }

  /**
   * Prevents event from reaching any objects other than the current object.
   *
   */


  createClass(InteractionEvent, [{
    key: "stopPropagation",
    value: function stopPropagation() {
      this.stopped = true;
    }

    /**
     * Resets the event.
     *
     * @private
     */

  }, {
    key: "_reset",
    value: function _reset() {
      this.stopped = false;
      this.currentTarget = null;
      this.target = null;
      this.intersect = null;
    }
  }]);
  return InteractionEvent;
}();

/**
 * DisplayObjects with the `trackedPointers` property use this class to track interactions
 *
 * @class
 * @private
 */
var InteractionTrackingData = function () {
  /**
   * @param {number} pointerId - Unique pointer id of the event
   */
  function InteractionTrackingData(pointerId) {
    classCallCheck(this, InteractionTrackingData);

    this._pointerId = pointerId;
    this._flags = InteractionTrackingData.FLAGS.NONE;
  }

  /**
   *
   * @private
   * @param {number} flag - The interaction flag to set
   * @param {boolean} yn - Should the flag be set or unset
   */


  createClass(InteractionTrackingData, [{
    key: "_doSet",
    value: function _doSet(flag, yn) {
      if (yn) {
        this._flags = this._flags | flag;
      } else {
        this._flags = this._flags & ~flag;
      }
    }

    /**
     * Unique pointer id of the event
     *
     * @readonly
     * @member {number}
     */

  }, {
    key: "pointerId",
    get: function get$$1() {
      return this._pointerId;
    }

    /**
     * State of the tracking data, expressed as bit flags
     *
     * @member {number}
     */

  }, {
    key: "flags",
    get: function get$$1() {
      return this._flags;
    }

    /**
     * Set the flags for the tracking data
     *
     * @param {number} flags - Flags to set
     */
    ,
    set: function set$$1(flags) {
      this._flags = flags;
    }

    /**
     * Is the tracked event inactive (not over or down)?
     *
     * @member {number}
     */

  }, {
    key: "none",
    get: function get$$1() {
      return this._flags === this.constructor.FLAGS.NONE;
    }

    /**
     * Is the tracked event over the DisplayObject?
     *
     * @member {boolean}
     */

  }, {
    key: "over",
    get: function get$$1() {
      return (this._flags & this.constructor.FLAGS.OVER) !== 0;
    }

    /**
     * Set the over flag
     *
     * @param {boolean} yn - Is the event over?
     */
    ,
    set: function set$$1(yn) {
      this._doSet(this.constructor.FLAGS.OVER, yn);
    }

    /**
     * Did the right mouse button come down in the DisplayObject?
     *
     * @member {boolean}
     */

  }, {
    key: "rightDown",
    get: function get$$1() {
      return (this._flags & this.constructor.FLAGS.RIGHT_DOWN) !== 0;
    }

    /**
     * Set the right down flag
     *
     * @param {boolean} yn - Is the right mouse button down?
     */
    ,
    set: function set$$1(yn) {
      this._doSet(this.constructor.FLAGS.RIGHT_DOWN, yn);
    }

    /**
     * Did the left mouse button come down in the DisplayObject?
     *
     * @member {boolean}
     */

  }, {
    key: "leftDown",
    get: function get$$1() {
      return (this._flags & this.constructor.FLAGS.LEFT_DOWN) !== 0;
    }

    /**
     * Set the left down flag
     *
     * @param {boolean} yn - Is the left mouse button down?
     */
    ,
    set: function set$$1(yn) {
      this._doSet(this.constructor.FLAGS.LEFT_DOWN, yn);
    }
  }]);
  return InteractionTrackingData;
}();

InteractionTrackingData.FLAGS = Object.freeze({
  NONE: 0,
  OVER: 1 << 0,
  LEFT_DOWN: 1 << 1,
  RIGHT_DOWN: 1 << 2
});

var MOUSE_POINTER_ID = 'MOUSE';

// helpers for hitTest() - only used inside hitTest()
var hitTestEvent = {
  target: null,
  data: {
    global: null
  }
};

/**
 * The interaction manager deals with mouse, touch and pointer events. Any DisplayObject can be interactive
 * if its interactive parameter is set to true
 * This manager also supports multitouch.
 *
 * reference to [pixi.js](http://www.pixijs.com/) impl
 *
 * @private
 * @class
 * @extends EventDispatcher
 */

var InteractionLayer = function (_EventDispatcher) {
  inherits(InteractionLayer, _EventDispatcher);

  /**
   * @param {WebGLRenderer} renderer - A reference to the current renderer
   * @param {Object} [options] - The options for the manager.
   * @param {Boolean} [options.autoPreventDefault=false] - Should the manager automatically prevent default browser actions.
   * @param {Boolean} [options.autoAttach=true] - Should the manager automatically attach target element.
   * @param {Number} [options.interactionFrequency=10] - Frequency increases the interaction events will be checked.
   */
  function InteractionLayer(renderer, options) {
    classCallCheck(this, InteractionLayer);

    var _this = possibleConstructorReturn(this, (InteractionLayer.__proto__ || Object.getPrototypeOf(InteractionLayer)).call(this));

    options = options || {};

    /**
     * The renderer this interaction manager works for.
     *
     * @member {WebGLRenderer}
     */
    _this.renderer = renderer;

    /**
     * The renderer this interaction manager works for.
     *
     * @member {Layer}
     */
    _this.layer = null;

    /**
     * The renderer this interaction manager works for.
     *
     * @member {Scene}
     */
    // this.scene = scene;

    /**
     * The renderer this interaction manager works for.
     *
     * @member {Camera}
     */
    // this.camera = camera;

    /**
     * Should default browser actions automatically be prevented.
     * Does not apply to pointer events for backwards compatibility
     * preventDefault on pointer events stops mouse events from firing
     * Thus, for every pointer event, there will always be either a mouse of touch event alongside it.
     *
     * @member {boolean}
     * @default false
     */
    _this.autoPreventDefault = options.autoPreventDefault || false;

    /**
     * Frequency in milliseconds that the mousemove, moveover & mouseout interaction events will be checked.
     *
     * @member {number}
     * @default 10
     */
    _this.interactionFrequency = options.interactionFrequency || 10;

    /**
     * The mouse data
     *
     * @member {InteractionData}
     */
    _this.mouse = new InteractionData();
    _this.mouse.identifier = MOUSE_POINTER_ID;

    // setting the mouse to start off far off screen will mean that mouse over does
    //  not get called before we even move the mouse.
    _this.mouse.global.set(-999999);

    /**
     * Actively tracked InteractionData
     *
     * @private
     * @member {Object.<number,InteractionData>}
     */
    _this.activeInteractionData = {};
    _this.activeInteractionData[MOUSE_POINTER_ID] = _this.mouse;

    /**
     * Pool of unused InteractionData
     *
     * @private
     * @member {InteractionData[]}
     */
    _this.interactionDataPool = [];

    /**
     * An event data object to handle all the event tracking/dispatching
     *
     * @member {object}
     */
    _this.eventData = new InteractionEvent();

    /**
     * The DOM element to bind to.
     *
     * @private
     * @member {HTMLElement}
     */
    _this.interactionDOMElement = null;

    /**
     * This property determines if mousemove and touchmove events are fired only when the cursor
     * is over the object.
     * Setting to true will make things work more in line with how the DOM verison works.
     * Setting to false can make things easier for things like dragging
     * It is currently set to false as this is how three.js used to work.
     *
     * @member {boolean}
     * @default true
     */
    _this.moveWhenInside = true;

    /**
     * Have events been attached to the dom element?
     *
     * @private
     * @member {boolean}
     */
    _this.eventsAdded = false;

    /**
     * Is the mouse hovering over the renderer?
     *
     * @private
     * @member {boolean}
     */
    _this.mouseOverRenderer = false;

    /**
     * Does the device support touch events
     * https://www.w3.org/TR/touch-events/
     *
     * @readonly
     * @member {boolean}
     */
    _this.supportsTouchEvents = 'ontouchstart' in window;

    /**
     * Does the device support pointer events
     * https://www.w3.org/Submission/pointer-events/
     *
     * @readonly
     * @member {boolean}
     */
    _this.supportsPointerEvents = !!window.PointerEvent;

    // this will make it so that you don't have to call bind all the time

    /**
     * @private
     * @member {Function}
     */
    _this.onClick = _this.onClick.bind(_this);
    _this.processClick = _this.processClick.bind(_this);

    /**
     * @private
     * @member {Function}
     */
    _this.onPointerUp = _this.onPointerUp.bind(_this);
    _this.processPointerUp = _this.processPointerUp.bind(_this);

    /**
     * @private
     * @member {Function}
     */
    _this.onPointerCancel = _this.onPointerCancel.bind(_this);
    _this.processPointerCancel = _this.processPointerCancel.bind(_this);

    /**
     * @private
     * @member {Function}
     */
    _this.onPointerDown = _this.onPointerDown.bind(_this);
    _this.processPointerDown = _this.processPointerDown.bind(_this);

    /**
     * @private
     * @member {Function}
     */
    _this.onPointerMove = _this.onPointerMove.bind(_this);
    _this.processPointerMove = _this.processPointerMove.bind(_this);

    /**
     * @private
     * @member {Function}
     */
    _this.onPointerOut = _this.onPointerOut.bind(_this);
    _this.processPointerOverOut = _this.processPointerOverOut.bind(_this);

    /**
     * @private
     * @member {Function}
     */
    _this.onPointerOver = _this.onPointerOver.bind(_this);

    /**
     * Dictionary of how different cursor modes are handled. Strings are handled as CSS cursor
     * values, objects are handled as dictionaries of CSS values for interactionDOMElement,
     * and functions are called instead of changing the CSS.
     * Default CSS cursor values are provided for 'default' and 'pointer' modes.
     * @member {Object.<string, (string|Function|Object.<string, string>)>}
     */
    _this.cursorStyles = {
      default: 'inherit',
      pointer: 'pointer'
    };

    /**
     * The mode of the cursor that is being used.
     * The value of this is a key from the cursorStyles dictionary.
     *
     * @member {string}
     */
    _this.currentCursorMode = null;

    /**
     * Internal cached let.
     *
     * @private
     * @member {string}
     */
    _this.cursor = null;

    /**
     * ray caster, for survey intersects from 3d-scene
     *
     * @private
     * @member {Raycaster}
     */
    _this.raycaster = new three.Raycaster();

    /**
     * snippet time
     *
     * @private
     * @member {Number}
     */
    _this._deltaTime = 0;

    _this.setTargetElement(_this.renderer.domElement);

    /**
     * Fired when a pointer device button (usually a mouse left-button) is pressed on the display
     * object.
     *
     * @event InteractionLayer#mousedown
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device secondary button (usually a mouse right-button) is pressed
     * on the display object.
     *
     * @event InteractionLayer#rightdown
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button (usually a mouse left-button) is released over the display
     * object.
     *
     * @event InteractionLayer#mouseup
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device secondary button (usually a mouse right-button) is released
     * over the display object.
     *
     * @event InteractionLayer#rightup
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button (usually a mouse left-button) is pressed and released on
     * the display object.
     *
     * @event InteractionLayer#click
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device secondary button (usually a mouse right-button) is pressed
     * and released on the display object.
     *
     * @event InteractionLayer#rightclick
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button (usually a mouse left-button) is released outside the
     * display object that initially registered a
     * [mousedown]{@link InteractionLayer#event:mousedown}.
     *
     * @event InteractionLayer#mouseupoutside
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device secondary button (usually a mouse right-button) is released
     * outside the display object that initially registered a
     * [rightdown]{@link InteractionLayer#event:rightdown}.
     *
     * @event InteractionLayer#rightupoutside
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device (usually a mouse) is moved while over the display object
     *
     * @event InteractionLayer#mousemove
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device (usually a mouse) is moved onto the display object
     *
     * @event InteractionLayer#mouseover
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device (usually a mouse) is moved off the display object
     *
     * @event InteractionLayer#mouseout
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button is pressed on the display object.
     *
     * @event InteractionLayer#pointerdown
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button is released over the display object.
     *
     * @event InteractionLayer#pointerup
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when the operating system cancels a pointer event
     *
     * @event InteractionLayer#pointercancel
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button is pressed and released on the display object.
     *
     * @event InteractionLayer#pointertap
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button is released outside the display object that initially
     * registered a [pointerdown]{@link InteractionLayer#event:pointerdown}.
     *
     * @event InteractionLayer#pointerupoutside
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device is moved while over the display object
     *
     * @event InteractionLayer#pointermove
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device is moved onto the display object
     *
     * @event InteractionLayer#pointerover
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device is moved off the display object
     *
     * @event InteractionLayer#pointerout
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is placed on the display object.
     *
     * @event InteractionLayer#touchstart
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is removed from the display object.
     *
     * @event InteractionLayer#touchend
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when the operating system cancels a touch
     *
     * @event InteractionLayer#touchcancel
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is placed and removed from the display object.
     *
     * @event InteractionLayer#tap
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is removed outside of the display object that initially
     * registered a [touchstart]{@link InteractionLayer#event:touchstart}.
     *
     * @event InteractionLayer#touchendoutside
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is moved along the display object.
     *
     * @event InteractionLayer#touchmove
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button (usually a mouse left-button) is pressed on the display.
     * object. DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#mousedown
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device secondary button (usually a mouse right-button) is pressed
     * on the display object. DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#rightdown
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button (usually a mouse left-button) is released over the display
     * object. DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#mouseup
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device secondary button (usually a mouse right-button) is released
     * over the display object. DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#rightup
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button (usually a mouse left-button) is pressed and released on
     * the display object. DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#click
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device secondary button (usually a mouse right-button) is pressed
     * and released on the display object. DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#rightclick
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button (usually a mouse left-button) is released outside the
     * display object that initially registered a
     * [mousedown]{@link Object3D#event:mousedown}.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#mouseupoutside
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device secondary button (usually a mouse right-button) is released
     * outside the display object that initially registered a
     * [rightdown]{@link Object3D#event:rightdown}.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#rightupoutside
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device (usually a mouse) is moved while over the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#mousemove
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device (usually a mouse) is moved onto the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#mouseover
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device (usually a mouse) is moved off the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#mouseout
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button is pressed on the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#pointerdown
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button is released over the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#pointerup
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when the operating system cancels a pointer event.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#pointercancel
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button is pressed and released on the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#pointertap
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button is released outside the display object that initially
     * registered a [pointerdown]{@link Object3D#event:pointerdown}.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#pointerupoutside
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device is moved while over the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#pointermove
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device is moved onto the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#pointerover
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device is moved off the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#pointerout
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is placed on the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#touchstart
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is removed from the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#touchend
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when the operating system cancels a touch.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#touchcancel
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is placed and removed from the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#tap
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is removed outside of the display object that initially
     * registered a [touchstart]{@link Object3D#event:touchstart}.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#touchendoutside
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is moved along the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#touchmove
     * @param {InteractionEvent} event - Interaction event
     */
    return _this;
  }

  /**
   * @return {boolean}
   */


  createClass(InteractionLayer, [{
    key: 'isAble',
    value: function isAble() {
      return this.layer && this.layer.interactive;
    }

    /**
     * set layer
     * @param {Layer} layer layer
     */

  }, {
    key: 'setLayer',
    value: function setLayer(layer) {
      this.layer = layer;
    }

    /**
     * Hit tests a point against the display tree, returning the first interactive object that is hit.
     *
     * @param {Point} globalPoint - A point to hit test with, in global space.
     * @param {Object3D} [root] - The root display object to start from. If omitted, defaults
     * to the last rendered root of the associated renderer.
     * @return {Object3D} The hit display object, if any.
     */

  }, {
    key: 'hitTest',
    value: function hitTest(globalPoint, root) {
      if (!this.isAble()) return null;
      // clear the target for our hit test
      hitTestEvent.target = null;
      // assign the global point
      hitTestEvent.data.global = globalPoint;
      // ensure safety of the root
      if (!root) {
        root = this.layer.scene;
      }
      // run the hit test
      this.processInteractive(hitTestEvent, root, null, true);
      // return our found object - it'll be null if we didn't hit anything

      return hitTestEvent.target;
    }

    /**
     * Sets the DOM element which will receive mouse/touch events. This is useful for when you have
     * other DOM elements on top of the renderers Canvas element. With this you'll be bale to deletegate
     * another DOM element to receive those events.
     *
     * @param {HTMLCanvasElement} element - the DOM element which will receive mouse and touch events.
     */

  }, {
    key: 'setTargetElement',
    value: function setTargetElement(element) {
      this.removeEvents();

      this.interactionDOMElement = element;

      this.addEvents();
    }

    /**
     * Registers all the DOM events
     *
     * @private
     */

  }, {
    key: 'addEvents',
    value: function addEvents() {
      if (!this.interactionDOMElement || this.eventsAdded) {
        return;
      }

      this.emit('addevents');

      this.interactionDOMElement.addEventListener('click', this.onClick, true);

      if (window.navigator.msPointerEnabled) {
        this.interactionDOMElement.style['-ms-content-zooming'] = 'none';
        this.interactionDOMElement.style['-ms-touch-action'] = 'none';
      } else if (this.supportsPointerEvents) {
        this.interactionDOMElement.style['touch-action'] = 'none';
      }

      /**
       * These events are added first, so that if pointer events are normalised, they are fired
       * in the same order as non-normalised events. ie. pointer event 1st, mouse / touch 2nd
       */
      if (this.supportsPointerEvents) {
        window.document.addEventListener('pointermove', this.onPointerMove, true);
        this.interactionDOMElement.addEventListener('pointerdown', this.onPointerDown, true);
        // pointerout is fired in addition to pointerup (for touch events) and pointercancel
        // we already handle those, so for the purposes of what we do in onPointerOut, we only
        // care about the pointerleave event
        this.interactionDOMElement.addEventListener('pointerleave', this.onPointerOut, true);
        this.interactionDOMElement.addEventListener('pointerover', this.onPointerOver, true);
        window.addEventListener('pointercancel', this.onPointerCancel, true);
        window.addEventListener('pointerup', this.onPointerUp, true);
      } else {
        window.document.addEventListener('mousemove', this.onPointerMove, true);
        this.interactionDOMElement.addEventListener('mousedown', this.onPointerDown, true);
        this.interactionDOMElement.addEventListener('mouseout', this.onPointerOut, true);
        this.interactionDOMElement.addEventListener('mouseover', this.onPointerOver, true);
        window.addEventListener('mouseup', this.onPointerUp, true);
      }

      // always look directly for touch events so that we can provide original data
      // In a future version we should change this to being just a fallback and rely solely on
      // PointerEvents whenever available
      if (this.supportsTouchEvents) {
        this.interactionDOMElement.addEventListener('touchstart', this.onPointerDown, true);
        this.interactionDOMElement.addEventListener('touchcancel', this.onPointerCancel, true);
        this.interactionDOMElement.addEventListener('touchend', this.onPointerUp, true);
        this.interactionDOMElement.addEventListener('touchmove', this.onPointerMove, true);
      }

      this.eventsAdded = true;
    }

    /**
     * Removes all the DOM events that were previously registered
     *
     * @private
     */

  }, {
    key: 'removeEvents',
    value: function removeEvents() {
      if (!this.interactionDOMElement) {
        return;
      }

      this.emit('removeevents');

      this.interactionDOMElement.removeEventListener('click', this.onClick, true);

      if (window.navigator.msPointerEnabled) {
        this.interactionDOMElement.style['-ms-content-zooming'] = '';
        this.interactionDOMElement.style['-ms-touch-action'] = '';
      } else if (this.supportsPointerEvents) {
        this.interactionDOMElement.style['touch-action'] = '';
      }

      if (this.supportsPointerEvents) {
        window.document.removeEventListener('pointermove', this.onPointerMove, true);
        this.interactionDOMElement.removeEventListener('pointerdown', this.onPointerDown, true);
        this.interactionDOMElement.removeEventListener('pointerleave', this.onPointerOut, true);
        this.interactionDOMElement.removeEventListener('pointerover', this.onPointerOver, true);
        window.removeEventListener('pointercancel', this.onPointerCancel, true);
        window.removeEventListener('pointerup', this.onPointerUp, true);
      } else {
        window.document.removeEventListener('mousemove', this.onPointerMove, true);
        this.interactionDOMElement.removeEventListener('mousedown', this.onPointerDown, true);
        this.interactionDOMElement.removeEventListener('mouseout', this.onPointerOut, true);
        this.interactionDOMElement.removeEventListener('mouseover', this.onPointerOver, true);
        window.removeEventListener('mouseup', this.onPointerUp, true);
      }

      if (this.supportsTouchEvents) {
        this.interactionDOMElement.removeEventListener('touchstart', this.onPointerDown, true);
        this.interactionDOMElement.removeEventListener('touchcancel', this.onPointerCancel, true);
        this.interactionDOMElement.removeEventListener('touchend', this.onPointerUp, true);
        this.interactionDOMElement.removeEventListener('touchmove', this.onPointerMove, true);
      }

      this.interactionDOMElement = null;

      this.eventsAdded = false;
    }

    /**
     * Updates the state of interactive objects.
     * Invoked by a throttled ticker.
     *
     * @param {number} deltaTime - time delta since last tick
     */

  }, {
    key: 'update',
    value: function update(_ref) {
      var snippet = _ref.snippet;

      if (!this.isAble()) return;
      this._deltaTime += snippet;

      if (this._deltaTime < this.interactionFrequency) {
        return;
      }

      this._deltaTime = 0;

      if (!this.interactionDOMElement) {
        return;
      }

      // if the user move the mouse this check has already been done using the mouse move!
      if (this.didMove) {
        this.didMove = false;

        return;
      }

      this.cursor = null;

      // Resets the flag as set by a stopPropagation call. This flag is usually reset by a user interaction of any kind,
      // but there was a scenario of a display object moving under a static mouse cursor.
      // In this case, mouseover and mouseevents would not pass the flag test in triggerEvent function
      for (var k in this.activeInteractionData) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.activeInteractionData.hasOwnProperty(k)) {
          var interactionData = this.activeInteractionData[k];

          if (interactionData.originalEvent && interactionData.pointerType !== 'touch') {
            var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, interactionData.originalEvent, interactionData);

            this.processInteractive(interactionEvent, this.layer.scene, this.processPointerOverOut, true);
          }
        }
      }

      this.setCursorMode(this.cursor);

      // TODO
    }

    /**
     * Sets the current cursor mode, handling any callbacks or CSS style changes.
     *
     * @param {string} mode - cursor mode, a key from the cursorStyles dictionary
     */

  }, {
    key: 'setCursorMode',
    value: function setCursorMode(mode) {
      mode = mode || 'default';
      // if the mode didn't actually change, bail early
      if (this.currentCursorMode === mode) {
        return;
      }
      this.currentCursorMode = mode;
      var style = this.cursorStyles[mode];

      // only do things if there is a cursor style for it
      if (style) {
        switch (typeof style === 'undefined' ? 'undefined' : _typeof(style)) {
          case 'string':
            // string styles are handled as cursor CSS
            this.interactionDOMElement.style.cursor = style;
            break;
          case 'function':
            // functions are just called, and passed the cursor mode
            style(mode);
            break;
          case 'object':
            // if it is an object, assume that it is a dictionary of CSS styles,
            // apply it to the interactionDOMElement
            Object.assign(this.interactionDOMElement.style, style);
            break;
          default:
            break;
        }
      } else if (typeof mode === 'string' && !Object.prototype.hasOwnProperty.call(this.cursorStyles, mode)) {
        // if it mode is a string (not a Symbol) and cursorStyles doesn't have any entry
        // for the mode, then assume that the dev wants it to be CSS for the cursor.
        this.interactionDOMElement.style.cursor = mode;
      }
    }

    /**
     * Dispatches an event on the display object that was interacted with
     *
     * @param {Object3D} displayObject - the display object in question
     * @param {string} eventString - the name of the event (e.g, mousedown)
     * @param {object} eventData - the event data object
     * @private
     */

  }, {
    key: 'triggerEvent',
    value: function triggerEvent(displayObject, eventString, eventData) {
      if (!eventData.stopped) {
        eventData.currentTarget = displayObject;
        eventData.type = eventString;

        displayObject.emit(eventString, eventData);

        if (displayObject[eventString]) {
          displayObject[eventString](eventData);
        }
      }
    }

    /**
     * This function is provides a neat way of crawling through the scene graph and running a
     * specified function on all interactive objects it finds. It will also take care of hit
     * testing the interactive objects and passes the hit across in the function.
     *
     * @private
     * @param {InteractionEvent} interactionEvent - event containing the point that
     *  is tested for collision
     * @param {Object3D} displayObject - the displayObject
     *  that will be hit test (recursively crawls its children)
     * @param {Function} [func] - the function that will be called on each interactive object. The
     *  interactionEvent, displayObject and hit will be passed to the function
     * @param {boolean} [hitTest] - this indicates if the objects inside should be hit test against the point
     * @param {boolean} [interactive] - Whether the displayObject is interactive
     * @return {boolean} returns true if the displayObject hit the point
     */

  }, {
    key: 'processInteractive',
    value: function processInteractive(interactionEvent, displayObject, func, hitTest, interactive) {
      if (!displayObject || !displayObject.visible) {
        return false;
      }

      // Took a little while to rework this function correctly! But now it is done and nice and optimised. ^_^
      //
      // This function will now loop through all objects and then only hit test the objects it HAS
      // to, not all of them. MUCH faster..
      // An object will be hit test if the following is true:
      //
      // 1: It is interactive.
      // 2: It belongs to a parent that is interactive AND one of the parents children have not already been hit.
      //
      // As another little optimisation once an interactive object has been hit we can carry on
      // through the scenegraph, but we know that there will be no more hits! So we can avoid extra hit tests
      // A final optimisation is that an object is not hit test directly if a child has already been hit.

      interactive = displayObject.interactive || interactive;

      var hit = false;
      var interactiveParent = interactive;

      if (displayObject.interactiveChildren && displayObject.children) {
        var children = displayObject.children;

        for (var i = children.length - 1; i >= 0; i--) {
          var child = children[i];

          // time to get recursive.. if this function will return if something is hit..
          var childHit = this.processInteractive(interactionEvent, child, func, hitTest, interactiveParent);

          if (childHit) {
            // its a good idea to check if a child has lost its parent.
            // this means it has been removed whilst looping so its best
            if (!child.parent) {
              continue;
            }

            // we no longer need to hit test any more objects in this container as we we
            // now know the parent has been hit
            interactiveParent = false;

            // If the child is interactive , that means that the object hit was actually
            // interactive and not just the child of an interactive object.
            // This means we no longer need to hit test anything else. We still need to run
            // through all objects, but we don't need to perform any hit tests.

            if (childHit) {
              if (interactionEvent.target) {
                hitTest = false;
              }
              hit = true;
            }
          }
        }
      }

      // no point running this if the item is not interactive or does not have an interactive parent.
      if (interactive) {
        // if we are hit testing (as in we have no hit any objects yet)
        // We also don't need to worry about hit testing if once of the displayObjects children
        // has already been hit - but only if it was interactive, otherwise we need to keep
        // looking for an interactive child, just in case we hit one
        if (hitTest && !interactionEvent.target) {
          var intersect = displayObject.raycastTest(this.raycaster);
          if (intersect) {
            interactionEvent.intersect = intersect;
            hit = true;
          }
        }

        if (displayObject.interactive) {
          if (hit && !interactionEvent.target) {
            interactionEvent.data.target = interactionEvent.target = displayObject;
          }

          if (func) {
            func(interactionEvent, displayObject, !!hit);
          }
        }
      }

      return hit;
    }

    /**
     * Is called when the click is pressed down on the renderer element
     *
     * @private
     * @param {MouseEvent} originalEvent - The DOM event of a click being pressed down
     */

  }, {
    key: 'onClick',
    value: function onClick(originalEvent) {
      if (!this.isAble()) return;
      if (originalEvent.type !== 'click') return;

      var events = this.normalizeToPointerData(originalEvent);

      if (this.autoPreventDefault && events[0].isNormalized) {
        originalEvent.preventDefault();
      }

      var interactionData = this.getInteractionDataForPointerId(events[0]);

      var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, events[0], interactionData);

      interactionEvent.data.originalEvent = originalEvent;

      this.processInteractive(interactionEvent, this.layer.scene, this.processClick, true);

      this.emit('click', interactionEvent);
    }

    /**
     * Processes the result of the click check and dispatches the event if need be
     *
     * @private
     * @param {InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {Object3D} displayObject - The display object that was tested
     * @param {boolean} hit - the result of the hit test on the display object
     */

  }, {
    key: 'processClick',
    value: function processClick(interactionEvent, displayObject, hit) {
      if (hit) {
        this.triggerEvent(displayObject, 'click', interactionEvent);
      }
    }

    /**
     * Is called when the pointer button is pressed down on the renderer element
     *
     * @private
     * @param {PointerEvent} originalEvent - The DOM event of a pointer button being pressed down
     */

  }, {
    key: 'onPointerDown',
    value: function onPointerDown(originalEvent) {
      if (!this.isAble()) return;
      // if we support touch events, then only use those for touch events, not pointer events
      if (this.supportsTouchEvents && originalEvent.pointerType === 'touch') return;

      var events = this.normalizeToPointerData(originalEvent);

      /**
       * No need to prevent default on natural pointer events, as there are no side effects
       * Normalized events, however, may have the double mousedown/touchstart issue on the native android browser,
       * so still need to be prevented.
       */

      // Guaranteed that there will be at least one event in events, and all events must have the same pointer type

      if (this.autoPreventDefault && events[0].isNormalized) {
        originalEvent.preventDefault();
      }

      var eventLen = events.length;

      for (var i = 0; i < eventLen; i++) {
        var event = events[i];

        var interactionData = this.getInteractionDataForPointerId(event);

        var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);

        interactionEvent.data.originalEvent = originalEvent;

        this.processInteractive(interactionEvent, this.layer.scene, this.processPointerDown, true);

        this.emit('pointerdown', interactionEvent);
        if (event.pointerType === 'touch') {
          this.emit('touchstart', interactionEvent);
        } else if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
          var isRightButton = event.button === 2;

          this.emit(isRightButton ? 'rightdown' : 'mousedown', this.eventData);
        }
      }
    }

    /**
     * Processes the result of the pointer down check and dispatches the event if need be
     *
     * @private
     * @param {InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {Object3D} displayObject - The display object that was tested
     * @param {boolean} hit - the result of the hit test on the display object
     */

  }, {
    key: 'processPointerDown',
    value: function processPointerDown(interactionEvent, displayObject, hit) {
      var data = interactionEvent.data;
      var id = interactionEvent.data.identifier;

      if (hit) {
        if (!displayObject.trackedPointers[id]) {
          displayObject.trackedPointers[id] = new InteractionTrackingData(id);
        }
        this.triggerEvent(displayObject, 'pointerdown', interactionEvent);

        if (data.pointerType === 'touch') {
          displayObject.started = true;
          this.triggerEvent(displayObject, 'touchstart', interactionEvent);
        } else if (data.pointerType === 'mouse' || data.pointerType === 'pen') {
          var isRightButton = data.button === 2;

          if (isRightButton) {
            displayObject.trackedPointers[id].rightDown = true;
          } else {
            displayObject.trackedPointers[id].leftDown = true;
          }

          this.triggerEvent(displayObject, isRightButton ? 'rightdown' : 'mousedown', interactionEvent);
        }
      }
    }

    /**
     * Is called when the pointer button is released on the renderer element
     *
     * @private
     * @param {PointerEvent} originalEvent - The DOM event of a pointer button being released
     * @param {boolean} cancelled - true if the pointer is cancelled
     * @param {Function} func - Function passed to {@link processInteractive}
     */

  }, {
    key: 'onPointerComplete',
    value: function onPointerComplete(originalEvent, cancelled, func) {
      var events = this.normalizeToPointerData(originalEvent);

      var eventLen = events.length;

      // if the event wasn't targeting our canvas, then consider it to be pointerupoutside
      // in all cases (unless it was a pointercancel)
      var eventAppend = originalEvent.target !== this.interactionDOMElement ? 'outside' : '';

      for (var i = 0; i < eventLen; i++) {
        var event = events[i];

        var interactionData = this.getInteractionDataForPointerId(event);

        var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);

        interactionEvent.data.originalEvent = originalEvent;

        // perform hit testing for events targeting our canvas or cancel events
        this.processInteractive(interactionEvent, this.layer.scene, func, cancelled || !eventAppend);

        this.emit(cancelled ? 'pointercancel' : 'pointerup' + eventAppend, interactionEvent);

        if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
          var isRightButton = event.button === 2;

          this.emit(isRightButton ? 'rightup' + eventAppend : 'mouseup' + eventAppend, interactionEvent);
        } else if (event.pointerType === 'touch') {
          this.emit(cancelled ? 'touchcancel' : 'touchend' + eventAppend, interactionEvent);
          this.releaseInteractionDataForPointerId(event.pointerId, interactionData);
        }
      }
    }

    /**
     * Is called when the pointer button is cancelled
     *
     * @private
     * @param {PointerEvent} event - The DOM event of a pointer button being released
     */

  }, {
    key: 'onPointerCancel',
    value: function onPointerCancel(event) {
      if (!this.isAble()) return;
      // if we support touch events, then only use those for touch events, not pointer events
      if (this.supportsTouchEvents && event.pointerType === 'touch') return;

      this.onPointerComplete(event, true, this.processPointerCancel);
    }

    /**
     * Processes the result of the pointer cancel check and dispatches the event if need be
     *
     * @private
     * @param {InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {Object3D} displayObject - The display object that was tested
     */

  }, {
    key: 'processPointerCancel',
    value: function processPointerCancel(interactionEvent, displayObject) {
      var data = interactionEvent.data;

      var id = interactionEvent.data.identifier;

      if (displayObject.trackedPointers[id] !== undefined) {
        delete displayObject.trackedPointers[id];
        this.triggerEvent(displayObject, 'pointercancel', interactionEvent);

        if (data.pointerType === 'touch') {
          this.triggerEvent(displayObject, 'touchcancel', interactionEvent);
        }
      }
    }

    /**
     * Is called when the pointer button is released on the renderer element
     *
     * @private
     * @param {PointerEvent} event - The DOM event of a pointer button being released
     */

  }, {
    key: 'onPointerUp',
    value: function onPointerUp(event) {
      if (!this.isAble()) return;
      // if we support touch events, then only use those for touch events, not pointer events
      if (this.supportsTouchEvents && event.pointerType === 'touch') return;

      this.onPointerComplete(event, false, this.processPointerUp);
    }

    /**
     * Processes the result of the pointer up check and dispatches the event if need be
     *
     * @private
     * @param {InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {Object3D} displayObject - The display object that was tested
     * @param {boolean} hit - the result of the hit test on the display object
     */

  }, {
    key: 'processPointerUp',
    value: function processPointerUp(interactionEvent, displayObject, hit) {
      var data = interactionEvent.data;

      var id = interactionEvent.data.identifier;

      var trackingData = displayObject.trackedPointers[id];

      var isTouch = data.pointerType === 'touch';

      var isMouse = data.pointerType === 'mouse' || data.pointerType === 'pen';

      // Mouse only
      if (isMouse) {
        var isRightButton = data.button === 2;

        var flags = InteractionTrackingData.FLAGS;

        var test = isRightButton ? flags.RIGHT_DOWN : flags.LEFT_DOWN;

        var isDown = trackingData !== undefined && trackingData.flags & test;

        if (hit) {
          this.triggerEvent(displayObject, isRightButton ? 'rightup' : 'mouseup', interactionEvent);

          if (isDown) {
            this.triggerEvent(displayObject, isRightButton ? 'rightclick' : 'leftclick', interactionEvent);
          }
        } else if (isDown) {
          this.triggerEvent(displayObject, isRightButton ? 'rightupoutside' : 'mouseupoutside', interactionEvent);
        }
        // update the down state of the tracking data
        if (trackingData) {
          if (isRightButton) {
            trackingData.rightDown = false;
          } else {
            trackingData.leftDown = false;
          }
        }
      }

      // Pointers and Touches, and Mouse
      if (isTouch && displayObject.started) {
        displayObject.started = false;
        this.triggerEvent(displayObject, 'touchend', interactionEvent);
      }
      if (hit) {
        this.triggerEvent(displayObject, 'pointerup', interactionEvent);

        if (trackingData) {
          this.triggerEvent(displayObject, 'pointertap', interactionEvent);
          if (isTouch) {
            this.triggerEvent(displayObject, 'tap', interactionEvent);
            // touches are no longer over (if they ever were) when we get the touchend
            // so we should ensure that we don't keep pretending that they are
            trackingData.over = false;
          }
        }
      } else if (trackingData) {
        this.triggerEvent(displayObject, 'pointerupoutside', interactionEvent);
        if (isTouch) this.triggerEvent(displayObject, 'touchendoutside', interactionEvent);
      }
      // Only remove the tracking data if there is no over/down state still associated with it
      if (trackingData && trackingData.none) {
        delete displayObject.trackedPointers[id];
      }
    }

    /**
     * Is called when the pointer moves across the renderer element
     *
     * @private
     * @param {PointerEvent} originalEvent - The DOM event of a pointer moving
     */

  }, {
    key: 'onPointerMove',
    value: function onPointerMove(originalEvent) {
      if (!this.isAble()) return;
      // if we support touch events, then only use those for touch events, not pointer events
      if (this.supportsTouchEvents && originalEvent.pointerType === 'touch') return;

      var events = this.normalizeToPointerData(originalEvent);

      if (events[0].pointerType === 'mouse') {
        this.didMove = true;

        this.cursor = null;
      }

      var eventLen = events.length;

      for (var i = 0; i < eventLen; i++) {
        var event = events[i];

        var interactionData = this.getInteractionDataForPointerId(event);

        var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);

        interactionEvent.data.originalEvent = originalEvent;

        var interactive = event.pointerType === 'touch' ? this.moveWhenInside : true;

        this.processInteractive(interactionEvent, this.layer.scene, this.processPointerMove, interactive);
        this.emit('pointermove', interactionEvent);
        if (event.pointerType === 'touch') this.emit('touchmove', interactionEvent);
        if (event.pointerType === 'mouse' || event.pointerType === 'pen') this.emit('mousemove', interactionEvent);
      }

      if (events[0].pointerType === 'mouse') {
        this.setCursorMode(this.cursor);

        // TODO BUG for parents interactive object (border order issue)
      }
    }

    /**
     * Processes the result of the pointer move check and dispatches the event if need be
     *
     * @private
     * @param {InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {Object3D} displayObject - The display object that was tested
     * @param {boolean} hit - the result of the hit test on the display object
     */

  }, {
    key: 'processPointerMove',
    value: function processPointerMove(interactionEvent, displayObject, hit) {
      var data = interactionEvent.data;

      var isTouch = data.pointerType === 'touch';

      var isMouse = data.pointerType === 'mouse' || data.pointerType === 'pen';

      if (isMouse) {
        this.processPointerOverOut(interactionEvent, displayObject, hit);
      }

      if (isTouch && displayObject.started) this.triggerEvent(displayObject, 'touchmove', interactionEvent);
      if (!this.moveWhenInside || hit) {
        this.triggerEvent(displayObject, 'pointermove', interactionEvent);
        if (isMouse) this.triggerEvent(displayObject, 'mousemove', interactionEvent);
      }
    }

    /**
     * Is called when the pointer is moved out of the renderer element
     *
     * @private
     * @param {PointerEvent} originalEvent - The DOM event of a pointer being moved out
     */

  }, {
    key: 'onPointerOut',
    value: function onPointerOut(originalEvent) {
      if (!this.isAble()) return;
      // if we support touch events, then only use those for touch events, not pointer events
      if (this.supportsTouchEvents && originalEvent.pointerType === 'touch') return;

      var events = this.normalizeToPointerData(originalEvent);

      // Only mouse and pointer can call onPointerOut, so events will always be length 1
      var event = events[0];

      if (event.pointerType === 'mouse') {
        this.mouseOverRenderer = false;
        this.setCursorMode(null);
      }

      var interactionData = this.getInteractionDataForPointerId(event);

      var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);

      interactionEvent.data.originalEvent = event;

      this.processInteractive(interactionEvent, this.layer.scene, this.processPointerOverOut, false);

      this.emit('pointerout', interactionEvent);
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        this.emit('mouseout', interactionEvent);
      } else {
        // we can get touchleave events after touchend, so we want to make sure we don't
        // introduce memory leaks
        this.releaseInteractionDataForPointerId(interactionData.identifier);
      }
    }

    /**
     * Processes the result of the pointer over/out check and dispatches the event if need be
     *
     * @private
     * @param {InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {Object3D} displayObject - The display object that was tested
     * @param {boolean} hit - the result of the hit test on the display object
     */

  }, {
    key: 'processPointerOverOut',
    value: function processPointerOverOut(interactionEvent, displayObject, hit) {
      var data = interactionEvent.data;

      var id = interactionEvent.data.identifier;

      var isMouse = data.pointerType === 'mouse' || data.pointerType === 'pen';

      var trackingData = displayObject.trackedPointers[id];

      // if we just moused over the display object, then we need to track that state
      if (hit && !trackingData) {
        trackingData = displayObject.trackedPointers[id] = new InteractionTrackingData(id);
      }

      if (trackingData === undefined) return;

      if (hit && this.mouseOverRenderer) {
        if (!trackingData.over) {
          trackingData.over = true;
          this.triggerEvent(displayObject, 'pointerover', interactionEvent);
          if (isMouse) {
            this.triggerEvent(displayObject, 'mouseover', interactionEvent);
          }
        }

        // only change the cursor if it has not already been changed (by something deeper in the
        // display tree)
        if (isMouse && this.cursor === null) {
          this.cursor = displayObject.cursor;
        }
      } else if (trackingData.over) {
        trackingData.over = false;
        this.triggerEvent(displayObject, 'pointerout', this.eventData);
        if (isMouse) {
          this.triggerEvent(displayObject, 'mouseout', interactionEvent);
        }
        // if there is no mouse down information for the pointer, then it is safe to delete
        if (trackingData.none) {
          delete displayObject.trackedPointers[id];
        }
      }
    }

    /**
     * Is called when the pointer is moved into the renderer element
     *
     * @private
     * @param {PointerEvent} originalEvent - The DOM event of a pointer button being moved into the renderer view
     */

  }, {
    key: 'onPointerOver',
    value: function onPointerOver(originalEvent) {
      if (!this.isAble()) return;
      var events = this.normalizeToPointerData(originalEvent);

      // Only mouse and pointer can call onPointerOver, so events will always be length 1
      var event = events[0];

      var interactionData = this.getInteractionDataForPointerId(event);

      var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);

      interactionEvent.data.originalEvent = event;

      if (event.pointerType === 'mouse') {
        this.mouseOverRenderer = true;
      }

      this.emit('pointerover', interactionEvent);
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        this.emit('mouseover', interactionEvent);
      }
    }

    /**
     * Get InteractionData for a given pointerId. Store that data as well
     *
     * @private
     * @param {PointerEvent} event - Normalized pointer event, output from normalizeToPointerData
     * @return {InteractionData} - Interaction data for the given pointer identifier
     */

  }, {
    key: 'getInteractionDataForPointerId',
    value: function getInteractionDataForPointerId(event) {
      var pointerId = event.pointerId;

      var interactionData = void 0;

      if (pointerId === MOUSE_POINTER_ID || event.pointerType === 'mouse') {
        interactionData = this.mouse;
      } else if (this.activeInteractionData[pointerId]) {
        interactionData = this.activeInteractionData[pointerId];
      } else {
        interactionData = this.interactionDataPool.pop() || new InteractionData();
        interactionData.identifier = pointerId;
        this.activeInteractionData[pointerId] = interactionData;
      }
      // copy properties from the event, so that we can make sure that touch/pointer specific
      // data is available
      interactionData._copyEvent(event);

      return interactionData;
    }

    /**
     * Return unused InteractionData to the pool, for a given pointerId
     *
     * @private
     * @param {number} pointerId - Identifier from a pointer event
     */

  }, {
    key: 'releaseInteractionDataForPointerId',
    value: function releaseInteractionDataForPointerId(pointerId) {
      var interactionData = this.activeInteractionData[pointerId];

      if (interactionData) {
        delete this.activeInteractionData[pointerId];
        interactionData._reset();
        this.interactionDataPool.push(interactionData);
      }
    }

    /**
     * Maps x and y coords from a DOM object and maps them correctly to the three.js view. The
     * resulting value is stored in the point. This takes into account the fact that the DOM
     * element could be scaled and positioned anywhere on the screen.
     *
     * @param  {Vector2} point - the point that the result will be stored in
     * @param  {number} x - the x coord of the position to map
     * @param  {number} y - the y coord of the position to map
     */

  }, {
    key: 'mapPositionToPoint',
    value: function mapPositionToPoint(point, x, y) {
      var rect = void 0;

      // IE 11 fix
      if (!this.interactionDOMElement.parentElement) {
        rect = {
          x: 0,
          y: 0,
          left: 0,
          top: 0,
          width: 0,
          height: 0
        };
      } else {
        rect = this.interactionDOMElement.getBoundingClientRect();
      }

      point.x = (x - rect.left) / rect.width * 2 - 1;
      point.y = -((y - rect.top) / rect.height) * 2 + 1;
    }

    /**
     * Configure an InteractionEvent to wrap a DOM PointerEvent and InteractionData
     *
     * @private
     * @param {InteractionEvent} interactionEvent - The event to be configured
     * @param {PointerEvent} pointerEvent - The DOM event that will be paired with the InteractionEvent
     * @param {InteractionData} interactionData - The InteractionData that will be paired
     *        with the InteractionEvent
     * @return {InteractionEvent} the interaction event that was passed in
     */

  }, {
    key: 'configureInteractionEventForDOMEvent',
    value: function configureInteractionEventForDOMEvent(interactionEvent, pointerEvent, interactionData) {
      interactionEvent.data = interactionData;

      this.mapPositionToPoint(interactionData.global, pointerEvent.clientX, pointerEvent.clientY);

      if (this.layer && this.layer.interactive) this.raycaster.setFromCamera(interactionData.global, this.layer.camera);

      // Not really sure why this is happening, but it's how a previous version handled things TODO: there should be remove
      if (pointerEvent.pointerType === 'touch') {
        pointerEvent.globalX = interactionData.global.x;
        pointerEvent.globalY = interactionData.global.y;
      }

      interactionData.originalEvent = pointerEvent;
      interactionEvent._reset();

      return interactionEvent;
    }

    /**
     * Ensures that the original event object contains all data that a regular pointer event would have
     *
     * @private
     * @param {TouchEvent|MouseEvent|PointerEvent} event - The original event data from a touch or mouse event
     * @return {PointerEvent[]} An array containing a single normalized pointer event, in the case of a pointer
     *  or mouse event, or a multiple normalized pointer events if there are multiple changed touches
     */

  }, {
    key: 'normalizeToPointerData',
    value: function normalizeToPointerData(event) {
      var normalizedEvents = [];

      if (this.supportsTouchEvents && event instanceof TouchEvent) {
        for (var i = 0, li = event.changedTouches.length; i < li; i++) {
          var touch = event.changedTouches[i];

          if (typeof touch.button === 'undefined') touch.button = event.touches.length ? 1 : 0;
          if (typeof touch.buttons === 'undefined') touch.buttons = event.touches.length ? 1 : 0;
          if (typeof touch.isPrimary === 'undefined') {
            touch.isPrimary = event.touches.length === 1 && event.type === 'touchstart';
          }
          if (typeof touch.width === 'undefined') touch.width = touch.radiusX || 1;
          if (typeof touch.height === 'undefined') touch.height = touch.radiusY || 1;
          if (typeof touch.tiltX === 'undefined') touch.tiltX = 0;
          if (typeof touch.tiltY === 'undefined') touch.tiltY = 0;
          if (typeof touch.pointerType === 'undefined') touch.pointerType = 'touch';
          if (typeof touch.pointerId === 'undefined') touch.pointerId = touch.identifier || 0;
          if (typeof touch.pressure === 'undefined') touch.pressure = touch.force || 0.5;
          touch.twist = 0;
          touch.tangentialPressure = 0;
          // TODO: Remove these, as layerX/Y is not a standard, is deprecated, has uneven
          // support, and the fill ins are not quite the same
          // offsetX/Y might be okay, but is not the same as clientX/Y when the canvas's top
          // left is not 0,0 on the page
          if (typeof touch.layerX === 'undefined') touch.layerX = touch.offsetX = touch.clientX;
          if (typeof touch.layerY === 'undefined') touch.layerY = touch.offsetY = touch.clientY;

          // mark the touch as normalized, just so that we know we did it
          touch.isNormalized = true;

          normalizedEvents.push(touch);
        }
      } else if (event instanceof MouseEvent && (!this.supportsPointerEvents || !(event instanceof window.PointerEvent))) {
        if (typeof event.isPrimary === 'undefined') event.isPrimary = true;
        if (typeof event.width === 'undefined') event.width = 1;
        if (typeof event.height === 'undefined') event.height = 1;
        if (typeof event.tiltX === 'undefined') event.tiltX = 0;
        if (typeof event.tiltY === 'undefined') event.tiltY = 0;
        if (typeof event.pointerType === 'undefined') event.pointerType = 'mouse';
        if (typeof event.pointerId === 'undefined') event.pointerId = MOUSE_POINTER_ID;
        if (typeof event.pressure === 'undefined') event.pressure = 0.5;
        event.twist = 0;
        event.tangentialPressure = 0;

        // mark the mouse event as normalized, just so that we know we did it
        event.isNormalized = true;

        normalizedEvents.push(event);
      } else {
        normalizedEvents.push(event);
      }

      return normalizedEvents;
    }

    /**
     * Destroys the interaction manager
     *
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.removeEvents();

      this.removeAllListeners();

      this.renderer = null;

      this.mouse = null;

      this.eventData = null;

      this.interactionDOMElement = null;

      this.onPointerDown = null;
      this.processPointerDown = null;

      this.onPointerUp = null;
      this.processPointerUp = null;

      this.onPointerCancel = null;
      this.processPointerCancel = null;

      this.onPointerMove = null;
      this.processPointerMove = null;

      this.onPointerOut = null;
      this.processPointerOverOut = null;

      this.onPointerOver = null;

      this._tempPoint = null;
    }
  }]);
  return InteractionLayer;
}(three.EventDispatcher);

/**
 * layer compositor, use to merge primerLayer and graphicsLayer
 */

var LayerCompositor = function () {
  function LayerCompositor() {
    classCallCheck(this, LayerCompositor);

    /**
     * framebuffer will auto clear
     * @member {Boolean}
     */
    this.autoClear = true;

    /**
     * orthographic camera, for composite draw
     * @member {OrthographicCamera}
     */
    this.camera = new three.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    /**
     * scene, for composite draw
     * @member {Scene}
     */
    this.scene = new three.Scene();
  }

  /**
   * push a display object into scene
   *
   * @param {THREE.Object3D} child display object, which will be rendering
   * @return {this} this
   */


  createClass(LayerCompositor, [{
    key: 'add',
    value: function add() {
      this.scene.add.apply(this.scene, arguments);
      return this;
    }

    /**
     * remove a display object from scene
     *
     * @param {THREE.Object3D} child display object, which you had push it at before
     * @return {this} this
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.scene.remove.apply(this.scene, arguments);
      return this;
    }
  }, {
    key: 'composition',
    value: function composition(renderer, renderTarget) {
      if (this.autoClear) this.clear(renderer, renderTarget);
      renderer.render(this.scene, this.camera, renderTarget);
    }

    /**
     * clear framebuffer
     * @param {WebGLRender} renderer renderer from view
     * @param {WebGLRenderTarget} renderTarget clear which render target
     */

  }, {
    key: 'clear',
    value: function clear(renderer, renderTarget) {
      renderer.setRenderTarget(renderTarget);
      renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
    }
  }]);
  return LayerCompositor;
}();

function setDefault(check, value, spare) {
  return check(value) ? value : spare;
}

/**
 * ViewConfig class, a default config for WebGLRenderer with-in UC-AR
 *
 * @private
 * @param {Object} options custom config for WebGLRenderer
 * @param {String|canvas} options.canvas `canvas-dom` or canvas `css-selector`
 * @param {Boolean} [options.alpha=false] whether the canvas contains an alpha (transparency) buffer or not.
 * @param {Boolean} [options.antialias=false] whether to perform antialiasing.
 * @param {String} [options.precision='highp'] Shader precision, Can be `highp`, `mediump` or `lowp`.
 * @param {Boolean} [options.premultipliedAlpha=true] whether the renderer will assume that colors have premultiplied alpha.
 * @param {Boolean} [options.stencil=true] whether the drawing buffer has a stencil buffer of at least 8 bits.
 * @param {Boolean} [options.preserveDrawingBuffer=false] whether to preserve the buffers until manually cleared or overwritten.
 * @param {Boolean} [options.depth=true] whether the drawing buffer has a depth buffer of at least 16 bits.
 * @param {Boolean} [options.logarithmicDepthBuffer] whether to use a logarithmic depth buffer.
 */

var ViewConfig = function ViewConfig(options) {
  classCallCheck(this, ViewConfig);

  /**
   * canvas dom element
   *
   * @member {canvas}
   */
  this.canvas = Utils.isString(options.canvas) ? document.getElementById(options.canvas) || document.querySelector(options.canvas) : options.canvas;

  /**
   * Shader precision
   *
   * @member {String}
   */
  this.precision = options.precision;

  /**
   * canvas contains an alpha (transparency) buffer or not
   *
   * @member {Boolean}
   */
  this.alpha = setDefault(Utils.isBoolean, options.alpha, true);

  /**
   * whether to perform antialiasing
   *
   * @member {Boolean}
   */
  this.antialias = setDefault(Utils.isBoolean, options.antialias, true);

  /**
   * whether the renderer will assume that colors have premultiplied alpha.
   *
   * @member {Boolean}
   */
  this.premultipliedAlpha = options.premultipliedAlpha;

  /**
   * whether the drawing buffer has a stencil buffer of at least 8 bits.
   *
   * @member {Boolean}
   */
  this.stencil = options.stencil;

  /**
   * whether to preserve the buffers until manually cleared or overwritten.
   *
   * @member {Boolean}
   */
  this.preserveDrawingBuffer = options.preserveDrawingBuffer;

  /**
   * whether the drawing buffer has a depth buffer of at least 16 bits.
   *
   * @member {Boolean}
   */
  this.depth = options.depth;

  /**
   * whether to use a logarithmic depth buffer.
   *
   * @member {Boolean}
   */
  this.logarithmicDepthBuffer = options.logarithmicDepthBuffer;
};

var parameters$1 = {
  minFilter: three.LinearFilter,
  magFilter: three.LinearFilter,
  format: three.RGBAFormat,
  stencilBuffer: false
};

var EffectPack = function () {
  function EffectPack(options) {
    classCallCheck(this, EffectPack);
    var width = options.width,
        height = options.height;


    this.width = width;

    this.height = height;

    /**
     * render buffer to carry render content
     */
    this.renderTarget = new three.WebGLRenderTarget(this.width, this.height, parameters$1);

    /**
     * after effect update delta
     * @member {Number}
     */
    this.delta = 0;

    /**
     * store pass array, all effect pass list
     * @member {pass}
     */
    this.passes = [];
  }

  /**
   * add a after-effects pass to this layer
   * @param {Pass} pass pass process
   */


  createClass(EffectPack, [{
    key: 'addPass',
    value: function addPass(pass) {
      this.passes.push(pass);
      pass.setSize(this.width, this.height);
    }

    /**
     * insert a after-effects pass to this layer
     * @param {Pass} pass pass process
     * @param {Number} index insert which position
     */

  }, {
    key: 'insertPass',
    value: function insertPass(pass, index) {
      this.passes.splice(index, 0, pass);
    }

    /**
     * resize buffer size and pass size when viewport has change
     * @param {number} width render buffer width
     * @param {number} height render buffer height
     */

  }, {
    key: 'setSize',
    value: function setSize(width, height) {
      this.width = width;
      this.height = height;
      this.renderTarget.setSize(width, height);

      var length = this.passes.length;
      for (var i = 0; i < length; i++) {
        this.passes[i].setSize(width, height);
      }
    }

    /**
     * get after-effects was active
     * @return {Boolean} active or not
     */

  }, {
    key: 'isAeOpen',
    get: function get$$1() {
      var length = this.passes.length;
      if (length === 0) return false;
      for (var i = 0; i < length; i++) {
        if (this.passes[i].enabled) return true;
      }
      return false;
    }
  }]);
  return EffectPack;
}();

// import GraphicsLayer from './GraphicsLayer';
// import PrimerLayer from './PrimerLayer';
/**
 * a `UC-AR` renderer framework, help you building AR-APP fastly
 * @extends EventDispatcher
 * @param {Object} options config for `Viewer` render view-port
 * @param {canvas} options.canvas `canvas-dom` or canvas `css-selector`
 * @param {Number} [options.vrmode=false] whether init with vrmode.
 * @param {Number} [options.updateStyle=false] need update canvas style size.
 * @param {Number} [options.pixelRatio=1] render buffer resolution.
 * @param {Boolean} [options.autoClear=true] whether the renderer should automatically clear its output before rendering a frame.
 * @param {Boolean} [options.alpha=false] whether the canvas contains an alpha (transparency) buffer or not.
 * @param {Boolean} [options.antialias=false] whether to perform antialiasing.
 * @param {String} [options.precision='highp'] Shader precision, Can be `highp`, `mediump` or `lowp`.
 * @param {Boolean} [options.premultipliedAlpha=true] whether the renderer will assume that colors have premultiplied alpha.
 * @param {Boolean} [options.stencil=true] whether the drawing buffer has a stencil buffer of at least 8 bits.
 * @param {Boolean} [options.preserveDrawingBuffer=false] whether to preserve the buffers until manually cleared or overwritten.
 * @param {Boolean} [options.depth=true] whether the drawing buffer has a depth buffer of at least 16 bits.
 * @param {Boolean} [options.logarithmicDepthBuffer] whether to use a logarithmic depth buffer.
 */

var Viewer = function (_EventDispatcher) {
  inherits(Viewer, _EventDispatcher);

  function Viewer(options) {
    classCallCheck(this, Viewer);

    var _this = possibleConstructorReturn(this, (Viewer.__proto__ || Object.getPrototypeOf(Viewer)).call(this));

    var _options$pixelRatio = options.pixelRatio,
        pixelRatio = _options$pixelRatio === undefined ? 1 : _options$pixelRatio,
        _options$width = options.width,
        width = _options$width === undefined ? 300 : _options$width,
        _options$height = options.height,
        height = _options$height === undefined ? 150 : _options$height,
        _options$updateStyle = options.updateStyle,
        updateStyle = _options$updateStyle === undefined ? false : _options$updateStyle,
        _options$vrmode = options.vrmode,
        vrmode = _options$vrmode === undefined ? false : _options$vrmode;


    _this.width = width;

    _this.height = height;

    _this.viewBox = { width: width * pixelRatio, height: height * pixelRatio };

    /**
     * `WebGL` renderer object, base on `three.js` gl context
     * @member {WebGLRenderer}
     */
    _this.renderer = new three.WebGLRenderer(new ViewConfig(options));

    /**
     * init set pixelRatio
     * @private
     */
    // this.renderer.setPixelRatio(pixelRatio);

    /**
     * init set renderer size
     * @private
     */
    // this.renderer.setSize(width, height, updateStyle);

    /**
     * render effect kit to carry render content and some data
     */
    _this.effectPack = new EffectPack(_this.viewBox);

    /**
     * close auto-clear, and change
     * @private
     */
    _this.renderer.autoClear = false;

    /**
     * whether the renderer should automatically clear its output before rendering a frame.
     *
     * @member {Boolean}
     */
    _this.autoClear = Utils.isBoolean(options.autoClear) ? options.autoClear : true;

    /**
     * whether update ticker is working or not
     *
     * @member {Boolean}
     */
    _this.ticking = false;

    /**
     * pre-time cache
     *
     * @member {Number}
     * @private
     */
    _this.pt = 0;

    /**
     * how long the time through, at this tick
     *
     * @member {Number}
     * @private
     */
    _this.snippet = 0;

    /**
     * set it when you hope engine update at a fixed fps, default 60/fps
     *
     * @member {Number}
     */
    _this.fps = options.fps || 60;

    /**
     * time-scale for timeline
     *
     * @member {Number}
     */
    _this.timeScale = 1;

    /**
     * effect composer, for postprogressing
     * @member {EffectComposer}
     */
    _this.effectComposer = new EffectComposer(_this.viewBox);

    /**
     * compositor primerLayer and graphicsLayer with zIndex order
     * @member {LayerCompositor}
     */
    _this.layerCompositor = new LayerCompositor();

    /**
     * store layers array, all content layer list
     * @member {layer}
     */
    _this.layers = [];

    /**
     * 3d-view interaction manager
     * TODO: should fix interaction bug when vrmode
     */
    _this.interactionLayer = new InteractionLayer(_this.renderer);

    _this.setPixelRatio(pixelRatio, updateStyle);

    _this.viewport = new three.Vector4();

    _this._vrmode = null;

    _this.vrmodeOnChange = function () {
      _this.emit('vrmodeChange');
      _this.setPassesSize();
      _this.setComposerSize();
      _this.setLayersSize();
    };

    _this.vrmode = vrmode;

    _this.session = {
      viewport: _this.viewport
    };
    return _this;
  }

  /**
   * update timeline and update render
   */


  createClass(Viewer, [{
    key: 'update',
    value: function update() {
      this.timeline();
      var snippet = this.snippet;

      this.emit('pretimeline', {
        snippet: snippet
      });
      this.updateTimeline(snippet);
      this.emit('posttimeline', {
        snippet: snippet
      });

      this.emit('prerender', {
        snippet: snippet
      });
      this.render();
      this.emit('postrender', {
        snippet: snippet
      });
    }

    /**
     * update timeline
     * @param {Number} snippet time snippet
     * @private
     */

  }, {
    key: 'updateTimeline',
    value: function updateTimeline(snippet) {
      snippet = this.timeScale * snippet;

      this.emit('pretimeline', {
        snippet: snippet
      });

      var i = 0;
      var layers = this.layers;
      var length = layers.length;
      while (i < length) {
        layers[i].updateTimeline(snippet);
        i++;
      }

      this.emit('posttimeline', {
        snippet: snippet
      });
    }

    /**
     * clear framebuffer
     * @param {WebGLRenderTarget} renderTarget clear which render target
     */

  }, {
    key: 'clear',
    value: function clear(renderTarget) {
      this.renderer.setRenderTarget(renderTarget);
      this.renderer.clear(this.renderer.autoClearColor, this.renderer.autoClearDepth, this.renderer.autoClearStencil);
    }

    /**
     * set render rectangle area
     * @param {number} x rectangle left-top point x-position
     * @param {number} y rectangle left-top point y-position
     * @param {number} width rectangle width
     * @param {number} height rectangle height
     */

  }, {
    key: 'setSV',
    value: function setSV(x, y, width, height) {
      this.viewport.set(x, y, width, height);
      this.renderer.setScissor(x, y, width, height);
      this.renderer.setViewport(x, y, width, height);
    }

    /**
     * render all 3d stage, should be overwrite by sub-class
     */

  }, {
    key: 'render',
    value: function render() {
      if (this.autoClear) this.clear(null);
      var size = this.viewBox;
      if (this.vrmode) {
        var hw = size.width / 2;
        this.session.mode = 'VR';

        this.renderer.setScissorTest(true);

        this.setSV(0, 0, hw, size.height);
        this.session.eye = 'LEFT';
        this.xrRender();

        this.setSV(hw, 0, hw, size.height);
        this.session.eye = 'RIGHT';
        this.xrRender();

        this.renderer.setScissorTest(false);
      } else {
        this.session.mode = 'NORMAL';
        this.session.eye = '';
        this.setSV(0, 0, size.width, size.height);
        this.xrRender();
      }
    }

    /**
     * render every layer to it's render buffer
     * @private
     */

  }, {
    key: 'xrRender',
    value: function xrRender() {
      this.renderLayers(this.session);
      this.layerEffect();
      this.composition();
    }

    /**
     * render every layer to it's render buffer
     * @param {object} session a renderer session
     * @private
     */

  }, {
    key: 'renderLayers',
    value: function renderLayers(session) {
      if (this.needSort) {
        this._sortList();
        this.needSort = false;
      }
      var ll = this.layers.length;
      for (var i = 0; i < ll; i++) {
        var layer = this.layers[i];
        if (!layer.isEmpty) layer.render(this.renderer, session);
      }
    }

    /**
     * process every layer effect magic
     *
     * @private
     */

  }, {
    key: 'layerEffect',
    value: function layerEffect() {
      var ll = this.layers.length;
      for (var i = 0; i < ll; i++) {
        var layer = this.layers[i];
        if (layer.effectPack.isAeOpen) this.effectComposer.render(this.renderer, layer.effectPack);
      }
    }

    /**
     * composition every layer to a single layer or render to screen
     *
     * @private
     */

  }, {
    key: 'composition',
    value: function composition() {
      var isAeOpen = this.effectPack.isAeOpen;
      var renderTarget = isAeOpen ? this.effectPack.renderTarget : null;
      this.layerCompositor.composition(this.renderer, renderTarget);
      if (isAeOpen) {
        this.viewEffect();
      }
    }

    /**
     * if this view has pass effect, do magic again
     *
     * @private
     */

  }, {
    key: 'viewEffect',
    value: function viewEffect() {
      this.effectComposer.render(this.renderer, this.effectPack, true);
    }

    /**
     * render loop, trigger one and one tick
     *
     * @private
     */

  }, {
    key: 'tick',
    value: function tick() {
      var This = this;
      /**
       * render loop
       */
      (function render() {
        This.update();
        This.loop = RAF(render);
      })();
    }

    /**
     * update loop with fixed fps, maybe case a performance problem
     *
     * @private
     */

  }, {
    key: 'tickFixedFPS',
    value: function tickFixedFPS() {
      var This = this;
      this.loop = setInterval(function () {
        This.update();
      }, 1000 / this.fps);
      This.update();
    }

    /**
     * get timeline snippet
     *
     * @private
     */

  }, {
    key: 'timeline',
    value: function timeline() {
      var snippet = Date.now() - this.pt;
      if (!this.pt || snippet > 200) {
        this.pt = Date.now();
        snippet = Date.now() - this.pt;
      }
      this.pt += snippet;
      this.snippet = snippet;
    }

    /**
     * start update engine
     * @return {this} this
     */

  }, {
    key: 'start',
    value: function start() {
      if (this.ticking) return;
      this.ticking = true;
      this.pt = Date.now();
      if (this.fps >= 60) {
        this.tick();
      } else {
        this.tickFixedFPS();
      }
      return this;
    }

    /**
     * stop update engine
     * @return {this} this
     */

  }, {
    key: 'stop',
    value: function stop() {
      CAF(this.loop);
      clearInterval(this.loop);
      this.ticking = false;
      return this;
    }

    /**
     * sort layer, because array.sort was not stable-sort, so use bubble sort
     *
     * @private
     */

  }, {
    key: '_sortList',
    value: function _sortList() {
      Utils.bubbleSort(this.layers, function (el) {
        return el.zIndex;
      });
    }

    /**
     * add a layer into layer compositor
     *
     * @param {Layer} layer primerLayer or graphicsLayer
     * @return {this} this
     */

  }, {
    key: 'add',
    value: function add(layer) {
      if (arguments.length > 1) {
        for (var i = 0; i < arguments.length; i++) {
          this.add(arguments[i]);
        }
        return this;
      }

      if (layer && layer.isLayer) {
        if (layer.parent !== null) {
          layer.parent.remove(layer);
        }

        layer.parent = this;
        this.layers.push(layer);
        this.layerCompositor.add(layer.quad);
        this.setLayerSize(layer);
        this.needSort = true;
      } else {
        console.error('Compositor.add: layer not an instance of Layer.', layer);
      }
      return this;
    }

    /**
     * remove a layer from compositor
     *
     * @param {Layer} layer primerLayer or graphicsLayer
     * @return {this} this
     */

  }, {
    key: 'remove',
    value: function remove(layer) {
      if (arguments.length > 1) {
        for (var i = 0; i < arguments.length; i++) {
          this.remove(arguments[i]);
        }
        return this;
      }
      var index = this.layers.indexOf(layer);

      if (index !== -1) {
        layer.parent = null;
        this.layers.splice(index, 1);
        this.layerCompositor.remove(layer.quad);
      }
      return this;
    }

    /**
     * add a after-effects pass to this layer
     * @param {Pass} pass pass process
     */

  }, {
    key: 'addPass',
    value: function addPass() {
      this.effectPack.addPass.apply(this.effectPack, arguments);
    }

    /**
     * insert a after-effects pass to this layer
     * @param {Pass} pass pass process
     * @param {Number} index insert which position
     */

  }, {
    key: 'insertPass',
    value: function insertPass() {
      this.effectPack.insertPass.apply(this.effectPack, arguments);
    }
  }, {
    key: 'getPortSize',
    value: function getPortSize() {
      var _viewBox = this.viewBox,
          width = _viewBox.width,
          height = _viewBox.height;

      if (this.vrmode) {
        width = width / 2;
      }
      return { width: width, height: height };
    }
  }, {
    key: 'setLayersSize',
    value: function setLayersSize() {
      var _getPortSize = this.getPortSize(),
          width = _getPortSize.width,
          height = _getPortSize.height;

      var l = this.layers.length;
      for (var i = 0; i < l; i++) {
        var layer = this.layers[i];
        layer.setSize(width, height);
      }
    }
  }, {
    key: 'setPassesSize',
    value: function setPassesSize() {
      var _getPortSize2 = this.getPortSize(),
          width = _getPortSize2.width,
          height = _getPortSize2.height;

      this.effectPack.setSize(width, height);
    }
  }, {
    key: 'setLayerSize',
    value: function setLayerSize(layer) {
      var _getPortSize3 = this.getPortSize(),
          width = _getPortSize3.width,
          height = _getPortSize3.height;

      layer.setSize(width, height);
    }
  }, {
    key: 'setComposerSize',
    value: function setComposerSize() {
      var _getPortSize4 = this.getPortSize(),
          width = _getPortSize4.width,
          height = _getPortSize4.height;

      this.effectComposer.setSize(width, height);
    }

    /**
     * resize window when view box has change
     * @param {number} width render buffer width
     * @param {number} height render buffer height
     * @param {boolean} updateStyle update style or not
     */

  }, {
    key: 'setSize',
    value: function setSize(width, height) {
      var updateStyle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      this.width = width;
      this.height = height;
      this.renderer.setSize(width, height, updateStyle);
      this.viewBox = this.renderer.getDrawingBufferSize();

      this.setPassesSize();
      this.setComposerSize();
      this.setLayersSize();
    }
  }, {
    key: 'setPixelRatio',
    value: function setPixelRatio(pixelRatio, updateStyle) {
      this.renderer.setPixelRatio(pixelRatio);
      this.setSize(this.width, this.height, updateStyle);
    }
  }, {
    key: 'createLayer',
    value: function createLayer(layerClass, options) {
      var _getPortSize5 = this.getPortSize(),
          width = _getPortSize5.width,
          height = _getPortSize5.height;

      options = Object.assign({ width: width, height: height }, options);
      var layer = new layerClass(options);
      this.add(layer);
      return layer;
    }
  }, {
    key: 'setEventLayer',
    value: function setEventLayer(layer) {
      this.interactionLayer.setLayer(layer);
    }

    /**
     * getter whether scene interactively or not
     */

  }, {
    key: 'vrmode',
    get: function get$$1() {
      return this._vrmode;
    }

    /**
     * setter whether scene interactively or not
     * @param {Boolean} value is interactively ?
     */
    ,
    set: function set$$1(value) {
      if (value !== this.vrmode) {
        this._vrmode = value;
        this.vrmodeOnChange();
      }
    }
  }]);
  return Viewer;
}(three.EventDispatcher);

/**
 * render layer, for multi-function render pipeline, support after-effects
 */

var Layer = function () {
  /**
   * layer required a renderer
   * @param {Object} options options
   */
  function Layer(options) {
    classCallCheck(this, Layer);
    var width = options.width,
        height = options.height;

    /**
     * the parent of this layer, sometime was compositor
     * @member {Compositor}
     */

    this.parent = null;

    /**
     * zIndex order, for render list
     * @member {Number}
     * @private
     */
    this._zIndex = 0;

    /**
     * layer tag, fast check isLayer
     * @member {Boolean}
     */
    this.isLayer = true;

    /**
     * framebuffer will auto clear
     * @member {Boolean}
     */
    this.autoClear = true;

    /**
     * time-scale for timeline
     *
     * @member {Number}
     */
    this.timeScale = 1;

    /**
     * after effect update delta TODO: link to effect pack
     * @member {Number}
     */
    this.aeDelta = 0;

    /**
     * render effect kit to carry render content and some data
     */
    this.effectPack = new EffectPack({ width: width, height: height });

    /**
     * camera, for composite draw
     * @member {Camera}
     */
    this.camera = null;

    /**
     * scene, for composite draw
     * @member {Scene}
     */
    this.scene = new three.Scene();

    /**
     * quad, for composite draw
     * @member {Mesh}
     */
    this.quad = new three.Mesh(new three.PlaneBufferGeometry(2, 2), new three.MeshBasicMaterial({
      transparent: true,
      map: this.effectPack.renderTarget.texture,
      depthTest: false,
      depthWrite: false
    }));

    this.interactive = false;
  }

  /**
   * push a display object into scene
   *
   * @param {THREE.Object3D} child display object, which will be rendering
   * @return {this} this
   */


  createClass(Layer, [{
    key: 'add',
    value: function add() {
      this.scene.add.apply(this.scene, arguments);
      return this;
    }

    /**
     * remove a display object from scene
     *
     * @param {THREE.Object3D} child display object, which you had push it at before
     * @return {this} this
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.scene.remove.apply(this.scene, arguments);
      return this;
    }

    /**
     * update timeline
     * @param {Number} snippet time snippet
     * @private
     */

  }, {
    key: 'updateTimeline',
    value: function updateTimeline(snippet) {
      snippet = this.timeScale * snippet;
      this.scene.updateTimeline(snippet);
    }
  }, {
    key: 'render',
    value: function render(renderer) {
      if (this.autoClear) this.clear(renderer, this.effectPack.renderTarget);

      renderer.render(this.scene, this.camera, this.effectPack.renderTarget);
    }

    /**
     * clear framebuffer
     * @param {WebGLRender} renderer renderer from view
     * @param {WebGLRenderTarget} renderTarget clear which render target
     */

  }, {
    key: 'clear',
    value: function clear(renderer, renderTarget) {
      renderer.setRenderTarget(renderTarget);
      renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
    }

    /**
     * add a after-effects pass to this layer
     * @param {Pass} pass pass process
     */

  }, {
    key: 'addPass',
    value: function addPass() {
      this.effectPack.addPass.apply(this.effectPack, arguments);
    }

    /**
     * insert a after-effects pass to this layer
     * @param {Pass} pass pass process
     * @param {Number} index insert which position
     */

  }, {
    key: 'insertPass',
    value: function insertPass() {
      this.effectPack.insertPass.apply(this.effectPack, arguments);
    }

    /**
     * resize layer size when viewport has change
     * @param {number} width layer buffer width
     * @param {number} height layer buffer height
     */

  }, {
    key: 'setSize',
    value: function setSize(width, height) {
      this.effectPack.setSize(width, height);
    }

    /**
     * get zIndex
     * @return {Number} zIndex
     */

  }, {
    key: 'zIndex',
    get: function get$$1() {
      return this._zIndex;
    }

    /**
     * set zIndex
     * @param {Number} index zIndex
     */
    ,
    set: function set$$1(index) {
      if (this._zIndex !== index) {
        this._zIndex = index;
        this.quad.renderOrder = index;
        if (this.parent) {
          this.parent.needSort = true;
        }
      }
    }

    /**
     * get primers status
     */

  }, {
    key: 'isEmpty',
    get: function get$$1() {
      return this.scene.children.length === 0;
    }
  }]);
  return Layer;
}();

var ARLayer = function (_Layer) {
  inherits(ARLayer, _Layer);

  function ARLayer(options) {
    classCallCheck(this, ARLayer);

    var _this = possibleConstructorReturn(this, (ARLayer.__proto__ || Object.getPrototypeOf(ARLayer)).call(this, options));

    var _options$frameWidth = options.frameWidth,
        frameWidth = _options$frameWidth === undefined ? 480 : _options$frameWidth,
        _options$frameHeight = options.frameHeight,
        frameHeight = _options$frameHeight === undefined ? 640 : _options$frameHeight;

    /**
     * video frame width
     * @member {Number}
     */

    _this.frameWidth = frameWidth;

    /**
     * video frame height
     * @member {Number}
     */
    _this.frameHeight = frameHeight;

    // init update viewport for ar-video-frame
    _this.updateViewport();

    /**
     * view-port camera object, a perspective camera
     *
     * @member {PerspectiveCamera}
     */
    _this.camera = new three.PerspectiveCamera();
    _this.camera.matrixAutoUpdate = false;

    /**
     * tracking object `<markerName-arGlue>` map
     *
     * @member {Object}
     */
    _this.ar_map = {};
    return _this;
  }

  /**
   * add display-object like `ARGlue` or `THREE.Object3D` object
   *
   * @param {ARGlue|THREE.Object3D} object display-object which you want show
   * @return {this} this
   */


  createClass(ARLayer, [{
    key: 'add',
    value: function add(object) {
      if (arguments.length > 1) {
        for (var i = 0; i < arguments.length; i++) {
          this.add(arguments[i]);
        }
        return this;
      }

      if (object.type === 'ARGlue') {
        var name = object.name;
        this.ar_map[name] = object;
      }
      this.scene.add(object);
      return this;
    }

    /**
     * remove `ARGlue` or `THREE.Object3D` object
     *
     * @param {ARGlue|THREE.Object3D} object display-object which you had add before
     * @return {this} this
     */

  }, {
    key: 'remove',
    value: function remove(object) {
      if (arguments.length > 1) {
        for (var i = 0; i < arguments.length; i++) {
          this.remove(arguments[i]);
        }
        return this;
      }

      if (object.type === 'ARGlue') {
        var name = object.name;
        this.ar_map[name] = null;
      }
      this.scene.remove(object);
      return this;
    }

    /**
     * update tracking-display-object's pose state, poses get from `UC-AR`
     *
     * @param {Array} poses poses matrix array
     */

  }, {
    key: 'updatePoses',
    value: function updatePoses(poses) {
      var _this2 = this;

      poses.forEach(function (_ref) {
        var name = _ref.name,
            matrix = _ref.matrix,
            isDetected = _ref.isDetected;

        var glue = _this2.ar_map[name];
        if (glue) {
          glue.updatePose(matrix, isDetected);
        }
      });
    }

    /**
     * update camera internal parama matrix, this matrix get from `UC-AR`
     *
     * @param {Array} matrix 4*4 matrix
     */

  }, {
    key: 'updateCameraMatrix',
    value: function updateCameraMatrix(matrix) {
      this.camera.projectionMatrix.fromArray(matrix);
    }

    /**
     * adjust viewport, when frameWidth frameHeight or renderer.getSize had change
     * @return {Object} view port
     */

  }, {
    key: 'updateViewport',
    value: function updateViewport() {
      var _effectPack = this.effectPack,
          width = _effectPack.width,
          height = _effectPack.height;

      var rw = width / this.frameWidth;
      var rh = height / this.frameHeight;
      var ratio = Math.max(rw, rh);
      var rtw = this.frameWidth * ratio;
      var rth = this.frameHeight * ratio;

      var sx = 0;
      var sy = 0;

      if (rw < rh) {
        sx = -(rtw - width) / 2;
      } else if (rw > rh) {
        sy = -(rth - height) / 2;
      }

      // this.renderer.setViewport(sx, sy, rtw, rth);
      return { sx: sx, sy: sy, rtw: rtw, rth: rth };
    }

    /**
     * render all scene
     * @param {WebGLRender} renderer renderer context
     * @param {object} session renderer session
     */

  }, {
    key: 'render',
    value: function render(renderer) {
      if (this.autoClear) this.clear(renderer, this.effectPack.renderTarget);

      renderer.render(this.scene, this.camera, this.effectPack.renderTarget);
    }

    /**
     * resize layer size when viewport has change
     * @param {number} width layer buffer width
     * @param {number} height layer buffer height
     */

  }, {
    key: 'setSize',
    value: function setSize(width, height) {
      this.effectPack.setSize(width, height);

      var _updateViewport = this.updateViewport(),
          sx = _updateViewport.sx,
          sy = _updateViewport.sy,
          rtw = _updateViewport.rtw,
          rth = _updateViewport.rth;

      this.effectPack.renderTarget.viewport = new three.Vector4(sx, sy, rtw, rth);
    }
  }]);
  return ARLayer;
}(Layer);

var XRLayer = function (_Layer) {
  inherits(XRLayer, _Layer);

  function XRLayer(options) {
    classCallCheck(this, XRLayer);

    var _this = possibleConstructorReturn(this, (XRLayer.__proto__ || Object.getPrototypeOf(XRLayer)).call(this, options));

    var width = options.width,
        height = options.height,
        vrsensor = options.vrsensor,
        _options$fov = options.fov,
        fov = _options$fov === undefined ? 60 : _options$fov,
        _options$aspect = options.aspect,
        aspect = _options$aspect === undefined ? width / height : _options$aspect,
        _options$near = options.near,
        near = _options$near === undefined ? 0.1 : _options$near,
        _options$far = options.far,
        far = _options$far === undefined ? 1000 : _options$far;
    /**
     * view-port camera object, a perspective camera
     *
     * @member {Camera}
     */

    _this.camera = new three.PerspectiveCamera(fov, aspect, near, far);

    /**
     * stereo camera object
     *
     * @member {StereoCamera}
     */
    _this.stereo = new three.StereoCamera();
    // this.stereo.aspect = options.stereoAspect || 0.5;

    /**
     * use orientation sensor or not
     *
     * @member {Boolean}
     */
    _this.vrsensor = vrsensor || false;

    /**
     * device orientation sensor, control camera look around
     *
     * @member {Orienter}
     */
    _this.sensorCTL = new Orienter();

    // update sensor state before update timeline
    _this.sensorCTL.on('deviceorientation', function (_ref) {
      var quaternion = _ref.quaternion;

      if (_this.vrsensor) {
        _this.camera.quaternion.copy(quaternion);
      }
    });

    _this.interactive = true;
    return _this;
  }

  /**
   * update stereo camera
   */


  createClass(XRLayer, [{
    key: 'updateStereo',
    value: function updateStereo() {
      if (this.camera.parent === null) this.camera.updateMatrixWorld();
      this.stereo.update(this.camera);
    }

    /**
     * render all scene
     * @param {WebGLRender} renderer renderer context
     * @param {object} session renderer session
     */

  }, {
    key: 'render',
    value: function render(renderer, session) {
      if (this.autoClear) this.clear(renderer, this.effectPack.renderTarget);

      if (session.mode === 'VR') {
        this.updateStereo();
        var camera = session.eye === 'LEFT' ? this.stereo.cameraL : this.stereo.cameraR;
        renderer.render(this.scene, camera, this.effectPack.renderTarget);
      } else {
        renderer.render(this.scene, this.camera, this.effectPack.renderTarget);
      }
    }

    /**
     * resize layer size when viewport has change
     * @param {number} width layer buffer width
     * @param {number} height layer buffer height
     */

  }, {
    key: 'setSize',
    value: function setSize(width, height) {
      this.effectPack.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }

    /**
     * getter whether scene interactively or not
     */

  }, {
    key: 'vrmode',
    get: function get$$1() {
      return this._vrmode;
    }

    /**
     * setter whether scene interactively or not
     * @param {Boolean} value is interactively ?
     */
    ,
    set: function set$$1(value) {
      if (value !== this.vrmode) {
        this._vrmode = value;
        this.vrmodeOnChange();
      }
    }
  }]);
  return XRLayer;
}(Layer);

var PrimerLayer = function (_Layer) {
  inherits(PrimerLayer, _Layer);

  function PrimerLayer(options) {
    classCallCheck(this, PrimerLayer);

    /**
     * camera for this 2D context
     *
     * @member {OrthographicCamera}
     */
    var _this = possibleConstructorReturn(this, (PrimerLayer.__proto__ || Object.getPrototypeOf(PrimerLayer)).call(this, options));

    _this.camera = new three.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    return _this;
  }

  /**
   * render all scene
   * @param {WebGLRender} renderer renderer context
   * @param {object} session renderer session
   */


  createClass(PrimerLayer, [{
    key: 'render',
    value: function render(renderer) {
      if (this.autoClear) this.clear(renderer, this.effectPack.renderTarget);
      renderer.render(this.scene, this.camera, this.effectPack.renderTarget);
    }

    /**
     * resize layer size when viewport has change
     * @param {number} width layer buffer width
     * @param {number} height layer buffer height
     */

  }, {
    key: 'setSize',
    value: function setSize(width, height) {
      this.effectPack.setSize(width, height);
      this.scene.children.forEach(function (child) {
        child.setSize && child.setSize(width, height);
      });
    }
  }]);
  return PrimerLayer;
}(Layer);

/**
 * base primer class, provide primering paint
 */

var Primer = function (_Mesh) {
  inherits(Primer, _Mesh);

  /**
   * post some config to primer
   * @param {*} geo have not be used
   * @param {*} mat config primer status
   * @param {*} options config primer status
   */
  function Primer(geo, mat, options) {
    classCallCheck(this, Primer);

    var _this = possibleConstructorReturn(this, (Primer.__proto__ || Object.getPrototypeOf(Primer)).call(this, geo, mat));

    var _options$frameAspect = options.frameAspect,
        frameAspect = _options$frameAspect === undefined ? 1 : _options$frameAspect,
        _options$targetAspect = options.targetAspect,
        targetAspect = _options$targetAspect === undefined ? 1 : _options$targetAspect,
        _options$backgroundSi = options.backgroundSize,
        backgroundSize = _options$backgroundSi === undefined ? 'COVER' : _options$backgroundSi;

    /**
     * frame aspect, same with texture aspect (width / height)
     */

    _this.frameAspect = frameAspect;

    /**
     * viewport aspect, same with viewport aspect (width / height)
     */
    _this.targetAspect = targetAspect;

    /**
     * background aspect, fill with 'COVER' or 'CONTAIN'
     */
    _this.backgroundSize = backgroundSize;
    return _this;
  }

  /**
   * set the target viewport aspect
   * @param {Number} targetAspect target viewport aspect
   */


  createClass(Primer, [{
    key: 'setAspect',
    value: function setAspect(targetAspect) {
      console.trace('aaa');
      this.targetAspect = targetAspect;
      if (this.loaded) this._updateAttributes();
    }

    /**
     * update attribute
     * @private
     */

  }, {
    key: '_updateAttributes',
    value: function _updateAttributes() {
      var _cs2 = this._cs(),
          width = _cs2.width,
          height = _cs2.height;

      this._setPositions(this.geometry.attributes.position, width, height);
    }

    /**
     * calculation the size for geometry in this frameAspect
     * @return {Object} size
     * @private
     */

  }, {
    key: '_cs',
    value: function _cs() {
      var scale = this.frameAspect / this.targetAspect;
      var size = {
        width: 1,
        height: 1
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

  }, {
    key: '_cover',
    value: function _cover(size, scale) {
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

  }, {
    key: '_contain',
    value: function _contain(size, scale) {
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

  }, {
    key: '_setPositions',
    value: function _setPositions(positions, width, height) {
      var coefficient = [-1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0];
      for (var i = 0; i < positions.count; i++) {
        var item = positions.itemSize * i;
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

  }, {
    key: 'setSize',
    value: function setSize(width, height) {
      this.setAspect(width / height);
    }
  }]);
  return Primer;
}(three.Mesh);

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Focus shader
 * based on PaintEffect postprocess from ro.me
 * http://code.google.com/p/3-dreams-of-black/source/browse/deploy/js/effects/PaintEffect.js
 * @private
 */
var YUVShader = {

  texOrder: ['uYTex', 'uUTex', 'uVTex'],

  uniforms: {

    uYTex: { value: null, ss: 1, format: three.LuminanceFormat },
    uUTex: { value: null, ss: 0.5, format: three.LuminanceFormat },
    uVTex: { value: null, ss: 0.5, format: three.LuminanceFormat },

    diffuse: { value: new three.Color(0xffffff) }

  },

  vertexShader: '\n  varying vec2 vUv;\n  void main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }',

  fragmentShader: '\n  uniform sampler2D uYTex;\n  uniform sampler2D uUTex;\n  uniform sampler2D uVTex;\n\n  uniform vec3 diffuse;\n\n  varying vec2 vUv;\n\n  const mat3 mYUV2RGB = mat3(\n    1.0,   1.0,     1.0,\n    0.0,  -0.395,  2.032,\n    1.40, -0.581,   0.0\n  );\n\n  void main(){\n    vec3 YUV;\n    YUV.x = 1.1643 * (texture2D(uYTex, vUv).r - 0.0625);\n    YUV.y = texture2D(uUTex, vUv).r - 0.5;\n    YUV.z = texture2D(uVTex, vUv).r - 0.5;\n\n    gl_FragColor = vec4(diffuse * diffuse * (mYUV2RGB * YUV), 1.0);\n  }'
};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Focus shader
 * based on PaintEffect postprocess from ro.me
 * http://code.google.com/p/3-dreams-of-black/source/browse/deploy/js/effects/PaintEffect.js
 * @private
 */
var YCbCrShader = {

  texOrder: ['uYTex', 'uCTex'],

  uniforms: {

    uYTex: { value: null, ss: 1, format: three.LuminanceFormat },
    uCTex: { value: null, ss: 0.5, format: three.LuminanceAlphaFormat },

    diffuse: { value: new three.Color(0xffffff) }

  },

  vertexShader: '\n  varying vec2 vUv;\n  void main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }',

  fragmentShader: '\n  uniform sampler2D uYTex;\n  uniform sampler2D uCTex;\n  uniform vec3 diffuse;\n\n  varying vec2 vUv;\n\n  const mat3 mYCbCrToRGB = mat3(\n    1.0,      1.0,     1.0,\n    0.0,     -0.18732, 1.8556,\n    1.57481, -.46813,  0.0\n  );\n\n  void main(){\n    vec3 YCbCr;\n    YCbCr.x  = texture2D(uYTex, vUv).r;\n    YCbCr.yz = texture2D(uCTex, vUv).ra - 0.5;\n    gl_FragColor = vec4(diffuse * diffuse * (mYCbCrToRGB * YCbCr), 1.0);\n  }'
};

var FORMAT_MAP = {
  3: YUVShader,
  4: YCbCrShader,
  5: YCbCrShader
};

var LANDSCAPE_MAP = {
  NONE: 0,
  CW: Utils.DTR(-90),
  CCW: Utils.DTR(90)
};

/**
 * camera-primer, for ali webar framework
 */

var CameraPrimer = function (_Primer) {
  inherits(CameraPrimer, _Primer);

  /**
   * required displayTarget to get frame
   * @param {DisplayTarget} displayTarget webar DisplayTarget class
   * @param {Object} options primer config
   * @param {Color} [options.color=0xffffff] tint color
   * @param {Boolean} [options.depthTest=false] enbale depth test
   * @param {Boolean} [options.depthWrite=false] enbale depth write
   */
  function CameraPrimer(displayTarget, options) {
    classCallCheck(this, CameraPrimer);

    var _this = possibleConstructorReturn(this, (CameraPrimer.__proto__ || Object.getPrototypeOf(CameraPrimer)).call(this, displayTarget, options));

    var _ref = options || {},
        _ref$color = _ref.color,
        color = _ref$color === undefined ? 0xffffff : _ref$color,
        _ref$depthTest = _ref.depthTest,
        depthTest = _ref$depthTest === undefined ? false : _ref$depthTest,
        _ref$depthWrite = _ref.depthWrite,
        depthWrite = _ref$depthWrite === undefined ? false : _ref$depthWrite;

    /**
     * frame landscape orientation
     * @member {Number}
     * @private
     */


    _this.landscape = Utils.isString(options.landscape) && LANDSCAPE_MAP[options.landscape] ? LANDSCAPE_MAP[options.landscape] : LANDSCAPE_MAP.CW;

    /**
     * this frame need to flip with y-axis
     * @member {Boolean}
     * @private
     */
    _this.flip = Utils.isBoolean(options.flip) ? options.flip : true;

    /**
     * uv matrix
     * @member {Matrix3}
     * @private
     */
    _this.uvMatrix = new three.Matrix3();

    /**
     * cache the displayTarget
     * @member {DisplayTarget}
     */
    _this.displayTarget = displayTarget;

    /**
     * set primer tint color
     * @member {Color}
     */
    _this.color = color;

    /**
     * whether enbale depth test or not
     * @member {Boolean}
     * @private
     */
    _this._depthTest = depthTest || false;

    /**
     * whether enbale depth write or not
     * @member {Boolean}
     * @private
     */
    _this._depthWrite = depthWrite || false;

    _this.init(_this.getFrames());
    return _this;
  }

  /**
   * get frame data from displayTarget
   * @return {frameData} camera frame data
   */


  createClass(CameraPrimer, [{
    key: 'getFrames',
    value: function getFrames() {
      return this.displayTarget.getFrames();
    }

    /**
     * init set something
     * @param {frameData} frameData camera frame data
     * @private
     */

  }, {
    key: 'init',
    value: function init(_ref2) {
      var _this2 = this;

      var format = _ref2.format,
          dataArray = _ref2.dataArray,
          width = _ref2.width,
          height = _ref2.height;

      this.shader = FORMAT_MAP[format];

      this.uniforms = three.UniformsUtils.clone(this.shader.uniforms);

      this.shader.texOrder.forEach(function (tex, idx) {
        var _uniforms$tex = _this2.uniforms[tex],
            ss = _uniforms$tex.ss,
            format = _uniforms$tex.format;

        _this2.uniforms[tex].value = new three.DataTexture(dataArray[idx], width * ss, height * ss, format);
      });

      this.uniforms.diffuse.value = new three.Color(this.color);

      this.pigmentMat = new three.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: this.shader.vertexShader,
        fragmentShader: this.shader.fragmentShader,
        depthTest: this._depthTest,
        depthWrite: this._depthWrite
      });

      this.pigment = new three.Mesh(this.pigmentGeo, this.pigmentMat);
      this.pigment.frustumCulled = false;

      this._correctUv(this.pigmentGeo.attributes.uv);

      this.scene.add(this.pigment);

      this._setAspect(height / width);
    }

    /**
     * update shader uniforms and aspect itself
     * @param {frameData} frameData camera frame data
     * @private
     */

  }, {
    key: 'updateFrame',
    value: function updateFrame(_ref3) {
      var _this3 = this;

      var dataArray = _ref3.dataArray,
          width = _ref3.width,
          height = _ref3.height;

      this.shader.texOrder.forEach(function (tex, idx) {
        if (_this3.uniforms[tex].value.needsUpdate) return;
        var ss = _this3.uniforms[tex].ss;

        _this3.uniforms[tex].value.image.data = dataArray[idx];
        _this3.uniforms[tex].value.image.width = width * ss;
        _this3.uniforms[tex].value.image.height = height * ss;
        _this3.uniforms[tex].value.needsUpdate = true;
      });
      this._setAspect(height / width);
    }

    /**
     * update attribute and frame
     */

  }, {
    key: 'update',
    value: function update() {
      if (this.autoCover) this._updateAttributes();
      if (!this.displayTarget.isDirty) return;
      this.updateFrame(this.getFrames());
    }

    /**
     * render this primer
     * @param {WebGLRenderer} renderer put webgl renderer
     * @param {WebGLRenderTarget} rednerTarget render to which buffer
     */

  }, {
    key: 'render',
    value: function render(renderer, rednerTarget) {
      this.update();
      renderer.render(this.scene, this.camera, rednerTarget);
    }

    /**
     * correct uv buffer
     * @param {BufferAttribute} uv uv bufferAttribute
     * @return {BufferAttribute} corrected BufferAttribute
     */

  }, {
    key: '_correctUv',
    value: function _correctUv(uv) {
      var v1 = new three.Vector3();
      this.uvMatrix.identity();
      this.uvMatrix.translate(-0.5, -0.5);
      this.uvMatrix.rotate(this.landscape);
      if (this.flip) this.uvMatrix.scale(1, -1);
      this.uvMatrix.translate(0.5, 0.5);
      for (var i = 0, l = uv.count; i < l; i++) {
        v1.x = uv.getX(i);
        v1.y = uv.getY(i);
        v1.z = 1;

        v1.applyMatrix3(this.uvMatrix);
        uv.setXY(i, v1.x, v1.y);
      }
      uv.needsUpdate = true;
      return uv;
    }
  }]);
  return CameraPrimer;
}(Primer);

/**
 * texture-primer, for Texture CanvasTexture VideoTexture
 */

var TexturePrimer = function (_Primer) {
  inherits(TexturePrimer, _Primer);

  /**
   * create a texture frame
   * @param {image|canvas|video} frame texture frame
   * @param {Object} options config
   * @param {Color} [options.color=0xffffff] tint color
   * @param {Boolean} [options.depthTest=false] enable depth test
   * @param {Boolean} [options.depthWrite=false] enable depth write
   * @param {THREE.Filter} [options.minFilter] use which min filter
   * @param {THREE.Filter} [options.magFilter] use which mag filter
   * @param {THREE.Format} [options.format] use which color format
   */
  function TexturePrimer(frame, options) {
    classCallCheck(this, TexturePrimer);

    var _ref = options || {},
        _ref$color = _ref.color,
        color = _ref$color === undefined ? 0xffffff : _ref$color,
        _ref$depthTest = _ref.depthTest,
        depthTest = _ref$depthTest === undefined ? false : _ref$depthTest,
        _ref$depthWrite = _ref.depthWrite,
        depthWrite = _ref$depthWrite === undefined ? false : _ref$depthWrite,
        _ref$minFilter = _ref.minFilter,
        minFilter = _ref$minFilter === undefined ? three.LinearFilter : _ref$minFilter,
        _ref$magFilter = _ref.magFilter,
        magFilter = _ref$magFilter === undefined ? three.LinearFilter : _ref$magFilter,
        _ref$format = _ref.format,
        format = _ref$format === undefined ? three.RGBFormat : _ref$format;

    var texture = Utils.isString(frame) ? new three.TextureLoader().load(frame) : frame.tagName === 'VIDEO' ? new three.VideoTexture(frame) : frame.tagName === 'CANVAS' ? new three.CanvasTexture(frame) : frame.tagName === 'IMG' ? new three.Texture(frame) : null;

    /**
     * geometry for this 2D context
     * @member {PlaneBufferGeometry}
     * @private
     */
    var geo = new three.PlaneBufferGeometry(2, 2);

    /**
     * material for this 2D context
     * @member {MeshBasicMaterial}
     * @private
     */
    var mat = new three.MeshBasicMaterial({
      color: new three.Color(color),
      map: texture,
      depthTest: depthTest,
      depthWrite: depthWrite
    });

    /**
     * this primer used texture
     */
    var _this = possibleConstructorReturn(this, (TexturePrimer.__proto__ || Object.getPrototypeOf(TexturePrimer)).call(this, geo, mat, options));

    _this.texture = texture;

    if (minFilter) _this.texture.minFilter = minFilter;
    if (magFilter) _this.texture.magFilter = magFilter;
    if (format) _this.texture.format = format;

    /**
     * texture had loaded ?
     */
    _this.loaded = false;

    _this._gainFrameSize();
    return _this;
  }

  /**
   * gain frame size, and to adjust aspect
   */


  createClass(TexturePrimer, [{
    key: '_gainFrameSize',
    value: function _gainFrameSize() {
      var _this2 = this;

      var image = this.texture.image;
      if (!image) return;
      if (image.width > 0 && image.height > 0) {
        this.loaded = true;
        this.frameAspect = image.width / image.height;
        this._updateAttributes();
      } else {
        image.addEventListener('load', function () {
          _this2.loaded = true;
          _this2.frameAspect = image.width / image.height;
          _this2._updateAttributes();
        });
      }
    }
  }]);
  return TexturePrimer;
}(Primer);

/**
 * anchor class, help your to bind interaction event
 */

var AnchorBase = function (_Group) {
  inherits(AnchorBase, _Group);

  function AnchorBase() {
    classCallCheck(this, AnchorBase);
    return possibleConstructorReturn(this, (AnchorBase.__proto__ || Object.getPrototypeOf(AnchorBase)).apply(this, arguments));
  }

  createClass(AnchorBase, [{
    key: 'putWhere',

    /**
     * help you caculate anchor position, relative which parent
     *
     * @param {Vector3} point global position relative camera
     * @param {Object3D} parent relative which parent
     * @return {Vector3} position relative parent coordinate system
     */
    value: function putWhere(point, parent) {
      point.multiplyScalar(0.9);
      point.applyMatrix4(new three.Matrix4().getInverse(parent.matrixWorld));
      this.position.set(point.x, point.y, point.z);
      this.lookAt(0, 0, 0);
      return point;
    }

    /**
     * put anchor to which posotion, position was relative it's parent
     *
     * @param {Vector3} position position was relative it's parent
     */

  }, {
    key: 'putHere',
    value: function putHere(position) {
      this.position.set(position.x, position.y, position.z);
      this.lookAt(0, 0, 0);
    }
  }]);
  return AnchorBase;
}(three.Group);

/**
 * anchor class, help your to bind interaction event
 */

var AnchorRippling = function (_AnchorBase) {
  inherits(AnchorRippling, _AnchorBase);

  /**
   * 构造函数
   * @param {Object} options 配置
   * @param {String} [options.image] 点击区域的半径
   * @param {Number} [options.width=8] 点击区域的半径
   * @param {Number} [options.height=8] 点击区域的半径
   * @param {Number} [options.segmentation=4] 点击区域的圆细分
   * @param {Boolean} [options.rippling=false] 点击区域的圆细分
   * @param {Number} [options.radius=8] 点击区域的半径
   * @param {Number} [options.segmentationRip=8] 点击区域的半径
   * @param {Color} [options.color=0xffffff] 点击区域的圆细分
   * @param {Number} [options.count=2] 点击区域的圆细分
   * @param {Number} [options.duration=1000] 点击区域的圆细分
   */
  function AnchorRippling(options) {
    classCallCheck(this, AnchorRippling);

    var _this = possibleConstructorReturn(this, (AnchorRippling.__proto__ || Object.getPrototypeOf(AnchorRippling)).call(this));

    var _ref = options || {},
        image = _ref.image,
        width = _ref.width,
        height = _ref.height,
        _ref$segmentation = _ref.segmentation,
        segmentation = _ref$segmentation === undefined ? 4 : _ref$segmentation,
        rippling = _ref.rippling,
        _ref$radius = _ref.radius,
        radius = _ref$radius === undefined ? 8 : _ref$radius,
        _ref$segmentationRip = _ref.segmentationRip,
        segmentationRip = _ref$segmentationRip === undefined ? 16 : _ref$segmentationRip,
        color = _ref.color,
        _ref$count = _ref.count,
        count = _ref$count === undefined ? 2 : _ref$count,
        _ref$duration = _ref.duration,
        duration = _ref$duration === undefined ? 1800 : _ref$duration;
    /**
     * global texture for stars
     * @member {Texture}
     */


    _this.map = Utils.isString(image) ? new three.TextureLoader().load(image) : null;

    _this.waves = new three.Group();
    _this.waves.position.z = -0.1;
    _this.uiFace = new three.Mesh(new three.PlaneBufferGeometry(width, height, segmentation, segmentation), new three.MeshBasicMaterial({ map: _this.map, transparent: true }));

    if (rippling) _this.initRippling(radius, segmentationRip, color, count, duration);

    _this.add(_this.uiFace);
    return _this;
  }

  createClass(AnchorRippling, [{
    key: 'initRippling',
    value: function initRippling(radius, segmentation, color, count, duration) {
      var waitTime = duration / count;
      for (var i = 0; i <= count; i++) {
        var last = i === count;
        var circle = new three.Mesh(new three.CircleBufferGeometry(radius, segmentation), new three.MeshBasicMaterial({ color: new three.Color(color), transparent: true, depthTest: false }));
        if (!last) {
          var wait = waitTime * i;
          circle.runners({
            runners: [{ from: { 'material.opacity': 0.1 }, to: { scaleXYZ: 1.25, 'material.opacity': 0.5 }, duration: duration * 0.4, ease: Tween.Linear.None }, { to: { scaleXYZ: 1.5, 'material.opacity': 0 }, duration: duration * 0.6, ease: Tween.Linear.None }],
            wait: wait,
            infinite: true
          });
        }

        this.waves.add(circle);
      }
      this.add(this.waves);
    }
  }]);
  return AnchorRippling;
}(AnchorBase);

var RATIO = 0.15;
var RANGE = 60;
var PI2 = Math.PI * 2;
var START = new three.Vector2();
var END = new three.Vector2();
var UP = new three.Vector3(0, 1, 0);

/**
 * 球面全景图组件，快速实现可交互的全景图
 */

var SphereWorld = function (_Object3D) {
  inherits(SphereWorld, _Object3D);

  /**
   * 构造函数
   * @param {Object} options 配置
   * @param {String} options.url 球面全景图的链接地址
   * @param {Boolean} [options.flipX=true] 球面全景图纹理是否做水平翻转
   * @param {Boolean} [options.flipY=false] 球面全景图纹理是否做垂直翻转
   * @param {Boolean} [options.draggable=true] 球面全景图是否可拖拽
   * @param {Number} [options.rangeMin=-60] Y轴拖拽的范围限制下限
   * @param {Number} [options.rangeMax=60] Y轴拖拽的范围限制上限
   * @param {Number} [options.driftX=0] 相对于摄像机的X轴旋转的修正角度
   * @param {Number} [options.driftY=0] 相对于摄像机的Y轴旋转的修正角度
   * @param {Number} [options.rotateSpeed=1] 球面全景图的旋转灵敏度
   * @param {Number} [options.radius=1000] 球面全景图的球体半径
   * @param {Number} [options.segmentationX=32] 球面全景图的球面横轴细分
   * @param {Number} [options.segmentationY=32] 球面全景图的球面纵轴细分
   */
  function SphereWorld(_ref) {
    var url = _ref.url,
        radius = _ref.radius,
        segmentationX = _ref.segmentationX,
        segmentationY = _ref.segmentationY,
        flipX = _ref.flipX,
        flipY = _ref.flipY,
        draggable = _ref.draggable,
        rotateSpeed = _ref.rotateSpeed,
        rangeMin = _ref.rangeMin,
        rangeMax = _ref.rangeMax,
        driftX = _ref.driftX,
        driftY = _ref.driftY;
    classCallCheck(this, SphereWorld);

    var _this = possibleConstructorReturn(this, (SphereWorld.__proto__ || Object.getPrototypeOf(SphereWorld)).call(this));

    _this.needCamera = true;

    _this.needMount = true;

    _this.inner = new three.Group();
    _this.camera = null;

    radius = radius || 1000;
    segmentationX = segmentationX || 32;
    segmentationY = segmentationY || 32;
    driftX = Utils.isNumber(driftX) ? driftX : 0;
    driftY = Utils.isNumber(driftY) ? driftY : 0;

    _this.background = new three.Mesh(new three.SphereBufferGeometry(radius, segmentationX, segmentationY), new three.MeshBasicMaterial({ map: new three.TextureLoader().load(url), side: three.DoubleSide }));

    flipX = Utils.isBoolean(flipX) ? flipX : true;
    flipY = Utils.isBoolean(flipY) ? flipY : false;
    if (flipX) {
      _this.background.scale.x = -1;
    }
    if (flipY) {
      _this.background.scale.y = -1;
    }

    _this.inner.add(_this.background);
    get(SphereWorld.prototype.__proto__ || Object.getPrototypeOf(SphereWorld.prototype), 'add', _this).call(_this, _this.inner);

    _this._onStart = _this._onStart.bind(_this);
    _this._onMove = _this._onMove.bind(_this);
    _this._onEnd = _this._onEnd.bind(_this);
    _this._draggable = false;
    _this._dragX = 0;
    _this.updateTracking = _this.updateTracking.bind(_this);
    _this.rotateSpeed = rotateSpeed || 1;
    _this.cx = 0;
    _this.cy = 0;
    _this.rangeMin = rangeMin || Utils.DTR(-RANGE);
    _this.rangeMax = rangeMax || Utils.DTR(RANGE);
    _this.eared = false;
    _this.draggable = Utils.isBoolean(draggable) ? draggable : true;
    _this.updateDrag({
      dragY: driftX,
      dragX: driftY
    });
    return _this;
  }

  /**
   * set camera
   * @param {PerspectiveCamera} camera scene camera, panorama need get camera pose state
   */


  createClass(SphereWorld, [{
    key: 'setCamera',
    value: function setCamera(camera) {
      if (camera instanceof three.Camera) {
        this.camera = camera;
      }
    }
  }, {
    key: 'onDragChange',
    value: function onDragChange() {
      if (this.draggable) {
        this.on('pretimeline', this.updateTracking);
        this.addEvents();
      } else {
        this.off('pretimeline', this.updateTracking);
        this.removeEvents();
      }
    }
  }, {
    key: 'addEvents',
    value: function addEvents() {
      if (this.eared) return;
      this.on('touchstart', this._onStart);
      this.on('touchmove', this._onMove);
      this.on('touchend', this._onEnd);
      this.on('mousedown', this._onStart);
      this.on('mousemove', this._onMove);
      this.on('mouseup', this._onEnd);
      this.eared = true;
    }
  }, {
    key: 'removeEvents',
    value: function removeEvents() {
      this.off('touchstart', this._onStart);
      this.off('touchmove', this._onMove);
      this.off('touchend', this._onEnd);
      this.off('mousedown', this._onStart);
      this.off('mousemove', this._onMove);
      this.off('mouseup', this._onEnd);
      this.eared = false;
    }
  }, {
    key: '_onStart',
    value: function _onStart(ev) {
      var originalEvent = ev.data.originalEvent;
      if (originalEvent.touches && originalEvent.touches.length > 1) return;
      this.hadStart = true;
      if (originalEvent.touches) {
        START.x = originalEvent.touches[0].pageX;
        START.y = originalEvent.touches[0].pageY;
      } else {
        START.x = originalEvent.pageX;
        START.y = originalEvent.pageY;
      }
      this.cx = this.dragX;
      this.cy = this.inner.rotation.y;
    }
  }, {
    key: '_onMove',
    value: function _onMove(ev) {
      var originalEvent = ev.data.originalEvent;
      if (!this.hadStart || originalEvent.touches && originalEvent.touches.length > 1) return;
      originalEvent.preventDefault();
      if (originalEvent.touches) {
        END.x = originalEvent.touches[0].pageX;
        END.y = originalEvent.touches[0].pageY;
      } else {
        END.x = originalEvent.pageX;
        END.y = originalEvent.pageY;
      }
      END.sub(START);

      var x = END.y * RATIO * this.rotateSpeed;
      var y = END.x * RATIO * this.rotateSpeed;

      var dragX = this.cx + Utils.DTR(x);
      var dragY = this.cy - Utils.DTR(y);
      this.updateDrag({
        dragX: dragX,
        dragY: dragY
      });
    }
  }, {
    key: '_onEnd',
    value: function _onEnd() {
      this.hadStart = false;
      this.cx = this.dragX;
      this.cy = this.dragY;
    }
  }, {
    key: 'updateDrag',
    value: function updateDrag(_ref2) {
      var dragX = _ref2.dragX,
          dragY = _ref2.dragY;

      this.dragX = Utils.isNumber(dragX) ? dragX : this.dragX;
      this.dragY = Utils.isNumber(dragY) ? dragY : this.dragY;
    }
  }, {
    key: 'updateTracking',
    value: function updateTracking() {
      if (!this.camera) return;
      var vector = new three.Vector3(0, 0, -1);
      vector.applyQuaternion(this.camera.quaternion);
      this.quaternion.setFromAxisAngle(new three.Vector3().crossVectors(UP, vector), this.dragX);
    }

    /**
     * 添加绘制对象
     *
     * @param {THREE.Object3D} child 添加的绘制对象
     */

  }, {
    key: 'add',
    value: function add() {
      this.inner.add.apply(this.inner, arguments);
    }

    /**
     * 移除绘制对象
     *
     * @param {THREE.Object3D} child 之前添加的绘制对象
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.inner.remove.apply(this.inner, arguments);
    }

    /**
     * getter whether draggable or not
     */

  }, {
    key: 'draggable',
    get: function get$$1() {
      return this._draggable;
    }

    /**
     * setter whether draggable or not
     * @param {Boolean} value whether or not
     */
    ,
    set: function set$$1(value) {
      if (value !== this._draggable) {
        this._draggable = value;
        this.onDragChange();
      }
    }

    /**
     * getter dragX of this panorama
     */

  }, {
    key: 'dragX',
    get: function get$$1() {
      return this._dragX;
    }

    /**
     * setter dragX of this panorama
     * @param {Number} radian rotation radian
     */
    ,
    set: function set$$1(radian) {
      radian = Utils.clamp(radian, this.rangeMin, this.rangeMax);
      if (radian !== this._dragX) {
        this._dragX = radian;
      }
    }

    /**
     * getter dragY of this panorama
     */

  }, {
    key: 'dragY',
    get: function get$$1() {
      return this.inner.rotation.y;
    }

    /**
     * setter dragY of this panorama
     * @param {Number} radian rotation radian
     */
    ,
    set: function set$$1(radian) {
      radian = Utils.euclideanModulo(radian, PI2);
      if (radian !== this.inner.rotation.y) {
        this.inner.rotation.y = radian;
      }
    }
  }]);
  return SphereWorld;
}(three.Object3D);

var RATIO$1 = 0.15;
var RANGE$1 = 50;
var START$1 = new three.Vector2();
var END$1 = new three.Vector2();

/**
 * 柱面全景图组件，快速实现可交互的全景图
 */

var CylinderWorld = function (_Object3D) {
  inherits(CylinderWorld, _Object3D);

  /**
   * 构造函数
   * @param {Object} options 配置
   * @param {String} options.url 柱面全景图的链接地址
   * @param {Number} [options.radius=512] 柱面全景图的球体半径
   * @param {Number} [options.height=1000] 柱面全景图的球体半径
   * @param {Number} [options.radiusSegments=64] 柱面全景图的柱面横轴细分
   * @param {Number} [options.heightSegments=1] 柱面全景图的柱面纵轴细分
   * @param {Boolean} [options.draggable=true] 柱面全景图是否可拖拽
   * @param {Number} [options.zoomIn=true] 是否开启景深变化的效果
   * @param {Number} [options.rangeMin=-50] 相对于摄像机的X轴旋转的范围限制下限
   * @param {Number} [options.rangeMax=50] 相对于摄像机的X轴旋转的范围限制上限
   * @param {Number} [options.driftX=0] 相对于摄像机的X轴旋转的修正角度
   * @param {Number} [options.driftY=0] 相对于摄像机的Y轴旋转的修正角度
   * @param {Number} [options.rotateSpeed=1] 柱面全景图的拖拽灵敏度
   * @param {Number} [options.strength=0.3] 柱面全景图的陀螺仪灵敏度
   * @param {Number} [options.viscosity=0.1] 平滑过渡的粘性
   * @param {Number} [options.openEnded=true] 柱面全景图的两端是否开放
   * @param {Boolean} [options.flipX=true] 柱面全景图纹理是否做水平翻转
   * @param {Boolean} [options.flipY=false] 柱面全景图纹理是否做垂直翻转
   */
  function CylinderWorld(_ref) {
    var url = _ref.url,
        radius = _ref.radius,
        height = _ref.height,
        radiusSegments = _ref.radiusSegments,
        heightSegments = _ref.heightSegments,
        openEnded = _ref.openEnded,
        flipX = _ref.flipX,
        flipY = _ref.flipY,
        draggable = _ref.draggable,
        zoomIn = _ref.zoomIn,
        rotateSpeed = _ref.rotateSpeed,
        strength = _ref.strength,
        viscosity = _ref.viscosity,
        rangeMin = _ref.rangeMin,
        rangeMax = _ref.rangeMax,
        driftX = _ref.driftX,
        driftY = _ref.driftY;
    classCallCheck(this, CylinderWorld);

    var _this = possibleConstructorReturn(this, (CylinderWorld.__proto__ || Object.getPrototypeOf(CylinderWorld)).call(this));

    _this.needMount = true;

    radius = radius || 512;
    height = height || 1000;
    radiusSegments = radiusSegments || 64;
    heightSegments = heightSegments || 1;
    openEnded = Utils.isBoolean(openEnded) ? openEnded : true;

    _this.background = new three.Mesh(new three.CylinderBufferGeometry(radius, radius, height, radiusSegments, heightSegments, openEnded), new three.MeshBasicMaterial({ map: new three.TextureLoader().load(url), side: three.DoubleSide }));

    flipX = Utils.isBoolean(flipX) ? flipX : true;
    flipY = Utils.isBoolean(flipY) ? flipY : false;
    if (flipX) {
      _this.background.scale.x = -1;
    }
    if (flipY) {
      _this.background.scale.y = -1;
    }

    _this.add(_this.background);

    _this._onStart = _this._onStart.bind(_this);
    _this._onMove = _this._onMove.bind(_this);
    _this._onEnd = _this._onEnd.bind(_this);

    _this._draggable = false;

    _this.rotateSpeed = rotateSpeed || 1;
    _this.strength = strength || 0.3;
    _this.viscosity = viscosity || 0.1;
    _this.rangeMin = rangeMin || -RANGE$1;
    _this.rangeMax = rangeMax || RANGE$1;
    _this.eared = false;
    _this.draggable = Utils.isBoolean(draggable) ? draggable : true;
    _this.zoomIn = Utils.isBoolean(zoomIn) ? zoomIn : true;

    _this.gyro = new Orienter();
    _this.drag = new three.Vector3();
    _this.updateDrag = _this.updateDrag.bind(_this);
    _this.on('pretimeline', _this.updateDrag);

    _this.driftX = Utils.isNumber(driftX) ? driftX : 0;
    _this.driftY = Utils.isNumber(driftY) ? driftY : 0;
    return _this;
  }

  createClass(CylinderWorld, [{
    key: 'onDragChange',
    value: function onDragChange() {
      if (this.draggable) {
        this.addEvents();
      } else {
        this.removeEvents();
      }
    }
  }, {
    key: 'addEvents',
    value: function addEvents() {
      if (this.eared) return;
      this.on('touchstart', this._onStart);
      this.on('touchmove', this._onMove);
      this.on('touchend', this._onEnd);
      this.on('mousedown', this._onStart);
      this.on('mousemove', this._onMove);
      this.on('mouseup', this._onEnd);
      this.eared = true;
    }
  }, {
    key: 'removeEvents',
    value: function removeEvents() {
      this.off('touchstart', this._onStart);
      this.off('touchmove', this._onMove);
      this.off('touchend', this._onEnd);
      this.off('mousedown', this._onStart);
      this.off('mousemove', this._onMove);
      this.off('mouseup', this._onEnd);
      this.eared = false;
    }
  }, {
    key: '_onStart',
    value: function _onStart(ev) {
      var originalEvent = ev.data.originalEvent;
      if (originalEvent.touches && originalEvent.touches.length > 1) return;
      this.hadStart = true;
      if (originalEvent.touches) {
        START$1.x = originalEvent.touches[0].pageX;
        START$1.y = originalEvent.touches[0].pageY;
      } else {
        START$1.x = originalEvent.pageX;
        START$1.y = originalEvent.pageY;
      }
    }
  }, {
    key: '_onMove',
    value: function _onMove(ev) {
      var originalEvent = ev.data.originalEvent;
      if (!this.hadStart || originalEvent.touches && originalEvent.touches.length > 1) return;
      originalEvent.preventDefault();
      if (originalEvent.touches) {
        END$1.x = originalEvent.touches[0].pageX;
        END$1.y = originalEvent.touches[0].pageY;
      } else {
        END$1.x = originalEvent.pageX;
        END$1.y = originalEvent.pageY;
      }
      var DIFF = new three.Vector2().copy(END$1).sub(START$1).multiplyScalar(RATIO$1 * this.rotateSpeed);
      this.drag.x = Utils.clamp(this.drag.x - DIFF.y, this.rangeMin, this.rangeMax);
      this.drag.y = Utils.euclideanModulo(this.drag.y - DIFF.x, 360);
      START$1.copy(END$1);
    }
  }, {
    key: '_onEnd',
    value: function _onEnd() {
      this.hadStart = false;
    }
  }, {
    key: 'updateDrag',
    value: function updateDrag() {
      var target = Utils.euclideanModulo(this.drag.y - this.gyro.lon, 360);
      var breaking = target - this.dragY;
      var compensate = 0;
      if (breaking > 180) compensate = 360;
      if (breaking < -180) compensate = -360;
      var speed = new three.Vector2(this.drag.x - this.gyro.lat * this.strength - this.dragX, target - (this.dragY + compensate));

      if (this.zoomIn) {
        var zoomIn = -Utils.clamp(Math.abs(5 * speed.length()), 0, 200) - this.position.z;
        this.position.z += zoomIn * this.viscosity * 2;
      } else {
        this.position.z = 0;
      }

      if (Math.abs(speed.y) > 1) {
        this.dragY += speed.y * this.viscosity;
      }
      if (Math.abs(speed.x) > 1) {
        this.dragX += speed.x * this.viscosity;
      }
    }

    /**
     * getter whether draggable or not
     */

  }, {
    key: 'draggable',
    get: function get$$1() {
      return this._draggable;
    }

    /**
     * setter whether draggable or not
     * @param {Boolean} value whether or not
     */
    ,
    set: function set$$1(value) {
      if (value !== this._draggable) {
        this._draggable = value;
        this.onDragChange();
      }
    }

    /**
     * getter dragX of this panorama
     */

  }, {
    key: 'dragX',
    get: function get$$1() {
      return Utils.RTD(this.rotation.x);
    }

    /**
     * setter dragX of this panorama
     * @param {Number} degree rotation degree
     */
    ,
    set: function set$$1(degree) {
      degree = Utils.clamp(degree, -90, 90);
      if (degree !== this.dragX) {
        this.rotation.x = Utils.DTR(degree);
      }
    }

    /**
     * getter dragY of this panorama
     */

  }, {
    key: 'dragY',
    get: function get$$1() {
      return Utils.RTD(this.rotation.y);
    }

    /**
     * setter dragY of this panorama
     * @param {Number} degree rotation degree
     */
    ,
    set: function set$$1(degree) {
      degree = Utils.euclideanModulo(degree, 360);
      if (degree !== this.dragY) {
        this.rotation.y = Utils.DTR(degree);
      }
    }

    /**
     * getter driftY of this panorama
     */

  }, {
    key: 'driftY',
    get: function get$$1() {
      return Utils.RTD(this.background.rotation.y);
    }

    /**
     * setter driftY of this panorama
     * @param {Number} degree rotation degree
     */
    ,
    set: function set$$1(degree) {
      degree = Utils.euclideanModulo(degree, 360);
      if (degree !== this.driftY) {
        this.background.rotation.y = Utils.DTR(degree);
      }
    }

    /**
     * getter driftX of this panorama
     */

  }, {
    key: 'driftX',
    get: function get$$1() {
      return this.drag.x;
    }

    /**
     * setter driftX of this panorama
     * @param {Number} degree rotation degree
     */
    ,
    set: function set$$1(degree) {
      degree = Utils.clamp(degree, this.rangeMin, this.rangeMax);
      if (degree !== this.driftX) {
        this.drag.x = degree;
      }
    }
  }]);
  return CylinderWorld;
}(three.Object3D);

// const BINARY_EXTENSION_BUFFER_NAME = 'binary_glTF';
var BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
var BINARY_EXTENSION_HEADER_LENGTH = 12;
var BINARY_EXTENSION_CHUNK_TYPES = {
  JSON: 0x4E4F534A,
  BIN: 0x004E4942
};

var EXTENSIONS = {
  KHR_BINARY_GLTF: 'KHR_binary_glTF',
  KHR_LIGHTS: 'KHR_lights',
  KHR_MATERIALS_COMMON: 'KHR_materials_common',
  KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS: 'KHR_materials_pbrSpecularGlossiness'
};

function GLTFLoader(manager) {

  this.manager = manager !== undefined ? manager : three.DefaultLoadingManager;
}

GLTFLoader.prototype = {

  constructor: GLTFLoader,

  crossOrigin: 'Anonymous',

  load: function load(url, onLoad, onProgress, onError) {

    var scope = this;

    var path = this.path && typeof this.path === 'string' ? this.path : three.Loader.prototype.extractUrlBase(url);

    var loader = new three.FileLoader(scope.manager);

    loader.setResponseType('arraybuffer');

    loader.load(url, function (data) {

      try {

        scope.parse(data, path, onLoad, onError);
      } catch (e) {

        // For SyntaxError or TypeError, return a generic failure message.
        onError(e.constructor === Error ? e : new Error('GLTFLoader: Unable to parse model.'));
      }
    }, onProgress, onError);
  },
  setCrossOrigin: function setCrossOrigin(value) {

    this.crossOrigin = value;
  },
  setPath: function setPath(value) {

    this.path = value;
  },
  parse: function parse(data, path, onLoad, onError) {

    var content = void 0;
    var extensions = {};

    var magic = convertUint8ArrayToString(new Uint8Array(data, 0, 4));

    if (magic === BINARY_EXTENSION_HEADER_MAGIC) {

      extensions[EXTENSIONS.KHR_BINARY_GLTF] = new GLTFBinaryExtension(data);
      content = extensions[EXTENSIONS.KHR_BINARY_GLTF].content;
    } else {

      content = convertUint8ArrayToString(new Uint8Array(data));
    }

    var json = JSON.parse(content);

    if (json.asset === undefined || json.asset.version[0] < 2) {

      onError(new Error('GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.'));
      return;
    }

    if (json.extensionsUsed) {

      if (json.extensionsUsed.indexOf(EXTENSIONS.KHR_LIGHTS) >= 0) {

        extensions[EXTENSIONS.KHR_LIGHTS] = new GLTFLightsExtension(json);
      }

      if (json.extensionsUsed.indexOf(EXTENSIONS.KHR_MATERIALS_COMMON) >= 0) {

        extensions[EXTENSIONS.KHR_MATERIALS_COMMON] = new GLTFMaterialsCommonExtension(json);
      }

      if (json.extensionsUsed.indexOf(EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS) >= 0) {

        extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS] = new GLTFMaterialsPbrSpecularGlossinessExtension();
      }
    }

    console.time('GLTFLoader');

    var parser = new GLTFParser(json, extensions, {

      path: path || this.path,
      crossOrigin: this.crossOrigin

    });

    parser.parse(function (scene, scenes, cameras, animations) {

      console.timeEnd('GLTFLoader');

      var glTF = {
        scene: scene,
        scenes: scenes,
        cameras: cameras,
        animations: animations
      };

      onLoad(glTF);
    }, onError);
  }
};

/* GLTFREGISTRY */

function GLTFRegistry() {

  var objects = {};

  return {
    get: function get(key) {

      return objects[key];
    },
    add: function add(key, object) {

      objects[key] = object;
    },
    remove: function remove(key) {

      delete objects[key];
    },
    removeAll: function removeAll() {

      objects = {};
    },
    update: function update(scene, camera) {

      for (var name in objects) {

        var object = objects[name];

        if (object.update) {

          object.update(scene, camera);
        }
      }
    }
  };
}

/**
 * Lights Extension
 *
 * Specification: PENDING
 * @param {Object} json config
 */
function GLTFLightsExtension(json) {

  this.name = EXTENSIONS.KHR_LIGHTS;

  this.lights = {};

  var extension = json.extensions && json.extensions[EXTENSIONS.KHR_LIGHTS] || {};
  var lights = extension.lights || {};

  for (var lightId in lights) {

    var light = lights[lightId];
    var lightNode = void 0;

    var color = new three.Color().fromArray(light.color);

    switch (light.type) {

      case 'directional':
        lightNode = new three.DirectionalLight(color);
        lightNode.position.set(0, 0, 1);
        break;

      case 'point':
        lightNode = new three.PointLight(color);
        break;

      case 'spot':
        lightNode = new three.SpotLight(color);
        lightNode.position.set(0, 0, 1);
        break;

      case 'ambient':
        lightNode = new three.AmbientLight(color);
        break;

      default:
        break;

    }

    if (lightNode) {

      if (light.constantAttenuation !== undefined) {

        lightNode.intensity = light.constantAttenuation;
      }

      if (light.linearAttenuation !== undefined) {

        lightNode.distance = 1 / light.linearAttenuation;
      }

      if (light.quadraticAttenuation !== undefined) {

        lightNode.decay = light.quadraticAttenuation;
      }

      if (light.fallOffAngle !== undefined) {

        lightNode.angle = light.fallOffAngle;
      }

      if (light.fallOffExponent !== undefined) {

        console.warn('GLTFLoader:: light.fallOffExponent not currently supported.');
      }

      lightNode.name = light.name || 'light_' + lightId;
      this.lights[lightId] = lightNode;
    }
  }
}

/**
 * Common Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/Khronos/KHR_materials_common
 */
function GLTFMaterialsCommonExtension() {

  this.name = EXTENSIONS.KHR_MATERIALS_COMMON;
}

GLTFMaterialsCommonExtension.prototype.getMaterialType = function (material) {

  var khrMaterial = material.extensions[this.name];

  switch (khrMaterial.type) {

    case 'commonBlinn':
    case 'commonPhong':
      return three.MeshPhongMaterial;

    case 'commonLambert':
      return three.MeshLambertMaterial;

    case 'commonConstant':
    default:
      return three.MeshBasicMaterial;

  }
};

GLTFMaterialsCommonExtension.prototype.extendParams = function (materialParams, material, parser) {

  var khrMaterial = material.extensions[this.name];

  var pending = [];

  var keys = [];

  // TODO: Currently ignored: 'ambientFactor', 'ambientTexture'
  switch (khrMaterial.type) {

    case 'commonBlinn':
    case 'commonPhong':
      keys.push('diffuseFactor', 'diffuseTexture', 'specularFactor', 'specularTexture', 'shininessFactor');
      break;

    case 'commonLambert':
      keys.push('diffuseFactor', 'diffuseTexture');
      break;

    case 'commonConstant':
    default:
      break;

  }

  var materialValues = {};

  keys.forEach(function (v) {

    if (khrMaterial[v] !== undefined) materialValues[v] = khrMaterial[v];
  });

  if (materialValues.diffuseFactor !== undefined) {

    materialParams.color = new three.Color().fromArray(materialValues.diffuseFactor);
    materialParams.opacity = materialValues.diffuseFactor[3];
  }

  if (materialValues.diffuseTexture !== undefined) {

    pending.push(parser.assignTexture(materialParams, 'map', materialValues.diffuseTexture.index));
  }

  if (materialValues.specularFactor !== undefined) {

    materialParams.specular = new three.Color().fromArray(materialValues.specularFactor);
  }

  if (materialValues.specularTexture !== undefined) {

    pending.push(parser.assignTexture(materialParams, 'specularMap', materialValues.specularTexture.index));
  }

  if (materialValues.shininessFactor !== undefined) {

    materialParams.shininess = materialValues.shininessFactor;
  }

  return Promise.all(pending);
};

/* BINARY EXTENSION */

function GLTFBinaryExtension(data) {

  this.name = EXTENSIONS.KHR_BINARY_GLTF;
  this.content = null;
  this.body = null;

  var headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH);

  this.header = {
    magic: convertUint8ArrayToString(new Uint8Array(data.slice(0, 4))),
    version: headerView.getUint32(4, true),
    length: headerView.getUint32(8, true)
  };

  if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {

    throw new Error('GLTFLoader: Unsupported glTF-Binary header.');
  } else if (this.header.version < 2.0) {

    throw new Error('GLTFLoader: Legacy binary file detected. Use GLTFLoader instead.');
  }

  var chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH);
  var chunkIndex = 0;

  while (chunkIndex < chunkView.byteLength) {

    var chunkLength = chunkView.getUint32(chunkIndex, true);
    chunkIndex += 4;

    var chunkType = chunkView.getUint32(chunkIndex, true);
    chunkIndex += 4;

    if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON) {

      var contentArray = new Uint8Array(data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength);
      this.content = convertUint8ArrayToString(contentArray);
    } else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN) {

      var byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
      this.body = data.slice(byteOffset, byteOffset + chunkLength);
    }

    // Clients must ignore chunks with unknown types.

    chunkIndex += chunkLength;
  }

  if (this.content === null) {

    throw new Error('GLTFLoader: JSON content not found.');
  }
}

/**
 * Specular-Glossiness Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/Khronos/KHR_materials_pbrSpecularGlossiness
 * @return {Object} extension
 */
function GLTFMaterialsPbrSpecularGlossinessExtension() {

  return {

    name: EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS,

    getMaterialType: function getMaterialType() {

      return three.ShaderMaterial;
    },
    extendParams: function extendParams(params, material, parser) {

      var pbrSpecularGlossiness = material.extensions[this.name];

      var shader = three.ShaderLib.standard;

      var uniforms = three.UniformsUtils.clone(shader.uniforms);

      var specularMapParsFragmentChunk = ['#ifdef USE_SPECULARMAP', '	uniform sampler2D specularMap;', '#endif'].join('\n');

      var glossinessMapParsFragmentChunk = ['#ifdef USE_GLOSSINESSMAP', '	uniform sampler2D glossinessMap;', '#endif'].join('\n');

      var specularMapFragmentChunk = ['vec3 specularFactor = specular;', '#ifdef USE_SPECULARMAP', '	vec4 texelSpecular = texture2D( specularMap, vUv );', '	// reads channel RGB, compatible with a glTF Specular-Glossiness (RGBA) texture', '	specularFactor *= texelSpecular.rgb;', '#endif'].join('\n');

      var glossinessMapFragmentChunk = ['float glossinessFactor = glossiness;', '#ifdef USE_GLOSSINESSMAP', '	vec4 texelGlossiness = texture2D( glossinessMap, vUv );', '	// reads channel A, compatible with a glTF Specular-Glossiness (RGBA) texture', '	glossinessFactor *= texelGlossiness.a;', '#endif'].join('\n');

      var lightPhysicalFragmentChunk = ['PhysicalMaterial material;', 'material.diffuseColor = diffuseColor.rgb;', 'material.specularRoughness = clamp( 1.0 - glossinessFactor, 0.04, 1.0 );', 'material.specularColor = specularFactor.rgb;'].join('\n');

      var fragmentShader = shader.fragmentShader.replace('#include <specularmap_fragment>', '').replace('uniform float roughness;', 'uniform vec3 specular;').replace('uniform float metalness;', 'uniform float glossiness;').replace('#include <roughnessmap_pars_fragment>', specularMapParsFragmentChunk).replace('#include <metalnessmap_pars_fragment>', glossinessMapParsFragmentChunk).replace('#include <roughnessmap_fragment>', specularMapFragmentChunk).replace('#include <metalnessmap_fragment>', glossinessMapFragmentChunk).replace('#include <lights_physical_fragment>', lightPhysicalFragmentChunk);

      delete uniforms.roughness;
      delete uniforms.metalness;
      delete uniforms.roughnessMap;
      delete uniforms.metalnessMap;

      uniforms.specular = {
        value: new three.Color().setHex(0x111111)
      };
      uniforms.glossiness = {
        value: 0.5
      };
      uniforms.specularMap = {
        value: null
      };
      uniforms.glossinessMap = {
        value: null
      };

      params.vertexShader = shader.vertexShader;
      params.fragmentShader = fragmentShader;
      params.uniforms = uniforms;
      params.defines = {
        STANDARD: ''
      };

      params.color = new three.Color(1.0, 1.0, 1.0);
      params.opacity = 1.0;

      var pending = [];

      if (Array.isArray(pbrSpecularGlossiness.diffuseFactor)) {

        var array = pbrSpecularGlossiness.diffuseFactor;

        params.color.fromArray(array);
        params.opacity = array[3];
      }

      if (pbrSpecularGlossiness.diffuseTexture !== undefined) {

        pending.push(parser.assignTexture(params, 'map', pbrSpecularGlossiness.diffuseTexture.index));
      }

      params.emissive = new three.Color(0.0, 0.0, 0.0);
      params.glossiness = pbrSpecularGlossiness.glossinessFactor !== undefined ? pbrSpecularGlossiness.glossinessFactor : 1.0;
      params.specular = new three.Color(1.0, 1.0, 1.0);

      if (Array.isArray(pbrSpecularGlossiness.specularFactor)) {

        params.specular.fromArray(pbrSpecularGlossiness.specularFactor);
      }

      if (pbrSpecularGlossiness.specularGlossinessTexture !== undefined) {

        var specGlossIndex = pbrSpecularGlossiness.specularGlossinessTexture.index;
        pending.push(parser.assignTexture(params, 'glossinessMap', specGlossIndex));
        pending.push(parser.assignTexture(params, 'specularMap', specGlossIndex));
      }

      return Promise.all(pending);
    },
    createMaterial: function createMaterial(params) {

      // setup material properties based on MeshStandardMaterial for Specular-Glossiness

      var material = new three.ShaderMaterial({
        defines: params.defines,
        vertexShader: params.vertexShader,
        fragmentShader: params.fragmentShader,
        uniforms: params.uniforms,
        fog: true,
        lights: true,
        opacity: params.opacity,
        transparent: params.transparent
      });

      material.isGLTFSpecularGlossinessMaterial = true;

      material.color = params.color;

      material.map = params.map === undefined ? null : params.map;

      material.lightMap = null;
      material.lightMapIntensity = 1.0;

      material.aoMap = params.aoMap === undefined ? null : params.aoMap;
      material.aoMapIntensity = 1.0;

      material.emissive = params.emissive;
      material.emissiveIntensity = 1.0;
      material.emissiveMap = params.emissiveMap === undefined ? null : params.emissiveMap;

      material.bumpMap = params.bumpMap === undefined ? null : params.bumpMap;
      material.bumpScale = 1;

      material.normalMap = params.normalMap === undefined ? null : params.normalMap;
      material.normalScale = new three.Vector2(1, 1);

      material.displacementMap = null;
      material.displacementScale = 1;
      material.displacementBias = 0;

      material.specularMap = params.specularMap === undefined ? null : params.specularMap;
      material.specular = params.specular;

      material.glossinessMap = params.glossinessMap === undefined ? null : params.glossinessMap;
      material.glossiness = params.glossiness;

      material.alphaMap = null;

      material.envMap = params.envMap === undefined ? null : params.envMap;
      material.envMapIntensity = 1.0;

      material.refractionRatio = 0.98;

      material.extensions.derivatives = true;

      return material;
    },


    // Here's based on refreshUniformsCommon() and refreshUniformsStandard() in WebGLRenderer.
    refreshUniforms: function refreshUniforms(renderer, scene, camera, geometry, material) {

      var uniforms = material.uniforms;
      var defines = material.defines;

      uniforms.opacity.value = material.opacity;

      uniforms.diffuse.value.copy(material.color);
      uniforms.emissive.value.copy(material.emissive).multiplyScalar(material.emissiveIntensity);

      uniforms.map.value = material.map;
      uniforms.specularMap.value = material.specularMap;
      uniforms.alphaMap.value = material.alphaMap;

      uniforms.lightMap.value = material.lightMap;
      uniforms.lightMapIntensity.value = material.lightMapIntensity;

      uniforms.aoMap.value = material.aoMap;
      uniforms.aoMapIntensity.value = material.aoMapIntensity;

      // uv repeat and offset setting priorities
      // 1. color map
      // 2. specular map
      // 3. normal map
      // 4. bump map
      // 5. alpha map
      // 6. emissive map

      var uvScaleMap = void 0;

      if (material.map) {

        uvScaleMap = material.map;
      } else if (material.specularMap) {

        uvScaleMap = material.specularMap;
      } else if (material.displacementMap) {

        uvScaleMap = material.displacementMap;
      } else if (material.normalMap) {

        uvScaleMap = material.normalMap;
      } else if (material.bumpMap) {

        uvScaleMap = material.bumpMap;
      } else if (material.glossinessMap) {

        uvScaleMap = material.glossinessMap;
      } else if (material.alphaMap) {

        uvScaleMap = material.alphaMap;
      } else if (material.emissiveMap) {

        uvScaleMap = material.emissiveMap;
      }

      if (uvScaleMap !== undefined) {

        // backwards compatibility
        if (uvScaleMap.isWebGLRenderTarget) {

          uvScaleMap = uvScaleMap.texture;
        }

        var offset = uvScaleMap.offset;
        var repeat = uvScaleMap.repeat;

        uniforms.offsetRepeat.value.set(offset.x, offset.y, repeat.x, repeat.y);
      }

      uniforms.envMap.value = material.envMap;
      uniforms.envMapIntensity.value = material.envMapIntensity;
      uniforms.flipEnvMap.value = material.envMap && material.envMap.isCubeTexture ? -1 : 1;

      uniforms.refractionRatio.value = material.refractionRatio;

      uniforms.specular.value.copy(material.specular);
      uniforms.glossiness.value = material.glossiness;

      uniforms.glossinessMap.value = material.glossinessMap;

      uniforms.emissiveMap.value = material.emissiveMap;
      uniforms.bumpMap.value = material.bumpMap;
      uniforms.normalMap.value = material.normalMap;

      uniforms.displacementMap.value = material.displacementMap;
      uniforms.displacementScale.value = material.displacementScale;
      uniforms.displacementBias.value = material.displacementBias;

      if (uniforms.glossinessMap.value !== null && defines.USE_GLOSSINESSMAP === undefined) {

        defines.USE_GLOSSINESSMAP = '';
        // set USE_ROUGHNESSMAP to enable vUv
        defines.USE_ROUGHNESSMAP = '';
      }

      if (uniforms.glossinessMap.value === null && defines.USE_GLOSSINESSMAP !== undefined) {

        delete defines.USE_GLOSSINESSMAP;
        delete defines.USE_ROUGHNESSMAP;
      }
    }
  };
}

/** *******************************/
/** ******** INTERNALS ************/
/** *******************************/

/* CONSTANTS */

var WEBGL_CONSTANTS = {
  FLOAT: 5126,
  // FLOAT_MAT2: 35674,
  FLOAT_MAT3: 35675,
  FLOAT_MAT4: 35676,
  FLOAT_VEC2: 35664,
  FLOAT_VEC3: 35665,
  FLOAT_VEC4: 35666,
  LINEAR: 9729,
  REPEAT: 10497,
  SAMPLER_2D: 35678,
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6,
  UNSIGNED_BYTE: 5121,
  UNSIGNED_SHORT: 5123
};

// const WEBGL_TYPE = {
//   5126: Number,
//   // 35674: Matrix2,
//   35675: Matrix3,
//   35676: Matrix4,
//   35664: Vector2,
//   35665: Vector3,
//   35666: Vector4,
//   35678: Texture,
// };

var WEBGL_COMPONENT_TYPES = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
};

var WEBGL_FILTERS = {
  9728: three.NearestFilter,
  9729: three.LinearFilter,
  9984: three.NearestMipMapNearestFilter,
  9985: three.LinearMipMapNearestFilter,
  9986: three.NearestMipMapLinearFilter,
  9987: three.LinearMipMapLinearFilter
};

var WEBGL_WRAPPINGS = {
  33071: three.ClampToEdgeWrapping,
  33648: three.MirroredRepeatWrapping,
  10497: three.RepeatWrapping
};

var WEBGL_TEXTURE_FORMATS = {
  6406: three.AlphaFormat,
  6407: three.RGBFormat,
  6408: three.RGBAFormat,
  6409: three.LuminanceFormat,
  6410: three.LuminanceAlphaFormat
};

var WEBGL_TEXTURE_DATATYPES = {
  5121: three.UnsignedByteType,
  32819: three.UnsignedShort4444Type,
  32820: three.UnsignedShort5551Type,
  33635: three.UnsignedShort565Type
};

// const WEBGL_SIDES = {
//   1028: BackSide, // Culling front
//   1029: FrontSide, // Culling back
//   // 1032: NoSide   // Culling front and back, what to do?
// };

// const WEBGL_DEPTH_FUNCS = {
//   512: NeverDepth,
//   513: LessDepth,
//   514: EqualDepth,
//   515: LessEqualDepth,
//   516: GreaterEqualDepth,
//   517: NotEqualDepth,
//   518: GreaterEqualDepth,
//   519: AlwaysDepth,
// };

// const WEBGL_BLEND_EQUATIONS = {
//   32774: AddEquation,
//   32778: SubtractEquation,
//   32779: ReverseSubtractEquation,
// };

// const WEBGL_BLEND_FUNCS = {
//   0: ZeroFactor,
//   1: OneFactor,
//   768: SrcColorFactor,
//   769: OneMinusSrcColorFactor,
//   770: SrcAlphaFactor,
//   771: OneMinusSrcAlphaFactor,
//   772: DstAlphaFactor,
//   773: OneMinusDstAlphaFactor,
//   774: DstColorFactor,
//   775: OneMinusDstColorFactor,
//   776: SrcAlphaSaturateFactor,
//   // The followings are not supported by js yet
//   // 32769: CONSTANT_COLOR,
//   // 32770: ONE_MINUS_CONSTANT_COLOR,
//   // 32771: CONSTANT_ALPHA,
//   // 32772: ONE_MINUS_CONSTANT_COLOR
// };

var WEBGL_TYPE_SIZES = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
};

var PATH_PROPERTIES = {
  scale: 'scale',
  translation: 'position',
  rotation: 'quaternion',
  weights: 'morphTargetInfluences'
};

var INTERPOLATION = {
  CATMULLROMSPLINE: three.InterpolateSmooth,
  CUBICSPLINE: three.InterpolateSmooth,
  LINEAR: three.InterpolateLinear,
  STEP: three.InterpolateDiscrete
};

// const STATES_ENABLES = {
//   2884: 'CULL_FACE',
//   2929: 'DEPTH_TEST',
//   3042: 'BLEND',
//   3089: 'SCISSOR_TEST',
//   32823: 'POLYGON_OFFSET_FILL',
//   32926: 'SAMPLE_ALPHA_TO_COVERAGE',
// };

var ALPHA_MODES = {
  OPAQUE: 'OPAQUE',
  MASK: 'MASK',
  BLEND: 'BLEND'
};

/* UTILITY FUNCTIONS */

function _each(object, callback, thisObj) {

  if (!object) {
    return Promise.resolve();
  }

  var results = void 0;
  var fns = [];

  if (Object.prototype.toString.call(object) === '[object Array]') {

    results = [];

    var length = object.length;

    for (var idx = 0; idx < length; idx++) {

      var value = callback.call(thisObj || this, object[idx], idx);

      if (value) {

        fns.push(value);

        if (value instanceof Promise) {
          /* eslint no-loop-func: 0 */
          value.then(function (key, value) {

            results[key] = value;
          }.bind(this, idx));
        } else {

          results[idx] = value;
        }
      }
    }
  } else {

    results = {};

    for (var key in object) {

      if (object.hasOwnProperty(key)) {

        var _value = callback.call(thisObj || this, object[key], key);

        if (_value) {

          fns.push(_value);

          if (_value instanceof Promise) {

            _value.then(function (key, value) {

              results[key] = value;
            }.bind(this, key));
          } else {

            results[key] = _value;
          }
        }
      }
    }
  }

  return Promise.all(fns).then(function () {

    return results;
  });
}

function resolveURL(url, path) {

  // Invalid URL
  if (typeof url !== 'string' || url === '') {
    return '';
  }

  // Absolute URL http://,https://,//
  if (/^(https?:)?\/\//i.test(url)) {

    return url;
  }

  // Data URI
  if (/^data:.*,.*$/i.test(url)) {

    return url;
  }

  // Blob URL
  if (/^blob:.*$/i.test(url)) {

    return url;
  }

  // Relative URL
  return (path || '') + url;
}

function convertUint8ArrayToString(array) {

  if (window.TextDecoder !== undefined) {

    return new TextDecoder().decode(array);
  }

  // Avoid the String.fromCharCode.apply(null, array) shortcut, which
  // throws a "maximum call stack size exceeded" error for large arrays.

  var s = '';

  for (var i = 0, il = array.length; i < il; i++) {

    s += String.fromCharCode(array[i]);
  }

  return s;
}

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
 * @return {MeshStandardMaterial} material
 */
function createDefaultMaterial() {

  return new three.MeshStandardMaterial({
    color: 0xFFFFFF,
    emissive: 0x000000,
    metalness: 1,
    roughness: 1,
    transparent: false,
    depthTest: true,
    side: three.FrontSide
  });
}

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#morph-targets
 * @param {Mesh} mesh mesh
 * @param {GLTF.Mesh} meshDef meshDef
 * @param {GLTF.Primitive} primitiveDef primitiveDef
 * @param {Object} dependencies dependencies
 */
function addMorphTargets(mesh, meshDef, primitiveDef, dependencies) {

  var geometry = mesh.geometry;
  var material = mesh.material;

  var targets = primitiveDef.targets;
  var morphAttributes = geometry.morphAttributes;

  morphAttributes.position = [];
  morphAttributes.normal = [];

  material.morphTargets = true;

  for (var i = 0, il = targets.length; i < il; i++) {

    var target = targets[i];
    var attributeName = 'morphTarget' + i;

    var positionAttribute = void 0,
        normalAttribute = void 0;

    if (target.POSITION !== undefined) {

      // js morph formula is
      //   position
      //     + weight0 * ( morphTarget0 - position )
      //     + weight1 * ( morphTarget1 - position )
      //     ...
      // while the glTF one is
      //   position
      //     + weight0 * morphTarget0
      //     + weight1 * morphTarget1
      //     ...
      // then adding position to morphTarget.
      // So morphTarget value will depend on mesh's position, then cloning attribute
      // for the case if attribute is shared among two or more meshes.

      positionAttribute = dependencies.accessors[target.POSITION].clone();
      var position = geometry.attributes.position;

      for (var j = 0, jl = positionAttribute.count; j < jl; j++) {

        positionAttribute.setXYZ(j, positionAttribute.getX(j) + position.getX(j), positionAttribute.getY(j) + position.getY(j), positionAttribute.getZ(j) + position.getZ(j));
      }
    } else {

      // Copying the original position not to affect the final position.
      // See the formula above.
      positionAttribute = geometry.attributes.position.clone();
    }

    if (target.NORMAL !== undefined) {

      material.morphNormals = true;

      // see target.POSITION's comment

      normalAttribute = dependencies.accessors[target.NORMAL].clone();
      var normal = geometry.attributes.normal;

      for (var _j = 0, _jl = normalAttribute.count; _j < _jl; _j++) {

        normalAttribute.setXYZ(_j, normalAttribute.getX(_j) + normal.getX(_j), normalAttribute.getY(_j) + normal.getY(_j), normalAttribute.getZ(_j) + normal.getZ(_j));
      }
    } else {

      normalAttribute = geometry.attributes.normal.clone();
    }

    if (target.TANGENT !== undefined) {

      // TODO: implement

    }

    positionAttribute.name = attributeName;
    normalAttribute.name = attributeName;

    morphAttributes.position.push(positionAttribute);
    morphAttributes.normal.push(normalAttribute);
  }

  mesh.updateMorphTargets();

  if (meshDef.weights !== undefined) {

    for (var _i = 0, _il = meshDef.weights.length; _i < _il; _i++) {

      mesh.morphTargetInfluences[_i] = meshDef.weights[_i];
    }
  }
}

/* GLTF PARSER */

function GLTFParser(json, extensions, options) {

  this.json = json || {};
  this.extensions = extensions || {};
  this.options = options || {};

  // loader object cache
  this.cache = new GLTFRegistry();
}

GLTFParser.prototype._withDependencies = function (dependencies) {

  var _dependencies = {};

  for (var i = 0; i < dependencies.length; i++) {

    var dependency = dependencies[i];
    var fnName = 'load' + dependency.charAt(0).toUpperCase() + dependency.slice(1);

    var cached = this.cache.get(dependency);

    if (cached !== undefined) {

      _dependencies[dependency] = cached;
    } else if (this[fnName]) {

      var fn = this[fnName]();
      this.cache.add(dependency, fn);

      _dependencies[dependency] = fn;
    }
  }

  return _each(_dependencies, function (dependency) {

    return dependency;
  });
};

GLTFParser.prototype.parse = function (onLoad, onError) {

  var json = this.json;

  // Clear the loader cache
  this.cache.removeAll();

  // Fire the callback on complete
  this._withDependencies(['scenes', 'cameras', 'animations']).then(function (dependencies) {

    var scenes = [];

    for (var name in dependencies.scenes) {

      scenes.push(dependencies.scenes[name]);
    }

    var scene = json.scene !== undefined ? dependencies.scenes[json.scene] : scenes[0];

    var cameras = [];

    for (var _name in dependencies.cameras) {

      var camera = dependencies.cameras[_name];
      cameras.push(camera);
    }

    var animations = [];

    for (var _name2 in dependencies.animations) {

      animations.push(dependencies.animations[_name2]);
    }

    onLoad(scene, scenes, cameras, animations);
  }).catch(onError);
};

/**
 * Requests the specified dependency asynchronously, with caching.
 * @param {string} type type
 * @param {number} index index
 * @return {Promise<Object>} deps
 */
GLTFParser.prototype.getDependency = function (type, index) {

  var cacheKey = type + ':' + index;
  var dependency = this.cache.get(cacheKey);

  if (!dependency) {

    var fnName = 'load' + type.charAt(0).toUpperCase() + type.slice(1);
    dependency = this[fnName](index);
    this.cache.add(cacheKey, dependency);
  }

  return dependency;
};

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
 * @param {number} bufferIndex bufferIndex
 * @return {Promise<ArrayBuffer>} buffer
 */
GLTFParser.prototype.loadBuffer = function (bufferIndex) {

  var bufferDef = this.json.buffers[bufferIndex];

  if (bufferDef.type && bufferDef.type !== 'arraybuffer') {

    throw new Error('GLTFLoader: %s buffer type is not supported.', bufferDef.type);
  }

  // If present, GLB container is required to be the first buffer.
  if (bufferDef.uri === undefined && bufferIndex === 0) {

    return Promise.resolve(this.extensions[EXTENSIONS.KHR_BINARY_GLTF].body);
  }

  var options = this.options;

  return new Promise(function (resolve) {

    var loader = new three.FileLoader();
    loader.setResponseType('arraybuffer');
    loader.load(resolveURL(bufferDef.uri, options.path), resolve);
  });
};

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
 * @param {number} bufferViewIndex bufferViewIndex
 * @return {Promise<ArrayBuffer>} buffer
 */
GLTFParser.prototype.loadBufferView = function (bufferViewIndex) {

  var bufferViewDef = this.json.bufferViews[bufferViewIndex];

  return this.getDependency('buffer', bufferViewDef.buffer).then(function (buffer) {

    var byteLength = bufferViewDef.byteLength || 0;
    var byteOffset = bufferViewDef.byteOffset || 0;
    return buffer.slice(byteOffset, byteOffset + byteLength);
  });
};

GLTFParser.prototype.loadAccessors = function () {

  var parser = this;
  var json = this.json;

  return _each(json.accessors, function (accessor) {

    return parser.getDependency('bufferView', accessor.bufferView).then(function (bufferView) {

      var itemSize = WEBGL_TYPE_SIZES[accessor.type];
      var TypedArray = WEBGL_COMPONENT_TYPES[accessor.componentType];

      // For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
      var elementBytes = TypedArray.BYTES_PER_ELEMENT;
      var itemBytes = elementBytes * itemSize;
      var byteStride = json.bufferViews[accessor.bufferView].byteStride;
      var array = void 0;

      // The buffer is not interleaved if the stride is the item size in bytes.
      if (byteStride && byteStride !== itemBytes) {

        // Use the full buffer if it's interleaved.
        array = new TypedArray(bufferView);

        // Integer parameters to IB/IBA are in array elements, not bytes.
        var ib = new three.InterleavedBuffer(array, byteStride / elementBytes);

        return new three.InterleavedBufferAttribute(ib, itemSize, accessor.byteOffset / elementBytes);
      }

      array = new TypedArray(bufferView, accessor.byteOffset, accessor.count * itemSize);

      return new three.BufferAttribute(array, itemSize);
    });
  });
};

/**
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
 * @param {number} textureIndex textureIndex
 * @return {Promise<Texture>} Texture
 */
GLTFParser.prototype.loadTexture = function (textureIndex) {

  var parser = this;
  var json = this.json;
  var options = this.options;

  var URL = window.URL || window.webkitURL;

  var textureDef = json.textures[textureIndex];
  var source = json.images[textureDef.source];
  var sourceURI = source.uri;
  var isObjectURL = false;

  if (source.bufferView !== undefined) {

    // Load binary image data from bufferView, if provided.

    sourceURI = parser.getDependency('bufferView', source.bufferView).then(function (bufferView) {

      isObjectURL = true;
      var blob = new Blob([bufferView], {
        type: source.mimeType
      });
      sourceURI = URL.createObjectURL(blob);
      return sourceURI;
    });
  }

  return Promise.resolve(sourceURI).then(function (sourceURI) {

    // Load Texture resource.

    var textureLoader = three.Loader.Handlers.get(sourceURI) || new three.TextureLoader();
    textureLoader.setCrossOrigin(options.crossOrigin);

    return new Promise(function (resolve, reject) {

      textureLoader.load(resolveURL(sourceURI, options.path), resolve, undefined, reject);
    });
  }).then(function (texture) {

    // Clean up resources and configure Texture.

    if (isObjectURL !== undefined) {

      URL.revokeObjectURL(sourceURI);
    }

    texture.flipY = false;

    if (textureDef.name !== undefined) texture.name = textureDef.name;

    texture.format = textureDef.format !== undefined ? WEBGL_TEXTURE_FORMATS[textureDef.format] : three.RGBAFormat;

    if (textureDef.internalFormat !== undefined && texture.format !== WEBGL_TEXTURE_FORMATS[textureDef.internalFormat]) {

      console.warn('GLTFLoader: js does not support texture internalFormat which is different from texture format. ' + 'internalFormat will be forced to be the same value as format.');
    }

    texture.type = textureDef.type !== undefined ? WEBGL_TEXTURE_DATATYPES[textureDef.type] : three.UnsignedByteType;

    var samplers = json.samplers || {};
    var sampler = samplers[textureDef.sampler] || {};

    texture.magFilter = WEBGL_FILTERS[sampler.magFilter] || three.LinearFilter;
    texture.minFilter = WEBGL_FILTERS[sampler.minFilter] || three.LinearMipMapLinearFilter;
    texture.wrapS = WEBGL_WRAPPINGS[sampler.wrapS] || three.RepeatWrapping;
    texture.wrapT = WEBGL_WRAPPINGS[sampler.wrapT] || three.RepeatWrapping;

    return texture;
  });
};

/**
 * Asynchronously assigns a texture to the given material parameters.
 * @param {Object} materialParams materialParams
 * @param {string} textureName textureName
 * @param {number} textureIndex textureIndex
 * @return {Promise} Promise
 */
GLTFParser.prototype.assignTexture = function (materialParams, textureName, textureIndex) {

  return this.getDependency('texture', textureIndex).then(function (texture) {

    materialParams[textureName] = texture;
  });
};

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
 * @return {Promise<Array<Material>>} Material
 */
GLTFParser.prototype.loadMaterials = function () {

  var parser = this;
  var json = this.json;
  var extensions = this.extensions;

  return _each(json.materials, function (material) {

    var materialType = void 0;
    var materialParams = {};
    var materialExtensions = material.extensions || {};

    var pending = [];

    if (materialExtensions[EXTENSIONS.KHR_MATERIALS_COMMON]) {

      var khcExtension = extensions[EXTENSIONS.KHR_MATERIALS_COMMON];
      materialType = khcExtension.getMaterialType(material);
      pending.push(khcExtension.extendParams(materialParams, material, parser));
    } else if (materialExtensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS]) {

      var sgExtension = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS];
      materialType = sgExtension.getMaterialType(material);
      pending.push(sgExtension.extendParams(materialParams, material, parser));
    } else if (material.pbrMetallicRoughness !== undefined) {

      // Specification:
      // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material

      materialType = three.MeshStandardMaterial;

      var metallicRoughness = material.pbrMetallicRoughness;

      materialParams.color = new three.Color(1.0, 1.0, 1.0);
      materialParams.opacity = 1.0;

      if (Array.isArray(metallicRoughness.baseColorFactor)) {

        var array = metallicRoughness.baseColorFactor;

        materialParams.color.fromArray(array);
        materialParams.opacity = array[3];
      }

      if (metallicRoughness.baseColorTexture !== undefined) {

        pending.push(parser.assignTexture(materialParams, 'map', metallicRoughness.baseColorTexture.index));
      }

      materialParams.metalness = metallicRoughness.metallicFactor !== undefined ? metallicRoughness.metallicFactor : 1.0;
      materialParams.roughness = metallicRoughness.roughnessFactor !== undefined ? metallicRoughness.roughnessFactor : 1.0;

      if (metallicRoughness.metallicRoughnessTexture !== undefined) {

        var textureIndex = metallicRoughness.metallicRoughnessTexture.index;
        pending.push(parser.assignTexture(materialParams, 'metalnessMap', textureIndex));
        pending.push(parser.assignTexture(materialParams, 'roughnessMap', textureIndex));
      }
    } else {

      materialType = three.MeshPhongMaterial;
    }

    if (material.doubleSided === true) {

      materialParams.side = three.DoubleSide;
    }

    var alphaMode = material.alphaMode || ALPHA_MODES.OPAQUE;

    if (alphaMode !== ALPHA_MODES.OPAQUE) {

      materialParams.transparent = true;
    } else {

      materialParams.transparent = false;
    }

    if (material.normalTexture !== undefined) {

      pending.push(parser.assignTexture(materialParams, 'normalMap', material.normalTexture.index));
    }

    if (material.occlusionTexture !== undefined) {

      pending.push(parser.assignTexture(materialParams, 'aoMap', material.occlusionTexture.index));
    }

    if (material.emissiveFactor !== undefined) {

      if (materialType === three.MeshBasicMaterial) {

        materialParams.color = new three.Color().fromArray(material.emissiveFactor);
      } else {

        materialParams.emissive = new three.Color().fromArray(material.emissiveFactor);
      }
    }

    if (material.emissiveTexture !== undefined) {

      if (materialType === three.MeshBasicMaterial) {

        pending.push(parser.assignTexture(materialParams, 'map', material.emissiveTexture.index));
      } else {

        pending.push(parser.assignTexture(materialParams, 'emissiveMap', material.emissiveTexture.index));
      }
    }

    return Promise.all(pending).then(function () {

      var _material = void 0;

      if (materialType === three.ShaderMaterial) {

        _material = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].createMaterial(materialParams);
      } else {

        _material = new materialType(materialParams);
      }

      if (material.name !== undefined) _material.name = material.name;

      // Normal map textures use OpenGL conventions:
      // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#materialnormaltexture
      _material.normalScale.x = -1;

      _material.userData = material.extras;

      return _material;
    });
  });
};

GLTFParser.prototype.loadGeometries = function (primitives) {

  return this._withDependencies(['accessors']).then(function (dependencies) {

    return _each(primitives, function (primitive) {

      var geometry = new three.BufferGeometry();

      var attributes = primitive.attributes;

      for (var attributeId in attributes) {

        var attributeEntry = attributes[attributeId];

        if (attributeEntry === undefined) return;

        var bufferAttribute = dependencies.accessors[attributeEntry];

        switch (attributeId) {

          case 'POSITION':

            geometry.addAttribute('position', bufferAttribute);
            break;

          case 'NORMAL':

            geometry.addAttribute('normal', bufferAttribute);
            break;

          case 'TEXCOORD_0':
          case 'TEXCOORD0':
          case 'TEXCOORD':

            geometry.addAttribute('uv', bufferAttribute);
            break;

          case 'TEXCOORD_1':

            geometry.addAttribute('uv2', bufferAttribute);
            break;

          case 'COLOR_0':
          case 'COLOR0':
          case 'COLOR':

            geometry.addAttribute('color', bufferAttribute);
            break;

          case 'WEIGHTS_0':
          case 'WEIGHT':
            // WEIGHT semantic deprecated.

            geometry.addAttribute('skinWeight', bufferAttribute);
            break;

          case 'JOINTS_0':
          case 'JOINT':
            // JOINT semantic deprecated.

            geometry.addAttribute('skinIndex', bufferAttribute);
            break;

          default:
            break;

        }
      }

      if (primitive.indices !== undefined) {

        geometry.setIndex(dependencies.accessors[primitive.indices]);
      }

      return geometry;
    });
  });
};

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
 * @return {Promise} promise
 */
GLTFParser.prototype.loadMeshes = function () {

  var scope = this;
  var json = this.json;

  return this._withDependencies(['accessors', 'materials']).then(function (dependencies) {

    return _each(json.meshes, function (meshDef) {

      var group = new three.Group();

      if (meshDef.name !== undefined) group.name = meshDef.name;
      if (meshDef.extras) group.userData = meshDef.extras;

      var primitives = meshDef.primitives || [];

      return scope.loadGeometries(primitives).then(function (geometries) {

        for (var name in primitives) {

          var primitive = primitives[name];
          var geometry = geometries[name];

          var material = primitive.material === undefined ? createDefaultMaterial() : dependencies.materials[primitive.material];

          if (material.aoMap && geometry.attributes.uv2 === undefined && geometry.attributes.uv !== undefined) {

            console.log('GLTFLoader: Duplicating UVs to support aoMap.');
            geometry.addAttribute('uv2', new three.BufferAttribute(geometry.attributes.uv.array, 2));
          }

          if (geometry.attributes.color !== undefined) {

            material.vertexColors = three.VertexColors;
            material.needsUpdate = true;
          }

          if (geometry.attributes.normal === undefined) {

            if (material.flatShading !== undefined) {

              material.flatShading = true;
            } else {

              // TODO: Remove this backwards-compatibility fix after r87 release.
              material.shading = three.FlatShading;
            }
          }

          var mesh = void 0;

          if (primitive.mode === WEBGL_CONSTANTS.TRIANGLES || primitive.mode === undefined) {

            mesh = new three.Mesh(geometry, material);
          } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {

            mesh = new three.Mesh(geometry, material);
            mesh.drawMode = three.TriangleStripDrawMode;
          } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {

            mesh = new three.Mesh(geometry, material);
            mesh.drawMode = three.TriangleFanDrawMode;
          } else if (primitive.mode === WEBGL_CONSTANTS.LINES) {

            mesh = new three.LineSegments(geometry, material);
          } else if (primitive.mode === WEBGL_CONSTANTS.LINE_STRIP) {

            mesh = new three.Line(geometry, material);
          } else if (primitive.mode === WEBGL_CONSTANTS.LINE_LOOP) {

            mesh = new three.LineLoop(geometry, material);
          } else if (primitive.mode === WEBGL_CONSTANTS.POINTS) {

            mesh = new three.Points(geometry, material);
          } else {

            throw new Error('GLTFLoader: Primitive mode unsupported: ', primitive.mode);
          }

          mesh.name = group.name + '_' + name;

          if (primitive.targets !== undefined) {

            addMorphTargets(mesh, meshDef, primitive, dependencies);
          }

          if (primitive.extras) mesh.userData = primitive.extras;

          group.add(mesh);
        }

        return group;
      });
    });
  });
};

/**
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
 * @return {Array} array
 */
GLTFParser.prototype.loadCameras = function () {

  var json = this.json;

  return _each(json.cameras, function (camera) {

    var _camera = void 0;

    var params = camera[camera.type];

    if (!params) {

      console.warn('GLTFLoader: Missing camera parameters.');
      return;
    }

    if (camera.type === 'perspective') {

      var aspectRatio = params.aspectRatio || 1;
      var xfov = params.yfov * aspectRatio;

      _camera = new three.PerspectiveCamera(Math.radToDeg(xfov), aspectRatio, params.znear || 1, params.zfar || 2e6);
    } else if (camera.type === 'orthographic') {

      _camera = new three.OrthographicCamera(params.xmag / -2, params.xmag / 2, params.ymag / 2, params.ymag / -2, params.znear, params.zfar);
    }

    if (camera.name !== undefined) _camera.name = camera.name;
    if (camera.extras) _camera.userData = camera.extras;

    return _camera;
  });
};

GLTFParser.prototype.loadSkins = function () {

  var json = this.json;

  return this._withDependencies(['accessors']).then(function (dependencies) {

    return _each(json.skins, function (skin) {

      var _skin = {
        joints: skin.joints,
        inverseBindMatrices: dependencies.accessors[skin.inverseBindMatrices]
      };

      return _skin;
    });
  });
};

GLTFParser.prototype.loadAnimations = function () {

  var json = this.json;

  return this._withDependencies(['accessors', 'nodes']).then(function (dependencies) {

    return _each(json.animations, function (animation, animationId) {

      var tracks = [];

      for (var channelId in animation.channels) {

        var channel = animation.channels[channelId];
        var sampler = animation.samplers[channel.sampler];

        if (sampler) {

          var target = channel.target;
          var _name3 = target.node !== undefined ? target.node : target.id; // NOTE: target.id is deprecated.
          var input = animation.parameters !== undefined ? animation.parameters[sampler.input] : sampler.input;
          var output = animation.parameters !== undefined ? animation.parameters[sampler.output] : sampler.output;

          var inputAccessor = dependencies.accessors[input];
          var outputAccessor = dependencies.accessors[output];

          var node = dependencies.nodes[_name3];

          if (node) {
            (function () {

              node.updateMatrix();
              node.matrixAutoUpdate = true;

              var TypedKeyframeTrack = void 0;

              switch (PATH_PROPERTIES[target.path]) {

                case PATH_PROPERTIES.weights:

                  TypedKeyframeTrack = three.NumberKeyframeTrack;
                  break;

                case PATH_PROPERTIES.rotation:

                  TypedKeyframeTrack = three.QuaternionKeyframeTrack;
                  break;

                case PATH_PROPERTIES.position:
                case PATH_PROPERTIES.scale:
                default:

                  TypedKeyframeTrack = three.VectorKeyframeTrack;
                  break;

              }

              var targetName = node.name ? node.name : node.uuid;

              if (sampler.interpolation === 'CATMULLROMSPLINE') {

                console.warn('GLTFLoader: CATMULLROMSPLINE interpolation is not supported. Using CUBICSPLINE instead.');
              }

              var interpolation = sampler.interpolation !== undefined ? INTERPOLATION[sampler.interpolation] : three.InterpolateLinear;

              var targetNames = [];

              if (PATH_PROPERTIES[target.path] === PATH_PROPERTIES.weights) {

                // node should be Group here but
                // PATH_PROPERTIES.weights(morphTargetInfluences) should be
                // the property of a mesh object under node.
                // So finding targets here.

                node.traverse(function (object) {

                  if (object.isMesh === true && object.material.morphTargets === true) {

                    targetNames.push(object.name ? object.name : object.uuid);
                  }
                });
              } else {

                targetNames.push(targetName);
              }

              // KeyframeTrack.optimize() will modify given 'times' and 'values'
              // buffers before creating a truncated copy to keep. Because buffers may
              // be reused by other tracks, make copies here.
              for (var i = 0, il = targetNames.length; i < il; i++) {

                tracks.push(new TypedKeyframeTrack(targetNames[i] + '.' + PATH_PROPERTIES[target.path], three.AnimationUtils.arraySlice(inputAccessor.array, 0), three.AnimationUtils.arraySlice(outputAccessor.array, 0), interpolation));
              }
            })();
          }
        }
      }

      var name = animation.name !== undefined ? animation.name : 'animation_' + animationId;

      return new three.AnimationClip(name, undefined, tracks);
    });
  });
};

GLTFParser.prototype.loadNodes = function () {

  var json = this.json;
  var extensions = this.extensions;
  var scope = this;

  var nodes = json.nodes || [];
  var skins = json.skins || [];

  // Nothing in the node definition indicates whether it is a Bone or an
  // Object3D. Use the skins' joint references to mark bones.
  skins.forEach(function (skin) {

    skin.joints.forEach(function (id) {

      nodes[id].isBone = true;
    });
  });

  return _each(json.nodes, function (node) {

    var matrix = new three.Matrix4();

    var _node = node.isBone === true ? new three.Bone() : new three.Object3D();

    if (node.name !== undefined) {

      _node.name = three.PropertyBinding.sanitizeNodeName(node.name);
    }

    if (node.extras) _node.userData = node.extras;

    if (node.matrix !== undefined) {

      matrix.fromArray(node.matrix);
      _node.applyMatrix(matrix);
    } else {

      if (node.translation !== undefined) {

        _node.position.fromArray(node.translation);
      }

      if (node.rotation !== undefined) {

        _node.quaternion.fromArray(node.rotation);
      }

      if (node.scale !== undefined) {

        _node.scale.fromArray(node.scale);
      }
    }

    return _node;
  }).then(function (__nodes) {

    return scope._withDependencies(['meshes', 'skins', 'cameras']).then(function (dependencies) {

      return _each(__nodes, function (_node, nodeId) {

        var node = json.nodes[nodeId];

        var meshes = void 0;

        if (node.mesh !== undefined) {

          meshes = [node.mesh];
        } else if (node.meshes !== undefined) {

          console.warn('GLTFLoader: Legacy glTF file detected. Nodes may have no more than one mesh.');

          meshes = node.meshes;
        }

        if (meshes !== undefined) {

          for (var meshId in meshes) {

            var mesh = meshes[meshId];
            var group = dependencies.meshes[mesh];

            if (group === undefined) {

              console.warn('GLTFLoader: Could not find node "' + mesh + '".');
              continue;
            }

            // do not clone children as they will be replaced anyway
            var clonedgroup = group.clone(false);

            for (var childrenId in group.children) {

              var child = group.children[childrenId];
              var originalChild = child;

              // clone Mesh to add to _node

              var originalMaterial = child.material;
              var originalGeometry = child.geometry;
              var originalInfluences = child.morphTargetInfluences;
              var originalUserData = child.userData;
              var originalName = child.name;

              var material = originalMaterial;

              switch (child.type) {

                case 'LineSegments':
                  child = new three.LineSegments(originalGeometry, material);
                  break;

                case 'LineLoop':
                  child = new three.LineLoop(originalGeometry, material);
                  break;

                case 'Line':
                  child = new three.Line(originalGeometry, material);
                  break;

                case 'Points':
                  child = new three.Points(originalGeometry, material);
                  break;

                default:
                  child = new three.Mesh(originalGeometry, material);
                  child.drawMode = originalChild.drawMode;

              }

              child.castShadow = true;
              child.morphTargetInfluences = originalInfluences;
              child.userData = originalUserData;
              child.name = originalName;

              var skinEntry = void 0;

              if (node.skin !== undefined) {

                skinEntry = dependencies.skins[node.skin];
              }

              // Replace Mesh with SkinnedMesh in library
              if (skinEntry) {

                var geometry = originalGeometry;
                material = originalMaterial;
                material.skinning = true;

                child = new three.SkinnedMesh(geometry, material);
                child.castShadow = true;
                child.userData = originalUserData;
                child.name = originalName;

                var bones = [];
                var boneInverses = [];

                for (var i = 0, l = skinEntry.joints.length; i < l; i++) {

                  var jointId = skinEntry.joints[i];
                  var jointNode = __nodes[jointId];

                  if (jointNode) {

                    bones.push(jointNode);

                    var m = skinEntry.inverseBindMatrices.array;
                    var mat = new three.Matrix4().fromArray(m, i * 16);
                    boneInverses.push(mat);
                  } else {

                    console.warn('GLTFLoader: Joint "%s" could not be found.', jointId);
                  }
                }

                child.bind(new three.Skeleton(bones, boneInverses), child.matrixWorld);
              }

              clonedgroup.add(child);
            }

            _node.add(clonedgroup);
          }
        }

        if (node.camera !== undefined) {

          var camera = dependencies.cameras[node.camera];

          _node.add(camera);
        }

        if (node.extensions && node.extensions[EXTENSIONS.KHR_LIGHTS] && node.extensions[EXTENSIONS.KHR_LIGHTS].light !== undefined) {

          var lights = extensions[EXTENSIONS.KHR_LIGHTS].lights;
          _node.add(lights[node.extensions[EXTENSIONS.KHR_LIGHTS].light]);
        }

        return _node;
      });
    });
  });
};

GLTFParser.prototype.loadScenes = function () {

  var json = this.json;
  var extensions = this.extensions;

  // scene node hierachy builder

  function buildNodeHierachy(nodeId, parentObject, allNodes) {

    var _node = allNodes[nodeId];
    parentObject.add(_node);

    var node = json.nodes[nodeId];

    if (node.children) {

      var children = node.children;

      for (var i = 0, l = children.length; i < l; i++) {

        var child = children[i];
        buildNodeHierachy(child, _node, allNodes);
      }
    }
  }

  return this._withDependencies(['nodes']).then(function (dependencies) {

    return _each(json.scenes, function (scene) {

      var _scene = new three.Scene();
      if (scene.name !== undefined) _scene.name = scene.name;

      if (scene.extras) _scene.userData = scene.extras;

      var nodes = scene.nodes || [];

      for (var i = 0, l = nodes.length; i < l; i++) {

        var nodeId = nodes[i];
        buildNodeHierachy(nodeId, _scene, dependencies.nodes);
      }

      _scene.traverse(function (child) {

        // for Specular-Glossiness.
        if (child.material && child.material.isGLTFSpecularGlossinessMaterial) {

          child.onBeforeRender = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].refreshUniforms;
        }
      });

      // Ambient lighting, if present, is always attached to the scene root.
      if (scene.extensions && scene.extensions[EXTENSIONS.KHR_LIGHTS] && scene.extensions[EXTENSIONS.KHR_LIGHTS].light !== undefined) {

        var lights = extensions[EXTENSIONS.KHR_LIGHTS].lights;
        _scene.add(lights[scene.extensions[EXTENSIONS.KHR_LIGHTS].light]);
      }

      return _scene;
    });
  });
};

/**
 * refactor from THREE.DeviceOrientationControls
 */

var GltfMagic = function (_EventDispatcher) {
  inherits(GltfMagic, _EventDispatcher);

  function GltfMagic(_ref) {
    var url = _ref.url,
        index = _ref.index;
    classCallCheck(this, GltfMagic);

    var _this = possibleConstructorReturn(this, (GltfMagic.__proto__ || Object.getPrototypeOf(GltfMagic)).call(this));

    _this.url = url;
    _this.index = index || 0;
    _this.scene = null;
    _this.glft = null;
    _this.mixer = null;
    _this.animations = [];
    _this.loader = new GLTFLoader();
    _this.loader.load(_this.url, function (gltf) {
      _this.setup(gltf);
      _this.emit('loaded', {});
    });
    return _this;
  }

  createClass(GltfMagic, [{
    key: 'switchScene',
    value: function switchScene(index) {
      this.index = Utils.isNumber(index) ? index : this.index;
      this.scene = this.glft.scenes[this.index] || this.scene;
      this.setupMixer();
    }
  }, {
    key: 'setup',
    value: function setup(gltf) {
      this.glft = gltf;
      this.animations = gltf.animations;
      this.switchScene();
      this.setupMixer();
    }
  }, {
    key: 'setupMixer',
    value: function setupMixer() {
      this.mixer = new three.AnimationMixer(this.scene);
      for (var i = 0; i < this.animations.length; i++) {
        var clip = this.animations[i];
        this.mixer.clipAction(clip).play();
      }
    }
  }, {
    key: 'update',
    value: function update(snippet) {
      this.mixer && this.mixer.update(snippet / 1000);
    }
  }]);
  return GltfMagic;
}(three.EventDispatcher);

exports.EventDispatcher = three.EventDispatcher;
exports.Utils = Utils;
exports.Tween = Tween;
exports.Smooth = Smooth;
exports.Orienter = Orienter;
exports.BloomPass = BloomPass;
exports.ClearMaskPass = ClearMaskPass;
exports.FilmPass = FilmPass;
exports.GlitchPass = GlitchPass;
exports.MaskPass = MaskPass;
exports.MattingPass = MattingPass;
exports.RenderPass = RenderPass;
exports.ShaderPass = ShaderPass;
exports.ConvolutionShader = ConvolutionShader;
exports.CopyShader = CopyShader;
exports.FilmShader = FilmShader;
exports.FocusShader = FocusShader;
exports.ARGlue = ARGlue;
exports.Viewer = Viewer;
exports.Layer = Layer;
exports.ARLayer = ARLayer;
exports.XRLayer = XRLayer;
exports.PrimerLayer = PrimerLayer;
exports.Primer = Primer;
exports.CameraPrimer = CameraPrimer;
exports.TexturePrimer = TexturePrimer;
exports.AnchorRippling = AnchorRippling;
exports.SphereWorld = SphereWorld;
exports.CylinderWorld = CylinderWorld;
exports.GltfMagic = GltfMagic;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=tofu.js.map
