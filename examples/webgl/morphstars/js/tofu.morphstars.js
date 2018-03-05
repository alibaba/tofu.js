(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three'), require('tofu.js')) :
	typeof define === 'function' && define.amd ? define(['exports', 'three', 'tofu.js'], factory) :
	(factory((global.Tofu = global.Tofu || {}),global.THREE,global.Tofu));
}(this, (function (exports,three,three_tofu_js) { 'use strict';

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
 * Break faces with edges longer than maxEdgeLength
 * - not recursive
 *
 * @private
 * @author alteredq / http://alteredqualia.com/
 */

var TessellateModifier = function () {
  function TessellateModifier(maxEdgeLength) {
    classCallCheck(this, TessellateModifier);

    this.maxEdgeLength = three_tofu_js.Utils.isNumber(maxEdgeLength) ? maxEdgeLength : 1;
  }

  createClass(TessellateModifier, [{
    key: 'setMaxEdgeLength',
    value: function setMaxEdgeLength(maxEdgeLength) {
      this.maxEdgeLength = three_tofu_js.Utils.isNumber(maxEdgeLength) ? maxEdgeLength : this.maxEdgeLength;
    }
  }, {
    key: 'modify',
    value: function modify(geometry) {
      var edge = void 0;

      var faces = [];
      var faceVertexUvs = [];
      var maxEdgeLengthSquared = this.maxEdgeLength * this.maxEdgeLength;
      var fvl = geometry.faceVertexUvs.length;

      for (var i = 0; i < fvl; i++) {
        faceVertexUvs[i] = [];
      }

      var fl = geometry.faces.length;
      for (var _i = 0; _i < fl; _i++) {

        var face = geometry.faces[_i];

        if (face instanceof three.Face3) {

          var a = face.a;
          var b = face.b;
          var c = face.c;

          var va = geometry.vertices[a];
          var vb = geometry.vertices[b];
          var vc = geometry.vertices[c];

          var dab = va.distanceToSquared(vb);
          var dbc = vb.distanceToSquared(vc);
          var dac = va.distanceToSquared(vc);

          if (dab > maxEdgeLengthSquared || dbc > maxEdgeLengthSquared || dac > maxEdgeLengthSquared) {

            var m = geometry.vertices.length;

            var triA = face.clone();
            var triB = face.clone();

            var vm = null;

            if (dab >= dbc && dab >= dac) {

              vm = va.clone();
              vm.lerp(vb, 0.5);

              triA.a = a;
              triA.b = m;
              triA.c = c;

              triB.a = m;
              triB.b = b;
              triB.c = c;

              if (face.vertexNormals.length === 3) {

                var vnm = face.vertexNormals[0].clone();
                vnm.lerp(face.vertexNormals[1], 0.5);

                triA.vertexNormals[1].copy(vnm);
                triB.vertexNormals[0].copy(vnm);
              }

              if (face.vertexColors.length === 3) {

                var vcm = face.vertexColors[0].clone();
                vcm.lerp(face.vertexColors[1], 0.5);

                triA.vertexColors[1].copy(vcm);
                triB.vertexColors[0].copy(vcm);
              }

              edge = 0;
            } else if (dbc >= dab && dbc >= dac) {

              vm = vb.clone();
              vm.lerp(vc, 0.5);

              triA.a = a;
              triA.b = b;
              triA.c = m;

              triB.a = m;
              triB.b = c;
              triB.c = a;

              if (face.vertexNormals.length === 3) {

                var _vnm = face.vertexNormals[1].clone();
                _vnm.lerp(face.vertexNormals[2], 0.5);

                triA.vertexNormals[2].copy(_vnm);

                triB.vertexNormals[0].copy(_vnm);
                triB.vertexNormals[1].copy(face.vertexNormals[2]);
                triB.vertexNormals[2].copy(face.vertexNormals[0]);
              }

              if (face.vertexColors.length === 3) {

                var _vcm = face.vertexColors[1].clone();
                _vcm.lerp(face.vertexColors[2], 0.5);

                triA.vertexColors[2].copy(_vcm);

                triB.vertexColors[0].copy(_vcm);
                triB.vertexColors[1].copy(face.vertexColors[2]);
                triB.vertexColors[2].copy(face.vertexColors[0]);
              }

              edge = 1;
            } else {

              vm = va.clone();
              vm.lerp(vc, 0.5);

              triA.a = a;
              triA.b = b;
              triA.c = m;

              triB.a = m;
              triB.b = b;
              triB.c = c;

              if (face.vertexNormals.length === 3) {

                var _vnm2 = face.vertexNormals[0].clone();
                _vnm2.lerp(face.vertexNormals[2], 0.5);

                triA.vertexNormals[2].copy(_vnm2);
                triB.vertexNormals[0].copy(_vnm2);
              }

              if (face.vertexColors.length === 3) {

                var _vcm2 = face.vertexColors[0].clone();
                _vcm2.lerp(face.vertexColors[2], 0.5);

                triA.vertexColors[2].copy(_vcm2);
                triB.vertexColors[0].copy(_vcm2);
              }

              edge = 2;
            }

            faces.push(triA, triB);
            geometry.vertices.push(vm);
            var jvl = geometry.faceVertexUvs.length;
            for (var j = 0; j < jvl; j++) {

              if (geometry.faceVertexUvs[j].length) {

                var uvs = geometry.faceVertexUvs[j][_i];

                var uvA = uvs[0];
                var uvB = uvs[1];
                var uvC = uvs[2];

                var uvsTriA = null;
                var uvsTriB = null;
                // AB

                if (edge === 0) {

                  var uvM = uvA.clone();
                  uvM.lerp(uvB, 0.5);

                  uvsTriA = [uvA.clone(), uvM.clone(), uvC.clone()];
                  uvsTriB = [uvM.clone(), uvB.clone(), uvC.clone()];

                  // BC
                } else if (edge === 1) {

                  var _uvM = uvB.clone();
                  _uvM.lerp(uvC, 0.5);

                  uvsTriA = [uvA.clone(), uvB.clone(), _uvM.clone()];
                  uvsTriB = [_uvM.clone(), uvC.clone(), uvA.clone()];

                  // AC
                } else {

                  var _uvM2 = uvA.clone();
                  _uvM2.lerp(uvC, 0.5);

                  uvsTriA = [uvA.clone(), uvB.clone(), _uvM2.clone()];
                  uvsTriB = [_uvM2.clone(), uvB.clone(), uvC.clone()];
                }

                faceVertexUvs[j].push(uvsTriA, uvsTriB);
              }
            }
          } else {

            faces.push(face);

            var _jvl = geometry.faceVertexUvs.length;

            for (var _j = 0; _j < _jvl; _j++) {

              faceVertexUvs[_j].push(geometry.faceVertexUvs[_j][_i]);
            }
          }
        }
      }

      geometry.faces = faces;
      geometry.faceVertexUvs = faceVertexUvs;
    }
  }]);
  return TessellateModifier;
}();

var tessellateModifier = new TessellateModifier();
var PI2 = Math.PI * 2;

/**
 * Specimen class, it can help you create points pecimen simply
 *
 * @class
 */

var Specimen = function () {
  /**
   * config a specimen
   * @example
   * import { Vector3, Vector3, Euler } from 'three';
   * import { SpecimensLoader } from 'tofu.morphstars.js';
   * import { Utils } from 'three.tofu.js';
   * const loader = new SpecimensLoader();
   * loader.load([
   *   new Specimen({
   *     url: './js/uc.json',
   *     name: 'uc',
   *     scale: new Vector3(700, 700, 700),
   *     translate: new Vector3(-400, 100, 0),
   *     rotation: new Euler(Utils.DTR(72), Utils.DTR(30), Utils.DTR(60), 'ZYX'),
   *     material: {
   *       size: 5,
   *     }
   *   }),
   *   new Specimen({
   *     url: './js/ali.json',
   *     name: 'ali',
   *     scale: new Vector3(700, 700, 700),
   *     translate: new Vector3(-400, 100, 0),
   *     rotation: new Euler(Utils.DTR(72), Utils.DTR(30), Utils.DTR(60), 'ZYX'),
   *     material: {
   *       size: 5,
   *     }
   *   }),
   * ]);
   *
   * @param {Object} options specimen config.
   * @param {String} options.url an json-model file url.
   * @param {String} options.name this specimen's unique name.
   * @param {Object} [options.material] this specimen's material config, when this specimen was active.
   * @param {Boolean} [options.autoNormalize=true] whether specimen need auto normalize geometry size or not.
   * @param {Boolean} [options.needTessellate=false] whether specimen need be use tessellate modify or not.
   * @param {Number} [options.edgeLength] tessellate modify max-edge-length.
   * @param {Boolean} [options.autoApply=true] whether specimen need apply transform or not.
   * @param {Vector3} [options.translate] how much this specimen should translate.
   * @param {Euler} [options.rotation] how much this specimen should rotation.
   * @param {Quaternion} [options.quaternion] how much this specimen should quaternion.
   * @param {Vector3} [options.scale] how much this specimen should scale.
   * @param {Boolean} [options.needWave=false] whether specimen need update wave when this specimen was active.
   * @param {Number} [options.amplitude=0.05] wave amplitude.
   * @param {Number} [options.frequency=70] wave frequency.
   * @param {Number} [options.speed=0.001] wave speed.
   */
  function Specimen(_ref) {
    var _this = this;

    var url = _ref.url,
        name = _ref.name,
        material = _ref.material,
        autoNormalize = _ref.autoNormalize,
        needTessellate = _ref.needTessellate,
        edgeLength = _ref.edgeLength,
        autoApply = _ref.autoApply,
        translate = _ref.translate,
        rotation = _ref.rotation,
        quaternion = _ref.quaternion,
        scale = _ref.scale,
        needWave = _ref.needWave,
        amplitude = _ref.amplitude,
        frequency = _ref.frequency,
        speed = _ref.speed;
    classCallCheck(this, Specimen);

    if (!url || !name) console.error('required url and required unique-name');

    /**
     * json-model file url
     *
     * @private
     * @member {String}
     */
    this.url = url;

    /**
     * this specimen's unique name, will be used in MorphStars.
     *
     * @member {String}
     */
    this.name = name;

    /**
     * this specimen's material config, will be used when this specimen was active.
     *
     * @member {Object}
     */
    this.material = material;

    /**
     * whether specimen need auto normalize geometry size or not.
     *
     * @private
     * @member {Boolean}
     */
    this._autoNormalize = three_tofu_js.Utils.isBoolean(autoNormalize) ? autoNormalize : true;

    /**
     * whether specimen need be use tessellate modify or not.
     *
     * @private
     * @member {Boolean}
     */
    this._needTessellate = needTessellate || false;

    /**
     * tessellate modify max-edge-length.
     *
     * @private
     * @member {Number}
     */
    this.edgeLength = edgeLength;

    /**
     * whether specimen need apply transform or not.
     *
     * @private
     * @member {Boolean}
     */
    this._autoApply = three_tofu_js.Utils.isBoolean(autoApply) ? autoApply : true;

    /**
     * specimen's geometry.
     *
     * @member {Geometry}
     */
    this.geometry = null;

    /**
     * specimen's materials, parser from json-model.
     *
     * @member {Geometry}
     */
    this.materials = null;

    /**
     * specimen update wave cycle.
     *
     * @private
     * @member {Number}
     */
    this._cycle = 0;

    /**
     * whether specimen need update wave when this specimen was active.
     *
     * @member {Boolean}
     */
    this.needWave = needWave || false;

    /**
     * wave amplitude.
     *
     * @member {Number}
     */
    this._amplitude = three_tofu_js.Utils.isNumber(amplitude) ? amplitude : 0.05;

    /**
     * wave frequency.
     *
     * @member {Number}
     */
    this._frequency = three_tofu_js.Utils.isNumber(frequency) ? frequency : 70;

    /**
     * wave frequency.
     *
     * @member {Number}
     */
    this._speed = three_tofu_js.Utils.isNumber(speed) ? speed : 0.001;

    var _translate = new three.Vector3();
    var _rotation = new three.Euler();
    var _quaternion = new three.Quaternion();
    var _scale = new three.Vector3(1, 1, 1);

    Object.defineProperties(this, {
      /**
       * specimen's translate
       */
      translate: {
        enumerable: true,
        value: _translate
      },

      /**
       * specimen's rotation
       */
      rotation: {
        enumerable: true,
        value: _rotation
      },

      /**
       * specimen's quaternion
       */
      quaternion: {
        enumerable: true,
        value: _quaternion
      },

      /**
       * specimen's scale
       */
      scale: {
        enumerable: true,
        value: _scale
      }
    });

    var onRotationChange = function onRotationChange() {
      _this.quaternion.setFromEuler(_this.rotation, false);
    };
    var onQuaternionChange = function onQuaternionChange() {
      _this.rotation.setFromQuaternion(_this.quaternion, undefined, false);
    };
    this.rotation.onChange(onRotationChange);
    this.quaternion.onChange(onQuaternionChange);

    /**
     * matrix for apply transform
     * @private
     * @member {Matrix4}
     */
    this.matrix = new three.Matrix4();

    this.setup = this.setup.bind(this);

    this.init({ translate: translate, rotation: rotation, quaternion: quaternion, scale: scale });
  }

  /**
   * @private
   * @param {Object} transform apply transform information
   */


  createClass(Specimen, [{
    key: 'init',
    value: function init(_ref2) {
      var translate = _ref2.translate,
          rotation = _ref2.rotation,
          quaternion = _ref2.quaternion,
          scale = _ref2.scale;

      if (translate) this.translate.copy(translate);
      if (rotation) this.rotation.copy(rotation);
      if (quaternion) this.quaternion.copy(quaternion);
      if (scale) this.scale.copy(scale);
    }

    /**
     * setup geometry and materials when json-loader received model
     * @param {Geometry} geometry specimen geometry
     * @param {Array} materials specimen materials
     */

  }, {
    key: 'setup',
    value: function setup(geometry, materials) {
      this.geometry = geometry;
      this.materials = materials;
      this.material = this.material || materials && materials[0];

      if (this._needTessellate) {
        tessellateModifier.setMaxEdgeLength(this.edgeLength);
        tessellateModifier.modify(this.geometry);
      }
      if (this._autoNormalize) {
        this.geometry.normalize();
      }
      if (this._autoApply) {
        this.applyTransform();
      }
      if (this.needWave) this.initWave();
    }

    /**
     * apply transform for geometry
     * @private
     */

  }, {
    key: 'applyTransform',
    value: function applyTransform() {
      this.matrix.compose(this.translate, this.quaternion, this.scale);
      this.geometry.applyMatrix(this.matrix);
    }

    /**
     * init wave data
     * @private
     */

  }, {
    key: 'initWave',
    value: function initWave() {
      this._cycle = 0;
      var length = this.geometry.vertices.length;
      this.geometry._vertices = [];
      for (var i = 0; i < length; i++) {
        var vec = this.geometry.vertices[i];
        this.geometry._vertices.push(vec.clone());
        var r = Math.sqrt(vec.x * vec.x + vec.z * vec.z);
        vec.y = vec.y + Math.sin(r / this._frequency + this._cycle) * r * this._amplitude;
      }
    }

    /**
     * update geometry with wave style
     * @param {Number} snippet update time snippet
     * @param {Geometry} geometry need update geometry
     */

  }, {
    key: 'updateWave',
    value: function updateWave(snippet, geometry) {
      this._cycle = three_tofu_js.Utils.euclideanModulo(this._cycle - snippet * this._speed, PI2);
      var length = geometry.vertices.length;
      var samsara = this.geometry.vertices.length;
      for (var i = 0; i < length; i++) {
        var idx = three_tofu_js.Utils.euclideanModulo(i, samsara);
        var _vec = this.geometry._vertices[idx];
        var vec = this.geometry.vertices[idx];
        var point = geometry.vertices[i];
        var r = Math.sqrt(_vec.x * _vec.x + _vec.z * _vec.z);
        vec.y = point.y = _vec.y + Math.sin(r / this._frequency + this._cycle) * r * this._amplitude;
      }
      geometry.verticesNeedUpdate = true;
    }
  }]);
  return Specimen;
}();

/**
 * Specimens Loader, load specimen for morph-stars
 * @extends EventDispatcher
 */

var SpecimensLoader = function (_EventDispatcher) {
  inherits(SpecimensLoader, _EventDispatcher);

  function SpecimensLoader() {
    classCallCheck(this, SpecimensLoader);

    /**
     * json loader
     */
    var _this = possibleConstructorReturn(this, (SpecimensLoader.__proto__ || Object.getPrototypeOf(SpecimensLoader)).call(this));

    _this.loader = new three.JSONLoader();

    /**
     * models maps
     */
    _this.models = {};

    /**
     * total specimen
     * @private
     */
    _this._total = 0;

    /**
     * load failed specimen
     * @private
     */
    _this._failed = 0;

    /**
     * load successed specimen
     * @private
     */
    _this._received = 0;
    return _this;
  }

  /**
   * @param {Array} specimens `Specimen` array
   * @return {this} this
   */


  createClass(SpecimensLoader, [{
    key: 'load',
    value: function load(specimens) {
      var _this2 = this;

      this.specimens = specimens;
      this._total = 0;
      this._failed = 0;
      this._received = 0;

      this.specimens.forEach(function (specimen) {
        _this2.models[specimen.name] = specimen;
        if (specimen instanceof Specimen) {
          _this2._total++;
          _this2.do(specimen);
        }
      });
      return this;
    }

    /**
     * do load for this specimen
     * @private
     * @param {Specimen} specimen Specimen object
     */

  }, {
    key: 'do',
    value: function _do(specimen) {
      var _this3 = this;

      this.loader.load(specimen.url, function (geometry, materials) {
        specimen.setup(geometry, materials);
        _this3._received++;
        _this3._check();
      }, null, function () {
        _this3._failed++;
        _this3._check();
      });
    }

    /**
     * check load progress
     * @private
     */

  }, {
    key: '_check',
    value: function _check() {
      this.emit('update', this.progress);
      if (this._received + this._failed >= this._total) this.emit('complete');
    }

    /**
     * get specimen by name
     * @param {String} id specimen name
     * @return {Specimen} Specimen object
     */

  }, {
    key: 'getById',
    value: function getById(id) {
      return this.models[id];
    }

    /**
     * get progress
     */

  }, {
    key: 'progress',
    get: function get$$1() {
      return this._total === 0 ? 1 : (this._received + this._failed) / this._total;
    }
  }]);
  return SpecimensLoader;
}(three.EventDispatcher);

/**
 * a simple vec3 class
 * @private
 */
var Vec3 = function () {
  function Vec3(x, y, z) {
    classCallCheck(this, Vec3);

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  createClass(Vec3, [{
    key: "copy",
    value: function copy(v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      return this;
    }
  }]);
  return Vec3;
}();

/**
 * bezierCurve function
 * @private
 * @param {Vector3} point 需要变换的坐标点
 * @param {Vector3} t 插值进度
 * @return {Vector3} 插值结果
 */
function bezierCurve(point, t) {
  var rT = 1 - t;
  var start = point.start;
  var control = point.control;
  var end = point.end;

  point.x = rT * rT * start.x + 2 * t * rT * control.x + t * t * end.x;
  point.y = rT * rT * start.y + 2 * t * rT * control.y + t * t * end.y;
  point.z = rT * rT * start.z + 2 * t * rT * control.z + t * t * end.z;
  return point;
}

var UP = new three.Vector3(0, 1, 0);
var matrix = new three.Matrix4();

/**
 * MorphStars, help you morph large stars between specimens
 */

var MorphStars = function (_Group) {
  inherits(MorphStars, _Group);

  /**
   * new a morph-stars manager
   * @param {SpecimensLoader} models SpecimensLoader object
   * @param {Object} options morph-stars manager config
   * @param {Array} options.specimens specimens queue, you can invoke `pre` and `next` method on that.
   * @param {Array} [options.hovers] hovers queue, you can make stars morph to hover-specimen from any specimens.
   * @param {String} [options.image] global image texture
   * @param {Number} [options.size=800] space size, point space range
   * @param {Number} [options.idels=200] idel star count
   * @param {Number} [options.idelSize=idels * 0.7] idel star space range
   * @param {Number} [options.dotSize=5] global star size
   * @param {Boolean} [options.hitColor=true] whether use hit-color or not
   * @param {Boolean} [options.autoLaunch=true] auto-launch stars
   * @param {Number} [options.duration=1000] morph stars transition duration, unit `ms`.
   * @param {Tween} [options.ease=Tween.Ease.In] transition timing function
   */
  function MorphStars(models, _ref) {
    var specimens = _ref.specimens,
        hovers = _ref.hovers,
        image = _ref.image,
        size = _ref.size,
        idels = _ref.idels,
        idelSize = _ref.idelSize,
        _ref$dotSize = _ref.dotSize,
        dotSize = _ref$dotSize === undefined ? 5 : _ref$dotSize,
        hitColor = _ref.hitColor,
        autoLaunch = _ref.autoLaunch,
        duration = _ref.duration,
        ease = _ref.ease;
    classCallCheck(this, MorphStars);

    var _this = possibleConstructorReturn(this, (MorphStars.__proto__ || Object.getPrototypeOf(MorphStars)).call(this));

    specimens = specimens || [];
    hovers = hovers || [];
    autoLaunch = three_tofu_js.Utils.isBoolean(autoLaunch) ? autoLaunch : true;
    idels = three_tofu_js.Utils.isNumber(idels) ? idels : 200;
    duration = three_tofu_js.Utils.isNumber(duration) ? duration : 1000;

    /**
     * all specimens pool
     * @member {SpecimensLoader}
     */
    _this.models = models;

    /**
     * space size, point space range
     * @private
     * @member {Number}
     */
    _this._size = size || 800;

    /**
     * idel star space range
     * @private
     * @member {Number}
     */
    _this._idelSize = idelSize || _this._size * 0.7;

    /**
     * all morph stars quantity
     * @private
     * @member {Number}
     */
    _this._quantity = 0;

    /**
     * whether use hit-color or not
     * @member {Boolean}
     */
    _this.hitColor = three_tofu_js.Utils.isBoolean(hitColor) ? hitColor : true;

    var vertexColors = _this.hitColor ? three.VertexColors : three.NoColors;

    /**
     * global texture for stars
     * @member {Texture}
     */
    _this.map = three_tofu_js.Utils.isString(image) ? new three.TextureLoader().load(image) : null;

    /**
     * morph stars geometry
     * @member {Geometry}
     */
    _this.morphGeo = new three.Geometry();

    /**
     * morph stars material
     * @member {PointsMaterial}
     */
    _this.morphMat = new three.PointsMaterial({
      map: _this.map,
      blending: three.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      vertexColors: vertexColors,
      size: dotSize
    });

    /**
     * morph stars mesh
     * @member {Points}
     */
    _this.morphMesh = new three.Points(_this.morphGeo, _this.morphMat);
    _this.add(_this.morphMesh);

    /**
     * hover-specimens maps
     * @private
     * @member {Object}
     */
    _this.hovers = {};
    hovers.forEach(function (name) {
      _this._ship(_this.models.getById(name), true);
    });

    /**
     * specimens queue
     * @private
     * @member {Array}
     */
    _this.specimens = [];
    specimens.forEach(function (name) {
      _this._ship(_this.models.getById(name));
    });

    /**
     * current specimen object
     *
     * @member {Specimen}
     */
    _this.specimen = null;

    /**
     * current specimens-queue cursor
     * @private
     * @member {Number}
     */
    _this.cursor = -1;

    /**
     * is idle now?
     *
     * @member {Boolean}
     */
    _this.idle = true;

    /**
     * morph stars transition duration
     *
     * @member {Number}
     */
    _this.duration = duration;

    /**
     * current sleep-stars count
     * @private
     * @member {Number}
     */
    _this.sleepNum = 0;

    /**
     * transition timing function
     * @member {Tween}
     */
    _this.ease = ease || three_tofu_js.Tween.Ease.In;

    _this.on('pretimeline', function (_ref2) {
      var snippet = _ref2.snippet;

      _this._updateMorph(snippet);
      if (_this.idle && _this.specimen && _this.specimen.needWave) {
        _this.specimen.updateWave(snippet, _this.morphGeo);
      }
    });

    /**
     * global stars rotation with horizontal
     * @member {Points}
     */
    _this.spaceH = new three.Points(_this._build(new three.Geometry(), idels, _this._idelSize), _this.morphMat.clone());

    /**
     * global stars rotation with vertical
     * @member {Points}
     */
    _this.spaceV = new three.Points(_this._build(new three.Geometry(), idels, _this._idelSize), _this.morphMat.clone());

    _this.spaceH.animate({
      from: {
        'rotation.y': 0
      },
      to: {
        'rotation.y': Math.PI * 2
      },
      ease: three_tofu_js.Tween.Linear.None,
      duration: 100000,
      infinite: true
    });
    _this.spaceV.animate({
      from: {
        'rotation.x': 0
      },
      to: {
        'rotation.x': -Math.PI * 2
      },
      ease: three_tofu_js.Tween.Linear.None,
      duration: 100000,
      infinite: true
    });
    _this.add(_this.spaceH, _this.spaceV);

    if (autoLaunch) _this.launch();
    return _this;
  }

  createClass(MorphStars, [{
    key: '_build',
    value: function _build(geo, number, size, bind) {
      for (var i = 0; i < number; i++) {
        var x = three_tofu_js.Utils.random(-size, size);
        var y = three_tofu_js.Utils.random(-size, size);
        var z = three_tofu_js.Utils.random(-size, size);
        var point = new three.Vector3(x, y, z);
        if (bind) this._bindBezier(point);
        geo.vertices.push(point);
        if (this.hitColor) {
          var color = new three.Color('hsl(' + three_tofu_js.Utils.random(190, 220) + ', 0%, 100%)');
          geo.colors.push(color);
        }
      }
      return geo;
    }
  }, {
    key: '_bindBezier',
    value: function _bindBezier(point) {
      point.start = new Vec3();
      point.control = new Vec3();
      point.end = new Vec3();
      point.delay = 0;
      point.progress = 0;
      point.sleep = true;
    }
  }, {
    key: '_ship',
    value: function _ship(specimen, isHover) {
      if (specimen.geometry instanceof three.Geometry) {
        this._quantity = Math.max(specimen.geometry.vertices.length, this._quantity);
        if (isHover) {
          var name = specimen.name || specimen.geometry.uuid;
          this.hovers[name] = specimen;
        } else {
          this.specimens.push(specimen);
        }
      }
      return this;
    }

    /**
     * launch morph stars
     */

  }, {
    key: 'launch',
    value: function launch() {
      this._build(this.morphGeo, this._quantity, this._size, true);
    }
  }, {
    key: '_setupMat',
    value: function _setupMat(options) {
      options = options || {};
      this.morphMat.color = three_tofu_js.Utils.isUndefined(options.color) ? this.morphMat.color : options.color;
      this.morphMat.map = three_tofu_js.Utils.isUndefined(options.map) ? this.morphMat.map ? this.morphMat.map : this.map : options.map;
      this.morphMat.needsUpdate = true;
    }

    /**
     * if pass number will morph to specimens-queue, if pass string will morph to hovers
     * @param {Number|String} cursor go to which one
     */

  }, {
    key: 'to',
    value: function to(cursor) {
      if (cursor === this.nowCursor) return;
      var numType = three_tofu_js.Utils.isNumber(cursor);
      cursor = numType ? three_tofu_js.Utils.euclideanModulo(cursor, this.specimens.length) : cursor;
      var specimen = numType ? this.specimens[cursor] : this.hovers[cursor];
      if (!specimen) return;
      this.specimen = specimen;

      var samsara = specimen.geometry.vertices.length;
      for (var i = 0; i < this._quantity; i++) {
        var point = this.morphGeo.vertices[i];
        var index = three_tofu_js.Utils.euclideanModulo(i, samsara);
        var end = specimen.geometry.vertices[index];
        this._init(point, end);
      }

      this.preCursor = this.nowCursor;
      this.nowCursor = cursor;
      if (numType) this.cursor = cursor;

      this.sleepNum = 0;
      this.idle = false;

      if (this.specimen.material.size !== this.morphMesh.material.size) {
        this.morphMesh.animate({
          to: {
            'material.size': this.specimen.material.size
          },
          duration: this.duration * 1.5
        });
      }
    }

    /**
     * go to next in specimens-queue
     */

  }, {
    key: 'next',
    value: function next() {
      this.to(++this.cursor);
    }

    /**
     * go to pre in specimens-queue
     */

  }, {
    key: 'pre',
    value: function pre() {
      this.to(--this.cursor);
    }
  }, {
    key: '_updateMorph',
    value: function _updateMorph(snippet) {
      if (this.idle || this.cursor === -1) return;

      for (var i = 0; i < this._quantity; i++) {
        var point = this.morphGeo.vertices[i];
        this._motion(point, snippet);
      }
      this.morphGeo.verticesNeedUpdate = true;
    }
  }, {
    key: '_init',
    value: function _init(from, end) {
      var center = this._cc(from, end);

      from.start.copy(from);
      from.control.copy(center);
      from.end.copy(end);
      from.delay = three_tofu_js.Utils.random(0, this.duration);
      from.progress = 0;
      from.sleep = false;
    }
  }, {
    key: '_cc',
    value: function _cc(from, end) {
      var radian = three_tofu_js.Utils.random(0, Math.PI * 2);
      var radius = end.clone().sub(from).length() / 3;
      var x = Math.cos(radian) * radius;
      var y = Math.sin(radian) * radius;
      var offset = new three.Vector3(x, y, 0);
      var center = from.clone().add(end).divideScalar(2);
      matrix.lookAt(center, end, UP);
      offset.applyMatrix4(matrix);
      return center.sub(offset);
    }
  }, {
    key: '_motion',
    value: function _motion(point, snippet) {
      if (point.sleep) return;
      if (point.delay > 0) {
        point.delay -= Math.abs(snippet);
        return;
      }
      point.progress = three_tofu_js.Utils.clamp(point.progress + snippet, 0, this.duration);
      var progress = this.ease(point.progress / this.duration);
      bezierCurve(point, progress);
      if (this.spill(point)) {
        point.sleep = true;
        if (++this.sleepNum === this._quantity) {
          this.idle = true;
          this._setupMat(this.specimen.material);
          this.emit('idel');
        }
      }
    }

    /**
     * check point-progress was spill or not
     *
     * @private
     * @param {Vector3} point point object
     * @return {Boolean} whether spill or not
     */

  }, {
    key: 'spill',
    value: function spill(point) {
      return point.progress >= this.duration;
    }
  }]);
  return MorphStars;
}(three.Group);

exports.SpecimensLoader = SpecimensLoader;
exports.Specimen = Specimen;
exports.MorphStars = MorphStars;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=tofu.morphstars.js.map
