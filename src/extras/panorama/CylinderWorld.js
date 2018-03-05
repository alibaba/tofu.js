import { Object3D, TextureLoader, Mesh, CylinderBufferGeometry, MeshBasicMaterial, DoubleSide, Vector2, Vector3 } from 'three';
import Utils from '../../utils/Utils';
import Orienter from '../../utils/Orienter';

const RATIO = 0.15;
const RANGE = 50;
const START = new Vector2();
const END = new Vector2();

/**
 * 柱面全景图组件，快速实现可交互的全景图
 */
class CylinderWorld extends Object3D {
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
  constructor({ url, radius, height, radiusSegments, heightSegments, openEnded, flipX, flipY, draggable, zoomIn, rotateSpeed, strength, viscosity, rangeMin, rangeMax, driftX, driftY }) {
    super();

    this.needMount = true;

    radius = radius || 512;
    height = height || 1000;
    radiusSegments = radiusSegments || 64;
    heightSegments = heightSegments || 1;
    openEnded = Utils.isBoolean(openEnded) ? openEnded : true;

    this.background = new Mesh(
      new CylinderBufferGeometry(radius, radius, height, radiusSegments, heightSegments, openEnded),
      new MeshBasicMaterial({ map: new TextureLoader().load(url), side: DoubleSide })
    );

    flipX = Utils.isBoolean(flipX) ? flipX : true;
    flipY = Utils.isBoolean(flipY) ? flipY : false;
    if (flipX) {
      this.background.scale.x = -1;
    }
    if (flipY) {
      this.background.scale.y = -1;
    }

    this.add(this.background);

    this._onStart = this._onStart.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onEnd = this._onEnd.bind(this);

    this._draggable = false;

    this.rotateSpeed = rotateSpeed || 1;
    this.strength = strength || 0.3;
    this.viscosity = viscosity || 0.1;
    this.rangeMin = rangeMin || -RANGE;
    this.rangeMax = rangeMax || RANGE;
    this.eared = false;
    this.draggable = Utils.isBoolean(draggable) ? draggable : true;
    this.zoomIn = Utils.isBoolean(zoomIn) ? zoomIn : true;

    this.gyro = new Orienter();
    this.drag = new Vector3();
    this.updateDrag = this.updateDrag.bind(this);
    this.on('pretimeline', this.updateDrag);

    this.driftX = Utils.isNumber(driftX) ? driftX : 0;
    this.driftY = Utils.isNumber(driftY) ? driftY : 0;
  }

  onDragChange() {
    if (this.draggable) {
      this.addEvents();
    } else {
      this.removeEvents();
    }
  }

  addEvents() {
    if (this.eared) return;
    this.on('touchstart', this._onStart);
    this.on('touchmove', this._onMove);
    this.on('touchend', this._onEnd);
    this.on('mousedown', this._onStart);
    this.on('mousemove', this._onMove);
    this.on('mouseup', this._onEnd);
    this.eared = true;
  }

  removeEvents() {
    this.off('touchstart', this._onStart);
    this.off('touchmove', this._onMove);
    this.off('touchend', this._onEnd);
    this.off('mousedown', this._onStart);
    this.off('mousemove', this._onMove);
    this.off('mouseup', this._onEnd);
    this.eared = false;
  }

  _onStart(ev) {
    const originalEvent = ev.data.originalEvent;
    if (originalEvent.touches && originalEvent.touches.length > 1) return;
    this.hadStart = true;
    if (originalEvent.touches) {
      START.x = originalEvent.touches[0].pageX;
      START.y = originalEvent.touches[0].pageY;
    } else {
      START.x = originalEvent.pageX;
      START.y = originalEvent.pageY;
    }
  }
  _onMove(ev) {
    const originalEvent = ev.data.originalEvent;
    if (!this.hadStart || (originalEvent.touches && originalEvent.touches.length > 1)) return;
    originalEvent.preventDefault();
    if (originalEvent.touches) {
      END.x = originalEvent.touches[0].pageX;
      END.y = originalEvent.touches[0].pageY;
    } else {
      END.x = originalEvent.pageX;
      END.y = originalEvent.pageY;
    }
    const DIFF = new Vector2()
      .copy(END)
      .sub(START)
      .multiplyScalar(RATIO * this.rotateSpeed);
    this.drag.x = Utils.clamp(this.drag.x - DIFF.y, this.rangeMin, this.rangeMax);
    this.drag.y = Utils.euclideanModulo(this.drag.y - DIFF.x, 360);
    START.copy(END);
  }
  _onEnd() {
    this.hadStart = false;
  }

  updateDrag() {
    const target = Utils.euclideanModulo(this.drag.y - this.gyro.lon, 360);
    const breaking = target - this.dragY;
    let compensate = 0;
    if (breaking > 180) compensate = 360;
    if (breaking < -180) compensate = -360;
    const speed = new Vector2(
      (this.drag.x - this.gyro.lat * this.strength) - this.dragX,
      target - (this.dragY + compensate)
    );

    if (this.zoomIn) {
      const zoomIn = -Utils.clamp(Math.abs(5 * speed.length()), 0, 200) - this.position.z;
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
  get draggable() {
    return this._draggable;
  }

  /**
   * setter whether draggable or not
   * @param {Boolean} value whether or not
   */
  set draggable(value) {
    if (value !== this._draggable) {
      this._draggable = value;
      this.onDragChange();
    }
  }

  /**
   * getter dragX of this panorama
   */
  get dragX() {
    return Utils.RTD(this.rotation.x);
  }

  /**
   * setter dragX of this panorama
   * @param {Number} degree rotation degree
   */
  set dragX(degree) {
    degree = Utils.clamp(degree, -90, 90);
    if (degree !== this.dragX) {
      this.rotation.x = Utils.DTR(degree);
    }
  }

  /**
   * getter dragY of this panorama
   */
  get dragY() {
    return Utils.RTD(this.rotation.y);
  }

  /**
   * setter dragY of this panorama
   * @param {Number} degree rotation degree
   */
  set dragY(degree) {
    degree = Utils.euclideanModulo(degree, 360);
    if (degree !== this.dragY) {
      this.rotation.y = Utils.DTR(degree);
    }
  }

  /**
   * getter driftY of this panorama
   */
  get driftY() {
    return Utils.RTD(this.background.rotation.y);
  }

  /**
   * setter driftY of this panorama
   * @param {Number} degree rotation degree
   */
  set driftY(degree) {
    degree = Utils.euclideanModulo(degree, 360);
    if (degree !== this.driftY) {
      this.background.rotation.y = Utils.DTR(degree);
    }
  }

  /**
   * getter driftX of this panorama
   */
  get driftX() {
    return this.drag.x;
  }

  /**
   * setter driftX of this panorama
   * @param {Number} degree rotation degree
   */
  set driftX(degree) {
    degree = Utils.clamp(degree, this.rangeMin, this.rangeMax);
    if (degree !== this.driftX) {
      this.drag.x = degree;
    }
  }
}

export default CylinderWorld;
