(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WebAR = global.WebAR || {})));
}(this, (function (exports) { 'use strict';

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





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

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

function isFunc(func) {
  return typeof func === 'function';
}

function isObj(any) {
  return any && (typeof any === 'undefined' ? 'undefined' : _typeof(any)) === 'object';
}

function isStr(any) {
  return typeof any === 'string';
}

function arrRemove(array, item) {
  var i = array.indexOf(item);
  if (i >= 0) {
    array.splice(i, 1);
    return true;
  }
  return false;
}

function arrAdd(array, item, index) {
  if (array.indexOf(item) === -1) {
    if (typeof index !== 'number') {
      array.push(item);
    } else {
      array.splice(index, 0, item);
    }
    return true;
  }
  return false;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

function forEach(object, callback, thisObj) {
  if (isObj(object)) {
    if (thisObj === void 0) {
      thisObj = object;
    }
    if (object instanceof Array || 'length' in object) {
      Array.prototype.forEach.call(object, callback, thisObj);
    } else {
      for (var name in object) {
        if (hasOwnProperty.call(object, name)) {
          callback.call(thisObj, object[name], name);
        }
      }
    }
  }
  return object;
}

var Renderer = function () {
  function Renderer(arg) {
    classCallCheck(this, Renderer);

    arg = arg || {};
    this.name = arg.name || randomName(this.constructor.name);
    this._renderMiddlewareFuncs = [];
    this._updateMiddlewareFuncs = [];
    this.disabled = arg.disabled;
    this.initialize(arg);
  }

  createClass(Renderer, [{
    key: 'initialize',
    value: function initialize(arg) {}
  }, {
    key: 'update',
    value: function update(gl, state) {
      this._updateMiddlewareFuncs = this._useMiddlewares(this._updateMiddlewareFuncs, gl, state);
    }
  }, {
    key: 'render',
    value: function render(gl, state) {
      this._renderMiddlewareFuncs = this._useMiddlewares(this._renderMiddlewareFuncs, gl, state);
    }
  }, {
    key: 'dispose',
    value: function dispose() {}
  }, {
    key: '_useMiddlewares',
    value: function _useMiddlewares(middlewares, gl, state) {
      var self = this;
      return middlewares.filter(function (func, i) {
        if (func) {
          func.call(self, gl, state);
          return middlewares[i] === func;
        }
        return false;
      });
    }
  }, {
    key: '_addMiddleware',
    value: function _addMiddleware(func, phrase) {
      var _this = this;

      var funcs = void 0;
      if (isFunc(func)) {
        if (phrase === 'render') {
          funcs = '_renderMiddlewareFuncs';
        } else if (phrase === 'update') {
          funcs = '_updateMiddlewareFuncs';
        }
        if (funcs) {
          var remove = function remove() {
            var arr = _this[funcs];
            var index = arr.indexOf(func);
            if (index > -1) {
              arr[index] = 0;
            }
          };
          arrAdd(this[funcs], func);
          return remove;
        }
      }
      return function () {
        return void 0;
      };
    }
  }, {
    key: 'addUpdateMiddleware',
    value: function addUpdateMiddleware(func) {
      return this._addMiddleware(func, 'update');
    }
  }, {
    key: 'addRenderMiddleware',
    value: function addRenderMiddleware(func) {
      return this._addMiddleware(func, 'render');
    }
  }, {
    key: 'invalid',
    value: function invalid() {
      if (this.parent) {
        this.parent.invalid();
      }
    }
  }, {
    key: 'disabled',
    get: function get$$1() {
      return this._disabled;
    },
    set: function set$$1(v) {
      if (v !== this.disabled) {
        this._disabled = !!v;
        this.invalid();
      }
    }
  }]);
  return Renderer;
}();

var seed = 1;

function randomName(prefix) {
  return prefix + ':' + seed++;
}

/**
 * Created by brian on 17/07/2017.
 */
var GLRenderNode = function (_Renderer) {
  inherits(GLRenderNode, _Renderer);

  function GLRenderNode() {
    classCallCheck(this, GLRenderNode);
    return possibleConstructorReturn(this, (GLRenderNode.__proto__ || Object.getPrototypeOf(GLRenderNode)).apply(this, arguments));
  }

  createClass(GLRenderNode, [{
    key: 'initialize',
    value: function initialize(arg) {
      get(GLRenderNode.prototype.__proto__ || Object.getPrototypeOf(GLRenderNode.prototype), 'initialize', this).call(this, arg);
      this.children = [];
      this._childrenCacheMap = {};
      this._uniformMap = {};
      this._removedChildren = [];
    }
  }, {
    key: 'update',
    value: function update(gl, state) {
      get(GLRenderNode.prototype.__proto__ || Object.getPrototypeOf(GLRenderNode.prototype), 'update', this).call(this, gl, state);
      this._iterateChildren(gl, state, 'update');
      this._removedChildren.forEach(function (c) {
        return c.dispose(gl);
      });
      this._removedChildren = [];
    }
  }, {
    key: 'addChild',
    value: function addChild(child, index) {
      if (child instanceof Renderer && !child.parent && arrAdd(this.children, child, index)) {
        this._childrenCacheMap[child.name] = null;
        child.parent = this;
        this.invalid();
        return true;
      }
      return false;
    }
  }, {
    key: 'removeChild',
    value: function removeChild(child, reuse) {
      var index = this.children.indexOf(child);
      if (index > -1) {
        this.children[index] = null;
        this._childrenCacheMap[child.name] = null;
        child.parent = null;
        this.invalid();
        if (!reuse) {
          arrAdd(this._removedChildren, child);
        }
        return true;
      }
      return false;
    }
  }, {
    key: 'findChildByName',
    value: function findChildByName(name, recursive) {
      var children = this.children;
      var cache = this._childrenCacheMap;
      var cached = cache[name];
      if (cached) {
        return cached;
      }
      for (var i = 0; i < children.length; i++) {
        var obj = children[i];
        if (obj && obj.name === name) {
          this._childrenCacheMap[name] = obj;
          return obj;
        }
      }
      if (recursive) {
        for (var _i = 0; _i < children.length; _i++) {
          var _obj = children[_i];
          if (_obj instanceof GLRenderNode) {
            var find = _obj.findChildByName(name, recursive);
            if (find) {
              return find;
            }
          }
        }
      }
    }
  }, {
    key: '_iterateChildren',
    value: function _iterateChildren(gl, state, phrase) {
      var nextChildren = [];
      for (var i = 0, children = this.children; i < children.length; i++) {
        var child = children[i];
        if (child) {
          if (!child.disabled) {
            child[phrase](gl, state);
          }
          if (children.indexOf(child) > -1) {
            nextChildren.push(child);
          }
        }
      }

      this.children = nextChildren;
    }
  }, {
    key: 'render',
    value: function render(gl, state) {
      get(GLRenderNode.prototype.__proto__ || Object.getPrototypeOf(GLRenderNode.prototype), 'render', this).call(this, gl, state);
      forEach(this._uniformMap, function (val, key) {
        return state.applyUniformValue(key, val);
      });
      this._iterateChildren(gl, state, 'render');
      return true;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      get(GLRenderNode.prototype.__proto__ || Object.getPrototypeOf(GLRenderNode.prototype), 'dispose', this).call(this);
      this._childrenCacheMap = {};
      this._renderMiddlewareFuncs = [];
      this._uniformMap = {};
      this._updateMiddlewareFuncs = [];
      this.children.forEach(function (c) {
        return c && c.dispose();
      });
    }
  }, {
    key: 'setUniformValue',
    value: function setUniformValue(name, value) {
      if (value instanceof Array) {
        value = new Float32Array(value);
      }
      if (value === undefined) {
        delete this._uniformMap[name];
      } else {
        this._uniformMap[name] = value;
      }
      this.invalid();
      return this;
    }
  }, {
    key: 'getUniformValue',
    value: function getUniformValue(name) {
      var value = this._uniformMap[name];
      if (value instanceof Float32Array) {
        return new Float32Array(value);
      }
      return value;
    }
  }]);
  return GLRenderNode;
}(Renderer);

var WebGL_CONST = {};
if (isFunc(window.WebGLRenderingContext) || isObj(window.WebGLRenderingContext)) {
  var copyConst = function copyConst(source) {
    for (var name in source) {
      if (/^[A-Z_\d]+$/.test(name)) {
        WebGL_CONST[name] = source[name];
      }
    }
  };
  copyConst(WebGLRenderingContext);
  copyConst(WebGLRenderingContext.prototype);
  WebGL_CONST.HALF_FLOAT_OES = 36193;
}

/**
 * Created by brian on 17/07/2017.
 */
var GL_STATE_VARS = {
  DEPTH_TEST: {
    get: function get$$1(gl) {
      return gl.getParameter(gl.DEPTH_TEST);
    },
    set: changeGLStateFunc(WebGL_CONST.DEPTH_TEST)
  },
  BLEND: {
    get: function get$$1(gl) {
      return gl.getParameter(gl.BLEND);
    },
    set: changeGLStateFunc(WebGL_CONST.BLEND)
  },
  CULL_FACE: {
    get: function get$$1(gl) {
      return gl.getParameter(gl.CULL_FACE);
    },
    set: changeGLStateFunc(WebGL_CONST.CULL_FACE)
  },
  DEPTH_WRITEMASK: {
    get: function get$$1(gl) {
      return gl.getParameter(gl.DEPTH_WRITEMASK);
    },
    set: function set$$1(gl, val) {
      return gl.depthMask(!!val);
    }
  }
};
var FLOAT = WebGL_CONST.FLOAT;
var SAMPLER_CUBE = WebGL_CONST.SAMPLER_CUBE;
var SAMPLER_2D = WebGL_CONST.SAMPLER_2D;
var INT = WebGL_CONST.INT;
var BOOL = WebGL_CONST.BOOL;
var FLOAT_VEC4 = WebGL_CONST.FLOAT_VEC4;
var FLOAT_VEC3 = WebGL_CONST.FLOAT_VEC3;
var FLOAT_VEC2 = WebGL_CONST.FLOAT_VEC2;
var FLOAT_MAT2 = WebGL_CONST.FLOAT_MAT2;
var FLOAT_MAT3 = WebGL_CONST.FLOAT_MAT3;
var FLOAT_MAT4 = WebGL_CONST.FLOAT_MAT4;


var RenderState = function () {
  function RenderState(task) {
    classCallCheck(this, RenderState);

    this.maxActiveTextureCount = task.maxActiveTextureCount;
    this.gl = task.gl;
    this.task = task;
    this.program = null;
    this.glState = {
      bindingFBO: null,
      bindingTexture: null
    };
  }

  createClass(RenderState, [{
    key: 'resetGLStates',
    value: function resetGLStates() {
      applyGLStates(this.gl, {
        DEPTH_TEST: false,
        CULL_FACE: false,
        BLEND: false,
        DEPTH_WRITEMASK: false
      });
    }
  }, {
    key: 'applyUniformValue',
    value: function applyUniformValue(name, value) {
      var uniformInfo = this.program.uniformInfoMap[name];
      if (!uniformInfo) {
        console.warn('unable to set uniform value:' + name);
      } else {
        var type = uniformInfo.type;
        var gl = this.gl;
        var loc = uniformInfo.loc;
        if (type === FLOAT) {
          gl.uniform1f(loc, +value);
        } else if (type === SAMPLER_CUBE || type === SAMPLER_2D || type === INT) {
          gl.uniform1i(loc, parseInt(value));
        } else if (type === BOOL) {
          gl.uniform1i(loc, value ? 1 : 0);
        } else if (type === FLOAT_VEC2) {
          gl.uniform2fv(loc, value);
        } else if (type === FLOAT_VEC3) {
          gl.uniform3fv(loc, value);
        } else if (type === FLOAT_VEC4) {
          gl.uniform4fv(loc, value);
        } else if (type === FLOAT_MAT2) {
          gl.uniformMatrix2fv(loc, false, value);
        } else if (type === FLOAT_MAT3) {
          gl.uniformMatrix3fv(loc, false, value);
        } else if (type === FLOAT_MAT4) {
          gl.uniformMatrix4fv(loc, false, value);
        } else {
          console.warn('type ' + type + ' is not supported');
        }
      }
    }
  }]);
  return RenderState;
}();

function snapshotGLState(gl) {
  var ret = {};
  forEach(GL_STATE_VARS, function (def, name) {
    ret[name] = def.get(gl);
  });
  return ret;
}

function applyGLStates(gl, states) {
  forEach(GL_STATE_VARS, function (def, name) {
    def.set(gl, states[name]);
  });
}

function changeGLStateFunc(state) {
  return function (gl, val) {
    return gl[val ? 'enable' : 'disable'](state);
  };
}

/**
 * Created by brian on 19/07/2017.
 */
var EventTarget = function () {
  function EventTarget() {
    classCallCheck(this, EventTarget);
  }

  createClass(EventTarget, [{
    key: 'addEventListener',
    value: function addEventListener(name, func) {
      _addEventListener(this, name, func);
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(name, func) {
      _removeEventListener(this, name, func);
    }
  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(name, evt) {
      _dispatchEvent(this, name, evt);
    }
  }]);
  return EventTarget;
}();

function _addEventListener(obj, evtName, handler, once) {
  if (isStr(evtName) && evtName && isFunc(handler)) {
    var hs = void 0;
    if (!obj.hasOwnProperty('$$callbacks')) {
      obj.$$callbacks = {};
    }
    var cbs = obj.$$callbacks;
    if (!(hs = cbs[evtName])) {
      hs = cbs[evtName] = [];
    }
    return arrAdd(hs, once ? wrapOnceFunc(handler) : handler);
  }
  return false;
}

function _dispatchEvent(obj, evtName) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var callbacks = void 0,
      handlers = void 0;
  if (!obj.hasOwnProperty('$$callbacks') || !(handlers = (callbacks = obj.$$callbacks)[evtName])) {
    return false;
  }
  callbacks[evtName] = handlers.reduce(function (next, call) {
    if (isFunc(call) && call.apply(obj, args) !== -1) {
      next.push(call);
    }
    return next;
  }, []).filter(function (func) {
    return handlers.indexOf(func) > -1;
  });
  return obj;
}

function _removeEventListener(obj, evtName, handler) {
  var cbs = void 0,
      hs = void 0;
  if ((cbs = obj.$$callbacks) && (hs = cbs[evtName]) && hs) {
    arrRemove(hs, handler);
  }
  return obj;
}

function wrapOnceFunc(func) {
  return function () {
    func.apply(this, arguments);
    return -1;
  };
}

function addEventListenerOnce(target, evtName, handler) {
  target.addEventListener(evtName, function func() {
    setTimeout(function () {
      return target.removeEventListener(evtName, func);
    }, 0);
    handler.apply(this, arguments);
  });
}

/**
 * Created by brian on 17/07/2017.
 */
var EVENT_FRAME_START = 's';
var EVENT_FRAME_END = 'e';

var GLTask = function (_EventTarget) {
  inherits(GLTask, _EventTarget);

  function GLTask() {
    classCallCheck(this, GLTask);

    var _this = possibleConstructorReturn(this, (GLTask.__proto__ || Object.getPrototypeOf(GLTask)).call(this));

    _this.rootNode = new GLRenderNode({ name: 'root' });
    _this.rootNode.parent = _this;
    _this._needRepaint = true;
    _this._defaultGLStates = null;
    return _this;
  }

  createClass(GLTask, [{
    key: 'initialize',
    value: function initialize(arg) {
      if (isObj(arg.gl)) {
        this.gl = arg.gl;
      }
      var gl = this.gl;
      this.maxActiveTextureCount = gl ? gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) : 0;
      return this;
    }
  }, {
    key: 'watchDocument',
    value: function watchDocument() {
      var _this2 = this;

      this.unwatchDocument();
      document.addEventListener('pause', this._pauseHandler = function () {
        _this2._paused = true;
      }, true);
      document.addEventListener('resume', this._resumeHandler = function () {
        _this2._paused = false;
      }, true);
      return this;
    }
  }, {
    key: 'unwatchDocument',
    value: function unwatchDocument() {
      document.removeEventListener('pause', this._pauseHandler, true);
      document.removeEventListener('resume', this._resumeHandler, true);
    }
  }, {
    key: 'render',
    value: function render() {
      var gl = this.gl;
      if (!this._paused && gl) {
        var state = new RenderState(this);
        this.last = this.now;
        this.now = Date.now();
        if (!this.rootNode.disabled) {
          this.rootNode.update(gl, state);
        }
        if (!this.rootNode.disabled && this._needRepaint) {
          this.dispatchEvent(EVENT_FRAME_START, { target: this, state: state });
          var states = this._defaultGLStates;
          if (states) {
            state.resetGLStates();
          }
          this.rootNode.render(gl, state);
          if (states) {
            applyGLStates(gl, states);
          }
          this.dispatchEvent(EVENT_FRAME_END, { target: this, state: state });
        }
        this._needRepaint = false;
      }
    }
  }, {
    key: 'snapshotGLStates',
    value: function snapshotGLStates() {
      if (this.gl) {
        return this._defaultGLStates = snapshotGLState(this.gl);
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.unwatchDocument();
      this.rootNode.dispose();
    }
  }, {
    key: 'invalid',
    value: function invalid() {
      this._needRepaint = true;
    }
  }]);
  return GLTask;
}(EventTarget);

/**
 * Created by brian on 17/07/2017.
 */
var GLMesh = function (_GLRenderNode) {
  inherits(GLMesh, _GLRenderNode);

  function GLMesh() {
    classCallCheck(this, GLMesh);
    return possibleConstructorReturn(this, (GLMesh.__proto__ || Object.getPrototypeOf(GLMesh)).apply(this, arguments));
  }

  createClass(GLMesh, [{
    key: 'initialize',
    value: function initialize(arg) {
      get(GLMesh.prototype.__proto__ || Object.getPrototypeOf(GLMesh.prototype), 'initialize', this).call(this, arg);
      this.primitive = arg.primitive || WebGL_CONST.POINTS;
      this.startIndex = arg.startIndex || 0;
      this.drawCount = arg.drawCount;
    }
  }, {
    key: 'render',
    value: function render(gl, state) {
      get(GLMesh.prototype.__proto__ || Object.getPrototypeOf(GLMesh.prototype), 'render', this).call(this, gl, state);
      var viewport = void 0;
      var drawingViewport = this.drawingViewport;
      if (drawingViewport) {
        viewport = gl.getParameter(gl.VIEWPORT);
        gl.viewport(drawingViewport[0], drawingViewport[1], drawingViewport[2], drawingViewport[3]);
      }
      this.beforeDraw(gl, state);
      this.draw(gl, state);
      this.afterDraw(gl, state);
      if (viewport) {
        gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
      }
      return true;
    }
  }, {
    key: 'beforeDraw',
    value: function beforeDraw(gl, state) {}
  }, {
    key: 'draw',
    value: function draw(gl, state) {
      gl.drawArrays(this.primitive, this.startIndex, this.drawCount);
    }
  }, {
    key: 'afterDraw',
    value: function afterDraw(gl, state) {}
  }]);
  return GLMesh;
}(GLRenderNode);

/**
 * Created by brian on 17/07/2017.
 */
var TYPE_SIZES = [WebGL_CONST.FLOAT, 1, WebGL_CONST.FLOAT_VEC2, 2, WebGL_CONST.FLOAT_VEC3, 3, WebGL_CONST.FLOAT_VEC4, 4];

var GLProgram = function (_GLRenderNode) {
  inherits(GLProgram, _GLRenderNode);

  function GLProgram() {
    classCallCheck(this, GLProgram);
    return possibleConstructorReturn(this, (GLProgram.__proto__ || Object.getPrototypeOf(GLProgram)).apply(this, arguments));
  }

  createClass(GLProgram, [{
    key: 'initialize',
    value: function initialize(arg) {
      get(GLProgram.prototype.__proto__ || Object.getPrototypeOf(GLProgram.prototype), 'initialize', this).call(this, arg);
      this.uniformInfoMap = {};
      this.attributeInfoMap = {};
      this.samplerNames = [];
      this.fragmentShader = arg.fragmentShader;
      this.vertexShader = arg.vertexShader;
    }
  }, {
    key: 'update',
    value: function update(gl, state) {
      get(GLProgram.prototype.__proto__ || Object.getPrototypeOf(GLProgram.prototype), 'update', this).call(this, gl, state);
      if (!this._glHandle) {
        this.setup(gl);
      }
    }
  }, {
    key: 'render',
    value: function render(gl, state) {
      state.program = this;
      gl.useProgram(this._glHandle);
      get(GLProgram.prototype.__proto__ || Object.getPrototypeOf(GLProgram.prototype), 'render', this).call(this, gl, state);
    }
  }, {
    key: 'activeTextureIndexForName',
    value: function activeTextureIndexForName(name) {
      return this.samplerNames.indexOf(name);
    }
  }, {
    key: 'setup',
    value: function setup(gl) {
      try {
        var program = createGLProgram(gl, this.vertexShader, this.fragmentShader, this.marcos);
        this._glHandle = program;
        this._gl = gl;
        var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (var i = 0; i < uniformCount; i++) {
          var info = gl.getActiveUniform(program, i);
          info.loc = gl.getUniformLocation(program, info.name);
          this.uniformInfoMap[info.name] = info;
          var type = info.type;
          if (type === WebGL_CONST.SAMPLER_2D || type === WebGL_CONST.SAMPLER_CUBE) {
            this.samplerNames.push(info.name);
          }
        }
        var attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (var _i = 0; _i < attributeCount; _i++) {
          var _info = gl.getActiveAttrib(program, _i);
          _info.loc = gl.getAttribLocation(program, _info.name);
          var index = TYPE_SIZES.indexOf(_info.type);
          if (index === -1) {
            throw Error('un supported type:' + _info.type);
          }
          _info.vecSize = TYPE_SIZES[index + 1];
          this.attributeInfoMap[_info.name] = _info;
        }
      } catch (ex) {
        this.onCompileError(ex);
        throw ex;
      }
    }
  }, {
    key: 'onCompileError',
    value: function onCompileError(e) {}
  }, {
    key: 'dispose',
    value: function dispose() {
      get(GLProgram.prototype.__proto__ || Object.getPrototypeOf(GLProgram.prototype), 'dispose', this).call(this);
      if (this._glHandle) {
        this._gl.deleteProgram(this._glHandle);
        this._glHandle = this._gl = null;
      }
    }
  }]);
  return GLProgram;
}(GLRenderNode);

function createGLProgram(gl, vSource, fSource, define) {
  var program = gl.createProgram();
  var shader = gl.createShader(gl.FRAGMENT_SHADER);
  var marco = '';
  var error = void 0;
  forEach(define, function (val, key) {
    marco += '#define ' + key + ' ' + val + '\n';
  });
  gl.shaderSource(shader, marco + fSource);
  gl.compileShader(shader);
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    error = gl.getShaderInfoLog(shader);
    throw Error('fragment shader fail:\n' + prettyPrintError(error, marco + fSource));
  }
  gl.attachShader(program, shader);
  gl.deleteShader(shader);
  shader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(shader, marco + vSource);
  gl.compileShader(shader);
  compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    error = gl.getShaderInfoLog(shader);
    throw Error('vertex shader fail:\n' + prettyPrintError(error, marco + vSource));
  }
  gl.attachShader(program, shader);
  gl.linkProgram(program);
  gl.deleteShader(shader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    error = gl.getProgramInfoLog(program);
    throw Error('program link fail:' + error);
  }
  return program;
}

function prettyPrintError(message, source) {
  var exp = /\d+:(\d+):(.*?)(\n|$)/g;
  var match = void 0;
  var dictionary = {};
  do {
    match = exp.exec(message);
    if (match) {
      var line = match[1];
      var reason = match[2];
      dictionarySet(dictionary, line, '*** ERROR:' + reason + ' ***');
    }
  } while (match);
  var lines = source.split('\n');
  var errorLines = [];
  forEach(dictionary, function (reasons, line) {
    var index = line - 1;
    errorLines.push(lines[index] + '\nline:' + index + ':' + reasons.join('\n') + '\n');
  });
  return errorLines.join('\n');
}

function dictionarySet(target, key, value) {
  var arr = target[key];
  if (!arr) {
    target[key] = [value];
  } else if (arr.indexOf(value) === -1) {
    arr.push(value);
  } else {
    return false;
  }
  return true;
}

/**
 * Created by brian on 17/07/2017.
 */
var GLAttribute = function (_Renderer) {
  inherits(GLAttribute, _Renderer);

  function GLAttribute() {
    classCallCheck(this, GLAttribute);
    return possibleConstructorReturn(this, (GLAttribute.__proto__ || Object.getPrototypeOf(GLAttribute)).apply(this, arguments));
  }

  createClass(GLAttribute, [{
    key: 'initialize',
    value: function initialize(arg) {
      this.stride = arg.stride || 0;
      this.offset = arg.offset || 0;
      this.data = arg.data;
    }
  }, {
    key: 'render',
    value: function render(gl, state) {
      var info = state.program.attributeInfoMap[this.name];
      if (!info) {
        console.error('no attribute named ' + this.name + ' found');
      } else {
        if (!this._glHandle) {
          this.setup(gl);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this._glHandle);
        if (this._dataInvalid) {
          this.bufferData(gl);
          this._dataInvalid = false;
          this._data = null;
        }
        gl.enableVertexAttribArray(info.loc);
        gl.vertexAttribPointer(info.loc, info.vecSize, gl.FLOAT, false, this.stride, this.offset);
      }
    }
  }, {
    key: 'bufferData',
    value: function bufferData(gl) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this._glHandle);
      gl.bufferData(gl.ARRAY_BUFFER, this._data, gl.STATIC_DRAW);
    }
  }, {
    key: 'setup',
    value: function setup(gl) {
      this._glHandle = gl.createBuffer();
      this._gl = gl;
    }
  }, {
    key: 'convertValidData',
    value: function convertValidData(data) {
      var fa = data;
      if (data instanceof Array || data instanceof ArrayBuffer) {
        fa = new Float32Array(data);
      }
      if (!(fa instanceof Float32Array)) {
        throw Error('Float32Array expected');
      }
      return fa;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this._glHandle) {
        this._gl.deleteBuffer(this._glHandle);
        this._glHandle = null;
      }
    }
  }, {
    key: 'data',
    set: function set$$1(v) {
      this._data = this.convertValidData(v);
      this._dataInvalid = true;
      this.invalid();
    }
  }]);
  return GLAttribute;
}(Renderer);

