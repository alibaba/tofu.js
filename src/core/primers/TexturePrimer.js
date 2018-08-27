import {
  PlaneBufferGeometry,
  MeshBasicMaterial,
  VideoTexture,
  CanvasTexture,
  Texture,
  TextureLoader,
  Color,
  LinearFilter,
  RGBFormat,
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
    const {
      color = 0xffffff,
      depthTest = false,
      depthWrite = false,
      minFilter = LinearFilter,
      magFilter = LinearFilter,
      format = RGBFormat,
    } = options || {};

    const texture = Utils.isString(frame) ? new TextureLoader().load(frame) :
      frame.tagName === 'VIDEO' ? new VideoTexture(frame) :
        frame.tagName === 'CANVAS' ? new CanvasTexture(frame) :
          frame.tagName === 'IMG' ? new Texture(frame) : null;

    /**
     * geometry for this 2D context
     * @member {PlaneBufferGeometry}
     * @private
     */
    const geo = new PlaneBufferGeometry(2, 2);

    /**
     * material for this 2D context
     * @member {MeshBasicMaterial}
     * @private
     */
    const mat = new MeshBasicMaterial({
      color: new Color(color),
      map: texture,
      depthTest,
      depthWrite,
    });

    super(geo, mat, options);


    /**
     * this primer used texture
     */
    this.texture = texture;

    if (minFilter) this.texture.minFilter = minFilter;
    if (magFilter) this.texture.magFilter = magFilter;
    if (format) this.texture.format = format;

    /**
     * texture had loaded ?
     */
    this.loaded = false;

    this._gainFrameSize();
  }

  /**
   * gain frame size, and to adjust aspect
   */
  _gainFrameSize() {
    const image = this.texture.image;
    if (!image) return;
    if (image.width > 0 && image.height > 0) {
      this.loaded = true;
      this.frameAspect = image.width / image.height;
      this._updateAttributes();
    } else {
      image.addEventListener('load', () => {
        this.loaded = true;
        this.frameAspect = image.width / image.height;
        this._updateAttributes();
      });
    }
  }
}

export default TexturePrimer;
