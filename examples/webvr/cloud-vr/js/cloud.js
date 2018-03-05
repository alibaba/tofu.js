function Cloud(){
	this.mesh = new THREE.Group();
	
	// var geom = new THREE.BoxGeometry(0.2,0.2,0.2);
	
	// var mat = new THREE.MeshPhongMaterial({
	// 	color: new THREE.Color(0xffffff),  
	// });
	
	var nBlocs = 20+(Math.random()*10 >> 0);
	var space = Math.PI*2/nBlocs;
	var This = this;

	var mtlLoader1 = new THREE.MTLLoader();
	mtlLoader1.setPath('./model/');
	mtlLoader1.load('cloud.mtl', function(materials) {
		materials.preload();
		var objLoader1 = new THREE.OBJLoader();
		objLoader1.setMaterials(materials);
		objLoader1.setPath('./model/');
		objLoader1.load('cloud.obj', function(object) {

			for (var i=0; i<nBlocs; i++ ){
				var degX = toRAD * randomRange(50, 130),
					degY = space * i + toRAD * randomRange(-5, 5),
					radius = randomRange(3, 3.7),
					x = Math.sin(degX) * Math.cos(degY) * radius,
					y = Math.cos(degX) * radius,
					z = Math.sin(degX) * Math.sin(degY) * radius,
					m = object.clone();
				m.position.x = x;
				m.position.y = y;
				m.position.z = z;
				m.lookAt(new THREE.Vector3(0, 0, 0));
				var s = .1 + Math.random()*.3;
				m.scale.set(s,s,s);
				This.mesh.add(m);
			}
		});
	});
}
var toRAD = Math.PI / 180.0;
function randomRange(LLimit, TLimit) {
    return (Math.random() * (TLimit - LLimit) + LLimit);
};