/**
 * Created by brian on 17/07/2017.
 */
var GLTexture = function (_Renderer) {
  inherits(GLTexture, _Renderer);

  function GLTexture() {
    classCallCheck(this, GLTexture);
    return possibleConstructorReturn(this, (GLTexture.__proto__ || Object.getPrototypeOf(GLTexture)).apply(this, arguments));
  }

  createClass(GLTexture, [{
    key: 'initialize',
    value: function initialize(arg) {
      this.type = arg.type === WebGL_CONST.TEXTURE_CUBE_MAP ? WebGL_CONST.TEXTURE_CUBE_MAP : WebGL_CONST.TEXTURE_2D;
      this.dataFormat = arg.dataFormat || WebGL_CONST.UNSIGNED_BYTE;
      this.data = arg.data;
      this.size = [0, 0];
      this.flipY = arg.flipY === undefined ? true : arg.flipY;
      this.isDynamic = arg.isDynamic;
      this.params = {
        TEXTURE_MAG_FILTER: arg.magFilter || WebGL_CONST.NEAREST,
        TEXTURE_MIN_FILTER: arg.minFilter || WebGL_CONST.NEAREST,
        TEXTURE_WRAP_S: arg.wrapS || WebGL_CONST.CLAMP_TO_EDGE,
        TEXTURE_WRAP_T: arg.wrapT || WebGL_CONST.CLAMP_TO_EDGE
      };
      this.format = arg.format || WebGL_CONST.RGBA;
    }
  }, {
    key: 'update',
    value: function update(gl, state) {
      if (this.isDynamic) {
        this.invalid();
      }
    }
  }, {
    key: 'render',
    value: function render(gl, state) {
      this.setup(gl);
      gl.bindTexture(this.type, this._glHandle);
      state.glState.bindingTexture = this;
      this.bufferData(gl);
    }
  }, {
    key: 'bufferData',
    value: function bufferData(gl) {
      if (this._dataInvalid || this.isDynamic) {
        this._bufferData(gl);
        this._dataInvalid = false;
      }
    }
  }, {
    key: '_bufferData',
    value: function _bufferData(gl) {
      var data = this._data;
      if (data) {
        gl.bindTexture(this.type, this._glHandle);
        var format = this.format;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
        this._texImage2D(gl, format, this.dataFormat, data);
        this.useTexParam(gl, this.params);
        if (!this.isDynamic) {
          this._data = null;
        }
      }
    }
  }, {
    key: 'useTexParam',
    value: function useTexParam(gl, params) {
      var targetTexture = this.type;
      var dataFormat = this.dataFormat;
      var method = dataFormat === WebGL_CONST.UNSIGNED_BYTE ? 'texParameteri' : 'texParameterf';
      forEach(params, function (val, key) {
        gl[method](targetTexture, gl[key], val);
      });
    }
  }, {
    key: 'setup',
    value: function setup(gl) {
      if (!this._glHandle) {
        var texture = gl.createTexture();
        var dataFormat = this.dataFormat;
        if (dataFormat === WebGL_CONST.FLOAT && !gl.getExtension('OES_texture_float')) {
          throw Error('float texture is not support');
        } else if (dataFormat === WebGL_CONST.HALF_FLOAT_OES && !gl.getExtension('OES_texture_half_float')) {
          throw Error('half float texture is not support');
        }
        this._glHandle = texture;
        this._gl = gl;
      }
      return this;
    }
  }, {
    key: 'checkValidData',
    value: function checkValidData(source) {
      var width = 0,
          height = 0,
          format = void 0;
      var isDynamic = false;
      var process = texImage;
      var isCanvas = void 0;
      if (isImageLike(source)) {
        if (!source.complete) {
          throw Error('image as data should be loaded');
        }
        width = source.naturalWidth;
        height = source.naturalHeight;
        format = WebGL_CONST.RGBA;
      } else if (isVideo(source)) {
        width = source.videoWidth;
        height = source.videoHeight;
        format = WebGL_CONST.RGB;
        isDynamic = true;
      } else if ((isCanvas = isCanvasLike(source)) || isObjectSource(source)) {
        width = source.width;
        height = source.height;
        format = source.format || this.format;
        if (!isCanvas) {
          process = isFunc(source.data) ? source.data : texImageData;
        }
      } else if (source != null) {
        throw Error('invalid texture source');
      }
      this._texImage2D = process;
      this.isDynamic = isDynamic;
      return { width: width, height: height, format: format };
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this._glHandle) {
        this._gl.deleteTexture(this._glHandle);
        this._data = this._gl = this._glHandle = null;
      }
    }
  }, {
    key: '_texImage2D',
    value: function _texImage2D(gl, format, dataFormat, data) {}
  }, {
    key: 'data',
    set: function set$$1(source) {
      var info = this.checkValidData(source);
      this.size = [info.width, info.height];
      this.format = info.format;
      this._data = source;
      this._dataInvalid = true;
      this.invalid();
    }
  }]);
  return GLTexture;
}(Renderer);

function texImage(gl, format, dataFormat, data) {
  gl.texImage2D(gl.TEXTURE_2D, 0, format, format, dataFormat, data);
}

function texImageData(gl, format, dataFormat, data) {
  gl.texImage2D(gl.TEXTURE_2D, 0, format, data.width, data.height, 0, format, dataFormat, data.data);
}

function isObjectSource(source) {
  if (isObj(source) && +source.width && +source.height) {
    if (isObj(source.data)) {
      return source.data.buffer instanceof ArrayBuffer;
    }
    return isFunc(source.data);
  }
  return false;
}

function isImageLike(source) {
  return source instanceof HTMLImageElement || source instanceof Image;
}

function isCanvasLike(source) {
  return source instanceof HTMLCanvasElement || source instanceof ImageData;
}

function isVideo(source) {
  return source instanceof HTMLVideoElement;
}

/**
 * Created by brian on 24/07/2017.
 */
var GLFrameBuffer = function (_Renderer) {
  inherits(GLFrameBuffer, _Renderer);

  function GLFrameBuffer() {
    classCallCheck(this, GLFrameBuffer);
    return possibleConstructorReturn(this, (GLFrameBuffer.__proto__ || Object.getPrototypeOf(GLFrameBuffer)).apply(this, arguments));
  }

  createClass(GLFrameBuffer, [{
    key: 'initialize',
    value: function initialize(arg) {
      this._texture = new GLTexture(arg.texture || { name: 'fbo-target' });
      this._w = arg.width || 0;
      this._h = arg.height || 0;
      this.shouldClearTexture = true;
      this.shouldCheckComplete = true;
    }
  }, {
    key: 'update',
    value: function update(gl, state) {
      this._texture.update(gl, state);
    }
  }, {
    key: 'unbind',
    value: function unbind(gl, state, ignoreError) {
      var binding = state.glState.bindingFBO;
      if (binding === this) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else if (binding && !ignoreError) {
        throw Error('the framebuffer to unbind is not binding');
      }
    }
  }, {
    key: 'setup',
    value: function setup(gl) {
      if (!this._glHandle) {
        this._gl = gl;
        this._glHandle = gl.createFramebuffer();
        var texture = this._texture;
        texture.setup(gl);
        gl.bindTexture(gl.TEXTURE_2D, texture._glHandle);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._glHandle);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture._glHandle, 0);
        return true;
      }
    }
  }, {
    key: 'render',
    value: function render(gl, state) {
      var w = this._w || gl.drawingBufferWidth;
      var h = this._h || gl.drawingBufferHeight;
      var texture = this._texture;
      var bindingTex = state.glState.bindingTexture;
      this.setup(gl);
      if (this._glHandle === -1) {}
      gl.bindFramebuffer(gl.FRAMEBUFFER, this._glHandle);
      state.glState.bindingFBO = this;
      texture.useTexParam(gl, texture.params);
      texture.size = [w, h];
      var dataFormat = texture.dataFormat;
      if (this.shouldClearTexture) {
        var format = gl.RGBA;
        gl.bindTexture(gl.TEXTURE_2D, texture._glHandle);
        gl.texImage2D(gl.TEXTURE_2D, 0, format, w, h, 0, format, dataFormat, null);
        this.shouldClearTexture = false;
      }
      if (this.shouldCheckComplete) {
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
          var moreReason = '';
          if (dataFormat === gl.FLOAT || dataFormat === WebGL_CONST.HALF_FLOAT_OES) {
            moreReason = ' Not support render to ' + (dataFormat === WebGL_CONST.HALF_FLOAT_OES ? 'half ' : '') + ' float texture';
          }
          throw Error('FrameBuffer failed' + moreReason);
        } else {
          this.shouldCheckComplete = false;
        }
      }
      if (bindingTex) {
        bindingTex.render(gl, state);
      }
    }
  }, {
    key: 'bindSampler2D',
    value: function bindSampler2D(gl, state, name) {
      this.unbind(gl, state, true);
      renderSampler2D(gl, state, this._texture, name);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this._glHandle) {
        this._gl.deleteFramebuffer(this._glHandle);
        this._texture.dispose();
        this._glHandle = -1;
      }
    }
  }, {
    key: 'size',
    set: function set$$1(s) {
      this.width = s[0];
      this.height = s[1];
    },
    get: function get$$1() {
      return [this._w, this._h];
    }
  }, {
    key: 'width',
    get: function get$$1() {
      return this._w;
    },
    set: function set$$1(v) {
      v = parseInt(v);
      if (this._w !== v) {
        this._w = v;
        this.invalid();
      }
    }
  }, {
    key: 'height',
    get: function get$$1() {
      return this._h;
    },
    set: function set$$1(v) {
      v = parseInt(v);
      if (this._h !== v) {
        this._h = v;
        this.invalid();
      }
    }
  }]);
  return GLFrameBuffer;
}(Renderer);

/**
 * Created by brian on 17/07/2017.
 */
var GLSampler2D = function (_GLTexture) {
  inherits(GLSampler2D, _GLTexture);

  function GLSampler2D() {
    classCallCheck(this, GLSampler2D);
    return possibleConstructorReturn(this, (GLSampler2D.__proto__ || Object.getPrototypeOf(GLSampler2D)).apply(this, arguments));
  }

  createClass(GLSampler2D, [{
    key: 'render',
    value: function render(gl, state, keepBinding) {
      if (this._data instanceof GLFrameBuffer) {
        renderSampler2D(gl, state, this._data._texture, this.name);
        if (!keepBinding && this._unbindFbo) {
          this._data.unbind(gl, state);
        }
      } else {
        renderSampler2D(gl, state, this);
      }
    }
  }, {
    key: 'dataFromFrameBuffer',
    value: function dataFromFrameBuffer(fbo, keepBinding) {
      if (fbo instanceof GLFrameBuffer) {
        this._data = fbo;
        this._unbindFbo = !keepBinding;
      }
    }
  }]);
  return GLSampler2D;
}(GLTexture);

function renderSampler2D(gl, state, texture, name) {
  name = name || texture.name;
  var index = state.program.activeTextureIndexForName(name);
  if (index !== -1) {
    gl.activeTexture(gl.TEXTURE0 + index);
    GLTexture.prototype.render.call(texture, gl, state);
    state.applyUniformValue(name, index);
  } else {
    console.warn('sampler ' + name + ' not found');
  }
}

/**
 * Created by brian on 14/10/2016.
 */
var sin = Math.sin;
var cos = Math.cos;
var mat3Proto = {
  translate: function translate(x, y) {
    return concatMat3(this, [1, 0, 0, 0, 1, 0, x || 0, y || 0, 1]);
  },
  scale: function scale(x, y) {
    return concatMat3(this, [defaultIfNaN(x, 1), 0, 0, 0, defaultIfNaN(y, 1), 0, 0, 0, 1]);
  },
  rotate: function rotate(rotation) {
    var sina = sin(rotation);
    var cosa = cos(rotation);
    return concatMat3(this, [cosa, sina, 0, -sina, cosa, 0, 0, 0, 1]);
  },
  concat: function concat(mat) {
    return concatMat3(this, mat);
  },
  invert: function invert() {
    return invertMat3(this, this);
  },
  clone: function clone() {
    return createMat3(this);
  },
  toString: function toString() {
    var ret = [];
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        ret.push(this[j + i * 3].toFixed(2));
      }ret.push('\n');
    }
    return ret.join(' ');
  }
};

function createMat3(elements) {
  if (!elements) {
    elements = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  }
  if (elements.length !== 9) {
    throw Error('9 elements expected');
  }
  var mat = new Float32Array(elements);
  forEach(mat3Proto, function (v, k) {
    return mat[k] = v;
  });
  return mat;
}

function vec3transformMat3(x, y, z, m) {
  var out = new Float32Array(3);
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}

function concatMat3(mat, other) {
  var a = other,
      b = mat,
      out = b;
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      b00 = b[0],
      b01 = b[1],
      b02 = b[2],
      b10 = b[3],
      b11 = b[4],
      b12 = b[5],
      b20 = b[6],
      b21 = b[7],
      b22 = b[8];

  out[0] = a00 * b00 + a01 * b10 + a02 * b20;
  out[1] = a00 * b01 + a01 * b11 + a02 * b21;
  out[2] = a00 * b02 + a01 * b12 + a02 * b22;

  out[3] = a10 * b00 + a11 * b10 + a12 * b20;
  out[4] = a10 * b01 + a11 * b11 + a12 * b21;
  out[5] = a10 * b02 + a11 * b12 + a12 * b22;

  out[6] = a20 * b00 + a21 * b10 + a22 * b20;
  out[7] = a20 * b01 + a21 * b11 + a22 * b21;
  out[8] = a20 * b02 + a21 * b12 + a22 * b22;
  return out;
}

function invertMat3(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  var b01 = a22 * a11 - a12 * a21;
  var b11 = -a22 * a10 + a12 * a20;
  var b21 = a21 * a10 - a11 * a20;
  // Calculate the determinant
  var det = a00 * b01 + a01 * b11 + a02 * b21;
  if (!det) {
    return null;
  }
  det = 1.0 / det;
  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}

function defaultIfNaN(v, def) {
  var ret = +v;
  return isNaN(ret) ? def : ret;
}

function sizeEquals(s0, s1) {
  return s0 && s1 && s0[0] === s1[0] && s0[1] === s1[1];
}
function sizeValid(s) {
  return s && !isNaN(s[0]) && !isNaN(s[1]);
}

/**
 * Created by brian on 18/07/2017.
 */
var VARYING_TEX_COORD = 'vTexCoord';
var UNIFORM_TEX_SIZE = 'uTexSize';
var UNIFORM_TEX_SOURCE = 'uSampler';

var VERTEX_SHADER = '\nprecision mediump float;\n\nattribute vec2 aQuad;\nattribute vec2 aTexCoord;\n\nvarying vec2 ' + VARYING_TEX_COORD + ';\n\nvoid main(){\n   ' + VARYING_TEX_COORD + ' = aTexCoord;\n   gl_Position = vec4(aQuad,0.0,1.0);\n}\n';
var COPY_FRAG_SHADER = '\nprecision mediump float;\nuniform sampler2D ' + UNIFORM_TEX_SOURCE + ';\nvarying vec2 ' + VARYING_TEX_COORD + ';\n\nvoid main(){\n  gl_FragColor = texture2D(' + UNIFORM_TEX_SOURCE + ',' + VARYING_TEX_COORD + ');\n}\n';

var QUAD_DATA = [-1, -1, 1, -1, -1, 1, 1, 1];

var GLFilter = function (_GLProgram) {
  inherits(GLFilter, _GLProgram);

  function GLFilter() {
    classCallCheck(this, GLFilter);
    return possibleConstructorReturn(this, (GLFilter.__proto__ || Object.getPrototypeOf(GLFilter)).apply(this, arguments));
  }

  createClass(GLFilter, [{
    key: 'initialize',
    value: function initialize(arg) {
      var _this2 = this;

      if (arg.program) {
        arg.fragmentShader = PROGRAM_TEMPLATE(arg.program);
      }
      if (!arg.vertexShader) {
        arg.vertexShader = VERTEX_SHADER;
      }
      if (!arg.fragmentShader) {
        arg.fragmentShader = COPY_FRAG_SHADER;
      }
      get(GLFilter.prototype.__proto__ || Object.getPrototypeOf(GLFilter.prototype), 'initialize', this).call(this, arg);
      this._useTexSize = this.fragmentShader.indexOf(UNIFORM_TEX_SIZE) > -1 || this.vertexShader.indexOf(UNIFORM_TEX_SIZE) > -1;
      this.setupGLEntities(arg);
      this.createChildren().forEach(function (c) {
        return _this2.addChild(c);
      });
      this.targets = [];
      this._targetsInfo = [];
      this.size = [0, 0];
    }
  }, {
    key: 'setupGLEntities',
    value: function setupGLEntities(arg) {
      this.addChild(new GLAttribute({ name: 'aQuad', data: QUAD_DATA }));
      this.addChild(new GLAttribute({ name: 'aTexCoord', data: [0, 0, 1, 0, 0, 1, 1, 1] }));
      this.setupSamplers(arg);
    }
  }, {
    key: 'setupSamplers',
    value: function setupSamplers(arg) {}
  }, {
    key: 'transformTexCoord',
    value: function transformTexCoord(mat) {
      var aTexCoord = this.findChildByName('aTexCoord');
      aTexCoord.data = GLFilter.transformTexCoord(mat);
      this.invalid();
    }
  }, {
    key: 'transformPosCoord',
    value: function transformPosCoord(mat) {
      var aQuadData = new Float32Array(QUAD_DATA);
      for (var i = 0; i < aQuadData.length; i += 2) {
        var point = vec3transformMat3(aQuadData[i], aQuadData[i + 1], 1, mat);
        aQuadData[i] = point[0] / point[2];
        aQuadData[i + 1] = point[1] / point[2];
      }
      var aQuad = this.findChildByName('aQuad');
      aQuad.data = aQuadData;
      this.invalid();
    }
  }, {
    key: 'createChildren',
    value: function createChildren() {
      return [new GLMesh({ drawCount: 4, primitive: WebGL_CONST.TRIANGLE_STRIP })];
    }
  }, {
    key: '_getSize',
    value: function _getSize() {
      return this._size;
    }
  }, {
    key: 'onSizeChanged',
    value: function onSizeChanged(size) {
      if (this._useTexSize) {
        this.setUniformValue(UNIFORM_TEX_SIZE, size);
      }
    }
  }, {
    key: 'setSamplerData',
    value: function setSamplerData(data) {
      var sampler = this.findChildByName(this.sourceSamplerName);
      if (data instanceof GLFrameBuffer) {
        sampler.dataFromFrameBuffer(data);
      } else {
        sampler.data = data;
      }
      this.size = sampler.size;
    }
  }, {
    key: '_getFBOParent',
    value: function _getFBOParent() {
      for (var children = this.children, i = children.length - 1; i >= 0; i--) {
        if (children[i] instanceof GLMesh) {
          return children[i];
        }
      }
    }
  }, {
    key: 'renderToFbo',
    value: function renderToFbo(fbo) {
      return this._getFBOParent().addRenderMiddleware(function (gl, state) {
        fbo.render(gl, state);
        gl.viewport(0, 0, fbo.width, fbo.height);
      });
    }
  }, {
    key: 'size',
    get: function get$$1() {
      return this._getSize();
    },
    set: function set$$1(size) {
      if (!sizeEquals(this._size, size)) {
        if (!sizeValid(size)) {
          throw Error('invalid size:' + size);
        }
        this.onSizeChanged(this._size = [size[0], size[1]]);
      }
    }
  }, {
    key: 'sourceSamplerName',
    get: function get$$1() {
      return UNIFORM_TEX_SOURCE;
    }
  }], [{
    key: 'transformTexCoord',
    value: function transformTexCoord(mat) {
      var aQuadData = new Float32Array(QUAD_DATA);
      var texData = new Float32Array(aQuadData.length);
      for (var i = 0; i < texData.length; i += 2) {
        var point = vec3transformMat3(aQuadData[i], aQuadData[i + 1], 1, mat);
        var x = point[0] / point[2];
        var y = point[1] / point[2];
        texData[i] = (x + 1) / 2;
        texData[i + 1] = (y + 1) / 2;
      }
      return texData;
    }
  }]);
  return GLFilter;
}(GLProgram);

