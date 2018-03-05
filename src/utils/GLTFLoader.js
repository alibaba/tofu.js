import {
  FileLoader,
  DefaultLoadingManager,
  Loader,
  Color,
  DirectionalLight,
  PointLight,
  SpotLight,
  AmbientLight,
  MeshPhongMaterial,
  MeshLambertMaterial,
  MeshBasicMaterial,
  ShaderMaterial,
  ShaderLib,
  UniformsUtils,
  Vector2,
  NearestFilter,
  LinearFilter,
  NearestMipMapNearestFilter,
  LinearMipMapNearestFilter,
  NearestMipMapLinearFilter,
  LinearMipMapLinearFilter,
  ClampToEdgeWrapping,
  MirroredRepeatWrapping,
  RepeatWrapping,
  AlphaFormat,
  RGBFormat,
  RGBAFormat,
  LuminanceFormat,
  LuminanceAlphaFormat,
  UnsignedByteType,
  UnsignedShort4444Type,
  UnsignedShort5551Type,
  UnsignedShort565Type,
  // BackSide,
  FrontSide,
  // NeverDepth,
  // LessDepth,
  // EqualDepth,
  // LessEqualDepth,
  // GreaterEqualDepth,
  // NotEqualDepth,
  // AlwaysDepth,
  // AddEquation,
  // SubtractEquation,
  // ReverseSubtractEquation,
  // ZeroFactor,
  // OneFactor,
  // SrcColorFactor,
  // OneMinusSrcColorFactor,
  // SrcAlphaFactor,
  // OneMinusSrcAlphaFactor,
  // DstAlphaFactor,
  // OneMinusDstAlphaFactor,
  // DstColorFactor,
  // OneMinusDstColorFactor,
  // SrcAlphaSaturateFactor,
  InterpolateSmooth,
  InterpolateLinear,
  InterpolateDiscrete,
  MeshStandardMaterial,
  InterleavedBuffer,
  InterleavedBufferAttribute,
  BufferAttribute,
  TextureLoader,
  DoubleSide,
  BufferGeometry,
  Group,
  VertexColors,
  FlatShading,
  Mesh,
  TriangleStripDrawMode,
  TriangleFanDrawMode,
  LineSegments,
  Line,
  LineLoop,
  Points,
  PerspectiveCamera,
  OrthographicCamera,
  NumberKeyframeTrack,
  QuaternionKeyframeTrack,
  VectorKeyframeTrack,
  AnimationUtils,
  AnimationClip,
  Matrix4,
  Bone,
  Object3D,
  PropertyBinding,
  SkinnedMesh,
  Skeleton,
  Scene,
} from 'three';


// const BINARY_EXTENSION_BUFFER_NAME = 'binary_glTF';
const BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
const BINARY_EXTENSION_HEADER_LENGTH = 12;
const BINARY_EXTENSION_CHUNK_TYPES = {
  JSON: 0x4E4F534A,
  BIN: 0x004E4942,
};

const EXTENSIONS = {
  KHR_BINARY_GLTF: 'KHR_binary_glTF',
  KHR_LIGHTS: 'KHR_lights',
  KHR_MATERIALS_COMMON: 'KHR_materials_common',
  KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS: 'KHR_materials_pbrSpecularGlossiness',
};

function GLTFLoader(manager) {

  this.manager = (manager !== undefined) ? manager : DefaultLoadingManager;

}

GLTFLoader.prototype = {

  constructor: GLTFLoader,

  crossOrigin: 'Anonymous',

  load(url, onLoad, onProgress, onError) {

    const scope = this;

    const path = this.path && (typeof this.path === 'string') ? this.path : Loader.prototype.extractUrlBase(url);

    const loader = new FileLoader(scope.manager);

    loader.setResponseType('arraybuffer');

    loader.load(url, function(data) {

      try {

        scope.parse(data, path, onLoad, onError);

      } catch (e) {

        // For SyntaxError or TypeError, return a generic failure message.
        onError(e.constructor === Error ? e : new Error('GLTFLoader: Unable to parse model.'));

      }

    }, onProgress, onError);

  },

  setCrossOrigin(value) {

    this.crossOrigin = value;

  },

  setPath(value) {

    this.path = value;

  },

  parse(data, path, onLoad, onError) {

    let content;
    const extensions = {};

    const magic = convertUint8ArrayToString(new Uint8Array(data, 0, 4));

    if (magic === BINARY_EXTENSION_HEADER_MAGIC) {

      extensions[EXTENSIONS.KHR_BINARY_GLTF] = new GLTFBinaryExtension(data);
      content = extensions[EXTENSIONS.KHR_BINARY_GLTF].content;

    } else {

      content = convertUint8ArrayToString(new Uint8Array(data));

    }

    const json = JSON.parse(content);

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

    const parser = new GLTFParser(json, extensions, {

      path: path || this.path,
      crossOrigin: this.crossOrigin,

    });

    parser.parse(function(scene, scenes, cameras, animations) {

      console.timeEnd('GLTFLoader');

      const glTF = {
        scene,
        scenes,
        cameras,
        animations,
      };

      onLoad(glTF);

    }, onError);

  },

};

/* GLTFREGISTRY */

