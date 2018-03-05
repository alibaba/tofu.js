import { Group, Mesh, CircleBufferGeometry, PlaneBufferGeometry, MeshBasicMaterial, Color, TextureLoader } from 'three';
import Utils from '../../utils/Utils';
import AnchorBase from './AnchorBase';
import Tween from '../../utils/Tween';

/**
 * anchor class, help your to bind interaction event
 */
class AnchorRippling extends AnchorBase {
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
  constructor(options) {
    super();
    const { image, width, height, segmentation = 4, rippling, radius = 8, segmentationRip = 16, color, count = 2, duration = 1800 } = options || {};
    /**
     * global texture for stars
     * @member {Texture}
     */
    this.map = Utils.isString(image) ? new TextureLoader().load(image) : null;

    this.waves = new Group();
    this.waves.position.z = -0.1;
    this.uiFace = new Mesh(
      new PlaneBufferGeometry(width, height, segmentation, segmentation),
      new MeshBasicMaterial({ map: this.map, transparent: true })
    );

    if (rippling) this.initRippling(radius, segmentationRip, color, count, duration);

    this.add(this.uiFace);
  }

  initRippling(radius, segmentation, color, count, duration) {
    const waitTime = duration / count;
    for (let i = 0; i <= count; i++) {
      const last = i === count;
      const circle = new Mesh(
        new CircleBufferGeometry(radius, segmentation),
        new MeshBasicMaterial({ color: new Color(color), transparent: true, depthTest: false })
      );
      if (!last) {
        const wait = waitTime * i;
        circle.runners({
          runners: [
            { from: { 'material.opacity': 0.1 }, to: { scaleXYZ: 1.25, 'material.opacity': 0.5 }, duration: duration * 0.4, ease: Tween.Linear.None },
            { to: { scaleXYZ: 1.5, 'material.opacity': 0 }, duration: duration * 0.6, ease: Tween.Linear.None },
          ],
          wait,
          infinite: true,
        });
      }

      this.waves.add(circle);
    }
    this.add(this.waves);
  }
}

export default AnchorRippling;