GLFilter.primitive = WebGL_CONST.TRIANGLE_STRIP;
GLFilter.drawCount = 4;

function PROGRAM_TEMPLATE(program) {
  var exp = /vec4\s+mainImage\s?\(/.exec(program);
  var args = [];
  if (exp) {
    var startIndex = exp.index + exp[0].length;
    args = program.slice(startIndex, program.indexOf(')', startIndex)).split(',');
  }
  var headers = ['uniform sampler2D ' + UNIFORM_TEX_SOURCE, 'varying vec2 ' + VARYING_TEX_COORD, 'uniform vec2 ' + UNIFORM_TEX_SIZE];
  var bodys = [UNIFORM_TEX_SOURCE, VARYING_TEX_COORD, UNIFORM_TEX_SIZE];
  var sigs = ['sampler2D source', 'vec2 texcoord', 'vec2 texSize'];
  bodys.length = sigs.length = headers.length = args.length;
  return '\nprecision mediump float;\n' + headers.join(';\n') + ';\n\nvec4 mainImage(' + sigs.join(',') + ');\n\n' + program + '\n\nvoid main(){\n  gl_FragColor = mainImage(' + bodys.join(',') + ');\n}\n\n';
}

/**
 * 后置摄像机
 * @const
 * @type {number}
 */
var CAMERA_FACING_BACK = 0;
/**
 * 前置摄像机
 * @const
 * @type {number}
 */
var CAMERA_FACING_FRONT = 1;
/**
 * 默认相机分辨率
 * @const
 * @type {number}
 */
var CAMERA_QUALITY_DEFAULT = 0;
/**
 * 低相机分辨率
 * @const
 * @type {number}
 */
var CAMERA_QUALITY_LOW = 1;
/**
 * 中等相机分辨率
 * @const
 * @type {number}
 */
var CAMERA_QUALITY_MEDIUM = 2;
/**
 * 高相机分辨率
 * @const
 * @type {number}
 */
var CAMERA_QUALITY_HIGH = 3;

// android 设备的 最高分辨率
var CAMERA_QUALITY_DEVICE_HIGH = 4;

/**
 * APP相机权限未知，可能是用户首次安装APP，还没有进行相机权限询问
 * @const
 * @type {number}
 */
var CAMERA_AUTHORIZATION_STATUS_UNDEFINED = 0;

/**
 * APP相机权限被拒绝,无法使用相机
 * @const
 * @type {number}
 */
var CAMERA_AUTHORIZATION_STATUS_DENIED = 1;

/**
 * APP相机权限被允许
 * @const
 * @type {number}
 */
var CAMERA_AUTHORIZATION_STATUS__ALLOWED = 2;

var CAMERA_HINT_TAKE_PHOTO = 1 << 1;

var PIXEL_FORMAT_RGB = 0;



var PIXEL_FORMAT_I420 = 2;

var PIXEL_FORMAT_YV12 = 3;

var PIXEL_FORMAT_NV21 = 4;



var PIXEL_FORMAT_YUV420 = 6;

var IOS = 'IOS';
var ANDROID = 'ANDROID';
var isIOS = /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(navigator.userAgent);
// WebAR.js only support Android or iOS.

var isAndroid = /Android\s+\d+/.test(navigator.userAgent);

var isAlipayClient = /AlipayClient/.test(navigator.userAgent);

var isUCBrowser = /UCBrowser\//.test(navigator.userAgent);

function base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

// native在iOS8和9上发送的NSData信息是base64编码的string，而iOS10以上直接通过ArrayBuffer传递
function ensureArrayBuffer(buffer) {
  if (buffer instanceof ArrayBuffer || buffer instanceof Array) {
    return buffer;
  } else if (isStr(buffer)) {
    return base64ToArrayBuffer(buffer);
  } else if (isObj(buffer) && buffer.buffer instanceof ArrayBuffer) {
    return buffer.buffer;
  }
}

function defer() {
  var ret = {};
  ret.promise = new Promise(function (res, rej) {
    ret.resolve = res;
    ret.reject = rej;
  });
  return ret;
}

function interceptPromise(promise, func) {
  return promise.then(function (ret) {
    func();
    return ret;
  }, function (ex) {
    func();
    throw ex;
  });
}

/**
 * 101 错误码，APP相机权限已被拒绝
 * @const
 * @type {number}
 */
var ERROR_CODE_APP_CAMERA_PERMISSION_ALREADY_DENIED = 101;
/**
 * 102 错误码，APP相机权限本次被拒绝
 * @const
 * @type {number}
 */
var ERROR_CODE_APP_CAMERA_PERMISSION_CURRENT_DENIED = 102;
/**
 * 103 错误码，网页相机权限被拒绝
 * @const
 * @type {number}
 */
var ERROR_CODE_APP_WEBSITE_PERMISSION_DENIED = 103;
/**
 * 104 错误码，相机分辨率不被支持
 * @const
 * @type {number}
 */
var ERROR_CODE_RESOLUTION_NOT_SUPPORT = 104;
/**
 * 105 错误码，没有找到对应位置的摄像头
 * @const
 * @type {number}
 */
var ERROR_CODE_NO_SPECIFIED_DEVICE = 105;
/**
 * 106 错误码，没有找到指定名称的相机源
 * @const
 * @type {number}
 */
var ERROR_CODE_NO_CAMERA_SOURCE = 106;

/**
 * 108 错误码，关闭相机错误
 * @const
 * @type {number}
 */
var ERROR_CODE_CAMERA_CLOSE_FAIL = 108;
/**
 * 109 错误码，相机打开超时
 * @const
 * @type {number}
 */
var ERROR_CODE_CAMERA_OPEN_TIME_OUT = 109;

/**
 * 110 错误码，相机在打开完成前被关闭
 * @const
 * @type {number}
 */
var ERROR_CODE_CAMERA_OPEN_CANCEL = 110;

/**
 * 107 错误码，相机已经被占用
 * @const
 * @type {number}
 */
var ERROR_CODE_CAMERA_OCCUPIED = 107;

/**
 * 110 错误码，安卓相机打开未知错误
 * @const
 * @type {number}
 */
var ERROR_CODE_CAMERA_UNKNOWN_ANDROID = 111;
/**
 * 201 错误码，没有找到对应的Detector
 * @const
 * @type {number}
 */
var ERROR_CODE_NO_SPECIFIED_DETECTOR = 201;
/**
 * 202 错误码，重复创建Detector
 * @const
 * @type {number}
 */
var ERROR_CODE_DETECTOR_DUPLICATED = 202;
/**
 * 203 错误码，Detector加载Marker失败
 * @const
 * @type {number}
 */
var ERROR_CODE_DETECTOR_MARKER_LOAD_FAIL = 203;

/**
 * 204 错误码, Detector算法资源下载失败
 * @const
 * @type {number}
 */
var ERROR_CODE_DETECTOR_RESOURCE_FAIL = 204;

/**
 * 205 错误码，Marker Detector启动tracking失败
 * @const
 * @type {number}
 */
var ERROR_CODE_DETECTOR_TRACKING_FAIL = 205;

/**
 * 206 错误码，Detector加载资源超时
 * @const
 * @type {number}
 */
var ERROR_CODE_DETECTOR_LOAD_TIMEOUT = 206;
/**
 * 301 错误码，系统版本不支持
 * @const
 * @type {number}
 */
var ERROR_CODE_SYSTEM_NOT_SUPPORT = 301;
/**
 * 302 错误码，WebView暂不支持
 * @const
 * @type {number}
 */
var ERROR_CODE_WEBVIEW_NOT_SUPPORT = 302;
/**
 * 303 错误码，缺少WebAR运行时或者运行时创建失败
 * @const
 * @type {number}
 */
var ERROR_CODE_NO_NATIVE_RUNTIME = 303;

/**
 * 313 错误码，支持ARCore的bundle没有下载到
 * @const
 * @type {number}
 */
var ERROR_CODE_AR_CORE_BUNDLE_NOT_INSTALL = 313;

/**
 * 304 错误码，当前WebAR版本不支持此功能
 * @type {number}
 */
var ERROR_CODE_RUNTIME_NOT_SUPPORT = 304;

/**
 * 305 错误码，WKWebView 创建session失败
 * @type {number}
 */
var ERROR_CODE_WK_SESSION_FAIL = 305;

/**
 * 306 错误码，缺少ARCore的APKx
 * @type {number}
 */
var ERROR_CODE_ARCORE_NOT_INSTALLED = 306;

var ERROR_CODE_GO_TO_INSTALL_ARCORE = 309;

/**
 * 401 错误码，函数错误的参数
 * @const
 * @type {number}
 */
var ERROR_CODE_INVALID_ARGUMENT = 401;
/**
 * 402 错误码，WebGLContext对象错误
 * @const
 * @type {number}
 */
var ERROR_CODE_INVALID_WEBGL_CONTEXT = 402;

/**
 * 403 错误码，创建DisplayTarget时的container没有找到
 * @const
 * @type {number}
 */
var ERROR_CODE_INVALID_DISPLAY_CONTAINER = 403;

/**
 * 408 错误码，最近一次的异步操作没有结束，无法重新开始此次异步操作
 * @const
 * @type {number}
 */
var ERROR_CODE_LAST_OPERATION_NOT_COMPLETE = 408;

/**
 * 409 错误码，滤镜编译错误
 * @const
 * @type {number}
 */
var ERROR_CODE_FILTER_COMPILE_FAIL = 409;

/**
 * Android 相机分辨率超过设备允许范围
 */
// export const CONSTRAINT_NOT_SATISFIED_ERROR = 500

var handlers = {};

function makeError(code, message) {
  // 优先使用 message, 没有 message 使用 code
  var err = new Error(message || code);
  err.code = code;
  forEach(handlers, function (func) {
    return func(err);
  });
  return err;
}

function handleWebARError(name, handler) {
  if (isFunc(handler)) {
    handlers[name] = handler;
  }
}

/*
export function handleWebARError2(handler) {
  if (isFunc(handler)) {
    const key =  handler.toString();
    handlers[ key ] = handler;
  }
}*/

/**
 * 相机滤镜配置
 * @public
 * @typedef  {Object} CameraFilterOption
 * @property {Object} value 相机变量，通过key,value存储
 * @property {String} name 滤镜名称
 * @property {Object} program Shader程序 {metal:string,gl:string}
 * @example
 * displayTarget.setFiltersAsync([
 *  {
   *    name:'filter',
   *    program:{
   *      gl:GL_SHADER,
   *      metal:METAL_SHADER
   *    },
   *    value:{
   *      uCenter:[0.5,0.5]
   *    }
   *   }
 * ])
 */

var GLFilterPipeline = function (_GLRenderNode) {
  inherits(GLFilterPipeline, _GLRenderNode);

  function GLFilterPipeline(arg) {
    classCallCheck(this, GLFilterPipeline);

    var _this = possibleConstructorReturn(this, (GLFilterPipeline.__proto__ || Object.getPrototypeOf(GLFilterPipeline)).call(this, arg));

    _this.fboMap = { source: new GLFrameBuffer({ name: 'source' }) };
    return _this;
  }

  createClass(GLFilterPipeline, [{
    key: 'setFiltersAsync',
    value: function setFiltersAsync(filterOptions) {
      var _this2 = this;

      var fboMap = this.fboMap;
      var self = this;
      var promises = [];
      forEach(filterOptions, function (opt) {
        var name = opt.name;
        fboMap[name] = new GLFrameBuffer({ name: name });
        var filter = new GLFilter({
          program: opt.program.gl,
          name: name
        });
        var def = defer();
        filter.addRenderMiddleware(textureMiddleware);
        var remove = filter.addRenderMiddleware(function () {
          def.resolve();
          remove();
        });
        filter.onCompileError = function (ex) {
          return def.reject(makeError(ERROR_CODE_FILTER_COMPILE_FAIL, ex.message));
        };
        promises.push(def.promise);
        _this2.addChild(filter);
        _this2.updateFilter(opt);
      });
      return Promise.all(promises);

      function textureMiddleware(gl, state) {
        var program = state.program;
        if (self._currentTarget) {
          self._currentTarget.bindSampler2D(gl, state, this.sourceSamplerName);
        }
        program.samplerNames.forEach(function (name) {
          return fboMap[name] && fboMap[name].bindSampler2D(gl, state, name);
        });
      }
    }
  }, {
    key: 'updateFilter',
    value: function updateFilter(opt) {
      var filter = this.findChildByName(opt.name);
      if (filter) {
        forEach(opt.value, function (value, key) {
          filter.setUniformValue(key, value);
        });
        forEach(opt.image, function (image, name) {
          var sampler = filter.findChildByName(name);
          if (!sampler) {
            sampler = new GLSampler2D({ name: name, format: image.format, dataFormat: image.dataFormat });
            filter.addChild(sampler);
          }
          sampler.data = image;
        });
      }
    }
  }, {
    key: 'render',
    value: function render(gl, state) {
      var filters = this.children;
      this._currentTarget = this.fboMap.source;
      for (var i = 0, end = filters.length - 1; i < end; i++) {
        var filter = filters[i];
        var target = this.fboMap[filter.name];
        var unbind = filter.renderToFbo(target);
        filter.render(gl, state);
        this._currentTarget = target;
        unbind();
      }
      var lastFilter = filters[filters.length - 1];
      if (lastFilter) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        lastFilter.render(gl, state);
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      get(GLFilterPipeline.prototype.__proto__ || Object.getPrototypeOf(GLFilterPipeline.prototype), 'dispose', this).call(this);
      forEach(this.fboMap, function (fbo) {
        return fbo.dispose();
      });
    }
  }, {
    key: 'sourceFbo',
    get: function get$$1() {
      return this.fboMap.source;
    }
  }, {
    key: 'size',
    set: function set$$1(size) {
      forEach(this.fboMap, setSize);
      forEach(this.children, setSize);

      function setSize(c) {
        c.size = size;
      }
    }
  }]);
  return GLFilterPipeline;
}(GLRenderNode);

var _shaders;

/**
 * Created by brian on 07/08/2017.
 */
var shaders = (_shaders = {}, defineProperty(_shaders, PIXEL_FORMAT_I420, '\nprecision mediump float;\n\nvarying vec2 ' + VARYING_TEX_COORD + ';\n\nuniform sampler2D uYTex;\nuniform sampler2D uUTex;\nuniform sampler2D uVTex;\n\nconst mat3 mYUV2RGB = mat3(1.,1.,1.,0.,-0.39173,2.017,1.5985,-0.8129,0.);\n\nvoid main(){\n  float y = 1.1643*(texture2D(uYTex,' + VARYING_TEX_COORD + ').r - 0.0625);\n  float u = texture2D(uUTex,' + VARYING_TEX_COORD + ').r - 0.5;\n  float v = texture2D(uVTex,' + VARYING_TEX_COORD + ').r - 0.5;\n  \n  gl_FragColor = vec4(mYUV2RGB * vec3(y,u,v),1.0);\n}\n'), defineProperty(_shaders, PIXEL_FORMAT_YUV420, '\nprecision mediump float;\n\nuniform sampler2D uYTex;\n\nuniform sampler2D uCTex;\n\nvarying vec2 ' + VARYING_TEX_COORD + ';\n\nconst mat3 transformYCrCbITURec601FullRangeToRGB = mat3(1.,1.,1.,0., -.18732, 1.8556,1.57481, -.46813,0.);\n\nvoid main(){\n  vec3 colourYCrCb;\n  colourYCrCb.x  = texture2D(uYTex, ' + VARYING_TEX_COORD + ').r;\n  colourYCrCb.yz = texture2D(uCTex, ' + VARYING_TEX_COORD + ').ra - 0.5;\n  gl_FragColor = vec4(transformYCrCbITURec601FullRangeToRGB * colourYCrCb, 1.0);\n}\n'), defineProperty(_shaders, PIXEL_FORMAT_NV21, '\nprecision mediump float;\nvarying vec2 ' + VARYING_TEX_COORD + ';\nuniform sampler2D uYTex;\nuniform sampler2D uUVTex;\nconst mat3 mYUV2RGB = mat3( 1., 1., 1., 0., -.39465, 2.03211, 1.13983, -.58060, 0. );\nvoid main(){\n  vec3 yuv;\n  yuv.x = texture2D(uYTex, ' + VARYING_TEX_COORD + ').r;\n  yuv.yz = texture2D(uUVTex, ' + VARYING_TEX_COORD + ').ar - 0.5;\n  gl_FragColor = vec4(mYUV2RGB * yuv,1.0);\n}\n  '), defineProperty(_shaders, PIXEL_FORMAT_RGB, COPY_FRAG_SHADER), _shaders);
shaders[PIXEL_FORMAT_YV12] = shaders[PIXEL_FORMAT_I420];

var CameraSourceFilter = function (_GLFilter) {
  inherits(CameraSourceFilter, _GLFilter);

  function CameraSourceFilter() {
    classCallCheck(this, CameraSourceFilter);
    return possibleConstructorReturn(this, (CameraSourceFilter.__proto__ || Object.getPrototypeOf(CameraSourceFilter)).apply(this, arguments));
  }

  createClass(CameraSourceFilter, [{
    key: 'render',
    value: function render(gl, state) {
      var camera = this.camera;
      var frame = camera._getCurrentFrame();
      if (frame) {
        if (frame instanceof HTMLVideoElement) {
          this.setSourceVideo(frame);
        } else {
          this.setSamplerFrames(getFrameData(frame));
        }

        this.bufferSamplerData(gl);
        if (this.rotation !== (frame.rotation || 0)) {
          this.rotation = frame.rotation || 0;
          this.applyAspectRatio();
        }
        // sync detector
        var frameResult = frame.result;
        if (frameResult) {
          camera._onSyncDetectorResult(frameResult);
        }
      }
      var unbind = function unbind() {
        return 1;
      };
      if (this.filterPipeline && this.filterPipeline.children.length) {
        this.filterPipeline.size = this.size;
        unbind = this.renderToFbo(this.filterPipeline.sourceFbo);
      }
      get(CameraSourceFilter.prototype.__proto__ || Object.getPrototypeOf(CameraSourceFilter.prototype), 'render', this).call(this, gl, state);
      if (this.filterPipeline) {
        this.filterPipeline.render(gl, state);
      }
      unbind();
    }
  }, {
    key: 'applyAspectRatio',
    value: function applyAspectRatio() {
      var mat = getTexcoordTransform(this.rotation, this._camera.facing, this.aspectRatio, this.size);
      this._invTexTransform = mat.clone().invert();
      this.transformTexCoord(mat);
    }
  }, {
    key: 'invertTexCoord',
    value: function invertTexCoord(x, y) {
      if (this._invTexTransform) {
        var tp = vec3transformMat3((x - 0.5) * 2, (y - 0.5) * 2, 1, this._invTexTransform);
        return [tp[0] / tp[2], tp[1] / tp[2]].map(function (x) {
          return (x + 1) / 2;
        });
      }
      return [x, y];
    }
  }, {
    key: 'update',
    value: function update(gl, state) {
      get(CameraSourceFilter.prototype.__proto__ || Object.getPrototypeOf(CameraSourceFilter.prototype), 'update', this).call(this, gl, state);
      var camera = this.camera;
      if (camera && camera.isDirty) {
        this.invalid();
      }
    }
  }, {
    key: 'setupSamplers',
    value: function setupSamplers() {
      var _this2 = this;

      var flipY = false;
      var format = this.format;
      var samplers = [];
      if (format === PIXEL_FORMAT_I420 || format === PIXEL_FORMAT_YV12) {
        samplers = ['uYTex', 'uUTex', 'uVTex'].map(function (name) {
          return {
            name: name,
            format: WebGL_CONST.LUMINANCE,
            flipY: flipY
          };
        });
      } else if (format === PIXEL_FORMAT_YUV420) {
        samplers = [{ name: 'uYTex', format: WebGL_CONST.LUMINANCE, flipY: flipY }, { name: 'uCTex', format: WebGL_CONST.LUMINANCE_ALPHA, flipY: flipY }];
      } else if (format === PIXEL_FORMAT_RGB) {
        samplers = [{ name: this.sourceSamplerName, isDynamic: true, flipY: flipY }];
      } else if (format === PIXEL_FORMAT_NV21) {
        samplers = [{ name: 'uYTex', format: WebGL_CONST.LUMINANCE, flipY: flipY }, { name: 'uUVTex', format: WebGL_CONST.LUMINANCE_ALPHA, flipY: flipY }];
      }
      samplers = this.samplers = samplers.map(function (cfg) {
        return new GLSampler2D(cfg);
      });
      samplers.forEach(function (s) {
        return _this2.addChild(s, 0);
      });
    }
  }, {
    key: 'setSourceVideo',
    value: function setSourceVideo(video) {
      if (this.format === PIXEL_FORMAT_RGB) {
        this.samplers[0].data = video;
        this.size = [video.videoWidth, video.videoHeight];
        this.invalid();
      }
    }
  }, {
    key: 'setSamplerFrames',
    value: function setSamplerFrames(frames) {
      var samplers = this.samplers;
      if (frames.length === samplers.length) {
        // safari Array#forEach cause memory leak,use for iteration
        for (var i = 0; i < samplers.length; i++) {
          var sampler = samplers[i];
          sampler.data = frames[i];
        }
        var frame0 = frames[0];
        this.size = [frame0.width, frame0.height];
        this._hasFrameData = true;
        this.invalid();
      }
    }
  }, {
    key: 'bufferSamplerData',
    value: function bufferSamplerData(gl) {
      for (var i = 0, samplers = this.samplers; i < samplers.length; i++) {
        samplers[i].setup(gl).bufferData(gl);
      }
    }
  }, {
    key: '_getSize',
    value: function _getSize() {
      var size = this._size;
      if (this.rotation === 270 || this.rotation === 90) {
        return [size[1], size[0]];
      }
      return size;
    }
  }, {
    key: 'setFiltersAsync',
    value: function setFiltersAsync(filterOpts) {
      if (this.filterPipeline) {
        this.removeChild(this.filterPipeline);
      }
      var f = this.filterPipeline = new GLFilterPipeline({});
      this.addChild(f);
      return f.setFiltersAsync(filterOpts);
    }
  }, {
    key: 'updateFilter',
    value: function updateFilter(opt) {
      if (this.filterPipeline) {
        this.filterPipeline.updateFilter(opt);
      }
    }
  }, {
    key: 'camera',
    set: function set$$1(camera) {
      this._camera = camera;
      var format = this.format = camera.format;
      this.fragmentShader = shaders[format];
      if (!this.fragmentShader) {
        throw Error('invalid camera format:' + format);
      }
      this.setupSamplers();
      this.rotation = -1;
    },
    get: function get$$1() {
      return this._camera;
    }
  }, {
    key: 'hasFrameData',
    get: function get$$1() {
      return this._hasFrameData;
    }
  }]);
  return CameraSourceFilter;
}(GLFilter);

function getTexcoordTransform(rotation, facing, aspectRatio, size) {
  var sx = -1;
  var sy = 1;
  if (facing === CAMERA_FACING_FRONT) {
    sx = 1;
  }
  if (isAndroid) {
    rotation = 180 - rotation;
  }
  return createMat3().rotate(Math.PI * rotation / 180).scale(sx, sy).concat(getAspectTransform(aspectRatio, size));
}

function getAspectTransform(aspectRatio, size) {
  var aspectMat = createMat3();
  var ratio = aspectRatio;
  if (ratio) {
    if (size[0] && size[1]) {
      var sourceRatio = size[0] / size[1];
      if (sourceRatio < ratio) {
        aspectMat.scale(1, sourceRatio / ratio);
      } else {
        aspectMat.scale(ratio / sourceRatio, 1);
      }
    }
  }
  return aspectMat;
}

function getFrameData(frame) {
  var width = frame.width;
  var height = frame.height;
  var buffers = frame.dataArray;
  var ret = [];

  for (var i = 0, len = buffers.length; i < len; i++) {
    var buffer = buffers[i];
    var data = buffer;
    if (buffer instanceof ArrayBuffer) {
      data = new Uint8Array(buffer);
    } else if (typeof buffer === 'number') {
      (function () {
        var index = i;
        data = function data(gl, format) {
          window.ARSession.bufferTextureData(gl.TEXTURE_2D, format, index);
        };
      })();
    }
    ret.push({
      width: i === 0 ? width : width / 2,
      height: i === 0 ? height : height / 2,
      data: data
    });
  }

  return ret;
}

function addRunLoop(func) {
  var canceled = 0;

  function loop() {
    func(cancel);
    if (!canceled) {
      requestAnimationFrame(loop);
    }
  }

  requestAnimationFrame(loop);

  function cancel() {
    canceled = true;
  }

  return cancel;
}

var _WebGL_CONST$LUMINANC;
var _ff;

var f32 = new Float32Array(1);
var u8 = new Uint8Array(1);
var _int = new Int32Array(1);
var _uint = new Uint32Array(1);
var convert = {
  float: function float(v) {
    f32[0] = v;
    return f32.buffer;
  },
  bool: function bool(v) {
    u8[0] = v;
    return u8.buffer;
  },
  int: function int(v) {
    _int[0] = v;
    return _int.buffer;
  },
  uint: function uint(v) {
    _uint[0] = v;
    return _uint.buffer;
  }
};
forEach({
  float: Float32Array,
  int: Int32Array,
  uint: Uint32Array,
  bool: Uint8Array
}, function (Ctrl, type) {
  ['2', '3', '4', '2x2', '3x3', '4x4'].forEach(function (t) {
    convert[type + t] = cvt;
  });

  function cvt(arr) {
    return new Ctrl(arr).buffer;
  }
});

var MetalEncoder = function () {
  function MetalEncoder() {
    classCallCheck(this, MetalEncoder);
  }

  createClass(MetalEncoder, [{
    key: 'encodeOptions',
    value: function encodeOptions(opt, metal) {
      var bufferMap = {};
      var imageMap = {};
      forEach(opt.value, function (value, name) {
        var metadata = metal[name];
        if (metadata) {
          bufferMap[metadata.index || 0] = encodeArrayBuffer(convert[metadata.type](value));
        }
      });
      forEach(opt.image, function (imageData, name) {
        imageMap[name] = {
          width: imageData.width,
          height: imageData.height,
          value: encodeArrayBuffer(imageData.data),
          format: toMetalFormat(imageData.format, imageData.dataFormat)
        };
      });
      return {
        name: opt.name,
        value: [bufferMap, imageMap]
      };
    }
  }, {
    key: 'processShaderBuffers',
    value: function processShaderBuffers(shader) {
      var constExp = /\bconstant\s+((float|u?int|bool)(2|3|4|2x2|3x3|4x4)?)\s?&\s?(\w+)\s?\[\[buffer\((\d+)\)]]/g;
      var match = void 0;
      var ret = {};
      while (match = constExp.exec(shader)) {
        ret[match[4]] = {
          type: match[1],
          index: +match[5]
        };
      }
      return ret;
    }
  }]);
  return MetalEncoder;
}();

var ff = (_ff = {}, defineProperty(_ff, WebGL_CONST.RGBA, defineProperty({}, WebGL_CONST.UNSIGNED_BYTE, 70)), defineProperty(_ff, WebGL_CONST.LUMINANCE, (_WebGL_CONST$LUMINANC = {}, defineProperty(_WebGL_CONST$LUMINANC, WebGL_CONST.UNSIGNED_BYTE, 10), defineProperty(_WebGL_CONST$LUMINANC, WebGL_CONST.FLOAT, 55), defineProperty(_WebGL_CONST$LUMINANC, WebGL_CONST.HALF_FLOAT_OES, 25), _WebGL_CONST$LUMINANC)), _ff);

function toMetalFormat(format, dataFormat) {
  var ret = (ff[format] || {})[dataFormat];
  if (!ret) {
    throw Error('invalid texture format');
  }
  return ret;
}

function encodeArrayBuffer(buff) {
  if (buff.buffer instanceof ArrayBuffer) {
    buff = buff.buffer;
  }
  var u8 = new Uint8Array(buff);
  return btoa(String.fromCharCode.apply(null, u8));
}

var g_metalEncoder = new MetalEncoder();

var NativeDisplayRenderer = function (_Renderer) {
  inherits(NativeDisplayRenderer, _Renderer);

  function NativeDisplayRenderer(arg) {
    classCallCheck(this, NativeDisplayRenderer);

    var _this = possibleConstructorReturn(this, (NativeDisplayRenderer.__proto__ || Object.getPrototypeOf(NativeDisplayRenderer)).call(this, arg));

    _this.container = arg.container;
    _this._name = _this.container.id;
    _this._createNativeView();
    _this._displaying = false;
    _this.autoResize = arg.autoResize;
    _this.manuallyRender = arg.manuallyRender;
    _this._filterUpdates = [];
    return _this;
  }

  createClass(NativeDisplayRenderer, [{
    key: 'resize',
    value: function resize(size, aspectRatio) {
      var camera = this._camera;
      var name = this._name;
      this._session._resizeDisplayView(name, size[0], size[1]);
      if (aspectRatio) {
        var d = GLFilter.transformTexCoord(getTexcoordTransform(camera.rotation, camera.facing, this.aspectRatio = aspectRatio, camera.resolution));
        this._session._transformTexCoord(name, d);
      }
    }
  }, {
    key: '_createNativeView',
    value: function _createNativeView() {
      var container = this.container;
      var kf = '__ani_web_ar_key';
      var styleEle = this._styleEle = document.createElement('style');
      var style = '\n    #' + this._name + '{\n      animation:' + kf + ' 1s infinite;\n      z-index:-1;\n      pointer-events:none;\n      position:absolute;\n      width:100%;\n      height:100%;\n    }\n    ';
      if (isIOS) {
        style += '@keyframes ' + kf + ' {\n      0% {\n        opacity: 1;\n      }\n      100% {\n        opacity: 0.999;\n      }\n    }';
      }
      styleEle.innerHTML = style;
      container.appendChild(styleEle);
    }
  }, {
    key: 'pause',
    value: function pause() {
      if (this._session) {
        this._session._toggleDisplayView(this._name, false);
      }
      this._displaying = false;
    }
  }, {
    key: 'resume',
    value: function resume() {
      if (this._session) {
        this._session._toggleDisplayView(this._name, true);
      }
      this._displaying = true;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this._session) {
        this._session._removeDisplayView(this._name);
        var container = this.container;
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }
    }
  }, {
    key: 'update',
    value: function update(gl, state) {
      get(NativeDisplayRenderer.prototype.__proto__ || Object.getPrototypeOf(NativeDisplayRenderer.prototype), 'update', this).call(this, gl, state);
      if (this.manuallyRender) {
        this.invalid();
      }
      this._session._updateFilters(this._name, this._filterUpdates);
      this._filterUpdates = [];
    }
  }, {
    key: 'render',
    value: function render(gl, state) {
      get(NativeDisplayRenderer.prototype.__proto__ || Object.getPrototypeOf(NativeDisplayRenderer.prototype), 'render', this).call(this, gl, state);
      this._session._renderDisplayView(this._name);
    }
  }, {
    key: 'snapshotImageDataURLAsync',
    value: function snapshotImageDataURLAsync(options) {
      var t = options.type;
      var isOrigin = t === 'origin';
      return this._session._snapshotAsync(this._name, isOrigin).then(function (e) {
        if (isOrigin) {
          if (e.code) {
            throw makeError(e.code);
          }
          return readArrayBufferToDataURL(e.value);
        }
        var dataCount = e.width * e.height * 4;
        var pixelData = new Uint8ClampedArray(e.value, 0, dataCount);
        for (var i = 0; i < dataCount; i += 4) {
          var r = pixelData[i + 2];
          var b = pixelData[i];
          pixelData[i] = r;
          pixelData[i + 2] = b;
        }
        var imData = new ImageData(pixelData, e.width, e.height);
        if (t === 'imageData') {
          return imData;
        }
        return getCanvasDataURL(imData, t, options.compress, options.resize);
      });
    }
  }, {
    key: 'setFiltersAsync',
    value: function setFiltersAsync(opts) {
      var codes = ['#include <metal_stdlib>', '#include <metal_matrix>', '#include <metal_math>', 'using namespace metal;'];
      var params = [];
      var metaMap = {};
      for (var i = 0; i < opts.length; i++) {
        var opt = opts[i];
        codes.push(opt.program.metal.replace(/kernel\s+void\s+mainImage/, 'kernel void ' + opt.name));
        var metal = metaMap[opt.name] = g_metalEncoder.processShaderBuffers(opt.program.metal);
        params.push(g_metalEncoder.encodeOptions(opt, metal));
      }
      this._metaMap = metaMap;
      return this._session._setFiltersAsync(this._name, codes.join('\n'), params);
    }
  }, {
    key: 'updateFilter',
    value: function updateFilter(opts) {
      var name = opts.name;
      this._filterUpdates.push(g_metalEncoder.encodeOptions(opts, this._metaMap[name]));
    }
  }, {
    key: 'size',
    get: function get$$1() {
      return this._camera.resolution;
    }
  }, {
    key: 'camera',
    set: function set$$1(camera) {
      var _this2 = this;

      if (!this._session) {
        this._session = camera._session;
        this._camera = camera;
        var autoResize = this.autoResize;
        var container = this.container;
        var width = void 0;
        var height = void 0;
        var name = this._name;
        if (autoResize) {
          var resolution = camera.resolution;
          width = resolution[0] / autoResize;
          height = resolution[1] / autoResize;
          var parent = container.parentNode;
          parent.style.width = container.style.width = width + 'px';
          parent.style.height = container.style.height = height + 'px';
        }
        var session = this._session;
        var rect = container.getBoundingClientRect();
        session._createDisplayViewAsync(name, this.manuallyRender, rect).then(function () {
          var d = GLFilter.transformTexCoord(getTexcoordTransform(camera.rotation, camera.facing, _this2.aspectRatio, camera.resolution));
          session._transformTexCoord(name, d);
          session._toggleDisplayView(name, _this2._displaying);
        });
      }
    }
  }]);
  return NativeDisplayRenderer;
}(Renderer);