function GLTFRegistry() {

  let objects = {};

  return {

    get(key) {

      return objects[key];

    },

    add(key, object) {

      objects[key] = object;

    },

    remove(key) {

      delete objects[key];

    },

    removeAll() {

      objects = {};

    },

    update(scene, camera) {

      for (const name in objects) {

        const object = objects[name];

        if (object.update) {

          object.update(scene, camera);

        }

      }

    },

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

  const extension = (json.extensions && json.extensions[EXTENSIONS.KHR_LIGHTS]) || {};
  const lights = extension.lights || {};

  for (const lightId in lights) {

    const light = lights[lightId];
    let lightNode;

    const color = new Color().fromArray(light.color);

    switch (light.type) {

      case 'directional':
        lightNode = new DirectionalLight(color);
        lightNode.position.set(0, 0, 1);
        break;

      case 'point':
        lightNode = new PointLight(color);
        break;

      case 'spot':
        lightNode = new SpotLight(color);
        lightNode.position.set(0, 0, 1);
        break;

      case 'ambient':
        lightNode = new AmbientLight(color);
        break;

      default :
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

      lightNode.name = light.name || ('light_' + lightId);
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

GLTFMaterialsCommonExtension.prototype.getMaterialType = function(material) {

  const khrMaterial = material.extensions[this.name];

  switch (khrMaterial.type) {

    case 'commonBlinn':
    case 'commonPhong':
      return MeshPhongMaterial;

    case 'commonLambert':
      return MeshLambertMaterial;

    case 'commonConstant':
    default:
      return MeshBasicMaterial;

  }

};

GLTFMaterialsCommonExtension.prototype.extendParams = function(materialParams, material, parser) {

  const khrMaterial = material.extensions[this.name];

  const pending = [];

  const keys = [];

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

  const materialValues = {};

  keys.forEach(function(v) {

    if (khrMaterial[v] !== undefined) materialValues[v] = khrMaterial[v];

  });

  if (materialValues.diffuseFactor !== undefined) {

    materialParams.color = new Color().fromArray(materialValues.diffuseFactor);
    materialParams.opacity = materialValues.diffuseFactor[3];

  }

  if (materialValues.diffuseTexture !== undefined) {

    pending.push(parser.assignTexture(materialParams, 'map', materialValues.diffuseTexture.index));

  }

  if (materialValues.specularFactor !== undefined) {

    materialParams.specular = new Color().fromArray(materialValues.specularFactor);

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

  const headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH);

  this.header = {
    magic: convertUint8ArrayToString(new Uint8Array(data.slice(0, 4))),
    version: headerView.getUint32(4, true),
    length: headerView.getUint32(8, true),
  };

  if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {

    throw new Error('GLTFLoader: Unsupported glTF-Binary header.');

  } else if (this.header.version < 2.0) {

    throw new Error('GLTFLoader: Legacy binary file detected. Use GLTFLoader instead.');

  }

  const chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH);
  let chunkIndex = 0;

  while (chunkIndex < chunkView.byteLength) {

    const chunkLength = chunkView.getUint32(chunkIndex, true);
    chunkIndex += 4;

    const chunkType = chunkView.getUint32(chunkIndex, true);
    chunkIndex += 4;

    if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON) {

      const contentArray = new Uint8Array(data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength);
      this.content = convertUint8ArrayToString(contentArray);

    } else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN) {

      const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
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

    getMaterialType() {

      return ShaderMaterial;

    },

    extendParams(params, material, parser) {

      const pbrSpecularGlossiness = material.extensions[this.name];

      const shader = ShaderLib.standard;

      const uniforms = UniformsUtils.clone(shader.uniforms);

      const specularMapParsFragmentChunk = [
        '#ifdef USE_SPECULARMAP',
        '	uniform sampler2D specularMap;',
        '#endif',
      ].join('\n');

      const glossinessMapParsFragmentChunk = [
        '#ifdef USE_GLOSSINESSMAP',
        '	uniform sampler2D glossinessMap;',
        '#endif',
      ].join('\n');

      const specularMapFragmentChunk = [
        'vec3 specularFactor = specular;',
        '#ifdef USE_SPECULARMAP',
        '	vec4 texelSpecular = texture2D( specularMap, vUv );',
        '	// reads channel RGB, compatible with a glTF Specular-Glossiness (RGBA) texture',
        '	specularFactor *= texelSpecular.rgb;',
        '#endif',
      ].join('\n');

      const glossinessMapFragmentChunk = [
        'float glossinessFactor = glossiness;',
        '#ifdef USE_GLOSSINESSMAP',
        '	vec4 texelGlossiness = texture2D( glossinessMap, vUv );',
        '	// reads channel A, compatible with a glTF Specular-Glossiness (RGBA) texture',
        '	glossinessFactor *= texelGlossiness.a;',
        '#endif',
      ].join('\n');

      const lightPhysicalFragmentChunk = [
        'PhysicalMaterial material;',
        'material.diffuseColor = diffuseColor.rgb;',
        'material.specularRoughness = clamp( 1.0 - glossinessFactor, 0.04, 1.0 );',
        'material.specularColor = specularFactor.rgb;',
      ].join('\n');

      const fragmentShader = shader.fragmentShader
        .replace('#include <specularmap_fragment>', '')
        .replace('uniform float roughness;', 'uniform vec3 specular;')
        .replace('uniform float metalness;', 'uniform float glossiness;')
        .replace('#include <roughnessmap_pars_fragment>', specularMapParsFragmentChunk)
        .replace('#include <metalnessmap_pars_fragment>', glossinessMapParsFragmentChunk)
        .replace('#include <roughnessmap_fragment>', specularMapFragmentChunk)
        .replace('#include <metalnessmap_fragment>', glossinessMapFragmentChunk)
        .replace('#include <lights_physical_fragment>', lightPhysicalFragmentChunk);

      delete uniforms.roughness;
      delete uniforms.metalness;
      delete uniforms.roughnessMap;
      delete uniforms.metalnessMap;

      uniforms.specular = {
        value: new Color().setHex(0x111111),
      };
      uniforms.glossiness = {
        value: 0.5,
      };
      uniforms.specularMap = {
        value: null,
      };
      uniforms.glossinessMap = {
        value: null,
      };

      params.vertexShader = shader.vertexShader;
      params.fragmentShader = fragmentShader;
      params.uniforms = uniforms;
      params.defines = {
        STANDARD: '',
      };

      params.color = new Color(1.0, 1.0, 1.0);
      params.opacity = 1.0;

      const pending = [];

      if (Array.isArray(pbrSpecularGlossiness.diffuseFactor)) {

        const array = pbrSpecularGlossiness.diffuseFactor;

        params.color.fromArray(array);
        params.opacity = array[3];

      }

      if (pbrSpecularGlossiness.diffuseTexture !== undefined) {

        pending.push(parser.assignTexture(params, 'map', pbrSpecularGlossiness.diffuseTexture.index));

      }

      params.emissive = new Color(0.0, 0.0, 0.0);
      params.glossiness = pbrSpecularGlossiness.glossinessFactor !== undefined ? pbrSpecularGlossiness.glossinessFactor : 1.0;
      params.specular = new Color(1.0, 1.0, 1.0);

      if (Array.isArray(pbrSpecularGlossiness.specularFactor)) {

        params.specular.fromArray(pbrSpecularGlossiness.specularFactor);

      }

      if (pbrSpecularGlossiness.specularGlossinessTexture !== undefined) {

        const specGlossIndex = pbrSpecularGlossiness.specularGlossinessTexture.index;
        pending.push(parser.assignTexture(params, 'glossinessMap', specGlossIndex));
        pending.push(parser.assignTexture(params, 'specularMap', specGlossIndex));

      }

      return Promise.all(pending);

    },

    createMaterial(params) {

      // setup material properties based on MeshStandardMaterial for Specular-Glossiness

      const material = new ShaderMaterial({
        defines: params.defines,
        vertexShader: params.vertexShader,
        fragmentShader: params.fragmentShader,
        uniforms: params.uniforms,
        fog: true,
        lights: true,
        opacity: params.opacity,
        transparent: params.transparent,
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
      material.normalScale = new Vector2(1, 1);

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
    refreshUniforms(renderer, scene, camera, geometry, material) {

      const uniforms = material.uniforms;
      const defines = material.defines;

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

      let uvScaleMap;

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

        const offset = uvScaleMap.offset;
        const repeat = uvScaleMap.repeat;

        uniforms.offsetRepeat.value.set(offset.x, offset.y, repeat.x, repeat.y);

      }

      uniforms.envMap.value = material.envMap;
      uniforms.envMapIntensity.value = material.envMapIntensity;
      uniforms.flipEnvMap.value = (material.envMap && material.envMap.isCubeTexture) ? -1 : 1;

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

    },

  };

}

/** *******************************/
/** ******** INTERNALS ************/
/** *******************************/

/* CONSTANTS */

const WEBGL_CONSTANTS = {
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
  UNSIGNED_SHORT: 5123,
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

const WEBGL_COMPONENT_TYPES = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array,
};

const WEBGL_FILTERS = {
  9728: NearestFilter,
  9729: LinearFilter,
  9984: NearestMipMapNearestFilter,
  9985: LinearMipMapNearestFilter,
  9986: NearestMipMapLinearFilter,
  9987: LinearMipMapLinearFilter,
};

const WEBGL_WRAPPINGS = {
  33071: ClampToEdgeWrapping,
  33648: MirroredRepeatWrapping,
  10497: RepeatWrapping,
};

const WEBGL_TEXTURE_FORMATS = {
  6406: AlphaFormat,
  6407: RGBFormat,
  6408: RGBAFormat,
  6409: LuminanceFormat,
  6410: LuminanceAlphaFormat,
};

const WEBGL_TEXTURE_DATATYPES = {
  5121: UnsignedByteType,
  32819: UnsignedShort4444Type,
  32820: UnsignedShort5551Type,
  33635: UnsignedShort565Type,
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

const WEBGL_TYPE_SIZES = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16,
};

const PATH_PROPERTIES = {
  scale: 'scale',
  translation: 'position',
  rotation: 'quaternion',
  weights: 'morphTargetInfluences',
};

const INTERPOLATION = {
  CATMULLROMSPLINE: InterpolateSmooth,
  CUBICSPLINE: InterpolateSmooth,
  LINEAR: InterpolateLinear,
  STEP: InterpolateDiscrete,
};

// const STATES_ENABLES = {
//   2884: 'CULL_FACE',
//   2929: 'DEPTH_TEST',
//   3042: 'BLEND',
//   3089: 'SCISSOR_TEST',
//   32823: 'POLYGON_OFFSET_FILL',
//   32926: 'SAMPLE_ALPHA_TO_COVERAGE',
// };

const ALPHA_MODES = {
  OPAQUE: 'OPAQUE',
  MASK: 'MASK',
  BLEND: 'BLEND',
};

/* UTILITY FUNCTIONS */

function _each(object, callback, thisObj) {

  if (!object) {
    return Promise.resolve();
  }

  let results;
  const fns = [];

  if (Object.prototype.toString.call(object) === '[object Array]') {

    results = [];

    const length = object.length;

    for (let idx = 0; idx < length; idx++) {

      const value = callback.call(thisObj || this, object[idx], idx);

      if (value) {

        fns.push(value);

        if (value instanceof Promise) {
          /* eslint no-loop-func: 0 */
          value.then(function(key, value) {

            results[key] = value;

          }.bind(this, idx));

        } else {

          results[idx] = value;

        }

      }

    }

  } else {

    results = {};

    for (const key in object) {

      if (object.hasOwnProperty(key)) {

        const value = callback.call(thisObj || this, object[key], key);

        if (value) {

          fns.push(value);

          if (value instanceof Promise) {

            value.then(function(key, value) {

              results[key] = value;

            }.bind(this, key));

          } else {

            results[key] = value;

          }

        }

      }

    }

  }

  return Promise.all(fns).then(function() {

    return results;

  });

}

function resolveURL(url, path) {

  // Invalid URL
  if (typeof url !== 'string' || url === '') { return ''; }

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

  let s = '';

  for (let i = 0, il = array.length; i < il; i++) {

    s += String.fromCharCode(array[i]);

  }

  return s;

}

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
 * @return {MeshStandardMaterial} material
 */
function createDefaultMaterial() {

  return new MeshStandardMaterial({
    color: 0xFFFFFF,
    emissive: 0x000000,
    metalness: 1,
    roughness: 1,
    transparent: false,
    depthTest: true,
    side: FrontSide,
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

  const geometry = mesh.geometry;
  const material = mesh.material;

  const targets = primitiveDef.targets;
  const morphAttributes = geometry.morphAttributes;

  morphAttributes.position = [];
  morphAttributes.normal = [];

  material.morphTargets = true;

  for (let i = 0, il = targets.length; i < il; i++) {

    const target = targets[i];
    const attributeName = 'morphTarget' + i;

    let positionAttribute,
      normalAttribute;

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
      const position = geometry.attributes.position;

      for (let j = 0, jl = positionAttribute.count; j < jl; j++) {

        positionAttribute.setXYZ(
          j,
          positionAttribute.getX(j) + position.getX(j),
          positionAttribute.getY(j) + position.getY(j),
          positionAttribute.getZ(j) + position.getZ(j)
        );

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
      const normal = geometry.attributes.normal;

      for (let j = 0, jl = normalAttribute.count; j < jl; j++) {

        normalAttribute.setXYZ(
          j,
          normalAttribute.getX(j) + normal.getX(j),
          normalAttribute.getY(j) + normal.getY(j),
          normalAttribute.getZ(j) + normal.getZ(j)
        );

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

    for (let i = 0, il = meshDef.weights.length; i < il; i++) {

      mesh.morphTargetInfluences[i] = meshDef.weights[i];

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

GLTFParser.prototype._withDependencies = function(dependencies) {

  const _dependencies = {};

  for (let i = 0; i < dependencies.length; i++) {

    const dependency = dependencies[i];
    const fnName = 'load' + dependency.charAt(0).toUpperCase() + dependency.slice(1);

    const cached = this.cache.get(dependency);

    if (cached !== undefined) {

      _dependencies[dependency] = cached;

    } else if (this[fnName]) {

      const fn = this[fnName]();
      this.cache.add(dependency, fn);

      _dependencies[dependency] = fn;

    }

  }

  return _each(_dependencies, function(dependency) {

    return dependency;

  });

};

GLTFParser.prototype.parse = function(onLoad, onError) {

  const json = this.json;

  // Clear the loader cache
  this.cache.removeAll();

  // Fire the callback on complete
  this._withDependencies([

    'scenes',
    'cameras',
    'animations',

  ]).then(function(dependencies) {

    const scenes = [];

    for (const name in dependencies.scenes) {

      scenes.push(dependencies.scenes[name]);

    }

    const scene = json.scene !== undefined ? dependencies.scenes[json.scene] : scenes[0];

    const cameras = [];

    for (const name in dependencies.cameras) {

      const camera = dependencies.cameras[name];
      cameras.push(camera);

    }

    const animations = [];

    for (const name in dependencies.animations) {

      animations.push(dependencies.animations[name]);

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
GLTFParser.prototype.getDependency = function(type, index) {

  const cacheKey = type + ':' + index;
  let dependency = this.cache.get(cacheKey);

  if (!dependency) {

    const fnName = 'load' + type.charAt(0).toUpperCase() + type.slice(1);
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
GLTFParser.prototype.loadBuffer = function(bufferIndex) {

  const bufferDef = this.json.buffers[bufferIndex];

  if (bufferDef.type && bufferDef.type !== 'arraybuffer') {

    throw new Error('GLTFLoader: %s buffer type is not supported.', bufferDef.type);

  }

  // If present, GLB container is required to be the first buffer.
  if (bufferDef.uri === undefined && bufferIndex === 0) {

    return Promise.resolve(this.extensions[EXTENSIONS.KHR_BINARY_GLTF].body);

  }

  const options = this.options;

  return new Promise(function(resolve) {

    const loader = new FileLoader();
    loader.setResponseType('arraybuffer');
    loader.load(resolveURL(bufferDef.uri, options.path), resolve);

  });

};

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
 * @param {number} bufferViewIndex bufferViewIndex
 * @return {Promise<ArrayBuffer>} buffer
 */
GLTFParser.prototype.loadBufferView = function(bufferViewIndex) {

  const bufferViewDef = this.json.bufferViews[bufferViewIndex];

  return this.getDependency('buffer', bufferViewDef.buffer).then(function(buffer) {

    const byteLength = bufferViewDef.byteLength || 0;
    const byteOffset = bufferViewDef.byteOffset || 0;
    return buffer.slice(byteOffset, byteOffset + byteLength);

  });

};

GLTFParser.prototype.loadAccessors = function() {

  const parser = this;
  const json = this.json;

  return _each(json.accessors, function(accessor) {

    return parser.getDependency('bufferView', accessor.bufferView).then(function(bufferView) {

      const itemSize = WEBGL_TYPE_SIZES[accessor.type];
      const TypedArray = WEBGL_COMPONENT_TYPES[accessor.componentType];

      // For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
      const elementBytes = TypedArray.BYTES_PER_ELEMENT;
      const itemBytes = elementBytes * itemSize;
      const byteStride = json.bufferViews[accessor.bufferView].byteStride;
      let array;

      // The buffer is not interleaved if the stride is the item size in bytes.
      if (byteStride && byteStride !== itemBytes) {

        // Use the full buffer if it's interleaved.
        array = new TypedArray(bufferView);

        // Integer parameters to IB/IBA are in array elements, not bytes.
        const ib = new InterleavedBuffer(array, byteStride / elementBytes);

        return new InterleavedBufferAttribute(ib, itemSize, accessor.byteOffset / elementBytes);

      }

      array = new TypedArray(bufferView, accessor.byteOffset, accessor.count * itemSize);

      return new BufferAttribute(array, itemSize);


    });

  });

};

/**
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
 * @param {number} textureIndex textureIndex
 * @return {Promise<Texture>} Texture
 */
GLTFParser.prototype.loadTexture = function(textureIndex) {

  const parser = this;
  const json = this.json;
  const options = this.options;

  const URL = window.URL || window.webkitURL;

  const textureDef = json.textures[textureIndex];
  const source = json.images[textureDef.source];
  let sourceURI = source.uri;
  let isObjectURL = false;

  if (source.bufferView !== undefined) {

    // Load binary image data from bufferView, if provided.

    sourceURI = parser.getDependency('bufferView', source.bufferView)
      .then(function(bufferView) {

        isObjectURL = true;
        const blob = new Blob([ bufferView ], {
          type: source.mimeType,
        });
        sourceURI = URL.createObjectURL(blob);
        return sourceURI;

      });

  }

  return Promise.resolve(sourceURI).then(function(sourceURI) {

    // Load Texture resource.

    const textureLoader = Loader.Handlers.get(sourceURI) || new TextureLoader();
    textureLoader.setCrossOrigin(options.crossOrigin);

    return new Promise(function(resolve, reject) {

      textureLoader.load(resolveURL(sourceURI, options.path), resolve, undefined, reject);

    });

  }).then(function(texture) {

    // Clean up resources and configure Texture.

    if (isObjectURL !== undefined) {

      URL.revokeObjectURL(sourceURI);

    }

    texture.flipY = false;

    if (textureDef.name !== undefined) texture.name = textureDef.name;

    texture.format = textureDef.format !== undefined ? WEBGL_TEXTURE_FORMATS[textureDef.format] : RGBAFormat;

    if (textureDef.internalFormat !== undefined && texture.format !== WEBGL_TEXTURE_FORMATS[textureDef.internalFormat]) {

      console.warn('GLTFLoader: js does not support texture internalFormat which is different from texture format. ' +
        'internalFormat will be forced to be the same value as format.');

    }

    texture.type = textureDef.type !== undefined ? WEBGL_TEXTURE_DATATYPES[textureDef.type] : UnsignedByteType;

    const samplers = json.samplers || {};
    const sampler = samplers[textureDef.sampler] || {};

    texture.magFilter = WEBGL_FILTERS[sampler.magFilter] || LinearFilter;
    texture.minFilter = WEBGL_FILTERS[sampler.minFilter] || LinearMipMapLinearFilter;
    texture.wrapS = WEBGL_WRAPPINGS[sampler.wrapS] || RepeatWrapping;
    texture.wrapT = WEBGL_WRAPPINGS[sampler.wrapT] || RepeatWrapping;

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
GLTFParser.prototype.assignTexture = function(materialParams, textureName, textureIndex) {

  return this.getDependency('texture', textureIndex).then(function(texture) {

    materialParams[textureName] = texture;

  });

};

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
 * @return {Promise<Array<Material>>} Material
 */
GLTFParser.prototype.loadMaterials = function() {

  const parser = this;
  const json = this.json;
  const extensions = this.extensions;

  return _each(json.materials, function(material) {

    let materialType;
    const materialParams = {};
    const materialExtensions = material.extensions || {};

    const pending = [];

    if (materialExtensions[EXTENSIONS.KHR_MATERIALS_COMMON]) {

      const khcExtension = extensions[EXTENSIONS.KHR_MATERIALS_COMMON];
      materialType = khcExtension.getMaterialType(material);
      pending.push(khcExtension.extendParams(materialParams, material, parser));

    } else if (materialExtensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS]) {

      const sgExtension = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS];
      materialType = sgExtension.getMaterialType(material);
      pending.push(sgExtension.extendParams(materialParams, material, parser));

    } else if (material.pbrMetallicRoughness !== undefined) {

      // Specification:
      // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material

      materialType = MeshStandardMaterial;

      const metallicRoughness = material.pbrMetallicRoughness;

      materialParams.color = new Color(1.0, 1.0, 1.0);
      materialParams.opacity = 1.0;

      if (Array.isArray(metallicRoughness.baseColorFactor)) {

        const array = metallicRoughness.baseColorFactor;

        materialParams.color.fromArray(array);
        materialParams.opacity = array[3];

      }

      if (metallicRoughness.baseColorTexture !== undefined) {

        pending.push(parser.assignTexture(materialParams, 'map', metallicRoughness.baseColorTexture.index));

      }

      materialParams.metalness = metallicRoughness.metallicFactor !== undefined ? metallicRoughness.metallicFactor : 1.0;
      materialParams.roughness = metallicRoughness.roughnessFactor !== undefined ? metallicRoughness.roughnessFactor : 1.0;

      if (metallicRoughness.metallicRoughnessTexture !== undefined) {

        const textureIndex = metallicRoughness.metallicRoughnessTexture.index;
        pending.push(parser.assignTexture(materialParams, 'metalnessMap', textureIndex));
        pending.push(parser.assignTexture(materialParams, 'roughnessMap', textureIndex));

      }

    } else {

      materialType = MeshPhongMaterial;

    }

    if (material.doubleSided === true) {

      materialParams.side = DoubleSide;

    }

    const alphaMode = material.alphaMode || ALPHA_MODES.OPAQUE;

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

      if (materialType === MeshBasicMaterial) {

        materialParams.color = new Color().fromArray(material.emissiveFactor);

      } else {

        materialParams.emissive = new Color().fromArray(material.emissiveFactor);

      }

    }

    if (material.emissiveTexture !== undefined) {

      if (materialType === MeshBasicMaterial) {

        pending.push(parser.assignTexture(materialParams, 'map', material.emissiveTexture.index));

      } else {

        pending.push(parser.assignTexture(materialParams, 'emissiveMap', material.emissiveTexture.index));

      }

    }

    return Promise.all(pending).then(function() {

      let _material;

      if (materialType === ShaderMaterial) {

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

GLTFParser.prototype.loadGeometries = function(primitives) {

  return this._withDependencies([

    'accessors',

  ]).then(function(dependencies) {

    return _each(primitives, function(primitive) {

      const geometry = new BufferGeometry();

      const attributes = primitive.attributes;

      for (const attributeId in attributes) {

        const attributeEntry = attributes[attributeId];

        if (attributeEntry === undefined) return;

        const bufferAttribute = dependencies.accessors[attributeEntry];

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
          case 'WEIGHT': // WEIGHT semantic deprecated.

            geometry.addAttribute('skinWeight', bufferAttribute);
            break;

          case 'JOINTS_0':
          case 'JOINT': // JOINT semantic deprecated.

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
GLTFParser.prototype.loadMeshes = function() {

  const scope = this;
  const json = this.json;

  return this._withDependencies([

    'accessors',
    'materials',

  ]).then(function(dependencies) {

    return _each(json.meshes, function(meshDef) {

      const group = new Group();

      if (meshDef.name !== undefined) group.name = meshDef.name;
      if (meshDef.extras) group.userData = meshDef.extras;

      const primitives = meshDef.primitives || [];

      return scope.loadGeometries(primitives).then(function(geometries) {

        for (const name in primitives) {

          const primitive = primitives[name];
          const geometry = geometries[name];

          const material = primitive.material === undefined ?
            createDefaultMaterial() :
            dependencies.materials[primitive.material];

          if (material.aoMap &&
            geometry.attributes.uv2 === undefined &&
            geometry.attributes.uv !== undefined) {

            console.log('GLTFLoader: Duplicating UVs to support aoMap.');
            geometry.addAttribute('uv2', new BufferAttribute(geometry.attributes.uv.array, 2));

          }

          if (geometry.attributes.color !== undefined) {

            material.vertexColors = VertexColors;
            material.needsUpdate = true;

          }

          if (geometry.attributes.normal === undefined) {

            if (material.flatShading !== undefined) {

              material.flatShading = true;

            } else {

              // TODO: Remove this backwards-compatibility fix after r87 release.
              material.shading = FlatShading;

            }

          }

          let mesh;

          if (primitive.mode === WEBGL_CONSTANTS.TRIANGLES || primitive.mode === undefined) {

            mesh = new Mesh(geometry, material);

          } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {

            mesh = new Mesh(geometry, material);
            mesh.drawMode = TriangleStripDrawMode;
          } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {

            mesh = new Mesh(geometry, material);
            mesh.drawMode = TriangleFanDrawMode;

          } else if (primitive.mode === WEBGL_CONSTANTS.LINES) {

            mesh = new LineSegments(geometry, material);

          } else if (primitive.mode === WEBGL_CONSTANTS.LINE_STRIP) {

            mesh = new Line(geometry, material);

          } else if (primitive.mode === WEBGL_CONSTANTS.LINE_LOOP) {

            mesh = new LineLoop(geometry, material);

          } else if (primitive.mode === WEBGL_CONSTANTS.POINTS) {

            mesh = new Points(geometry, material);

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
GLTFParser.prototype.loadCameras = function() {

  const json = this.json;

  return _each(json.cameras, function(camera) {

    let _camera;

    const params = camera[camera.type];

    if (!params) {

      console.warn('GLTFLoader: Missing camera parameters.');
      return;

    }

    if (camera.type === 'perspective') {

      const aspectRatio = params.aspectRatio || 1;
      const xfov = params.yfov * aspectRatio;

      _camera = new PerspectiveCamera(Math.radToDeg(xfov), aspectRatio, params.znear || 1, params.zfar || 2e6);

    } else if (camera.type === 'orthographic') {

      _camera = new OrthographicCamera(params.xmag / -2, params.xmag / 2, params.ymag / 2, params.ymag / -2, params.znear, params.zfar);

    }

    if (camera.name !== undefined) _camera.name = camera.name;
    if (camera.extras) _camera.userData = camera.extras;

    return _camera;

  });

};

GLTFParser.prototype.loadSkins = function() {

  const json = this.json;

  return this._withDependencies([

    'accessors',

  ]).then(function(dependencies) {

    return _each(json.skins, function(skin) {

      const _skin = {
        joints: skin.joints,
        inverseBindMatrices: dependencies.accessors[skin.inverseBindMatrices],
      };

      return _skin;

    });

  });

};

GLTFParser.prototype.loadAnimations = function() {

  const json = this.json;

  return this._withDependencies([

    'accessors',
    'nodes',

  ]).then(function(dependencies) {

    return _each(json.animations, function(animation, animationId) {

      const tracks = [];

      for (const channelId in animation.channels) {

        const channel = animation.channels[channelId];
        const sampler = animation.samplers[channel.sampler];

        if (sampler) {

          const target = channel.target;
          const name = target.node !== undefined ? target.node : target.id; // NOTE: target.id is deprecated.
          const input = animation.parameters !== undefined ? animation.parameters[sampler.input] : sampler.input;
          const output = animation.parameters !== undefined ? animation.parameters[sampler.output] : sampler.output;

          const inputAccessor = dependencies.accessors[input];
          const outputAccessor = dependencies.accessors[output];

          const node = dependencies.nodes[name];

          if (node) {

            node.updateMatrix();
            node.matrixAutoUpdate = true;

            let TypedKeyframeTrack;

            switch (PATH_PROPERTIES[target.path]) {

              case PATH_PROPERTIES.weights:

                TypedKeyframeTrack = NumberKeyframeTrack;
                break;

              case PATH_PROPERTIES.rotation:

                TypedKeyframeTrack = QuaternionKeyframeTrack;
                break;

              case PATH_PROPERTIES.position:
              case PATH_PROPERTIES.scale:
              default:

                TypedKeyframeTrack = VectorKeyframeTrack;
                break;

            }

            const targetName = node.name ? node.name : node.uuid;

            if (sampler.interpolation === 'CATMULLROMSPLINE') {

              console.warn('GLTFLoader: CATMULLROMSPLINE interpolation is not supported. Using CUBICSPLINE instead.');

            }

            const interpolation = sampler.interpolation !== undefined ? INTERPOLATION[sampler.interpolation] : InterpolateLinear;

            const targetNames = [];

            if (PATH_PROPERTIES[target.path] === PATH_PROPERTIES.weights) {

              // node should be Group here but
              // PATH_PROPERTIES.weights(morphTargetInfluences) should be
              // the property of a mesh object under node.
              // So finding targets here.

              node.traverse(function(object) {

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
            for (let i = 0, il = targetNames.length; i < il; i++) {

              tracks.push(new TypedKeyframeTrack(
                targetNames[i] + '.' + PATH_PROPERTIES[target.path],
                AnimationUtils.arraySlice(inputAccessor.array, 0),
                AnimationUtils.arraySlice(outputAccessor.array, 0),
                interpolation
              ));

            }

          }

        }

      }

      const name = animation.name !== undefined ? animation.name : 'animation_' + animationId;

      return new AnimationClip(name, undefined, tracks);

    });

  });

};

GLTFParser.prototype.loadNodes = function() {

  const json = this.json;
  const extensions = this.extensions;
  const scope = this;

  const nodes = json.nodes || [];
  const skins = json.skins || [];

  // Nothing in the node definition indicates whether it is a Bone or an
  // Object3D. Use the skins' joint references to mark bones.
  skins.forEach(function(skin) {

    skin.joints.forEach(function(id) {

      nodes[id].isBone = true;

    });

  });

  return _each(json.nodes, function(node) {

    const matrix = new Matrix4();

    const _node = node.isBone === true ? new Bone() : new Object3D();

    if (node.name !== undefined) {

      _node.name = PropertyBinding.sanitizeNodeName(node.name);

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

  }).then(function(__nodes) {

    return scope._withDependencies([

      'meshes',
      'skins',
      'cameras',

    ]).then(function(dependencies) {

      return _each(__nodes, function(_node, nodeId) {

        const node = json.nodes[nodeId];

        let meshes;

        if (node.mesh !== undefined) {

          meshes = [ node.mesh ];

        } else if (node.meshes !== undefined) {

          console.warn('GLTFLoader: Legacy glTF file detected. Nodes may have no more than one mesh.');

          meshes = node.meshes;

        }

        if (meshes !== undefined) {

          for (const meshId in meshes) {

            const mesh = meshes[meshId];
            const group = dependencies.meshes[mesh];

            if (group === undefined) {

              console.warn('GLTFLoader: Could not find node "' + mesh + '".');
              continue;

            }

            // do not clone children as they will be replaced anyway
            const clonedgroup = group.clone(false);

            for (const childrenId in group.children) {

              let child = group.children[childrenId];
              const originalChild = child;

              // clone Mesh to add to _node

              const originalMaterial = child.material;
              const originalGeometry = child.geometry;
              const originalInfluences = child.morphTargetInfluences;
              const originalUserData = child.userData;
              const originalName = child.name;

              let material = originalMaterial;

              switch (child.type) {

                case 'LineSegments':
                  child = new LineSegments(originalGeometry, material);
                  break;

                case 'LineLoop':
                  child = new LineLoop(originalGeometry, material);
                  break;

                case 'Line':
                  child = new Line(originalGeometry, material);
                  break;

                case 'Points':
                  child = new Points(originalGeometry, material);
                  break;

                default:
                  child = new Mesh(originalGeometry, material);
                  child.drawMode = originalChild.drawMode;

              }

              child.castShadow = true;
              child.morphTargetInfluences = originalInfluences;
              child.userData = originalUserData;
              child.name = originalName;

              let skinEntry;

              if (node.skin !== undefined) {

                skinEntry = dependencies.skins[node.skin];

              }

              // Replace Mesh with SkinnedMesh in library
              if (skinEntry) {

                const geometry = originalGeometry;
                material = originalMaterial;
                material.skinning = true;

                child = new SkinnedMesh(geometry, material);
                child.castShadow = true;
                child.userData = originalUserData;
                child.name = originalName;

                const bones = [];
                const boneInverses = [];

                for (let i = 0, l = skinEntry.joints.length; i < l; i++) {

                  const jointId = skinEntry.joints[i];
                  const jointNode = __nodes[jointId];

                  if (jointNode) {

                    bones.push(jointNode);

                    const m = skinEntry.inverseBindMatrices.array;
                    const mat = new Matrix4().fromArray(m, i * 16);
                    boneInverses.push(mat);

                  } else {

                    console.warn('GLTFLoader: Joint "%s" could not be found.', jointId);

                  }

                }

                child.bind(new Skeleton(bones, boneInverses), child.matrixWorld);

              }

              clonedgroup.add(child);

            }

            _node.add(clonedgroup);

          }

        }

        if (node.camera !== undefined) {

          const camera = dependencies.cameras[node.camera];

          _node.add(camera);

        }

        if (node.extensions &&
          node.extensions[EXTENSIONS.KHR_LIGHTS] &&
          node.extensions[EXTENSIONS.KHR_LIGHTS].light !== undefined) {

          const lights = extensions[EXTENSIONS.KHR_LIGHTS].lights;
          _node.add(lights[node.extensions[EXTENSIONS.KHR_LIGHTS].light]);

        }

        return _node;

      });

    });

  });

};

GLTFParser.prototype.loadScenes = function() {

  const json = this.json;
  const extensions = this.extensions;

  // scene node hierachy builder

  function buildNodeHierachy(nodeId, parentObject, allNodes) {

    const _node = allNodes[nodeId];
    parentObject.add(_node);

    const node = json.nodes[nodeId];

    if (node.children) {

      const children = node.children;

      for (let i = 0, l = children.length; i < l; i++) {

        const child = children[i];
        buildNodeHierachy(child, _node, allNodes);

      }

    }

  }

  return this._withDependencies([

    'nodes',

  ]).then(function(dependencies) {

    return _each(json.scenes, function(scene) {

      const _scene = new Scene();
      if (scene.name !== undefined) _scene.name = scene.name;

      if (scene.extras) _scene.userData = scene.extras;

      const nodes = scene.nodes || [];

      for (let i = 0, l = nodes.length; i < l; i++) {

        const nodeId = nodes[i];
        buildNodeHierachy(nodeId, _scene, dependencies.nodes);

      }

      _scene.traverse(function(child) {

        // for Specular-Glossiness.
        if (child.material && child.material.isGLTFSpecularGlossinessMaterial) {

          child.onBeforeRender = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].refreshUniforms;

        }

      });

      // Ambient lighting, if present, is always attached to the scene root.
      if (scene.extensions &&
        scene.extensions[EXTENSIONS.KHR_LIGHTS] &&
        scene.extensions[EXTENSIONS.KHR_LIGHTS].light !== undefined) {

        const lights = extensions[EXTENSIONS.KHR_LIGHTS].lights;
        _scene.add(lights[scene.extensions[EXTENSIONS.KHR_LIGHTS].light]);

      }

      return _scene;

    });

  });
};

export { GLTFLoader };
