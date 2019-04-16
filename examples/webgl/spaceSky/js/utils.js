
var Utils = {
  randomVec3: function(range) {
    return new THREE.Vector3(Tofu.Utils.random(-range, range), Tofu.Utils.random(-range, range), Tofu.Utils.random(-range, range))
  }
};