var cvs1 = void 0;

function getCanvasDataURL(imgData, type, compress, resize) {
  if (!cvs1) {
    cvs1 = document.createElement('canvas');
  }
  cvs1.width = imgData.width;
  cvs1.height = imgData.height;
  var ctx = cvs1.getContext('2d');
  ctx.putImageData(imgData, 0, 0);
  ctx.save();
  ctx.scale(1, -1);
  ctx.drawImage(cvs1, 0, -cvs1.height);
  ctx.restore();
  var cvs = cvs1;
  if (resize) {
    cvs = drawImageToSize(cvs1, resize);
  }
  var dataurl = cvs.toDataURL(type, compress);
  cvs1.height = cvs1.width = 0;
  return dataurl;
}

/**
 * @description DisplayTarget 构造参数
 * @typedef {Object} DisplayTargetOptions
 * @property {number} [aspectRatio] 可选，按照比率绘制相机图片，当aspectRatio = canvas.width/canvas.height时等同于cameraSize = 'cover'
 * @property {string} [cameraSize] 可选，贴图的适应方式，提供两个选项：'cover|stretch'，'cover'等比覆盖绘制区域，多余裁剪;'stretch' 拉伸铺满;
 * @property {number} [autoResize] 可选，根据相机分辨率自动调整canvas宽高
 * @property {boolean} [webglProxy] 可选，创建DisplayTarget时不验证WebGL Context对象
 * @see WebCamera#createDisplayTarget
 * @example
 * import {getWebCameraAsync} from '@ali/web-ar';
 * async function main(){
 *  const camera = await getWebCameraAsync();
 *  await camera.openAsync();
 *  const gl = $('canvas').getContext('webgl');
 *  const displayTarget = camera.createDisplayTarget(gl,{
 *    autoResize: true //resize canvas size to be the same  of camera resolution
 *  });
 *  displayTarget.loop();
 * }
 * @example
 * async function main(){
 *  const camera = await getWebCameraAsync();
 *  await camera.openAsync();
 *  const gl = $('canvas').getContext('webgl');
 *  // clip camera image size to be the same with specified aspectRation
 *  const displayTarget = camera.createDisplayTarget(gl,{
 *    aspectRatio: gl.drawingBufferWidth/gl.drawingBufferHeight
 *  });
 *  displayTarget.loop();
 * }
 *
 */

var CAMERA_FILTER_NAME = 'cameraFilter';
var NATIVE_RENDERER_NAME = 'nativeRenderer';

/**
 * @class
 * @classdesc 渲染对象，用于绘制相机图像，请使用 WebCamera.createDisplayTarget(gl,options)创建实例
 * @since 0.1.0
 */

var DisplayTarget = function () {

  /**
   * 请使用 WebCamera.createDisplayTarget(gl,options)创建绘制对象
   * @private
   * @deprecated
   * @param {WebCamera} webCamera 相机
   * @param {DisplayTargetOptions?} options 构造参数
   */
  function DisplayTarget(webCamera, options) {
    var _this = this;

    classCallCheck(this, DisplayTarget);

    this._camera = webCamera;
    var task = this._task = new GLTask();
    var nativeDisplay = !!options.container;
    var resizeRatio = 0;
    if (options.autoResize === true) {
      resizeRatio = window.devicePixelRatio || 1;
    } else if (!isNaN(options.autoResize)) {
      resizeRatio = +options.autoResize;
    }
    var manuallyRender = this.manuallyRender = !!options.manuallyRender;
    var filter = nativeDisplay ? new NativeDisplayRenderer({
      name: NATIVE_RENDERER_NAME,
      container: options.container,
      autoResize: resizeRatio,
      manuallyRender: manuallyRender
    }) : new CameraSourceFilter({
      name: CAMERA_FILTER_NAME
    });
    task.rootNode.addChild(filter);
    task.rootNode.disabled = true;
    var gl = options.gl;
    if (!nativeDisplay) {
      if (!options.webglProxy && !(gl instanceof WebGLRenderingContext)) {
        throw makeError(ERROR_CODE_INVALID_WEBGL_CONTEXT);
      }
    } else {
      this._nativeDisplay = filter;
    }
    filter.aspectRatio = options.aspectRatio;
    whenWebCameraOpened(webCamera, function (camera) {
      var task = _this._task;
      if (task) {
        task.rootNode.disabled = false;
        filter.camera = camera;
        task.initialize({ gl: gl, camera: camera });
      }
    });
    if (resizeRatio && gl) {
      whenWebCameraOpened(webCamera, function () {
        return resizeGLCanvas(resizeRatio, gl, webCamera.resolution);
      });
    }
  }

  /**
   * 改变DisplayTarget的绘制区域大小，可以修改DOM绘制区域的大小
   * @param {number[]} size  绘制区域尺寸的大小，单位是px。
   * @param {number} aspectRatio 显示比例，默认为 size[0]/size[1]
   */

  createClass(DisplayTarget, [{
    key: 'resize',
    value: function resize(size, aspectRatio) {
      var nr = this._nativeDisplay;
      if (arguments.length === 1) {
        aspectRatio = size[0] / size[1];
      }
      if (nr) {
        this._cFilter.resize(size, aspectRatio);
      } else {
        var _gl = this._task.gl;
        var resizeRatio = window.devicePixelRatio || 1;
        resizeGLCanvas(resizeRatio, _gl, [size[0] * resizeRatio, size[1] * resizeRatio]);
        if (aspectRatio) {
          this._cFilter.aspectRatio = aspectRatio;
          this._cFilter.applyAspectRatio();
        }
      }
    }

    /**
     * 绘制当前帧，当相机数据没有更新时，不会触发绘制动作，适用于独立绘制相机
     */

  }, {
    key: 'render',
    value: function render() {
      if (this._task) {
        this._task.render();
      }
    }

    /**
     * 绘制当前帧，无论相数据是否更新，都强行绘制，适合与其他渲染引擎配合使用
     */

  }, {
    key: 'forceRender',
    value: function forceRender() {
      if (this._camera) {
        this._task.invalid();
      }
      this.render();
    }

    /**
     * 记录当前WebGL状态，绘制结束后会恢复此时的GL状态
     * @deprecated 请不要和渲染引擎混合使用GL
     * @return {object} 目前的GL状态
     */

  }, {
    key: 'snapshotGLStates',
    value: function snapshotGLStates() {
      return this._task.snapshotGLStates();
    }

    /**
     * @description 截取下一帧的图片并异步返回DataURL或图片imageData
     * @param {object} [options] 可选,截图参数
     * @param {string} [options.type] 图片格式:'image/png','image/jpeg','imageData','origin'
     * 'imageData'返回ImageData对象，'origin'采用拍照接口，返回拍照高清图片,返回base64编码地址
     * 'image/png' 和 'image/jpeg'取下一帧绘制图片数据，返回图片的base64编码URL
     * @param {number} [options.compress] 图片压缩质量,默认0.92,仅对jpeg生效
     * @param {number[]} [options.rect] 当读取imageData时可以选择截图范围,对'origin'不生效
     * @param {number[]} [options.resize] 对截图大小进行限制，默认使用绘制区域大小，仅对'image/*'的图片生效
     * options.resize = [200,300] 将图像缩放到200*300px的大小
     * @return {Promise.<string>} 异步返回图片DataURL
     */

  }, {
    key: 'snapshotImageDataURLAsync',
    value: function snapshotImageDataURLAsync(options) {
      var _this2 = this;

      if (!options) {
        options = {};
      }
      var type = options.type || 'image/jpeg';
      var compress = options.compress || 0.92;
      if (this._nativeDisplay) {
        return this._nativeDisplay.snapshotImageDataURLAsync({ type: type, compress: compress, resize: options.resize });
      }
      if (type === 'origin') {
        if (isFunc(this._camera._session.takePhotoAsync)) {
          return this._camera._session.takePhotoAsync().then(function (file) {
            return readArrayBufferToDataURL(file.data);
          });
        }
        return Promise.reject(ERROR_CODE_SYSTEM_NOT_SUPPORT);
      }
      return new Promise(function (res) {
        addEventListenerOnce(_this2._task, EVENT_FRAME_END, function (e) {
          var gl = e.state.gl;
          if (type === 'imageData') {
            var rect = options.rect || [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight];
            var width = rect[2];
            var height = rect[3];
            var data = new Uint8Array(width * height * 4);
            gl.readPixels(rect[0], rect[1], width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
            res({ data: data, width: width, height: height });
          } else {
            var canvas = gl.canvas;
            if (options.resize) {
              canvas = drawImageToSize(gl.canvas, options.resize);
            }
            res(canvas.toDataURL(type, compress));
          }
        });
        _this2._task.invalid();
      });
    }

    /**
     * 异步重新配置滤镜
     * @param {Array<CameraFilterOption>} opts  滤镜参数
     * @return {Promise.<DisplayTarget>} displayTarget
     */

  }, {
    key: 'setFiltersAsync',
    value: function setFiltersAsync(opts) {
      var _this3 = this;

      return this._cFilter.setFiltersAsync(opts).then(function () {
        return _this3;
      });
    }
  }, {
    key: 'updateFilter',


    /**
     * 跟新滤镜参数
     * @param {CameraFilterOption} opt 滤镜参数
     */
    value: function updateFilter(opt) {
      this._cFilter.updateFilter(opt);
    }

    /**
     * 将屏幕二维坐标转化成贴图标准二维坐标，图片右上角为(0,0)，左下角为(1,1)
     * @param {number} x 屏幕x坐标
     * @param {number} y 屏幕y坐标
     * @return {number[]} 变化后的坐标
     */

  }, {
    key: 'transformScreenTexCoord',
    value: function transformScreenTexCoord(x, y) {
      return this._task.rootNode.findChildByName(CAMERA_FILTER_NAME).invertTexCoord(x, 1 - y);
    }

    /**
     * 开始循环绘制
     * @deprecated
     */

  }, {
    key: 'loop',
    value: function loop() {
      console.error('DisplayTarget.loop() has been deprecated, please use resume instead');
      this.resume();
    }

    /**
     * 结束绘制，清理绘制资源。
     * 相机关闭时将会主动清理所有此相机产生的绘制对象
     */

  }, {
    key: 'dispose',
    value: function dispose() {
      this._cancelRunLoop();
      this._task.dispose();
      this._task = null;
    }

    /**
     * 暂停相机渲染，但不会暂停物理相机采样
     */

  }, {
    key: 'pause',
    value: function pause() {
      this._cancelRunLoop();
      this._task.rootNode.disabled = true;
      if (this._nativeDisplay) {
        this._nativeDisplay.pause();
      }
    }

    /**
     * 开始相机渲染
     */

  }, {
    key: 'resume',
    value: function resume() {
      var _this4 = this;

      if (!this.manuallyRender) {
        this._cancelRunLoop = addRunLoop(function (cancel) {
          if (_this4._task) {
            _this4._task.render();
          } else {
            cancel();
          }
        });
      }
      this._task.rootNode.disabled = false;
      if (this._nativeDisplay) {
        this._nativeDisplay.resume();
      }
    }
  }, {
    key: '_cancelRunLoop',
    value: function _cancelRunLoop() {}
  }, {
    key: '_cFilter',
    get: function get$$1() {
      return this._task.rootNode.children[0];
    }
  }]);
  return DisplayTarget;
}();

var dg_canvas = void 0;

function drawImageToSize(image, size) {
  if (!dg_canvas) {
    dg_canvas = document.createElement('canvas');
  }
  dg_canvas.width = size[0];
  dg_canvas.height = size[1];
  dg_canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height, 0, 0, size[0], size[1]);
  return dg_canvas;
}

