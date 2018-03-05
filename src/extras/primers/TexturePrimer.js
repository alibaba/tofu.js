import {
  Mesh,
  MeshBasicMaterial,
  VideoTexture,
  CanvasTexture,
  Texture,
  TextureLoader,
  Color,
} from 'three';
import Primer from './Primer';
import Utils from '../../utils/Utils';

/**
 * texture-primer, for Texture CanvasTexture VideoTexture
 */
class TexturePrimer extends Primer {
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
  constructor(frame, options) {
    super(frame, options);

    const { color = 0xffffff, depthTest = false, depthWrite = false, minFilter, magFilter, format } = options || {};

    this.texture = Utils.isString(frame) ? new TextureLoader().load(frame) :
      frame.tagName === 'VIDEO' ? new VideoTexture(frame) :
        frame.tagName === 'CANVAS' ? new CanvasTexture(frame) :
          frame.tagName === 'IMG' ? new Texture(frame) : null;

    if (minFilter) this.texture.minFilter = minFilter;
    if (magFilter) this.texture.magFilter = magFilter;
    if (format) this.texture.format = format;


    this.pigmentMat = new MeshBasicMaterial({
      color: new Color(color),
      map: this.texture,
      depthTest,
      depthWrite,
    });

    this.pigment = new Mesh(this.pigmentGeo, this.pigmentMat);
    this.pigment.frustumCulled = false;

    this.scene.add(this.pigment);

    this._gainFrameSize();
  }

  /**
   * gain frame size, and to adjust aspect
   */
  _gainFrameSize() {
    const image = this.texture.image;
    if (!image) return;
    if (image.width > 0 && image.height > 0) {
      this._setAspect(image.width / image.height);
    } else {
      image.addEventListener('load', () => {
        this._setAspect(image.width / image.height);
      });
    }
  }

  /**
   * update positions attribute
   */
  update() {
    if (this.autoCover) this._updateAttributes();
  }

  /**
   * render this primer
   * @param {WebGLRenderer} renderer put webgl renderer
   * @param {WebGLRenderTarget} rednerTarget render to which buffer
   */
  render(renderer, rednerTarget) {
    this.update();
    renderer.render(this.scene, this.camera, rednerTarget);
  }
}

export default TexturePrimer;
