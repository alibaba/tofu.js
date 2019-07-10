/* global THREE, ATUtil , noise, events, BOUNDS */

/**

	Confetti are rects that fluttter in the dark

**/


var Confetti = function(){

	var numConfetti = 150;
	var holder;

	this.init = function(parent){

		holder = new THREE.Group();

		for(var i = 0; i < numConfetti; i++) {

			var s = new Confetto();
			var pos = ATUtil.randomVector3(1000);
			s.init(holder, pos.x);
			s.mesh.position.copy(pos);
			s.mesh.rotation.setFromVector3(ATUtil.randomVector3(1));

			//clump sizes of dots
			var noiseScale = 0.02;
			var n = noise.noise3d(pos.x * noiseScale, pos.y * noiseScale, pos.z * noiseScale);
			n = Math.pow(n,3);
			var scl = ATUtil.lerp(n, 0.1 , 1.5);
			s.mesh.scale.set(scl,scl,scl);

		}
		parent.add(holder);

	};

};


//////////////////////////////////
//Confetto OBJECT
//////////////////////////////////

var Confetto = function(){

	var scope = this;

	this.init = function(parent, posx){

		var size = 60;

		//color based on x pos
		var col = new THREE.Color();
		var sat = ATUtil.randomRange(0.6,1);
		var lightness = ATUtil.randomRange(0.2,0.6);
		col.setHSL( ATUtil.map(posx,-BOUNDS,BOUNDS,0,1), sat, lightness);

		var meshMaterial = new THREE.MeshPhongMaterial( {
			side: THREE.DoubleSide,
			color: col.getHex(),
			shininess: 30,
			specular: 0x50473b,
		} );

		this.meshGeom = new THREE.PlaneGeometry( size, size, 1, 1);
		this.mesh = new THREE.Mesh( this.meshGeom, meshMaterial );
		parent.add(this.mesh);

		events.on('update',this.update);

	};

	this.update = function(){
		scope.mesh.rotation.x += 0.02;
		scope.mesh.rotation.y += 0.01;
		scope.mesh.rotation.z += 0.01;

		//slow drift
		scope.mesh.position.y += 0.7;

		if (scope.mesh.position.y > 1000) scope.mesh.position.y = -1000;

	};

};