function resizeGLCanvas(pixelRatio, gl, size) {
  var canvas = gl.canvas;
  var w = size[0];
  var h = size[1];
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    canvas.style.width = w / pixelRatio + 'px';
    canvas.style.height = h / pixelRatio + 'px';
  }
}

function readArrayBufferToDataURL(data) {
  var reader = new FileReader();
  return new Promise(function (res, rej) {
    reader.readAsDataURL(new Blob([data], { type: 'image/jpeg' }));
    reader.onload = function () {
      return res(reader.result);
    };
    reader.onerror = function () {
      return rej(makeError(ERROR_CODE_SYSTEM_NOT_SUPPORT));
    };
  });
}

var EVENT_DETECTOR_INIT_RESULT = 'DetectorInitResult';

var EVENT_DETECT_RESULT = 'DetectorResult';

// export const EVENT_DETECT_MESSAGE = 'DetectorMessage';

var EVENT_SESSION_START = 'SessionStart';

var EVENT_SESSION_FAIL = 'SessionFail';

var EVENT_SESSION_STOP = 'SessionStop';
// iOS only
// export const EVENT_SESSION_DID_INIT = 'ARSessionDidInit';

// export const EVENT_Marker_Download_Result = 'MarkerDownloadResult';

// ClassifyDetector 模型下载状态回调
// export const EVENT_MODEL_DOWNLOAD_RESULT = 'ModelDownloadResult';

var EVENT_WEBCAMERA_OPEN = 'open';

var DETECTOR_OPTIONS_TYPE_RELOAD_MARKERS = 'reload';



var DETECTOR_OPTIONS_TYPE_TRACKING = 'tracking';

/**
 * @class
 * @description Detector基类，请从此类派生继承Detector并提供更友好的封装。
 */
var BaseDetector = function (_EventTarget) {
  inherits(BaseDetector, _EventTarget);

  /**
   * webCamera.getDetectorAsync(exportName,options)被调用时会创建注册的JS Detector，此时构造函数被调用，传入nativeDetector
   * 子类请不要集成构造函数，而是集成私有方法
   * @private
   * @param {Object} nativeDetector native detector对象
   * @param {DetectorCreateOptions} options 参数
   */
  function BaseDetector(nativeDetector, options) {
    classCallCheck(this, BaseDetector);

    var _this = possibleConstructorReturn(this, (BaseDetector.__proto__ || Object.getPrototypeOf(BaseDetector)).call(this));

    _this._nativeDetector = nativeDetector;
    // 默认pause detector,避免在资源加载之前分析图像帧
    nativeDetector.pause();
    _this._onCreateOptions(options);
    if (nativeDetector.initResult !== null && !isNaN(+nativeDetector.initResult)) {
      _this._onInitResult(nativeDetector.initResult);
    } else {
      var onInit = _this._initHandler = function () {
        _this._onInitResult(nativeDetector.initResult);
        nativeDetector.removeEventListener(EVENT_DETECTOR_INIT_RESULT, onInit);
      };
      nativeDetector.addEventListener(EVENT_DETECTOR_INIT_RESULT, onInit);
    }
    _this._messageHandler = function (e) {
      return _this._onMessage(e.result, false);
    };
    nativeDetector.addEventListener(EVENT_DETECT_RESULT, _this._messageHandler);
    return _this;
  }

  // 子类请不要访问nativeDetector方法，而直接使用此类的公有方法


  createClass(BaseDetector, [{
    key: '_onCreateOptions',


    /**
     * 解析创建时参数，子类复写此方法实现自定义参数
     * @description
     * webCamera.getDetectorAsync(name,options)中的options会成为此函数的参数
     * options 还包括相机的信息和是否同步帧
     * @param {DetectorCreateOptions} options 参数
     * @protected
     */
    value: function _onCreateOptions(options) {}

    /**
     * 处理detector initResult的方法，子类请复写此方法
     * @param {number} initResult init返回参数
     * @protected
     */

  }, {
    key: '_onInitResult',
    value: function _onInitResult(initResult) {}

    /**
     * 收到Detector消息时的处理函数,子类复写此方法来处理图像识别结果
     * @param {Object}result detector消息
     * @param {boolean}sync 是否是同步模式下的消息
     * @protected
     */

  }, {
    key: '_onMessage',
    value: function _onMessage(result, sync) {}

    /**
     * 停止向识别模块输入相机数据
     */

  }, {
    key: 'pause',
    value: function pause() {
      this._nativeDetector.pause();
    }

    /**
     * 恢复识别模块相机数据
     */

  }, {
    key: 'resume',
    value: function resume() {
      this._nativeDetector.resume();
    }

    /**
     * 调用native detector的setOption方法，子类请调用此方法而不要直接操作 native detector
     * @param {Object} opt 设置参数
     * @protected
     */

  }, {
    key: 'setOptions',
    value: function setOptions(opt) {
      this._nativeDetector.setOption(opt);
    }

    /**
     * 停止并释放此Detector，一旦调用此方法，detector对象不可以再次被使用
     */

  }, {
    key: 'stop',
    value: function stop() {
      releaseCurrentDetector();
    }

    // detector factory call this method to stop detector

  }, {
    key: '_stop',
    value: function _stop() {
      var nativeDetector = this._nativeDetector;
      if (nativeDetector) {
        nativeDetector.removeEventListener(this._initHandler, EVENT_DETECTOR_INIT_RESULT);
        nativeDetector.removeEventListener(this._messageHandler, EVENT_DETECT_RESULT);
        nativeDetector.stop();
        this._nativeDetector = null;
      }
    }
  }, {
    key: 'metadata',
    get: function get$$1() {
      return this._nativeDetector.metadata || {};
    }
  }, {
    key: 'initResult',
    get: function get$$1() {
      return this._nativeDetector ? this._nativeDetector.initResult : 0;
    }
  }]);
  return BaseDetector;
}(EventTarget);

/**
 * @typedef DetectorRegisterInfo
 * @property {string} exportName 暴露的JS名称，用于WebCamera.getDetectorAsync(name)
 * @property {string|object} nativeClassName Native的注册名称
 * @property {function} constructor JS的封装类,此类继承 BaseDetector
 */

var DetectorFactory = function () {
  function DetectorFactory() {
    classCallCheck(this, DetectorFactory);

    this._registerInfoMap = {};
  }

  createClass(DetectorFactory, [{
    key: 'register',
    value: function register(info) {
      var hasError = false;
      var exportName = info.exportName;
      var constructor = info.constructor;
      if (!isFunc(constructor) || !(constructor.prototype instanceof BaseDetector) || !isStr(exportName)) {
        hasError = true;
      }
      var nativeClassName = info.nativeClassName;
      if (!isObj(nativeClassName) && isStr(nativeClassName)) {
        var _nativeClassName;

        nativeClassName = (_nativeClassName = {}, defineProperty(_nativeClassName, ANDROID, nativeClassName), defineProperty(_nativeClassName, IOS, nativeClassName), _nativeClassName);
      }
      if (!isStr(nativeClassName[ANDROID]) || !isStr(nativeClassName[IOS])) {
        hasError = true;
      }
      if (hasError) {
        throw makeError(ERROR_CODE_INVALID_ARGUMENT);
      }
      this._registerInfoMap[exportName] = {
        nativeClassName: nativeClassName, exportName: exportName, constructor: constructor
      };
    }
  }, {
    key: 'getDetectorAsync',
    value: function getDetectorAsync(session, exportName, options) {
      var _this = this;

      if (this._currentDetector) {
        return Promise.reject(makeError(ERROR_CODE_DETECTOR_DUPLICATED));
      }
      var info = this._registerInfoMap[exportName];
      if (info) {
        var Ctrl = info.constructor;
        return session.getDetectorAsync(info.nativeClassName[isAndroid ? ANDROID : IOS], { sync: !!options.sync }).then(function (nativeDetector) {
          var detector = new Ctrl(nativeDetector, options);
          _this._currentDetector = detector;
          return detector;
        });
      }
      return Promise.reject(makeError(ERROR_CODE_NO_SPECIFIED_DETECTOR));
    }
  }, {
    key: 'updateAsyncDetectorResult',
    value: function updateAsyncDetectorResult(result) {
      if (this._currentDetector) {
        this._currentDetector._onMessage(result, true);
      }
    }
  }, {
    key: 'releaseCurrentDetector',
    value: function releaseCurrentDetector() {
      if (this._currentDetector) {
        this._currentDetector._stop();
        this._currentDetector = null;
      }
    }
  }]);
  return DetectorFactory;
}();

var ARKIT_TRACKING_STATE_NOT_AVAILABLE = 0;
var ARKIT_TRACKING_STATE_LIMITED = 1;
var ARKIT_TRACKING_STATE_NORMAL = 2;

var ARKIT_TRACKING_STATE_REASON_NONE = 0;
var ARKIT_TRACKING_STATE_REASON_INITIALIZING = 1;
var ARKIT_TRACKING_STATE_REASON_EXCESSIVE_MOTION = 2;
var ARKIT_TRACKING_STATE_REASON_INSUFFICIENT_FEATURES = 3;

/**
 * @event ARKitWorldTrackingDetector#EVENT_TRACKING_UPDATE
 * @description 跟踪数据发生变化时的事件
 * @type {object}
 * @property {ARKitWorldTrackingDetector} target 事件目标
 */
var EVENT_ARKIT_TRACKING_UPDATE = 'update';

/**
 * @event ARKitWorldTrackingDetector#EVENT_INTERRUPTION_CHANGE
 * @description  当ARKit被中断或者恢复中断时的事件，当程序进入后台，相机被占用等情况下ARKit会被中断，
 * 中断后如果恢复，请调用restartTracking()重新开始追踪
 * @type {object}
 * @property {boolean} interrupted 是否被中断
 * @property {ARKitWorldTrackingDetector} target 事件目标
 * @example
 * detector.addEventListener(detector.EVENT_INTERRUPTION_CHANGE,(e)=>{
 *  if(!e.interrupted){
 *    e.target.restartTracking();
 *  }
 * })
 */
var EVENT_ARKIT_INTERRUPTION_CHANGE = 'interruption';

var ARKIT_HIT_TEST_TYPE_FEATURE_POINTS = 1 << 0;
var ARKIT_HIT_TEST_TYPE_ESTIMATED_HORIZONTAL_PLANE = 1 << 1;
var ARKIT_HIT_TEST_TYPE_ESTIMATED_VERTICAL_PLANE = 1 << 2;
var ARKIT_HIT_TEST_TYPE_EXISTING_PLANE = 1 << 3;
var ARKIT_HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT = 1 << 4;

/**
 * @class
 * @classdesc ios上使用ARKit进行追踪
 * @property {Float32Array} projectionMatrix 相机投影矩阵(mat4)
 * @property {Float32Array} viewMatrix 相机视角矩阵(mat4)
 * @property {Float32Array} transformMatrix 相机位置变化矩阵(mat4)
 * @property {boolean} interrupted ARKit是否被中断
 * @property {number} version ARKitDetector 版本号
 * @property {Float32Array} featurePoints 图片特征点，version 1.1后支持
 * @property {ARKitAnchor[]} anchors 平面锚点
 * @property {number} trackingState ARKit跟踪运行状态
 * @property {number} trackingStateReason ARKit跟踪状态原因，当跟踪状态不正常时查询
 * @property {boolean} interrupted ARKit是否被中断
 * @example
 * if(detector.trackingState === detector.TRACKING_STATE_LIMITED){
 *    console.log('tracking limited by:'+detector.trackingStateReason);
 * }
 */
var ARKitWorldTrackingDetector = function (_BaseDetector) {
  inherits(ARKitWorldTrackingDetector, _BaseDetector);

  function ARKitWorldTrackingDetector() {
    classCallCheck(this, ARKitWorldTrackingDetector);
    return possibleConstructorReturn(this, (ARKitWorldTrackingDetector.__proto__ || Object.getPrototypeOf(ARKitWorldTrackingDetector)).apply(this, arguments));
  }

  createClass(ARKitWorldTrackingDetector, [{
    key: 'configFeaturePoints',


    /**
     * 配置输出图片特征点，version 1.1后支持
     * @param {boolean}output 是否输出图片特征点
     * @return {boolean} 配置结果
     */
    value: function configFeaturePoints(output) {
      if (this.version < 1.1) {
        return false;
      }
      this.setOptions({
        type: 'featurePoints',
        value: !!output
      });
      return true;
    }

    /**
     * 设置ARKit相机投影矩阵
     * @param {number} width  viewport宽度，单位像素
     * @param {number} height viewport高度，单位像素
     * @param {number} near 相机剪裁最近距离，单位米
     * @param {number} far 相机剪裁最远距离，单位米
     */

  }, {
    key: 'setProjectionParameters',
    value: function setProjectionParameters(width, height, near, far) {
      this.setOptions({
        type: 'projection',
        width: width, height: height, near: near, far: far
      });
    }

    /**
     * 进行碰撞检测，version 1.1后支持
     * @param {number[]}point 要检测点的图片二维坐标，左上角为（0，0）右下角为（1，1）
     * @param {number}type 平面检测类型
     * @return {Promise.<ARKitHitTestResult[]>} 异步返回平面检测结果
     * @example
     * detector.hitTestAsync([0.5,0.5],detector.HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT)
     *   .then(results => { });
     */

  }, {
    key: 'hitTestAsync',
    value: function hitTestAsync(point, type) {
      if (+this.version < 1.1) {
        return Promise.reject(makeError(ERROR_CODE_RUNTIME_NOT_SUPPORT));
      }
      if (isNaN(point[0]) || isNaN(point[1]) || isNaN(type)) {
        return Promise.reject(makeError(ERROR_CODE_INVALID_ARGUMENT));
      }
      var timestamp = Date.now();
      if (this._pendings[timestamp]) {
        return this._pendings[timestamp].promise;
      }
      var options = {
        x: point[0],
        y: point[1],
        type: 'hitTest',
        hitType: type,
        timestamp: timestamp
      };
      this.setOptions(options);
      var deffered = this._pendings[timestamp] = defer();
      return deffered.promise;
    }

    /**
     * 重新开始追踪，在调用startAsync()之后如果被中断，调用此函数会重建世界坐标，重新开始追踪
     * @return {boolean} 操作结果
     */

  }, {
    key: 'restartTracking',
    value: function restartTracking() {
      if (this.version < 1.1) {
        return false;
      }
      this.setOptions({ type: 'restart' });
      return true;
    }

    /**
     * @param {number}int initResult
     * @private
     */

  }, {
    key: '_onInitResult',
    value: function _onInitResult(int) {
      if (int) {
        throw makeError(int);
      }
      this.version = +this.metadata.version || 0;
      this._pendings = {};
    }

    /**
     * @param {object} options options
     * @private
     */

  }, {
    key: '_onMessage',
    value: function _onMessage(options) {
      var type = options.type;
      if (/(e?irt)|(interrupted)|(interruptionEnd)/.test(type)) {
        var interrupted = type === (this.version < 1.1 ? 'interrupted' : 'irt');
        this.dispatchEvent(EVENT_ARKIT_INTERRUPTION_CHANGE, {
          target: this,
          interrupted: this._interrupted = interrupted
        });
      } else {
        this._pm = new Float32Array(options.cameraProjectionMat);
        this._mm = new Float32Array(options.cameraTransformMat);
        this._vm = new Float32Array(options.cameraViewMat);
        this._ts = options.trackingState;
        this._tsr = options.trackingStateReason;
        this._anchors = options.anchors;
        this._anchors.forEach(function (anchor) {
          return forEach(anchor, function (val, key) {
            if (val instanceof ArrayBuffer) {
              anchor[key] = new Float32Array(val);
            }
          });
        });
        if (options.featurePoints) {
          this._fp = new Float32Array(options.featurePoints);
        }
        this.dispatchEvent(EVENT_ARKIT_TRACKING_UPDATE, { target: this });
        var htr = options.hitTestResult;
        if (htr) {
          var deffered = this._pendings[htr.timestamp];
          if (deffered) {
            delete this._pendings[htr.timestamp];
            deffered.resolve(htr.results.map(normalizeHitTestResult));
          }
        }
      }
    }

    /**
     * @param {object} options options
     * @private
     */

  }, {
    key: '_onCreateOptions',
    value: function _onCreateOptions(options) {
      this._pm = new Float32Array(16);
      this._vm = new Float32Array(16);
      this._mm = new Float32Array(16);
      this._fp = new Float32Array(0);
      this._ts = ARKIT_TRACKING_STATE_NOT_AVAILABLE;
      this._tsr = ARKIT_TRACKING_STATE_REASON_NONE;
      this._interrupted = false;
    }

    /**
     * 异步开始追踪，当ARKit初始化完成后解析Promise
     * @return {Promise} 异步结果
     * @fires  ARKitWorldTrackingDetector#EVENT_TRACKING_UPDATE
     * @example
     * showLoading();
     * await detector.startAsync();
     * hideLoading();
     * detector.addEventListener(detector.EVENT_TRACKING_UPDATE,() => {
     *  updateCamera(detector.projectionMatrix,detector.viewMatrix);
     *  if(detector.anchors.length){
     *    //draw anchors
     *  }
     * });
     */

  }, {
    key: 'startAsync',
    value: function startAsync() {
      var _this2 = this;

      if (this._startDefer) {
        return this._startDefer.promise;
      }
      var d = this._startDefer = defer();
      this.resume();
      var handler = function handler() {
        if (_this2._ts === ARKIT_TRACKING_STATE_NORMAL) {
          d.resolve(_this2);
        }
      };
      this.addEventListener(EVENT_ARKIT_TRACKING_UPDATE, handler);
      return interceptPromise(d.promise, function () {
        return _this2.removeEventListener(EVENT_ARKIT_TRACKING_UPDATE, handler);
      });
    }

    /**
     * ARKit 追踪不能暂停，调用此函数将直接报错
     */

  }, {
    key: 'pause',
    value: function pause() {
      throw makeError(ERROR_CODE_INVALID_ARGUMENT);
    }
  }, {
    key: 'projectionMatrix',
    get: function get$$1() {
      return new Float32Array(this._pm);
    }
  }, {
    key: 'viewMatrix',
    get: function get$$1() {
      return new Float32Array(this._vm);
    }
  }, {
    key: 'transformMatrix',
    get: function get$$1() {
      return new Float32Array(this._mm);
    }
  }, {
    key: 'trackingState',
    get: function get$$1() {
      return this._ts;
    }
  }, {
    key: 'trackingStateReason',
    get: function get$$1() {
      return this._tsr;
    }
  }, {
    key: 'anchors',
    get: function get$$1() {
      return this._anchors || [];
    }
  }, {
    key: 'interrupted',
    get: function get$$1() {
      return this._interrupted;
    }
  }, {
    key: 'featurePoints',
    get: function get$$1() {
      return this._fp;
    }
  }]);
  return ARKitWorldTrackingDetector;
}(BaseDetector);

function normalizeHitTestResult(result) {
  result.worldPosition = positionFromTransform(result.worldTransform = new Float32Array(result.worldTransform));
  result.localPosition = positionFromTransform(result.localTransform = new Float32Array(result.localTransform));
  return result;
}

