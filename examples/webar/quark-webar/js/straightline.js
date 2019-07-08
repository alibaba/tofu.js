function StraightLine( points, divisions ) {

	THREE.Curve.call( this );

	this.points = points;
  this.divisions = divisions || 5;
  this.totalLength = 0;
  this.lengths = [];
  
  this.needUpdateLine = true;
}

StraightLine.prototype = Object.create( THREE.Curve.prototype );
StraightLine.prototype.constructor = StraightLine;

StraightLine.prototype.cacheLen = function() {
  var len = 0;
  var last = this.points.length - 1;
  for (var i = 0; i < last; i++) {
    var a = this.points[i];
    var b = this.points[i + 1];
    var x = b.x - a.x;
    var y = b.y - a.y;
    var z = b.z - a.z;
    a.distanceInLines = len;
    len += Math.sqrt( x * x + y * y + z * z );
    b.distanceInLines = len;
  }
  this.totalLength = len;
};

StraightLine.prototype.getPointByDistance = function(targetLenght) {
  var i = 0;
  var length = this.points.length;
  for (var i = 1; i < length; i++) {
    if (targetLenght <= this.points[i].distanceInLines) {
      var a = this.points[i - 1];
      var b = this.points[i];
      var x = b.x - a.x;
      var y = b.y - a.y;
      var z = b.z - a.z;
      var distance = targetLenght - a.distanceInLines;
      var point = a.clone().add(new THREE.Vector3(x, y, z).normalize().multiplyScalar(distance));
      point.distanceInLines = targetLenght;
      return point;
    }
  }
};

StraightLine.prototype.getPoint = function ( t ) {
  if (this.needUpdateLine) this.cacheLen();
  var targetLenght = t * this.totalLength;

	return this.getPointByDistance(targetLenght);
};
