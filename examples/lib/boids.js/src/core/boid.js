import { Vector3, Euler } from 'three';
// import CubeWall from './walls/cubewall';

export default function Boid(options = {}) {
  const {
    position = new Vector3(),
    rotation = new Euler(),
    velocity = new Vector3(),
    goal = null,
    worldWall = null,
    neighborhoodRadius = 50,
    maxSpeed = 4,
    maxSteerForce = 0.1,
    enableWalls = false,
  } = options;

  this.position = position;
  this.velocity = velocity;
  this.worldWall = worldWall;
  this.goal = goal;
  this.neighborhoodRadius = neighborhoodRadius;
  this.maxSpeed = maxSpeed;
  this.maxSteerForce = maxSteerForce;
  this.enableWalls = enableWalls;
  this.rotation = rotation;
  this._acceleration = new Vector3();
}

Boid.prototype.setGoal = function(goal) {
  if (goal.isVector3) {
    this.goal = goal;
  }
};

Boid.prototype.setWorldWall = function(wall) {
  if (wall.isWall) {
    this.worldWall = wall;
  }
};

Boid.prototype.update = function(boids) {

  if (this.enableWalls && this.worldWall && this.worldWall.isWall) {

    const acc = this.worldWall.resultant(this.position);
    // console.log(acc);
    this._acceleration.add(acc);

  }

  if (Math.random() > 0.5) {
    this.flock(boids);
  }

  this.move();

  // TODO: use quaternion maybe better
  this.rotation.y = Math.atan2(-this.velocity.z, this.velocity.x);
  this.rotation.z = Math.asin(this.velocity.y / this.velocity.length());
};

Boid.prototype.flock = function(boids) {
  if (this.goal) {
    this._acceleration.add(this.reach(this.goal, 0.005));
  }

  this._acceleration.add(this.alignment(boids));
  this._acceleration.add(this.cohesion(boids));
  this._acceleration.add(this.separation(boids));
};

Boid.prototype.move = function() {
  this.velocity.add(this._acceleration);

  const l = this.velocity.length();

  if (l > this.maxSpeed) {
    this.velocity.divideScalar(l / this.maxSpeed);
  }

  this.position.add(this.velocity);
  this._acceleration.set(0, 0, 0);
};

// TODO: use a Repulse class to implement
Boid.prototype.repulse = function(target) {
  const distance = this.position.distanceTo(target);

  if (distance < 150) {
    const steer = new Vector3();

    steer.subVectors(this.position, target);
    steer.multiplyScalar(0.5 / distance);

    this._acceleration.add(steer);
  }
};

Boid.prototype.reach = function(target, amount) {
  const steer = new Vector3();

  steer.subVectors(target, this.position);
  steer.multiplyScalar(amount);

  return steer;
};

Boid.prototype.alignment = function(boids) {
  let boid = null;
  const velSum = new Vector3();
  let count = 0;

  for (let i = 0, il = boids.length; i < il; i++) {
    if (Math.random() > 0.6) continue;

    boid = boids[i];

    const distance = boid.position.distanceTo(this.position);

    if (distance > 0 && distance <= this.neighborhoodRadius) {
      velSum.add(boid.velocity);
      count++;
    }
  }

  if (count > 0) {
    velSum.divideScalar(count);
    const l = velSum.length();

    if (l > this.maxSteerForce) {
      velSum.divideScalar(l / this.maxSteerForce);
    }
  }
  return velSum;
};

Boid.prototype.cohesion = function(boids) {
  let boid = null;
  let distance = 0;
  const posSum = new Vector3();
  const steer = new Vector3();
  let count = 0;

  for (let i = 0, il = boids.length; i < il; i++) {
    if (Math.random() > 0.6) continue;

    boid = boids[i];
    distance = boid.position.distanceTo(this.position);

    if (distance > 0 && distance <= this.neighborhoodRadius) {
      posSum.add(boid.position);
      count++;
    }
  }

  if (count > 0) {
    posSum.divideScalar(count);
  }

  steer.subVectors(posSum, this.position);

  const l = steer.length();

  if (l > this.maxSteerForce) {
    steer.divideScalar(l / this.maxSteerForce);
  }

  return steer;
};

// this.checkBounds = function () {
//   if (this.position.x > _width) this.position.x = -_width;
//   if (this.position.x < -_width) this.position.x = _width;
//   if (this.position.y > _height) this.position.y = -_height;
//   if (this.position.y < -_height) this.position.y = _height;
//   if (this.position.z > _depth) this.position.z = -_depth;
//   if (this.position.z < -_depth) this.position.z = _depth;
// }

Boid.prototype.cohesion = function(boids) {

  let boid = null;
  let distance = 0;
  const posSum = new Vector3();
  const steer = new Vector3();
  let count = 0;

  for (let i = 0, il = boids.length; i < il; i++) {
    if (Math.random() > 0.6) continue;

    boid = boids[i];
    distance = boid.position.distanceTo(this.position);

    if (distance > 0 && distance <= this.neighborhoodRadius) {
      posSum.add(boid.position);
      count++;
    }
  }

  if (count > 0) {
    posSum.divideScalar(count);
  }

  steer.subVectors(posSum, this.position);

  const l = steer.length();

  if (l > this.maxSteerForce) {
    steer.divideScalar(l / this.maxSteerForce);
  }

  return steer;
};

Boid.prototype.separation = function(boids) {
  let boid = null;
  let distance = 0;
  const posSum = new Vector3();
  const repulse = new Vector3();

  for (let i = 0, il = boids.length; i < il; i++) {

    if (Math.random() > 0.6) continue;

    boid = boids[i];
    distance = boid.position.distanceTo(this.position);

    if (distance > 0 && distance <= this.neighborhoodRadius) {
      repulse.subVectors(this.position, boid.position);
      repulse.normalize();
      repulse.divideScalar(distance);
      posSum.add(repulse);
    }
  }

  return posSum;
};