function positionFromTransform(t) {
  return [12, 13, 14].map(function (i) {
    return t[i];
  });
}

/**
 * @typedef {Object} ARKitHitTestResult
 * @description 碰撞检测结果
 * @property {number} type 碰撞结果类型
 * @property {Float32Array} worldTransform 碰撞点变化矩阵
 * @property {Float32Array} localTransform 碰撞点相对于锚点的变化矩阵
 * @property {string} anchorId 碰撞点关联的锚点id（如果有的话）
 * @property {number[]} localPosition 碰撞点相对于关联锚点的位置(vec3)
 * @property {number[]} worldPosition 碰撞点的世界坐标位置(vec3)
 * @property {number} distance 碰撞点相对相机的距离
 * @see ARKitWorldTrackingDetector#hitTestAsync
 */

/**
 * @typedef {Object} ARKitAnchor
 * @description 锚点，检测到的平面信息会通过锚点形式返回
 * @property {number} type 锚点类型
 * @property {string} id 锚点id
 * @property {Float32Array} transform 锚点的世界变化矩阵(mat4)
 * @property {number[]} 锚点中心位置（vec3）
 * @property {number[]} 延伸大小，锚点位置为中心延伸出的平面(vec3)
 * @see ARKitWorldTrackingDetector
 */


(function () {
  var proto = ARKitWorldTrackingDetector.prototype;
  proto.EVENT_TRACKING_UPDATE = EVENT_ARKIT_TRACKING_UPDATE;
  proto.EVENT_INTERRUPTION_CHANGE = EVENT_ARKIT_INTERRUPTION_CHANGE;
  /**
   * @const
   * @name TRACKING_STATE_NOT_AVAILABLE
   * @description ARKit状态:不可用
   * @memberOf ARKitWorldTrackingDetector.prototype
   * @type {number}
   */
  proto.TRACKING_STATE_NOT_AVAILABLE = ARKIT_TRACKING_STATE_NOT_AVAILABLE;
  /**
   * @const
   * @name TRACKING_STATE_LIMITED
   * @description ARKit状态:追踪受限制，限制原因参见TRACKING_STATE_REASON
   * @memberOf ARKitWorldTrackingDetector.prototype
   * @type {number}
   */
  proto.TRACKING_STATE_LIMITED = ARKIT_TRACKING_STATE_LIMITED;
  /**
   * @const
   * @name TRACKING_STATE_LIMITED
   * @description ARKit状态:追踪正常
   * @memberOf ARKitWorldTrackingDetector.prototype
   * @type {number}
   */
  proto.TRACKING_STATE_NORMAL = ARKIT_TRACKING_STATE_NORMAL;
  /**
   * @const
   * @name TRACKING_STATE_REASON_NONE
   * @description ARKit受限原因:无，表示追踪正常时
   * @memberOf ARKitWorldTrackingDetector.prototype
   * @type {number}
   */
  proto.TRACKING_STATE_REASON_NONE = ARKIT_TRACKING_STATE_REASON_NONE;
  /**
   * @const
   * @name TRACKING_STATE_REASON_INITIALIZING
   * @description ARKit受限原因:ARKit正在初始化
   * @memberOf ARKitWorldTrackingDetector.prototype
   * @type {number}
   */
  proto.TRACKING_STATE_REASON_INITIALIZING = ARKIT_TRACKING_STATE_REASON_INITIALIZING;
  /**
   * @const
   * @name TRACKING_STATE_REASON_EXCESSIVE_MOTION
   * @description ARKit受限原因:运动太过激烈
   * @memberOf ARKitWorldTrackingDetector.prototype
   * @type {number}
   */
  proto.TRACKING_STATE_REASON_EXCESSIVE_MOTION = ARKIT_TRACKING_STATE_REASON_EXCESSIVE_MOTION;
  /**
   * @const
   * @name TRACKING_STATE_REASON_INSUFFICIENT_FEATURES
   * @description ARKit受限原因:图片特征不明显
   * @memberOf ARKitWorldTrackingDetector.prototype
   * @type {number}
   */
  proto.TRACKING_STATE_REASON_INSUFFICIENT_FEATURES = ARKIT_TRACKING_STATE_REASON_INSUFFICIENT_FEATURES;
  /**
   * @const
   * @name HIT_TEST_TYPE_FEATURE_POINTS
   * @description ARKit碰撞检测类型：图片特征点
   * @memberOf ARKitWorldTrackingDetector.prototype
   * @type {number}
   */
  proto.HIT_TEST_TYPE_FEATURE_POINTS = ARKIT_HIT_TEST_TYPE_FEATURE_POINTS;
  /**
   * @const
   * @name HIT_TEST_TYPE_FEATURE_POINTS
   * @description ARKit碰撞检测类型：水平面
   * @memberOf ARKitWorldTrackingDetector.prototype
   * @type {number}
   */
  proto.HIT_TEST_TYPE_ESTIMATED_HORIZONTAL_PLANE = ARKIT_HIT_TEST_TYPE_ESTIMATED_HORIZONTAL_PLANE;
  /**
   * @const
   * @name HIT_TEST_TYPE_FEATURE_POINTS
   * @description ARKit碰撞检测类型：竖直平面
   * @memberOf ARKitWorldTrackingDetector.prototype
   * @type {number}
   */
  proto.HIT_TEST_TYPE_ESTIMATED_VERTICAL_PLANE = ARKIT_HIT_TEST_TYPE_ESTIMATED_VERTICAL_PLANE;
  /**
   * @const
   * @name HIT_TEST_TYPE_FEATURE_POINTS
   * @description ARKit碰撞检测类型：已存在的平面
   * @memberOf ARKitWorldTrackingDetector.prototype
   * @type {number}
   */
  proto.HIT_TEST_TYPE_EXISTING_PLANE = ARKIT_HIT_TEST_TYPE_EXISTING_PLANE;
  /**
   * @const
   * @name HIT_TEST_TYPE_FEATURE_POINTS
   * @description ARKit碰撞检测类型：已存在的平面和它的延伸范围
   * @memberOf ARKitWorldTrackingDetector.prototype
   * @type {number}
   */
  proto.HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT = ARKIT_HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT;
})();

var EVENT_UPDATE = 'update';

/**
 * @typedef {Object} FaceResult
 * @property {string} id 唯一标示
 * @property {number[]} rect 面部图片二维坐标，数组元素标示:[x,y,with,height]
 * @property {Float32Array} matrix 面部的图片矩阵变化
 * @see APFaceDetector#getTrackingFaces
 */
/**
 * @class
 * @classdesc 对头像进行追踪的识别模块
 */
var APFaceDetector = function (_BaseDetector) {
  inherits(APFaceDetector, _BaseDetector);

  function APFaceDetector() {
    classCallCheck(this, APFaceDetector);
    return possibleConstructorReturn(this, (APFaceDetector.__proto__ || Object.getPrototypeOf(APFaceDetector)).apply(this, arguments));
  }

  createClass(APFaceDetector, [{
    key: 'startTrack',


    /**
     * 开始追踪
     * @fires APFaceDetector#EVENT_UPDATE
     */
    value: function startTrack() {
      this.resume();
      this.faces = [];
    }

    /**
     * @param {object} msg 消息
     * @private
     */

  }, {
    key: '_onMessage',
    value: function _onMessage(msg) {
      if (msg.type === DETECTOR_OPTIONS_TYPE_TRACKING) {
        this.faces = msg.faces || [];
        this.dispatchEvent(EVENT_UPDATE);
      }
    }

    /**
     * 通过相机拿到识别到的头部信息
     * @param {WebCamera} camera 相机
     * @return {Array<FaceResult>} 返回头部信息的数组
     */

  }, {
    key: 'getTrackingFaces',
    value: function getTrackingFaces(camera) {
      var size = camera.resolution;
      var facing = camera.facing;
      return this.faces.map(function (face) {
        var matrix = toGLMatrix(new Float32Array(ensureArrayBuffer(face.matrix)));
        var rect = new Float32Array(face.rect);
        if (facing === CAMERA_FACING_FRONT) {
          [0, 4, 8, 12].forEach(function (i) {
            return matrix[i] = -matrix[i];
          });
          rect[0] = size[1] - rect[0] - rect[2];
        }
        return {
          matrix: matrix,
          rect: rect,
          id: face.id
        };
      });
    }
  }]);
  return APFaceDetector;
}(BaseDetector);

/**
 * @event APFaceDetector#EVENT_UPDATE
 * @description 检测到的头像发生变化时的事件
 * @example
 * detector.addEventListener(detector.EVENT_UPDATE,function(){
 *  const faces = detector.getTrackingFaces(camera);
 * })
 * @type {string}
 */
APFaceDetector.prototype.EVENT_UPDATE = EVENT_UPDATE;

function toGLMatrix(mat) {
  return new Float32Array([mat[0], mat[4], mat[8], mat[12], mat[1], mat[5], mat[9], mat[13], mat[2], mat[6], mat[10], mat[14], mat[3], mat[7], mat[11], mat[15]]);
}

function registerAPDetectors() {
  [{
    constructor: ARKitWorldTrackingDetector,
    nativeClassName: 'ARKitWorldDetector',
    exportName: 'APARKitWorldTrackingDetector'
  }, {
    exportName: 'APFaceDetector',
    constructor: APFaceDetector,
    nativeClassName: 'FaceDetector'
  }].forEach(registerDetector);
}

var g_detectorFactory = new DetectorFactory();

registerAPDetectors();

function getDetectorFromSessionAsync(session, name, options) {
  if (!isObj(options)) {
    options = {};
  }
  return g_detectorFactory.getDetectorAsync(session, name, options);
}

function releaseCurrentDetector() {
  g_detectorFactory.releaseCurrentDetector();
}

function updateSyncDetectorResult(result) {
  g_detectorFactory.updateAsyncDetectorResult(result);
}

/**
 * 注册Detector
 * @param {DetectorRegisterInfo} info Detector 注册信息
 */
function registerDetector(info) {
  g_detectorFactory.register(info);
}

function $(slt, ele) {
  return (ele || document).querySelector(slt);
}

var NATIVE_BIND_FLAG = 1 << 1;

var displayTargetSeed = 1;

/**
 * 摄像头对象,请使用 getWebCameraAsync(opts)获取实例对象
 * @class
 * @since 0.1.0
 * @example
 * import {getWebCameraAsync,CAMERA_FACING_BACK} from 'webar.js';
 * async function main(){
 *  const camera = await getWebCameraAsync({facing:CAMERA_FACING_BACK});
 *  await camera.openAsync();
 * }
 *
 * @property {boolean} isRunning 相机是否运行
 * @property {boolean} isDirty 相机数据是否更新
 * @property {Array.<number>} resolution 相机图片分辨率,在相机打开前返回[0,0]，打开后返回图片的宽高
 * @property {number} format 相机图片格式
 * @property {number} facing 相机设备朝向
 */
var WebCamera = function (_EventTarget) {
  inherits(WebCamera, _EventTarget);

  function WebCamera(ARSession, options) {
    classCallCheck(this, WebCamera);

    var _this = possibleConstructorReturn(this, (WebCamera.__proto__ || Object.getPrototypeOf(WebCamera)).call(this));

    _this._session = ARSession;
    if (!options) {
      options = {};
    }
    var cameraSource = options.cameraSource || options.experimentalCameraSource;
    _this._options = {
      facing: options.facing || CAMERA_FACING_BACK,
      quality: options.quality || CAMERA_QUALITY_DEFAULT,
      cameraSource: cameraSource,
      experimentalCameraSource: cameraSource
    };
    _this._displayTargets = [];
    _this._dirty = null;
    _this._size = [0, 0];
    if (options.experimentalNativeTextureBinding) {
      _this._getCurrentFrame = getCurrentFrameWithoutData;
    }
    if (+options.hint) {
      _this._options.userData = options.hint + '';
    }
    return _this;
  }

  createClass(WebCamera, [{
    key: 'openAsync',


    /**
     * 开启ARSession
     * @since 0.1.0
     * @param {number} [timeout] 开启相机超时,单位毫秒，默认5000毫秒
     * @return {Promise} 开启成功/失败的错误码
     */
    value: function openAsync() {
      var _this2 = this;

      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5000;

      if (!this._openDefer) {
        var deferred = this._openDefer = defer();
        setTimeout(function () {
          deferred.reject(makeError(ERROR_CODE_CAMERA_OPEN_TIME_OUT));
          _this2._openDefer = null;
        }, timeout);
        getDefaultWebCameraFactory().openWebCameraAsync(this, this._options).then(function (e) {
          var cameraInfo = e.result;
          _this2._format = cameraInfo.format;
          _this2._size = [cameraInfo.width, cameraInfo.height];
          if (!isNaN(cameraInfo.facing)) {
            _this2._options.facing = cameraInfo.facing;
          }
          _this2._rotation = cameraInfo.rotation;
          whenWebCameraOpened(_this2, function () {
            return setTimeout(function () {
              return deferred.resolve(_this2);
            }, 0);
          });
        }, function (ex) {
          return deferred.reject(ex);
        }).then(function () {
          _this2._openDefer = null;
        });
      }
      return this._openDefer.promise;
    }

    /**
     * 关闭摄像头
     * @since 0.1.0
     * @return {Promise} 关闭成功/失败的错误码
     */

  }, {
    key: 'closeAsync',
    value: function closeAsync() {
      if (this._openDefer) {
        this._openDefer.reject(makeError(ERROR_CODE_CAMERA_OPEN_CANCEL));
        this._openDefer = null;
      }
      this._displayTargets.forEach(function (d) {
        return d.dispose();
      });
      this._displayTargets = [];
      releaseCurrentDetector();
      return getDefaultWebCameraFactory().closeWebCameraAsync(this);
    }

    /**
     * 创建相机渲染对象
     * @param {string} [container] dom id;
     * @param {DisplayTargetOptions} [options] - 可选配置
     * @return {DisplayTarget} DisplayTarget
     * @since 0.1.0
     */

  }, {
    key: 'createDisplayTarget',
    value: function createDisplayTarget(container) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var ele = document.getElementById(container);
      if (!ele) {
        throw makeError(ERROR_CODE_INVALID_DISPLAY_CONTAINER);
      }
      if (this._session.nativeDisplay) {
        var _container = $('div[data-display]', ele);
        if (!_container) {
          _container = document.createElement('div');
        }
        if (!_container.hasAttribute('id')) {
          _container.setAttribute('id', '_WADisplayTarget' + displayTargetSeed++);
        }
        options.container = _container;
      }
      if (!options.gl) {
        var cvs = ele.querySelector('canvas[data-display],canvas');
        if (!cvs) {
          cvs = document.createElement('canvas');
          var ratio = window.devicePixelRatio || 1;
          var width = ele.clientWidth;
          var height = ele.clientHeight;
          cvs.width = width * ratio;
          cvs.height = height * ratio;
          cvs.style.width = width + 'px';
          cvs.style.height = height + 'px';
          ele.appendChild(cvs);
        }
        options.gl = cvs.getContext('webgl');
      }
      if (options.container && options.gl) {
        ele.insertBefore(options.container, options.gl.canvas);
      }
      var target = new DisplayTarget(this, options);
      arrAdd(this._displayTargets, target);
      return target;
    }

    /**
     * 异步获取Detector
     * @param {string} name Detector模块名称
     * @param {Object} [options] 检测模块创建参数
     * @return {Promise.<Detector>} 检测模块的异步返回对象
     */

  }, {
    key: 'getDetectorAsync',
    value: function getDetectorAsync(name, options) {
      if (!isObj(options)) {
        options = {};
      }
      options.facing = this.facing;
      options.quality = this.quality;
      return getDetectorFromSessionAsync(this._session, name, options);
    }
  }, {
    key: '_onSyncDetectorResult',
    value: function _onSyncDetectorResult(result) {
      updateSyncDetectorResult(result);
    }
  }, {
    key: '_getCurrentFrame',
    value: function _getCurrentFrame() {
      return this._session.getCurrentFrame();
    }
  }, {
    key: 'isRunning',
    get: function get$$1() {
      return this._session.isRunning;
    }
  }, {
    key: 'isDirty',
    get: function get$$1() {
      var _this3 = this;

      if (this._dirty === null) {
        this._dirty = this._session.isDirty;
        addRunLoop(function (cancel) {
          _this3._dirty = null;
          cancel();
        });
      }
      return this._dirty;
    }
  }, {
    key: 'resolution',
    get: function get$$1() {
      var rotation = this._rotation;
      var size = this._size;
      return rotation % 180 === 0 ? [size[0], size[1]] : [size[1], size[0]];
    }
  }, {
    key: 'format',
    get: function get$$1() {
      return this._format;
    }
  }, {
    key: 'facing',
    get: function get$$1() {
      return this._options.facing;
    }
  }, {
    key: 'rotation',
    get: function get$$1() {
      return this._rotation;
    }
  }]);
  return WebCamera;
}(EventTarget);

function getCurrentFrameWithoutData() {
  return this._session.getCurrentFrame(NATIVE_BIND_FLAG);
}

function whenWebCameraOpened(webCamera, func) {
  !check() && addRunLoop(check);

  function check(cancel) {
    var session = webCamera._session;
    if (session.isDirty || session.nativeDisplay && session.isRunning) {
      cancel && cancel();
      func(webCamera);
      return true;
    }
  }
}

// 用于PC Debug调试

var WebRTCSession = function (_EventTarget) {
  inherits(WebRTCSession, _EventTarget);

  function WebRTCSession() {
    classCallCheck(this, WebRTCSession);

    var _this = possibleConstructorReturn(this, (WebRTCSession.__proto__ || Object.getPrototypeOf(WebRTCSession)).call(this));

    var video = _this._video = document.createElement('video');
    video.addEventListener('timeupdate', function () {
      _this._isDirty = true;
      video.width = video.videoWidth;
      video.height = video.videoHeight;
    });
    return _this;
  }

  createClass(WebRTCSession, [{
    key: 'start',
    value: function start(options) {
      var _this2 = this;

      var isBack = options.facing === CAMERA_FACING_BACK;
      var constraint = {
        video: {
          facingMode: 'user'
        }
      };
      this._video.rotation = isBack ? 180 : 0;
      navigator.mediaDevices.getUserMedia(constraint).then(function (stream) {
        return _this2._setStream(stream, isBack);
      }, function () {
        _this2.dispatchEvent(EVENT_SESSION_FAIL, { message: ERROR_CODE_APP_WEBSITE_PERMISSION_DENIED });
      });
    }
  }, {
    key: '_setStream',
    value: function _setStream(strem, isBack) {
      var _this3 = this;

      this._strem = strem;
      var video = this._video;
      video.srcObject = strem;
      video.play();

      addEventListenerOnce(video, 'canplay', function () {
        _this3.dispatchEvent(EVENT_SESSION_START, {
          result: {
            width: video.videoWidth,
            height: video.videoHeight,
            format: PIXEL_FORMAT_RGB,
            rotation: 0,
            facing: CAMERA_FACING_FRONT
          }
        });
      });
    }
  }, {
    key: 'getDetectorAsync',
    value: function getDetectorAsync() {
      return Promise.reject(ERROR_CODE_NO_SPECIFIED_DETECTOR);
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this._strem) {
        this._video.srcObject = null;
        this._strem.getTracks().forEach(function (track) {
          track.stop();
        });
        this.dispatchEvent(EVENT_SESSION_STOP, { target: this });
      }
    }
  }, {
    key: 'getCurrentFrame',
    value: function getCurrentFrame() {
      return this._video;
    }
  }, {
    key: 'isRunning',
    get: function get$$1() {
      return this._video ? !this._video.paused : false;
    }
  }, {
    key: 'isDirty',
    get: function get$$1() {
      return this._isDirty;
    }
  }]);
  return WebRTCSession;
}(EventTarget);

var g_session$1 = void 0;

function getWebRTCSession() {
  if (!g_session$1) {
    g_session$1 = new WebRTCSession();
  }
  return g_session$1;
}

var _FACING_KEY_WORDS;
var _videoSizes;

var FACING_KEY_WORDS = (_FACING_KEY_WORDS = {}, defineProperty(_FACING_KEY_WORDS, CAMERA_FACING_BACK, 'back'), defineProperty(_FACING_KEY_WORDS, CAMERA_FACING_FRONT, 'front'), _FACING_KEY_WORDS);

function getMediaConstraintAsync(facing, quality, format) {
  var m57 = isObj(navigator.mediaDevices);
  facing = m57 ? FACING_KEY_WORDS[facing] : getCameraWebRTCFacing(facing);
  var minHeight = getVideoSizeFromQuality(quality);
  var constraint = void 0;
  var c2Index = Infinity;
  var size = {
    minHeight: minHeight,
    minWidth: minHeight
  };
  if (minHeight instanceof Array) {
    size = {
      minHeight: minHeight[1],
      minWidth: minHeight[0]
    };
  }
  if (m57) {
    return navigator.mediaDevices.enumerateDevices().then(function (devices) {
      devices.some(findDeviceInfoM57);
      if (constraint) {
        return constraint;
      }
      throw makeError(devices.length ? ERROR_CODE_NO_SPECIFIED_DEVICE : ERROR_CODE_APP_WEBSITE_PERMISSION_DENIED);
    });
  }
  return new Promise(function (res, rej) {
    MediaStreamTrack.getSources(function (devices) {
      devices.some(findDeviceInfo);
      constraint ? res(constraint || {}) : rej(makeError(devices.length ? ERROR_CODE_NO_SPECIFIED_DEVICE : ERROR_CODE_APP_WEBSITE_PERMISSION_DENIED));
    });
  });

  function findDeviceInfo(deviceInfo) {
    if (deviceInfo.kind === 'video' && deviceInfo.facing === facing) {
      return constraint = {
        video: {
          mandatory: {
            sourceId: deviceInfo.id,
            minHeight: size.minWidth,
            minWidth: size.minHeight,
            ucArFormat: format || 'yv12'
          }
        }
      };
    }
  }

  function findDeviceInfoM57(deviceInfo) {
    if (deviceInfo.kind === 'videoinput' && deviceInfo.label.indexOf(facing) > 0) {
      var c = {
        video: {
          deviceId: deviceInfo.deviceId,
          width: { min: size.minWidth },
          height: { min: size.minHeight }
        }
      };
      if (/camera2\s(\d+)/.test(deviceInfo.label)) {
        var index = +RegExp.$1;
        if (index < c2Index) {
          c2Index = index;
          constraint = c;
        }
      } else {
        constraint = c;
        return true;
      }
    }
  }
}

