import { Group, Matrix4 } from 'three';

/**
 * anchor class, help your to bind interaction event
 */
class AnchorBase extends Group {
  /**
   * help you caculate anchor position, relative which parent
   *
   * @param {Vector3} point global position relative camera
   * @param {Object3D} parent relative which parent
   * @return {Vector3} position relative parent coordinate system
   */
  putWhere(point, parent) {
    point.multiplyScalar(0.9);
    point.applyMatrix4(new Matrix4().getInverse(parent.matrixWorld));
    this.position.set(point.x, point.y, point.z);
    this.lookAt(0, 0, 0);
    return point;
  }

  /**
   * put anchor to which posotion, position was relative it's parent
   *
   * @param {Vector3} position position was relative it's parent
   */
  putHere(position) {
    this.position.set(position.x, position.y, position.z);
    this.lookAt(0, 0, 0);
  }
}

export default AnchorBase;
