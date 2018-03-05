function Vector3(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}
Vector3.prototype.copy = function (vec3) {
  this.x = vec3.x;
  this.y = vec3.y;
  this.z = vec3.z;
  return this;
};

function Sleep3() {
  this.x = false;
  this.y = false;
  this.z = false;
}

function IMU(camera, options) {
  options = options || {};
  this.camera = camera;
  this.sleepTimes = options.sleepTimes || 30;
  this.noise = options.noise || 1;
  // this.conver = options.conver || 0.5;
  this.interval = 0;

  this.acc = new Vector3();
  this.velocity = new Vector3();
  this.position = new Vector3();

  this.sleeps = new Vector3();
  this.sleep = new Sleep3();

  this.VEC = ['x', 'y', 'z'];
}
IMU.prototype.update = function (ev) {
  this.interval = ev.interval;


  var direcv = new THREE.Vector3(0, 0, -1);
  direcv.applyQuaternion(this.camera.quaternion).normalize();
  direcv.multiplyScalar(event.acceleration.z);

  var upv = new THREE.Vector3(0, 1, 0);
  upv.applyQuaternion(this.camera.quaternion).normalize();
  upv.multiplyScalar(event.acceleration.y);

  var leftv = new THREE.Vector3(1, 0, 0);
  leftv.applyQuaternion(this.camera.quaternion).normalize();
  leftv.multiplyScalar(event.acceleration.x);

  var acc = new THREE.Vector3();
  acc.add(direcv).add(upv).add(leftv);

  this.acc.copy(acc);

  this.velocity.x += this.acc.x * this.interval;
  this.velocity.y += this.acc.y * this.interval;
  this.velocity.z += this.acc.z * this.interval;

  this.checkSleeps();
  this.convergence();

  this.position.x += this.velocity.x * this.interval;
  this.position.y += this.velocity.y * this.interval;
  this.position.z += this.velocity.z * this.interval;
};
IMU.prototype.convergence = function () {
  var This = this;
  this.VEC.forEach(function (it) {
    var scale = 0.5 + 0.5 * (1 - Tofu.Utils.clamp(This.sleeps[it] / This.sleepTimes, 0, 1));
    This.velocity[it] *= scale;
  })
};
IMU.prototype.checkSleeps = function () {
  var This = this;
  this.VEC.forEach(function (it) {
    if (This.isSleep(This.acc[it], This.noise)) {
      This.sleeps[it]++;
    } else {
      This.sleeps[it] = 0;
    }
  })
};
IMU.prototype.isSleep = function (value, noise) {
  return Math.abs(value) < noise;
};
