import { Vector3 } from 'three';

export default class Smooth {
  constructor(object, options) {
    options = options || {};
    this.object = object;
    this.to = new Vector3().copy(object);
    this.now = this.to.clone();
    this.speed = options.speed || 0.02;
    this.noise = options.noise || 0.000001;
  }
  goto(x, y, z) {
    this.to.set(x, y, z);
  }
  update() {
    const space = this.to.clone().sub(this.now).multiplyScalar(this.speed);
    if (space.length() < this.noise) return;
    this.now.add(space);
    this.object.x = this.now.x;
    this.object.y = this.now.y;
    this.object.z = this.now.z;
  }
}