var videoSizes = (_videoSizes = {}, defineProperty(_videoSizes, CAMERA_QUALITY_DEFAULT, 480), defineProperty(_videoSizes, CAMERA_QUALITY_LOW, 360), defineProperty(_videoSizes, CAMERA_QUALITY_MEDIUM, 480), defineProperty(_videoSizes, CAMERA_QUALITY_HIGH, 720), _videoSizes);

function getVideoSizeFromQuality(quality) {
  if (quality === CAMERA_QUALITY_DEVICE_HIGH) {
    if (isAndroid) {
      // TODO 后续使用 Android  设备 支持的相机分辨率列表最好的一个
      // TODO 处理尝试失败的情况
      var devicePixelRatio = window.devicePixelRatio;
      if (devicePixelRatio > 3) {
        devicePixelRatio = 3;
      }
      // 使用设备的最高支持分辨率, 屏幕设备信息，所以 宽度，高度 反着写
      return [screen.width * devicePixelRatio, screen.height * devicePixelRatio];
    }
    quality = CAMERA_QUALITY_HIGH;
  }
  if (quality instanceof Array) {
    return quality;
  }
  return videoSizes[quality] || videoSizes[CAMERA_QUALITY_DEFAULT];
}

function getCameraWebRTCFacing(facing) {
  return facing === CAMERA_FACING_BACK ? 'environment' : 'user';
}

function wrapSession_3_(session) {
  var start = session.start;
  session.start = function normalized(opt) {
    if (opt.cameraSource) {
      session.nativeDisplay = true;
      start.call(session, { video: opt });
    } else {
      session.nativeDisplay = false;
      getMediaConstraintAsync(opt.facing, opt.quality).then(function (constraint) {
        return start.call(session, constraint);
      });
    }
  };

  session._createDisplayViewAsync = function (name, manuallyRender) {
    var container = document.getElementById(name);
    if (container) {
      container.innerHTML = container.innerHTML + '\n      <object id="map" type="application/map" style="width:100%; height:100%; opacity:1;">\n      <param id="param" name="webar" value="arcore"/>\n      <param name="type" value="video" />\n      <param id="param" name="manuallyRender" value="' + (!!manuallyRender + '') + '"/>\n    </object>\n      ';
      return Promise.resolve();
    }
    return Promise.reject(makeError(ERROR_CODE_INVALID_DISPLAY_CONTAINER));
  };
  ['renderDisplayView', 'toggleDisplayView', 'transformTexCoord'].forEach(function (key) {
    var func = session['p_' + key];
    if (func) {
      session['_' + key] = func;
    }
  });
  session._updateFilters = function () {};
  session._snapshotAsync = function (name, origin) {
    return session.p_snapshotAsync(name, '').then(function (data) {
      return {
        width: data.width,
        height: data.height,
        value: data.data
      };
    });
  };
  return session;
}

var g_session = void 0;

function getStandardARSessionAsync(opt) {
  if (g_session) {
    return Promise.resolve(g_session);
  }
  return new Promise(function (res, rej) {
    if (isIOS) {
      addRunLoop(function (cancel) {
        if (window.ARSession) {
          cancel();
          res(g_session = ARSessionTakePhotoFallback(window.ARSession));
        }
      });
    } else if (window.ARSession) {
      res(g_session = wrapSession_3_(window.ARSession));
    } else if (isObj(navigator.mediaDevices)) {
      res(g_session = getWebRTCSession());
    } else {
      rej(makeError(ERROR_CODE_NO_NATIVE_RUNTIME));
    }
  });
}

function ARSessionTakePhotoFallback(session) {
  var requestMap = {};
  if (isFunc(session.takePhoto)) {
    session.takePhotoAsync = function () {
      var reqId = session.takePhoto();
      if (reqId) {
        var d = requestMap[reqId] = defer();
        return d.promise;
      }
      return Promise.reject(makeError(ERROR_CODE_SYSTEM_NOT_SUPPORT));
    };
    session.addEventListener('photo', function (e) {
      var d = requestMap[e.id || e.name];
      var error = e.error || e.code;
      if (d) {
        error ? d.reject(makeError(error)) : d.resolve({ data: e.data || e.value, format: 0 });
      }
    });
  }
  return session;
}

var VERSION = '0.0.1';

