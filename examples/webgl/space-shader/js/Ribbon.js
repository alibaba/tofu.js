/* global THREE, ATUtil , noise, noiseTime , events */

/*
	RIBBON

	Move Ribbons using joints
	phong material

	@author felixturner / http://airtight.cc/

*/

var RIBBON_LEN = 400;//number of spine points

var Ribbon = function(){

	var up = new THREE.Vector3(1,0,0);
	var direction = new THREE.Vector3();
	var normal = new THREE.Vector3();

	var arm1 = new THREE.Vector3();
	var arm2 = new THREE.Vector3();
	var arm3 = new THREE.Vector3();

	var arm1T = new THREE.Vector3();
	var arm2T = new THREE.Vector3();
	var arm3T = new THREE.Vector3();

	var xAxis = new THREE.Vector3(1,0,0);
	var yAxis = new THREE.Vector3(0,1,0);
	var zAxis = new THREE.Vector3(0,0,1);

	var groupHolder;
	var noiseId;
	var scope = this;

	this.init = function(holder,id){

		//noiseId for noise calcs
		noiseId = id/300;
		groupHolder = new THREE.Group();
		holder.add(groupHolder);

		//some thick
		this.ribbonWidth = ATUtil.randomRange(4,10);
		if (Math.random() < 0.2){
			this.ribbonWidth = 20;
		}

		this.color = new THREE.Color();
		this.hue = Math.random();
		this.color.setHSL(this.hue,0.4,0.9);

		//head is the thing that moves, prev follows behind
		this.head = new THREE.Vector3();
		this.prev = new THREE.Vector3();

		//ADD MESH
		this.meshGeom = this.createMeshGeom();

		this.meshMaterial = new THREE.MeshPhongMaterial( {
			side: THREE.DoubleSide,
			vertexColors:THREE.FaceColors,
			color: 0xFFFFFF,
			shininess: 30,
			specular: 0x50473b,
		} );

		this.mesh = new THREE.Mesh( this.meshGeom, this.meshMaterial );
		groupHolder.add(this.mesh);

		this.mesh.frustumCulled = false;

		//create arm vectors
		var armLenFac = 1.7;
		arm1 = new THREE.Vector3(300 * armLenFac,0,0);
		arm2 = new THREE.Vector3(200 * armLenFac,0,0);
		arm3 = new THREE.Vector3(100 * armLenFac,0,0);

		this.reset();

		events.on('update',this.update);

	};

	this.createMeshGeom = function(){

		//make geometry, faces & colors for a ribbon
		var i;
		var geom = new THREE.Geometry();
		geom.vertexColors = [];

		//create verts + colors
		for ( i = 0; i < RIBBON_LEN; i ++ ) {
			geom.vertices.push(new THREE.Vector3());
			geom.vertices.push(new THREE.Vector3());
			geom.vertexColors.push(new THREE.Color());
			geom.vertexColors.push(new THREE.Color());
		}

		//create faces

		for ( i = 0; i < RIBBON_LEN-1; i ++ ) {
			geom.faces.push( new THREE.Face3(i*2,i*2+1,i*2+2));
			geom.faces.push( new THREE.Face3(i*2+1,i*2+3,i*2+2));
		}
		return geom;
	};

	this.reset = function(){

		var i;

		//reset prev position
		this.prev.copy(this.head);

		//reset mesh geom
		for ( i = 0; i < RIBBON_LEN; i ++ ) {
			this.meshGeom.vertices[i*2].copy(this.head);
			this.meshGeom.vertices[i*2+1].copy(this.head);
		}

		//init colors for this ribbon
		//hue is set by noiseId
		var hue1 = (noiseId + Math.random()*0.01) % 2;
		var hue2 = (noiseId + Math.random()*0.01) % 2;

		if (Math.random() < 0.1)  {
			hue1 = Math.random();
		}
		if (Math.random() < 0.1)  {
			hue2 = Math.random();
		}

		var sat = ATUtil.randomRange(0.6,1);
		var lightness = ATUtil.randomRange(0.2,0.6);

		var col = new THREE.Color();

		for ( i = 0; i < RIBBON_LEN-1; i ++ ) {
			//add lightness gradient based on spine position
			col.setHSL( ATUtil.lerp(i/RIBBON_LEN,hue1,hue2), sat, lightness);
			this.meshGeom.faces[i*2].color.copy(col);
			this.meshGeom.faces[i*2+1].color.copy(col);
		}

		this.meshGeom.verticesNeedUpdate = true;
		this.meshGeom.colorsNeedUpdate = true;

	};

	function getNoiseAngle(zOffset){
		return noise.noise3d( noiseTime, noiseId, zOffset ) * Math.PI*2;
	}

	this.update = function(){

		scope.prev.copy(scope.head);

		//MOVE JOINTS
		arm1T.copy(arm1);
		arm2T.copy(arm2);
		arm3T.copy(arm3);

		arm1T.applyAxisAngle( zAxis, getNoiseAngle(0) );
		arm1T.applyAxisAngle( yAxis, getNoiseAngle(20));

		arm2T.applyAxisAngle( zAxis, getNoiseAngle(50) );
		arm2T.applyAxisAngle( xAxis, getNoiseAngle(70) );

		arm3T.applyAxisAngle( xAxis, getNoiseAngle(100));
		arm3T.applyAxisAngle( yAxis, getNoiseAngle(150) );

		//MOVE HEAD
		scope.head.copy(arm1T).add(arm2T).add(arm3T);

		//calc new L + R edge positions from direction between head and prev
		direction.subVectors(scope.head,scope.prev).normalize();
		normal.crossVectors( direction, up ).normalize();
		normal.multiplyScalar(scope.ribbonWidth);

		//shift each 2 verts down one posn
		//e.g. copy verts (0,1) -> (2,3)
		for ( var i = RIBBON_LEN - 1; i > 0; i -- ) {
			scope.meshGeom.vertices[i*2].copy(scope.meshGeom.vertices[(i-1)*2]);
			scope.meshGeom.vertices[i*2+1].copy(scope.meshGeom.vertices[(i-1)*2+1]);
		}

		//populate 1st 2 verts with left and right normalHelper
		scope.meshGeom.vertices[0].copy(scope.head).add(normal);
		scope.meshGeom.vertices[1].copy(scope.head).sub(normal);

		scope.meshGeom.verticesNeedUpdate = true;
		scope.meshGeom.computeFaceNormals();
		scope.meshGeom.computeVertexNormals();

	};

};
