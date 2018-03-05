import { EventDispatcher, Quaternion, Vector3, Euler } from 'three';
import Utils from './Utils';

const zee = new Vector3(0, 0, 1);

const euler = new Euler();

const q0 = new Quaternion();

const q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

const ROTATE_ORDER = 'YXZ';

class Orienter extends EventDispatcher {
  constructor(options) {
    super();
    options = options || {};

    this._orient = this._orient.bind(this);
    this._change = this._change.bind(this);

    this.needFix = Utils.isBoolean(options.needFix) ? options.needFix : true;
    this.fix = 0;
    this.timing = 8;

    this.alpha = 0;
    this.beta = 0;
    this.gamma = 0;
    this.lon = 0;
    this.lat = 0;
    this.direction = 0;
    this.quaternion = new Quaternion();

    this.eared = false;
    this.nodce = true;
    this.connect();
  }

  connect() {
    this._change();
    if (this.eared) return;
    this.eared = true;
    window.addEventListener('deviceorientation', this._orient, false);
    window.addEventListener('orientationchange', this._change, false);
  }

  disconnect() {
    this.eared = false;
    window.removeEventListener('deviceorientation', this._orient, false);
    window.removeEventListener('orientationchange', this._change, false);
  }

  _orient(event) {
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
      quaternion: this.quaternion,
    });
  }

  update() {
    if (!this.eared || this.nodce) return;
    const alpha = Utils.DTR(this.alpha);
    const beta = Utils.DTR(this.beta);
    const gamma = Utils.DTR(this.gamma);
    euler.set(beta, alpha, -gamma, ROTATE_ORDER); // 'ZXY' for the device, but 'YXZ' for us

    this.quaternion.setFromEuler(euler); // orient the device
    this.quaternion.multiply(q1); // camera looks out the back of the device, not the top
    this.quaternion.multiply(q0.setFromAxisAngle(zee, -this.direction)); // adjust for screen orientation

    this.calculation();
  }

  calculation() {
    this.lon = Utils.euclideanModulo(this.alpha + this.gamma, 360);

    const face = new Vector3(0, 0, -1);
    face.applyQuaternion(this.quaternion);
    const xzFace = new Vector3(face.x, 0, face.z);
    const cos = Utils.clamp(xzFace.dot(face), -1, 1);
    const nor = face.y >= 0 ? 1 : -1;
    const degree = Utils.RTD(Math.acos(cos));
    this.lat = this.beta < 0 ? nor * (180 - degree) : nor * degree;
  }

  _change() {
    this.direction = window.orientation || 0;
    this.update();
  }
}

export default Orienter;
