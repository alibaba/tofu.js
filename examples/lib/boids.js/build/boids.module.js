import { Vector3, Euler, Box3 } from 'three';

// import CubeWall from './walls/cubewall';

function Boid() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$position = options.position,
      position = _options$position === undefined ? new Vector3() : _options$position,
      _options$rotation = options.rotation,
      rotation = _options$rotation === undefined ? new Euler() : _options$rotation,
      _options$velocity = options.velocity,
      velocity = _options$velocity === undefined ? new Vector3() : _options$velocity,
      _options$goal = options.goal,
      goal = _options$goal === undefined ? null : _options$goal,
      _options$worldWall = options.worldWall,
      worldWall = _options$worldWall === undefined ? null : _options$worldWall,
      _options$neighborhood = options.neighborhoodRadius,
      neighborhoodRadius = _options$neighborhood === undefined ? 50 : _options$neighborhood,
      _options$maxSpeed = options.maxSpeed,
      maxSpeed = _options$maxSpeed === undefined ? 4 : _options$maxSpeed,
      _options$maxSteerForc = options.maxSteerForce,
      maxSteerForce = _options$maxSteerForc === undefined ? 0.1 : _options$maxSteerForc,
      _options$enableWalls = options.enableWalls,
      enableWalls = _options$enableWalls === undefined ? false : _options$enableWalls;


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

Boid.prototype.setGoal = function (goal) {
  if (goal.isVector3) {
    this.goal = goal;
  }
};

Boid.prototype.setWorldWall = function (wall) {
  if (wall.isWall) {
    this.worldWall = wall;
  }
};

Boid.prototype.update = function (boids) {

  if (this.enableWalls && this.worldWall && this.worldWall.isWall) {

    var acc = this.worldWall.resultant(this.position);
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

Boid.prototype.flock = function (boids) {
  if (this.goal) {
    this._acceleration.add(this.reach(this.goal, 0.005));
  }

  this._acceleration.add(this.alignment(boids));
  this._acceleration.add(this.cohesion(boids));
  this._acceleration.add(this.separation(boids));
};

Boid.prototype.move = function () {
  this.velocity.add(this._acceleration);

  var l = this.velocity.length();

  if (l > this.maxSpeed) {
    this.velocity.divideScalar(l / this.maxSpeed);
  }

  this.position.add(this.velocity);
  this._acceleration.set(0, 0, 0);
};

// TODO: use a Repulse class to implement
Boid.prototype.repulse = function (target) {
  var distance = this.position.distanceTo(target);

  if (distance < 150) {
    var steer = new Vector3();

    steer.subVectors(this.position, target);
    steer.multiplyScalar(0.5 / distance);

    this._acceleration.add(steer);
  }
};

Boid.prototype.reach = function (target, amount) {
  var steer = new Vector3();

  steer.subVectors(target, this.position);
  steer.multiplyScalar(amount);

  return steer;
};

Boid.prototype.alignment = function (boids) {
  var boid = null;
  var velSum = new Vector3();
  var count = 0;

  for (var i = 0, il = boids.length; i < il; i++) {
    if (Math.random() > 0.6) continue;

    boid = boids[i];

    var distance = boid.position.distanceTo(this.position);

    if (distance > 0 && distance <= this.neighborhoodRadius) {
      velSum.add(boid.velocity);
      count++;
    }
  }

  if (count > 0) {
    velSum.divideScalar(count);
    var l = velSum.length();

    if (l > this.maxSteerForce) {
      velSum.divideScalar(l / this.maxSteerForce);
    }
  }
  return velSum;
};

Boid.prototype.cohesion = function (boids) {
  var boid = null;
  var distance = 0;
  var posSum = new Vector3();
  var steer = new Vector3();
  var count = 0;

  for (var i = 0, il = boids.length; i < il; i++) {
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

  var l = steer.length();

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

Boid.prototype.cohesion = function (boids) {

  var boid = null;
  var distance = 0;
  var posSum = new Vector3();
  var steer = new Vector3();
  var count = 0;

  for (var i = 0, il = boids.length; i < il; i++) {
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

  var l = steer.length();

  if (l > this.maxSteerForce) {
    steer.divideScalar(l / this.maxSteerForce);
  }

  return steer;
};

Boid.prototype.separation = function (boids) {
  var boid = null;
  var distance = 0;
  var posSum = new Vector3();
  var repulse = new Vector3();

  for (var i = 0, il = boids.length; i < il; i++) {

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

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Wall = function Wall() {
  classCallCheck(this, Wall);

  this.isWall = true;
};

var CubeWall = function (_Wall) {
  inherits(CubeWall, _Wall);

  function CubeWall(min, max) {
    classCallCheck(this, CubeWall);

    var _this = possibleConstructorReturn(this, (CubeWall.__proto__ || Object.getPrototypeOf(CubeWall)).call(this));

    _this.bounding = new Box3(min, max);

    _this._CMP = ['x', 'y', 'z'];
    return _this;
  }

  createClass(CubeWall, [{
    key: 'resultant',
    value: function resultant(position) {
      var acceleration = new Vector3();
      var vector = new Vector3();

      for (var i = 0; i < 3; i++) {
        var cmp = this._CMP[i];
        vector.copy(position);
        vector[cmp] = this.bounding.min[cmp];
        acceleration.add(this.avoid(position, vector).multiplyScalar(5));
        vector.copy(position);
        vector[cmp] = this.bounding.max[cmp];
        acceleration.add(this.avoid(position, vector).multiplyScalar(5));
      }

      return acceleration;
    }
  }, {
    key: 'avoid',
    value: function avoid(position, target) {
      var steer = new Vector3();

      steer.copy(position);
      steer.sub(target);

      steer.multiplyScalar(1 / steer.lengthSq());

      return steer;
    }
  }]);
  return CubeWall;
}(Wall);

export { Boid, CubeWall };
