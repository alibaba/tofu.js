import { AnimationMixer, EventDispatcher } from 'three';
import { GLTFLoader } from '../utils/GLTFLoader';
import Utils from '../utils/Utils';

/**
 * refactor from THREE.DeviceOrientationControls
 */
class GltfMagic extends EventDispatcher {
  constructor({ url, index }) {
    super();
    this.url = url;
    this.index = index || 0;
    this.scene = null;
    this.glft = null;
    this.mixer = null;
    this.animations = [];
    this.loader = new GLTFLoader();
    this.loader.load(this.url, gltf => {
      this.setup(gltf);
      this.emit('loaded', {});
    });
  }

  switchScene(index) {
    this.index = Utils.isNumber(index) ? index : this.index;
    this.scene = this.glft.scenes[this.index] || this.scene;
    this.setupMixer();
  }

  setup(gltf) {
    this.glft = gltf;
    this.animations = gltf.animations;
    this.switchScene();
    this.setupMixer();
  }

  setupMixer() {
    this.mixer = new AnimationMixer(this.scene);
    for (let i = 0; i < this.animations.length; i++) {
      const clip = this.animations[i];
      this.mixer.clipAction(clip).play();
    }
  }

  update(snippet) {
    this.mixer && this.mixer.update(snippet / 1000);
  }
}

export { GltfMagic };