var AlipayFallbackARSession = function () {
  function AlipayFallbackARSession(ns) {
    classCallCheck(this, AlipayFallbackARSession);

    this._ns = ns;
  }

  createClass(AlipayFallbackARSession, [{
    key: 'start',
    value: function start(options) {
      var _this = this;

      if (!this._camera) {
        var quality = options.quality;
        if (quality === CAMERA_QUALITY_HIGH) {
          quality = 4;
        } else if (quality === CAMERA_QUALITY_MEDIUM) {
          quality = 2;
        } else if (quality === CAMERA_QUALITY_DEFAULT) {
          quality = 3;
        }
        // 兼容Android 处理，如果是数组，就是设置成 默认值
        if (quality instanceof Array) {
          quality = CAMERA_QUALITY_DEFAULT;
        }
        options.quality = quality;
        var camera = this._camera = new this._ns.WebCamera(options);
        camera.start();
        addRunLoop(function (cancel) {
          if (camera.isRunning && camera.isDirty) {
            var frame = camera.getCurrentFrames()[0];
            _dispatchEvent(_this, EVENT_SESSION_START, {
              result: {
                width: frame.width,
                height: frame.height,
                rotation: camera.orientation,
                format: PIXEL_FORMAT_YUV420
              }
            });
            cancel();
          }
        });
      }
    }
  }, {
    key: 'getCurrentFrame',
    value: function getCurrentFrame() {
      if (this._camera) {
        var frames = this._camera.getCurrentFrames();
        var f0 = frames[0];
        return {
          width: f0.width,
          height: f0.height,
          dataArray: [f0.data, frames[1].data],
          rotation: 90
        };
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this._detector) {
        this._detector.stop();
      }
      if (this._camera) {
        this._camera.stop();
        this._camera = null;
        _dispatchEvent(this, EVENT_SESSION_STOP);
      }
    }
  }, {
    key: 'addEventListener',
    value: function addEventListener$$1(evt, func) {
      _addEventListener(this, evt, func);
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener$$1(evt, func) {
      _removeEventListener(this, evt, func);
    }
  }, {
    key: 'getDetectorAsync',
    value: function getDetectorAsync(name) {
      return Promise.reject(makeError(ERROR_CODE_NO_SPECIFIED_DETECTOR));
    }
  }, {
    key: 'version',
    get: function get$$1() {
      return VERSION;
    }
  }, {
    key: 'isRunning',
    get: function get$$1() {
      return this._camera && this._camera.isRunning;
    }
  }, {
    key: 'isDirty',
    get: function get$$1() {
      return this._camera && this._camera.isDirty;
    }
  }]);
  return AlipayFallbackARSession;
}();

var wrapARSession = void 0;

var APAndroidFallbackARSession = function (_EventTarget) {
  inherits(APAndroidFallbackARSession, _EventTarget);

  function APAndroidFallbackARSession(session) {
    classCallCheck(this, APAndroidFallbackARSession);

    var _this = possibleConstructorReturn(this, (APAndroidFallbackARSession.__proto__ || Object.getPrototypeOf(APAndroidFallbackARSession)).call(this));

    _this._session = session;
    _this._detectorName = 'MarkerDetector';
    _this._detector = null;
    _this.normalizeEvents(session);
    return _this;
  }

  createClass(APAndroidFallbackARSession, [{
    key: 'checkConstraintNotSatisfiedError',
    value: function checkConstraintNotSatisfiedError(err) {
      var isConstraintError = false;
      if (typeof err === 'string') {
        try {
          var _err = JSON.parse(err);
          if (_err && _err.msg === 'ConstraintNotSatisfiedError') {
            isConstraintError = true;
            return _err;
          }
        } catch (e) {
          console.error(e);
        }
      }
      return isConstraintError;
    }
  }, {
    key: 'normalizeEvents',
    value: function normalizeEvents(session) {
      var _this2 = this;

      session.addEventListener(EVENT_SESSION_STOP, function (e) {
        return _dispatchEvent(_this2, EVENT_SESSION_STOP, {});
      });
      session.addEventListener(EVENT_SESSION_FAIL, function (e) {
        var message = void 0;
        var isConstraintError = _this2.checkConstraintNotSatisfiedError(e);
        if (isConstraintError) {
          _dispatchEvent(_this2, EVENT_SESSION_FAIL, {
            message: e,
            code: ERROR_CODE_RESOLUTION_NOT_SUPPORT
          });
        } else {
          if (/('|")errorCode\1:(\d+)/.test(e)) {
            message = RegExp.$2 === 0 ? ERROR_CODE_APP_WEBSITE_PERMISSION_DENIED : ERROR_CODE_APP_CAMERA_PERMISSION_ALREADY_DENIED;
          } else {
            message = ERROR_CODE_INVALID_ARGUMENT;
          }
          _dispatchEvent(_this2, EVENT_SESSION_FAIL, { message: message });
        }
      });

      session.addEventListener(EVENT_DETECT_RESULT, function (e) {
        if (_this2._detector) {
          try {
            var result = JSON.parse(e);
            _dispatchEvent(_this2._detector, EVENT_DETECT_RESULT, { result: result });
          } catch (ex) {
            console.error(ex);
          }
        }
      });

      session.addEventListener(EVENT_SESSION_START, function (e) {
        // session.setDetector(this._detectorName);
        addRunLoop(function (cancel) {
          if (session.isDirty) {
            var frame = _this2.getCurrentFrame();
            if (frame) {
              _dispatchEvent(_this2, EVENT_SESSION_START, {
                result: {
                  width: frame.width,
                  height: frame.height,
                  format: frame.format,
                  rotation: frame.rotation
                }
              });
              cancel();
            }
          }
        });
      });

      session.addEventListener = this.addEventListener.bind(this);
      session.removeEventListener = this.removeEventListener.bind(this);
    }
  }, {
    key: 'getDetectorAsync',
    value: function getDetectorAsync(name) {
      var _this3 = this;

      var detector = this._detector;
      // 0.2.0 只可能有这两个detector
      if (!/(MarkerDetector|FaceDetector)/.test(name)) {
        return Promise.reject(ERROR_CODE_NO_SPECIFIED_DETECTOR);
      }
      if (!detector) {
        detector = this._detector = this._session.setDetector(name);
        this._detectorName = name;
        detector.stop = function () {
          return _this3._detector = null;
        };
        wrapDetector(detector);
      } else if (this._detectorName !== name) {
        return Promise.reject(makeError(ERROR_CODE_DETECTOR_DUPLICATED));
      }
      return Promise.resolve(detector);
    }
  }, {
    key: 'getCurrentFrame',
    value: function getCurrentFrame() {
      var frames = this._session.getCurrentFrames();

      if (frames.length) {
        var dataArray = [];
        for (var i = 0; i < frames.length; i++) {
          dataArray.push(frames[i].data);
        }
        return {
          width: frames[0].width,
          height: frames[0].height,
          rotation: frames[0].rotation,
          format: PIXEL_FORMAT_I420,
          dataArray: dataArray
        };
      }
    }
  }, {
    key: 'start',
    value: function start(opt) {
      var session = this._session;
      getMediaConstraintAsync(opt.facing, opt.quality, opt.androidCameraFormat).then(function (constraint) {
        session.start(constraint);
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      this._session.stop();
    }
  }, {
    key: 'isRunning',
    get: function get$$1() {
      return this._session.isRunning;
    }
  }, {
    key: 'isDirty',
    get: function get$$1() {
      return this._session.isDirty;
    }
  }]);
  return APAndroidFallbackARSession;
}(EventTarget);

function getAPAndroidFallbackARSession() {
  if (wrapARSession) {
    return wrapARSession;
  }
  var session = window.ARSession || window.ucweb.ARSession;
  if (session) {
    if (session.version === '0.3.0') {
      wrapARSession = wrapSession_3_(session);
    } else {
      wrapARSession = new APAndroidFallbackARSession(session);
    }
    return wrapARSession;
  }
}

function wrapDetector(detector) {
  var setOption = detector.setOption;
  detector.setOption = function (options) {
    if (options.type === DETECTOR_OPTIONS_TYPE_RELOAD_MARKERS) {
      detector.setMarkers(options.value);
    } else {
      setOption.call(detector, JSON.stringify(options));
    }
  };
  detector.addEventListener = EventTarget.prototype.addEventListener;
  detector.removeEventListener = EventTarget.prototype.removeEventListener;
}

var WA_MSG_OPT_START_SESSION = 0x01;
var WA_MSG_OPT_INJECT_VIEW = 0x02;
var WA_MSG_OPT_DRAW_FRAME = 0x03;
var WA_MSG_OPT_GET_DETECTOR = 0x06;
var WA_MSG_OPT_DETECTOR_OPTIONS = 0x07;
var WA_MSG_OPT_DETECTOR_PAUSE = 0x08;
var WA_MSG_OPT_DETECTOR_RESUME = 0x09;
var WA_MSG_OPT_FRAME_TEXCOORD = 0x0d;
var WA_MSG_OPT_DETECTOR_STOP = 0x0a;
var WA_MSG_OPT_REMOVE_VIEW = 0x0c;
var WA_MSG_OPT_SESSION_STOP = 0x04;
var WA_MSG_OPT_RESIZE_VIEW = 0x0f;
var WA_MSG_OPT_TOGGLE_VIEW = 0x10;
var WA_MSG_OPT_SNAPSHOT = 0x11;
var WA_MSG_OPT_SET_FILTERS = 0x12;

var NativeDetector = function (_EventTarget) {
  inherits(NativeDetector, _EventTarget);

  function NativeDetector(metadata, port, remove) {
    classCallCheck(this, NativeDetector);

    var _this = possibleConstructorReturn(this, (NativeDetector.__proto__ || Object.getPrototypeOf(NativeDetector)).call(this));

    _this.metadata = metadata;
    _this._port = port;
    _this._remove = remove;
    return _this;
  }

  createClass(NativeDetector, [{
    key: 'setOption',
    value: function setOption(options) {
      this._port({ op: WA_MSG_OPT_DETECTOR_OPTIONS, value: options });
    }
  }, {
    key: 'pause',
    value: function pause() {
      this._port({ op: WA_MSG_OPT_DETECTOR_PAUSE });
    }
  }, {
    key: 'resume',
    value: function resume() {
      this._port({ op: WA_MSG_OPT_DETECTOR_RESUME });
    }
  }, {
    key: 'stop',
    value: function stop() {
      this._port({ op: WA_MSG_OPT_DETECTOR_STOP });
      this._remove();
      this._port = function () {
        return void 0;
      };
    }
  }]);
  return NativeDetector;
}(EventTarget);

var ARSession = function (_EventTarget2) {
  inherits(ARSession, _EventTarget2);

  function ARSession(ns) {
    classCallCheck(this, ARSession);

    var _this2 = possibleConstructorReturn(this, (ARSession.__proto__ || Object.getPrototypeOf(ARSession)).call(this));

    _this2._ns = ns;
    _this2.nativeDisplay = true;
    _this2._snapshotDefers = {};
    _this2._displayDefers = {};
    _this2._filterDefers = {};
    return _this2;
  }

  createClass(ARSession, [{
    key: 'start',
    value: function start(options) {
      this.__postMessage({
        op: WA_MSG_OPT_START_SESSION,
        facing: options.facing,
        quality: options.quality,
        cameraSource: options.cameraSource
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.__postMessage({ op: WA_MSG_OPT_SESSION_STOP });
    }

    /**
     * 创建渲染view
     * @param {string} name view的名称
     * @param {boolean} manuallyRender 是否都手动渲染,默认false
     * @return {Promise} 异步
     * @private
     */

  }, {
    key: '_createDisplayViewAsync',
    value: function _createDisplayViewAsync(name, manuallyRender, rect) {
      var _this3 = this;

      var d = this._displayDefers[name];
      if (!d) {
        d = defer();
        d.count = 60;
        this._displayDefers[name] = d;
        d.create = function () {
          return _this3.__postMessage({
            op: WA_MSG_OPT_INJECT_VIEW,
            name: name,
            value: !!manuallyRender,
            width: rect.width,
            height: rect.height,
            x: rect.left,
            y: rect.top
          });
        };
        requestAnimationFrame(d.create);
      }
      return d.promise;
    }
  }, {
    key: '_setFiltersAsync',
    value: function _setFiltersAsync(name, code, value) {
      var _this4 = this;

      if (this._filterDefers[name]) {
        return Promise.reject(makeError(ERROR_CODE_LAST_OPERATION_NOT_COMPLETE));
      }
      var msg = {
        op: WA_MSG_OPT_SET_FILTERS,
        name: name, code: code, value: value
      };
      var def = this._displayDefers[name];
      if (def) {
        def.promise.then(function () {
          return _this4.__postMessage(msg);
        });
      } else {
        this.__postMessage(msg);
      }
      return (this._filterDefers[name] = defer()).promise;
    }
  }, {
    key: '_updateFilters',
    value: function _updateFilters(name, value) {
      if (value.length) {
        this.__postMessage({
          op: WA_MSG_OPT_SET_FILTERS,
          name: name, value: value
        });
      }
    }

    /**
     * 移除渲染view
     * @param {string} name 渲染View的名称
     * @private
     */

  }, {
    key: '_removeDisplayView',
    value: function _removeDisplayView(name) {
      this.__postMessage({ op: WA_MSG_OPT_REMOVE_VIEW, name: name });
    }

    /**
     * 开启或关闭view渲染
     * @param {string} name view的名称
     * @param {boolean} resumed 是否继续渲染
     * @private
     */

  }, {
    key: '_toggleDisplayView',
    value: function _toggleDisplayView(name, resumed) {
      this.__postMessage({ op: WA_MSG_OPT_TOGGLE_VIEW, name: name, value: !resumed });
    }

    /**
     * 重新设置View大小
     * @param {string} name view名称
     * @param {Number} width view的宽度
     * @param {Number} height view的高度
     * @private
     */

  }, {
    key: '_resizeDisplayView',
    value: function _resizeDisplayView(name, width, height) {
      this.__postMessage({ op: WA_MSG_OPT_RESIZE_VIEW, name: name, width: width, height: height });
    }

    /**
     * 手动渲染view
     * @param {string }name view名称
     * @private
     */

  }, {
    key: '_renderDisplayView',
    value: function _renderDisplayView(name) {
      this.__postMessage({ op: WA_MSG_OPT_DRAW_FRAME, name: name });
    }

    /**
     * 从native对下一帧数据进行截图
     * @param {string} name view名称
     * @param {boolean} origin 是否高清拍照
     * @return {Promise.<*>}
     * @private
     */

  }, {
    key: '_snapshotAsync',
    value: function _snapshotAsync(name, origin) {
      if (this._snapshotDefers[name]) {
        return Promise.reject();
      }
      this.__postMessage({ op: WA_MSG_OPT_SNAPSHOT, name: name, value: !!origin });
      return (this._snapshotDefers[name] = defer()).promise;
    }

    /**
     * 设置view的texcoord数据
     * @param {string} name view名称
     * @param {Float32Array}data texcoord数据
     * @private
     */

  }, {
    key: '_transformTexCoord',
    value: function _transformTexCoord(name, data) {
      this.__postMessage({ op: WA_MSG_OPT_FRAME_TEXCOORD, name: name, value: Array.from(data) });
    }
  }, {
    key: '__postMessage',
    value: function __postMessage(msg) {
      window.webkit.messageHandlers[this._ns].postMessage(msg);
    }
  }, {
    key: '__onMessage',
    value: function __onMessage(evtName, evtArg) {
      var _this5 = this;

      if (/^Session/.test(evtName)) {
        if (evtName === 'SessionStart') {
          this._frame = evtArg.result;
        }
        this.dispatchEvent(evtName, evtArg);
      } else if (/^Detector/.test(evtName)) {
        var detector = this._currentDetector;
        if (evtName === EVENT_DETECTOR_INIT_RESULT) {
          if (detector) {
            detector.initResult = evtArg.result;
          }
        }
        if (detector) {
          detector.dispatchEvent(evtName, evtArg);
        }
      } else if (evtName === '_getDetector') {
        var deferred = this._detectorPending;
        if (evtArg.code) {
          deferred.reject({ code: evtArg.code });
        } else {
          deferred.resolve(this._currentDetector = new NativeDetector(evtArg.value, function (e) {
            return _this5.__postMessage(e);
          }, function () {
            return _this5._currentDetector = null;
          }));
        }
        this._detectorPending = null;
      } else if (evtName === '_SessionState') {
        this._isRunning = !!evtArg.isRunning;
      } else if (evtName === 'photo') {
        var def = this._snapshotDefers[evtArg.name];
        if (def) {
          delete this._snapshotDefers[evtArg.name];
          def.resolve(evtArg);
        }
      } else if (evtName === '_displayResult') {
        var _def = this._displayDefers[evtArg.name];
        if (_def) {
          if (evtArg.value) {
            _def.resolve();
            delete _def.create;
          } else if (_def.count-- > 0) {
            _def.create();
          } else {
            _def.reject(makeError(ERROR_CODE_INVALID_DISPLAY_CONTAINER));
          }
        }
      } else if (evtName === '_filterResult') {
        var _def2 = this._filterDefers[evtArg.name];
        delete this._filterDefers[evtArg.name];
        if (_def2) {
          if (evtArg.value) {
            _def2.resolve();
          } else {
            _def2.reject(makeError(ERROR_CODE_FILTER_COMPILE_FAIL, evtArg.code));
          }
        }
      }
    }
  }, {
    key: 'getCurrentFrame',
    value: function getCurrentFrame() {
      return this._frame;
    }
  }, {
    key: 'getDetectorAsync',
    value: function getDetectorAsync(name, opt) {
      if (this._detectorPending || this._currentDetector) {
        return Promise.reject({ code: 202 });
      }
      var deferred = this._detectorPending = defer();
      this.__postMessage({ op: WA_MSG_OPT_GET_DETECTOR, sync: opt && opt.sync, name: name });
      return deferred.promise;
    }
  }, {
    key: 'isRunning',
    get: function get$$1() {
      return this._isRunning;
    }
  }]);
  return ARSession;
}(EventTarget);

var session$1 = void 0;
var pending = void 0;

function getWKARSessionAsync() {
  if (session$1) {
    return Promise.resolve(session$1);
  } else if (!pending) {
    pending = defer();
  }
  return pending.promise;
}

window.__setWKARBridge = function (namespace) {
  session$1 = new ARSession(namespace);
  Object.defineProperties(window, {
    ARSession: {
      configurable: false,
      value: session$1,
      writable: false
    },
    __WKAREvents: {
      configurable: false,
      writable: false,
      value: function value(ns, events) {
        if (namespace === ns) {
          for (var i = 0; i < events.length; i += 2) {
            try {
              var arg = isObj(events[i + 1]) ? decodeJSON(events[i + 1]) : decodeBinary(base64ToArrayBuffer$1(events[i + 1]));
              session$1.__onMessage(events[i], arg);
            } finally {
              //
            }
          }
        }
      }
    }
  });

  if (pending) {
    pending.resolve(session$1);
  }
};

var WA_BINARY_TYPE_NUMBER = 1;
var WA_BINARY_TYPE_STRING = 2;
var WA_BINARY_TYPE_DATE = 3;
var WA_BINARY_TYPE_ARRAY = 4;
var WA_BINARY_TYPE_OBJECT = 5;
var WA_BINARY_TYPE_DATA = 6;

function decodeJSON(obj) {
  forEach(obj, function replaceB64(val, key) {
    if (/data:,/.test(val)) {
      obj[key] = base64ToArrayBuffer$1(val.slice(6));
    } else if (isObj(val)) {
      decodeJSON(val);
    }
  });
  return obj;
}

function decodeBinary(arraybuffer) {
  var littleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var dataView = new DataView(arraybuffer, start);
  var type = dataView.getUint8(0);
  var headerSize = Uint8Array.BYTES_PER_ELEMENT + Uint32Array.BYTES_PER_ELEMENT;
  if (type === WA_BINARY_TYPE_DATA) {
    var dataLen = dataView.getUint32(1, littleEndian);
    var bufferStart = headerSize + start;
    return arraybuffer.slice(bufferStart, bufferStart + dataLen);
  } else if (type === WA_BINARY_TYPE_NUMBER) {
    return dataView.getFloat64(headerSize, littleEndian);
  } else if (type === WA_BINARY_TYPE_DATE) {
    var num = dataView.getFloat64(headerSize, littleEndian);
    return new Date(num);
  } else if (type === WA_BINARY_TYPE_STRING) {
    var codes = [];
    var _dataLen3 = dataView.getUint32(1, littleEndian);
    var stringView = new DataView(arraybuffer, headerSize + start);
    for (var i = 0, x = 0; i < _dataLen3; i += 2, x++) {
      codes[x] = stringView.getUint16(i, true);
    }
    return String.fromCharCode.apply(null, codes);
  } else if (type === WA_BINARY_TYPE_ARRAY) {
    var count = dataView.getUint32(headerSize, littleEndian);
    var cursor = headerSize + Uint32Array.BYTES_PER_ELEMENT;
    var arr = [];
    for (var _i5 = 0; _i5 < count; _i5++) {
      var itemSize = dataView.getUint32(cursor + 1, littleEndian);
      var item = decodeBinary(arraybuffer, littleEndian, start + cursor);
      arr.push(item);
      cursor += itemSize + headerSize;
    }
    return arr;
  } else if (type === WA_BINARY_TYPE_OBJECT) {
    var _count = dataView.getUint32(headerSize, littleEndian);
    var _cursor2 = headerSize + Uint32Array.BYTES_PER_ELEMENT;
    var obj = {};
    for (var _i6 = 0; _i6 < _count; _i6++) {
      var keySize = dataView.getUint32(_cursor2 + 1, littleEndian);
      var key = decodeBinary(arraybuffer, littleEndian, start + _cursor2);
      _cursor2 += keySize + headerSize;
      var valueSize = dataView.getUint32(_cursor2 + 1, littleEndian);
      var _value = decodeBinary(arraybuffer, littleEndian, start + _cursor2);
      _cursor2 += valueSize + headerSize;
      obj[key] = _value;
    }
    return obj;
  }
  return null;
}

function base64ToArrayBuffer$1(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

var ARSessionNamespace = '_ARSession';

var session = void 0;

function getAPARSessionAsync(opt) {
  if (session) {
    return Promise.resolve(session);
  }
  if (isIOS) {
    return new Promise(function (res, rej) {
      bridgeReady(function () {
        var usage = (opt && opt.usage ? opt.usage : '') + '';
        window[ARSessionNamespace] = {};
        AlipayJSBridge.call('initWebAR', { namespace: ARSessionNamespace, usage: usage }, function (e) {
          var error = e.error;
          if (error) {
            var errorCode = ERROR_CODE_NO_NATIVE_RUNTIME;
            if (error === 25) {
              errorCode = ERROR_CODE_SYSTEM_NOT_SUPPORT;
            } else if (error === 11) {
              errorCode = ERROR_CODE_APP_WEBSITE_PERMISSION_DENIED;
            } else if (error === 23) {
              errorCode = ERROR_CODE_WEBVIEW_NOT_SUPPORT;
            } else if (/\d{3,}/.test(error)) {
              errorCode = error;
            }
            rej(makeError(errorCode));
          } else {
            var version = e.version;
            if (/0\.3\.\d+/.test(version)) {
              if (e.wk) {
                session = getWKARSessionAsync(version);
              } else {
                session = ARSessionTakePhotoFallback(window.ARSession);
              }
            } else {
              session = window.ARSession = new AlipayFallbackARSession(window[ARSessionNamespace]);
            }
            res(session);
          }
        });
      });
    });
  } else if (isAndroid) {
    session = getAPAndroidFallbackARSession();
    if (session) {
      return Promise.resolve(session);
    }
  }
  return Promise.reject(makeError(ERROR_CODE_NO_NATIVE_RUNTIME));
}

function bridgeReady(callback) {
  if (window.AlipayJSBridge) {
    callback && callback();
  } else {
    document.addEventListener('AlipayJSBridgeReady', callback, false);
  }
}

var UCAndroidFallbackARSession = function () {
  function UCAndroidFallbackARSession(session) {
    classCallCheck(this, UCAndroidFallbackARSession);

    this._session = session;
    this._detectorName = 'MarkerDetector';
    this._detector = null;
    this.normalizeEvents(session);
  }

  createClass(UCAndroidFallbackARSession, [{
    key: 'checkConstraintNotSatisfiedError',
    value: function checkConstraintNotSatisfiedError(err) {
      var isConstraintError = false;
      if (typeof err === 'string') {
        try {
          var _err = JSON.parse(err);
          if (_err && _err.msg === 'ConstraintNotSatisfiedError') {
            isConstraintError = true;
            return _err;
          }
        } catch (e) {
          console.error(e);
        }
      }
      return isConstraintError;
    }
  }, {
    key: 'normalizeEvents',
    value: function normalizeEvents(session) {
      var _this = this;

      session.addEventListener(EVENT_SESSION_STOP, function (e) {
        return _dispatchEvent(_this, EVENT_SESSION_STOP, {});
      });
      session.addEventListener(EVENT_SESSION_FAIL, function (e) {
        var message = ERROR_CODE_CAMERA_UNKNOWN_ANDROID;
        var isConstraintError = _this.checkConstraintNotSatisfiedError(e);
        if (isConstraintError) {
          _dispatchEvent(_this, EVENT_SESSION_FAIL, {
            message: e,
            code: ERROR_CODE_RESOLUTION_NOT_SUPPORT
          });
        } else {
          var errorCode = -1;
          if (isStr(e)) {
            if (/('|")errorCode\1:(\d+)/.test(e)) {
              errorCode = +RegExp.$2;
            } else {
              errorCode = -1;
            }
          } else if (isObj(e.result)) {
            errorCode = e.result.errorCode;
          }
          if (errorCode === 0) {
            message = ERROR_CODE_APP_WEBSITE_PERMISSION_DENIED;
          } else if (errorCode === 8) {
            message = ERROR_CODE_APP_CAMERA_PERMISSION_ALREADY_DENIED;
          }
          _dispatchEvent(_this, EVENT_SESSION_FAIL, { message: message });
        }
      });

      session.addEventListener(EVENT_DETECT_RESULT, function (e) {
        if (_this._detector) {
          try {
            var result = JSON.parse(e);
            _dispatchEvent(_this._detector, EVENT_DETECT_RESULT, { result: result });
          } catch (ex) {
            console.error(ex);
          }
        }
      });

      session.addEventListener(EVENT_SESSION_START, function (e) {
        // session.setDetector(this._detectorName);
        addRunLoop(function (cancel) {
          if (session.isDirty) {
            var frame = _this.getCurrentFrame();
            _dispatchEvent(_this, EVENT_SESSION_START, {
              result: {
                width: frame.width,
                height: frame.height,
                format: frame.format,
                rotation: frame.rotation
              }
            });
            cancel();
          }
        });
      });

      session.addEventListener = this.addEventListener.bind(this);
      session.removeEventListener = this.removeEventListener.bind(this);
    }
  }, {
    key: 'getDetectorAsync',
    value: function getDetectorAsync(name) {
      var detector = this._detector;
      if (!detector) {
        detector = this._detector = this._session.setDetector(name);
        this._detectorName = name;
        if (this._session.version == '0.2.0') {
          detector.addEventListener = this.addEventListener;
          detector.removeEventListener = this.removeEventListener;
        }
      } else if (this._detectorName !== name) {
        return Promise.reject(makeError(ERROR_CODE_DETECTOR_DUPLICATED));
      }
      return Promise.resolve(detector);
    }
  }, {
    key: 'getCurrentFrame',
    value: function getCurrentFrame() {
      var frames = this._session.getCurrentFrames();

      if (frames.length) {
        var dataArray = [];
        for (var i = 0; i < frames.length; i++) {
          dataArray.push(frames[i].data);
        }
        return {
          width: frames[0].width,
          height: frames[0].height,
          rotation: frames[0].rotation,
          format: frames[0].format || PIXEL_FORMAT_I420,
          dataArray: dataArray
        };
      }
    }
  }, {
    key: 'addEventListener',
    value: function addEventListener$$1(name, func) {
      _addEventListener(this, name, func);
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener$$1(name, func) {
      _removeEventListener(this, name, func);
    }
  }, {
    key: 'start',
    value: function start(opt) {
      var session = this._session;
      getMediaConstraintAsync(opt.facing, opt.quality).then(function (constraint) {
        session.start(constraint);
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      this._session.stop();
    }
  }, {
    key: 'isRunning',
    get: function get$$1() {
      return this._session.isRunning;
    }
  }, {
    key: 'isDirty',
    get: function get$$1() {
      return this._session.isDirty;
    }
  }]);
  return UCAndroidFallbackARSession;
}();

function getARSessionAsync(opt) {
  if (isAlipayClient) {
    return getAPARSessionAsync(opt);
  }
  return getStandardARSessionAsync(opt);
}

/**
 * @global
 * @description 查询APP相机权限是否支持
 * @return {number} APP相机权限
 */
function queryCameraAuthorizationStatusAsync() {
  var session = getARSessionAsync();
  if (isFunc(session.queryCameraAuthorizationStatusAsync)) {
    return session.queryCameraAuthorizationStatusAsync();
  }
  return Promise.reject(makeError(ERROR_CODE_RUNTIME_NOT_SUPPORT));
}

/**
 * 相机获取的设置
 * @public
 * @typedef {Object} WebCameraOptions
 * @property {number} [facing] 相机设备朝向，默认后置
 * @property {number} [quality] 相机分辨率质量，iOS默认1280*720，安卓默认不小于480P
 */

var WebCameraFactory = function () {
  function WebCameraFactory() {
    classCallCheck(this, WebCameraFactory);
  }

  createClass(WebCameraFactory, [{
    key: 'getWebCameraAsync',
    value: function getWebCameraAsync(options) {
      var _this = this;

      if (this._currentWebCamera) {
        return Promise.reject(makeError(ERROR_CODE_CAMERA_OCCUPIED));
      }
      if (!this._sessionPending) {
        this._sessionPending = interceptPromise(getARSessionAsync(options), function () {
          return _this._sessionPending = null;
        });
      }
      return this._sessionPending.then(function (session) {
        _this._currentWebCamera = new WebCamera(session, options);
        return _this._currentWebCamera;
      });
    }
  }, {
    key: 'openWebCameraAsync',
    value: function openWebCameraAsync(webCamera, options) {
      if (this._currentWebCamera === webCamera) {
        var session = webCamera._session;
        return new Promise(function (res, rej) {
          session.addEventListener(EVENT_SESSION_START, onStart);
          session.addEventListener(EVENT_SESSION_FAIL, onFail);
          session.start(options);

          function onStart(e) {
            res(e);
            clear();
          }

          function onFail(e) {
            if (e.code !== null) {
              rej(makeError(e.code || e.result, e.message));
            } else {
              rej(makeError(e.message));
            }
            clear();
          }

          function clear() {
            session.removeEventListener(EVENT_SESSION_FAIL, onFail);
            session.removeEventListener(EVENT_SESSION_START, onStart);
          }
        });
      }
      return Promise.reject(makeError(ERROR_CODE_INVALID_ARGUMENT));
    }
  }, {
    key: 'closeWebCameraAsync',
    value: function closeWebCameraAsync(webCamera) {
      var _this2 = this;

      if (this._currentWebCamera === webCamera) {
        var session = webCamera._session;
        return new Promise(function (res) {
          var onStop = function onStop() {
            _this2._currentWebCamera = null;
            res();
          };
          if (!session.isRunning) {
            onStop();
          }
          addEventListenerOnce(session, EVENT_SESSION_STOP, onStop);
          session.stop();
        });
      }
      return Promise.reject(makeError(ERROR_CODE_CAMERA_CLOSE_FAIL));
    }
  }, {
    key: 'checkCameraSourceAvailabilityAsync',
    value: function checkCameraSourceAvailabilityAsync(name) {
      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (isIOS) {
        return Promise.resolve(0);
      } else if (isFunc(window.ARSession.checkCameraSourceAvailabilityAsync)) {
        return window.ARSession.checkCameraSourceAvailabilityAsync(name, opt);
      }
      return Promise.reject(makeError(ERROR_CODE_RUNTIME_NOT_SUPPORT));
    }
  }]);
  return WebCameraFactory;
}();

var g_webCamFactory = void 0;

function getDefaultWebCameraFactory() {
  if (!g_webCamFactory) {
    g_webCamFactory = new WebCameraFactory();
  }
  return g_webCamFactory;
}

/**
 * 获取相机
 * @global
 * @param {WebCameraOptions} [options] 可选相机参数
 * @return {Promise.<WebCamera>} 相机获取的异步对象
 */
function getWebCameraAsync(options) {
  return getDefaultWebCameraFactory().getWebCameraAsync(options);
}

function checkCameraSourceAvailabilityAsync(name, opt) {
  return getDefaultWebCameraFactory().checkCameraSourceAvailabilityAsync(name, opt);
}

var experiment = {
  GLFrameBuffer: GLFrameBuffer,
  GLMesh: GLMesh,
  GLTexture: GLTexture,
  WebGL_CONST: WebGL_CONST,
  GLSampler2D: GLSampler2D,
  GLProgram: GLProgram,
  GLAttribute: GLAttribute,
  GLRenderNode: GLRenderNode,
  GLFilter: GLFilter,
  GLTask: GLTask,
  Renderer: Renderer,
  createMat3: createMat3
};

exports.BaseDetector = BaseDetector;
exports.registerDetector = registerDetector;
exports.defer = defer;
exports.makeError = makeError;
exports.handleWebARError = handleWebARError;
exports.ensureArrayBuffer = ensureArrayBuffer;
exports.queryCameraAuthorizationStatusAsync = queryCameraAuthorizationStatusAsync;
exports.getWebCameraAsync = getWebCameraAsync;
exports.checkCameraSourceAvailabilityAsync = checkCameraSourceAvailabilityAsync;
exports.experiment = experiment;
exports.CAMERA_FACING_BACK = CAMERA_FACING_BACK;
exports.CAMERA_FACING_FRONT = CAMERA_FACING_FRONT;
exports.CAMERA_QUALITY_DEFAULT = CAMERA_QUALITY_DEFAULT;
exports.CAMERA_QUALITY_LOW = CAMERA_QUALITY_LOW;
exports.CAMERA_QUALITY_MEDIUM = CAMERA_QUALITY_MEDIUM;
exports.CAMERA_QUALITY_HIGH = CAMERA_QUALITY_HIGH;
exports.CAMERA_QUALITY_DEVICE_HIGH = CAMERA_QUALITY_DEVICE_HIGH;
exports.CAMERA_AUTHORIZATION_STATUS_UNDEFINED = CAMERA_AUTHORIZATION_STATUS_UNDEFINED;
exports.CAMERA_AUTHORIZATION_STATUS_DENIED = CAMERA_AUTHORIZATION_STATUS_DENIED;
exports.CAMERA_AUTHORIZATION_STATUS__ALLOWED = CAMERA_AUTHORIZATION_STATUS__ALLOWED;
exports.CAMERA_HINT_TAKE_PHOTO = CAMERA_HINT_TAKE_PHOTO;
exports.ERROR_CODE_APP_CAMERA_PERMISSION_ALREADY_DENIED = ERROR_CODE_APP_CAMERA_PERMISSION_ALREADY_DENIED;
exports.ERROR_CODE_APP_CAMERA_PERMISSION_CURRENT_DENIED = ERROR_CODE_APP_CAMERA_PERMISSION_CURRENT_DENIED;
exports.ERROR_CODE_APP_WEBSITE_PERMISSION_DENIED = ERROR_CODE_APP_WEBSITE_PERMISSION_DENIED;
exports.ERROR_CODE_RESOLUTION_NOT_SUPPORT = ERROR_CODE_RESOLUTION_NOT_SUPPORT;
exports.ERROR_CODE_NO_SPECIFIED_DEVICE = ERROR_CODE_NO_SPECIFIED_DEVICE;
exports.ERROR_CODE_NO_CAMERA_SOURCE = ERROR_CODE_NO_CAMERA_SOURCE;
exports.ERROR_CODE_CAMERA_CLOSE_FAIL = ERROR_CODE_CAMERA_CLOSE_FAIL;
exports.ERROR_CODE_CAMERA_OPEN_TIME_OUT = ERROR_CODE_CAMERA_OPEN_TIME_OUT;
exports.ERROR_CODE_CAMERA_OPEN_CANCEL = ERROR_CODE_CAMERA_OPEN_CANCEL;
exports.ERROR_CODE_CAMERA_OCCUPIED = ERROR_CODE_CAMERA_OCCUPIED;
exports.ERROR_CODE_CAMERA_UNKNOWN_ANDROID = ERROR_CODE_CAMERA_UNKNOWN_ANDROID;
exports.ERROR_CODE_NO_SPECIFIED_DETECTOR = ERROR_CODE_NO_SPECIFIED_DETECTOR;
exports.ERROR_CODE_DETECTOR_DUPLICATED = ERROR_CODE_DETECTOR_DUPLICATED;
exports.ERROR_CODE_DETECTOR_MARKER_LOAD_FAIL = ERROR_CODE_DETECTOR_MARKER_LOAD_FAIL;
exports.ERROR_CODE_DETECTOR_RESOURCE_FAIL = ERROR_CODE_DETECTOR_RESOURCE_FAIL;
exports.ERROR_CODE_DETECTOR_TRACKING_FAIL = ERROR_CODE_DETECTOR_TRACKING_FAIL;
exports.ERROR_CODE_DETECTOR_LOAD_TIMEOUT = ERROR_CODE_DETECTOR_LOAD_TIMEOUT;
exports.ERROR_CODE_SYSTEM_NOT_SUPPORT = ERROR_CODE_SYSTEM_NOT_SUPPORT;
exports.ERROR_CODE_WEBVIEW_NOT_SUPPORT = ERROR_CODE_WEBVIEW_NOT_SUPPORT;
exports.ERROR_CODE_NO_NATIVE_RUNTIME = ERROR_CODE_NO_NATIVE_RUNTIME;
exports.ERROR_CODE_AR_CORE_BUNDLE_NOT_INSTALL = ERROR_CODE_AR_CORE_BUNDLE_NOT_INSTALL;
exports.ERROR_CODE_RUNTIME_NOT_SUPPORT = ERROR_CODE_RUNTIME_NOT_SUPPORT;
exports.ERROR_CODE_WK_SESSION_FAIL = ERROR_CODE_WK_SESSION_FAIL;
exports.ERROR_CODE_ARCORE_NOT_INSTALLED = ERROR_CODE_ARCORE_NOT_INSTALLED;
exports.ERROR_CODE_GO_TO_INSTALL_ARCORE = ERROR_CODE_GO_TO_INSTALL_ARCORE;
exports.ERROR_CODE_INVALID_ARGUMENT = ERROR_CODE_INVALID_ARGUMENT;
exports.ERROR_CODE_INVALID_WEBGL_CONTEXT = ERROR_CODE_INVALID_WEBGL_CONTEXT;
exports.ERROR_CODE_INVALID_DISPLAY_CONTAINER = ERROR_CODE_INVALID_DISPLAY_CONTAINER;
exports.ERROR_CODE_LAST_OPERATION_NOT_COMPLETE = ERROR_CODE_LAST_OPERATION_NOT_COMPLETE;
exports.ERROR_CODE_FILTER_COMPILE_FAIL = ERROR_CODE_FILTER_COMPILE_FAIL;
exports.EVENT_DETECTOR_INIT_RESULT = EVENT_DETECTOR_INIT_RESULT;
exports.EVENT_DETECT_RESULT = EVENT_DETECT_RESULT;
exports.EVENT_SESSION_START = EVENT_SESSION_START;
exports.EVENT_SESSION_FAIL = EVENT_SESSION_FAIL;
exports.EVENT_SESSION_STOP = EVENT_SESSION_STOP;
exports.EVENT_WEBCAMERA_OPEN = EVENT_WEBCAMERA_OPEN;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=web-ar.js.map
