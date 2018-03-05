import { Camera, Object3D, Group, TextureLoader, Mesh, SphereBufferGeometry, MeshBasicMaterial, DoubleSide, Vector2, Vector3 } from 'three';
import Utils from '../../utils/Utils';

const RATIO = 0.15;
const RANGE = 60;
const PI2 = Math.PI * 2;
const START = new Vector2();
const END = new Vector2();
const UP = new Vector3(0, 1, 0);

/**
 * 球面全景图组件，快速实现可交互的全景图
 */
class SphereWorld extends Object3D {
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
  constructor({ url, radius, segmentationX, segmentationY, flipX, flipY, draggable, rotateSpeed, rangeMin, rangeMax, driftX, driftY }) {
    super();

    this.needCamera = true;

    this.needMount = true;

    this.inner = new Group();
    this.camera = null;

    radius = radius || 1000;
    segmentationX = segmentationX || 32;
    segmentationY = segmentationY || 32;
    driftX = Utils.isNumber(driftX) ? driftX : 0;
    driftY = Utils.isNumber(driftY) ? driftY : 0;

    this.background = new Mesh(
      new SphereBufferGeometry(radius, segmentationX, segmentationY),
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

    this.inner.add(this.background);
    super.add.call(this, this.inner);

    this._onStart = this._onStart.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this._draggable = false;
    this._dragX = 0;
    this.updateTracking = this.updateTracking.bind(this);
    this.rotateSpeed = rotateSpeed || 1;
    this.cx = 0;
    this.cy = 0;
    this.rangeMin = rangeMin || Utils.DTR(-RANGE);
    this.rangeMax = rangeMax || Utils.DTR(RANGE);
    this.eared = false;
    this.draggable = Utils.isBoolean(draggable) ? draggable : true;
    this.updateDrag({
      dragY: driftX,
      dragX: driftY,
    });
  }

  /**
   * set camera
   * @param {PerspectiveCamera} camera scene camera, panorama need get camera pose state
   */
  setCamera(camera) {
    if (camera instanceof Camera) {
      this.camera = camera;
    }
  }

  onDragChange() {
    if (this.draggable) {
      this.on('pretimeline', this.updateTracking);
      this.addEvents();
    } else {
      this.off('pretimeline', this.updateTracking);
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
    this.cx = this.dragX;
    this.cy = this.inner.rotation.y;
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
    END.sub(START);

    const x = END.y * RATIO * this.rotateSpeed;
    const y = END.x * RATIO * this.rotateSpeed;

    const dragX = this.cx + Utils.DTR(x);
    const dragY = this.cy - Utils.DTR(y);
    this.updateDrag({
      dragX,
      dragY,
    });
  }
  _onEnd() {
    this.hadStart = false;
    this.cx = this.dragX;
    this.cy = this.dragY;
  }

  updateDrag({ dragX, dragY }) {
    this.dragX = Utils.isNumber(dragX) ? dragX : this.dragX;
    this.dragY = Utils.isNumber(dragY) ? dragY : this.dragY;
  }

  updateTracking() {
    if (!this.camera) return;
    const vector = new Vector3(0, 0, -1);
    vector.applyQuaternion(this.camera.quaternion);
    this.quaternion.setFromAxisAngle(new Vector3().crossVectors(UP, vector), this.dragX);
  }

  /**
   * 添加绘制对象
   *
   * @param {THREE.Object3D} child 添加的绘制对象
   */
  add() {
    this.inner.add.apply(this.inner, arguments);
  }

  /**
   * 移除绘制对象
   *
   * @param {THREE.Object3D} child 之前添加的绘制对象
   */
  remove() {
    this.inner.remove.apply(this.inner, arguments);
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
    return this._dragX;
  }

  /**
   * setter dragX of this panorama
   * @param {Number} radian rotation radian
   */
  set dragX(radian) {
    radian = Utils.clamp(radian, this.rangeMin, this.rangeMax);
    if (radian !== this._dragX) {
      this._dragX = radian;
    }
  }

  /**
   * getter dragY of this panorama
   */
  get dragY() {
    return this.inner.rotation.y;
  }

  /**
   * setter dragY of this panorama
   * @param {Number} radian rotation radian
   */
  set dragY(radian) {
    radian = Utils.euclideanModulo(radian, PI2);
    if (radian !== this.inner.rotation.y) {
      this.inner.rotation.y = radian;
    }
  }
}

export default SphereWorld;
