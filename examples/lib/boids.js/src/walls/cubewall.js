import { Vector3, Box3 } from 'three';
import Wall from './wall';

export default class CubeWall extends Wall {
  constructor(min, max) {
    super();

    this.bounding = new Box3(min, max);

    this._CMP = [ 'x', 'y', 'z' ];
  }

  resultant(position) {
    const acceleration = new Vector3();
    const vector = new Vector3();

    for (let i = 0; i < 3; i++) {
      const cmp = this._CMP[i];
      vector.copy(position);
      vector[cmp] = this.bounding.min[cmp];
      acceleration.add(this.avoid(position, vector).multiplyScalar(5));
      vector.copy(position);
      vector[cmp] = this.bounding.max[cmp];
      acceleration.add(this.avoid(position, vector).multiplyScalar(5));
    }

    return acceleration;
  }

  avoid(position, target) {
    const steer = new Vector3();

    steer.copy(position);
    steer.sub(target);

    steer.multiplyScalar(1 / steer.lengthSq());

    return steer;
  }
}
