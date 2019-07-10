/*
* Airtight Utilities
* v 0.1.2
* @author felixturner / http://airtight.cc/
*/

var ATUtil = {
	randomRange : function(min, max) {
		return min + Math.random() * (max - min);
	},
	randomInt : function(min,max){
		return Math.floor(min + Math.random() * (max - min + 1));
	},
	map : function(value, min1, max1, min2, max2) {
		return ATUtil.lerp( ATUtil.norm(value, min1, max1), min2, max2);
	},
	lerp : function(value, min, max){
		return min + (max -min) * value;
	},
	norm : function(value , min, max){
		return (value - min) / (max - min);
	},
	shuffle : function(o) {
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	},
	randomVector3: function(range){
		return new THREE.Vector3(ATUtil.randomRange(-range,range),ATUtil.randomRange(-range,range),ATUtil.randomRange(-range,range));
	},
	randomVector2: function(range){
		return new THREE.Vector2(ATUtil.randomRange(-range,range),ATUtil.randomRange(-range,range));
	},
	clamp: function(value, min, max){
		return Math.max(Math.min(value,max), min);
	},
	mod: function(n, m) {
		return ((n % m) + m) % m;
	},
	smoothstep: function (value, min, max ) {
	  var x = Math.max(0, Math.min(1, (value-min)/(max-min)));
		return x*x*(3 - 2*x);
	},
	//return a randomly seleted item in an array
	sample: function (ary) {
		return ary[ATUtil.randomInt(0,ary.length-1)];
	},
	//a modulo function that handles negatives numbers 'correctly'
	modWrap: function(n, m) {
		return ((n % m) + m) % m;
	},
	degToRad (degrees) {
      return degrees * Math.PI / 180;
    }

};
