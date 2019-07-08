var loader = new THREE.TextureLoader();
var smallDot = loader.load('data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%3Csvg%20width%3D%22200px%22%20height%3D%22200px%22%20viewBox%3D%220%200%20200%20200%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%20%20%3Crect%20id%3D%22%E7%9F%A9%E5%BD%A2%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%2210%22%20fill%3D%22%23FFFFFF%22%20x%3D%22-2%22%20y%3D%22-2%22%20width%3D%224%22%20height%3D%224%22%20stroke-opacity%3D%220.18%22%20transform%3D%22scale(10)%20translate(10%2C%2010)%20rotate(45)%22%3E%3C%2Frect%3E%0A%3C%2Fsvg%3E');
var bigDot = loader.load('data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%3Csvg%20width%3D%22302px%22%20height%3D%22302px%22%20viewBox%3D%220%200%20302%20302%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M15.0755166%2C-2.84217094e-14%20L30.1510331%2C15.0755166%20L15.0755166%2C30.1510331%20L0%2C15.0755166%20L15.0755166%2C-2.84217094e-14%20Z%20M6.10940259%2C15.0755166%20L15.0755166%2C24.0416306%20L24.0416306%2C15.0755166%20L15.0755166%2C6.10940259%20L6.10940259%2C15.0755166%20Z%22%20id%3D%22%E5%BD%A2%E7%8A%B6%22%20fill-opacity%3D%220.18%22%20fill%3D%22%23FFFFFF%22%20fill-rule%3D%22nonzero%22%20transform%3D%22scale(10)%22%3E%3C%2Fpath%3E%0A%20%20%20%20%3Cpolygon%20id%3D%22%E7%9F%A9%E5%BD%A2%E5%A4%8D%E5%88%B6-2%22%20fill%3D%22%23FFFFFF%22%20points%3D%2215.0755166%209.9237386%2020.2272946%2015.0755166%2015.0755166%2020.2272946%209.9237386%2015.0755166%22%20transform%3D%22scale(10)%22%3E%3C%2Fpolygon%3E%0A%3C%2Fsvg%3E');

function BlinkDot(big, position) {
  var size = big ? 24 : 16;
  this.geometry = new THREE.PlaneBufferGeometry( size, size );
  this.material = new THREE.MeshBasicMaterial( { map: big ? bigDot : smallDot, side: THREE.DoubleSide, transparent: true, opacity: 1 } );
  this.mesh = new THREE.Mesh( this.geometry, this.material );
  var scale = Math.random() * 0.6 + 0.4;
  this.mesh.scale.set(scale, scale, scale);
  this.locked = false;
  this.reset(position);
}

BlinkDot.prototype.reset = function(position) {
  this.alive = true;
  this.delay = Math.random() * 8000;
  this.fadeInTime = 500 + Math.random() * 1000;
  this.fadeInTimeCut = this.fadeInTime;
  this.fadeOutTime = 500 + Math.random() * 1000;
  this.fadeOutTimeCut = this.fadeOutTime;
  this.idelTime = 1000 + Math.random() * 4000;
  this.mesh.position.x = position.x;
  this.mesh.position.y = position.y;
};

BlinkDot.prototype.update = function(snippet) {
  if (this.delay > 0) {
    this.delay -= snippet;
    this.material.opacity = 0;
  } else if (this.fadeInTimeCut > 0) {
    this.fadeInTimeCut -= snippet;
    var rate = 1 - (this.fadeInTimeCut / this.fadeInTime);
    this.material.opacity = rate * rate;
  } else if (this.idelTime > 0) {
    this.idelTime -= snippet;
    this.material.opacity = 1;
  } else if (this.locked) {
    this.material.opacity = 1;
  } else if (this.fadeOutTimeCut > 0) {
    this.fadeOutTimeCut -= snippet;
    var rate = this.fadeOutTimeCut / this.fadeOutTime;
    this.material.opacity = rate * rate;
  } else {
    this.alive = false;
    this.material.opacity = 0;
  }
}
