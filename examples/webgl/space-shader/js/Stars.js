/* global THREE , ATUtil , StarShader, noise */


/*
	Stars
	variable size white points
*/

var Stars= function(){

	var scope = this;
	var NUM_STARS = 10000;
	var RANGE = 1000;
	var noiseScale = 0.002;
	var OPACITY = 0.7;

	this.init = function(parent){

		//custom dots with size determined by noise
		var dotMaterial = new THREE.ShaderMaterial( {
				uniforms: 		THREE.UniformsUtils.clone( StarShader.uniforms ),
				vertexShader:  	StarShader.vertexShader,
				fragmentShader: StarShader.fragmentShader,
				transparent: true,
				depthWrite:false,
				blending: THREE.AdditiveBlending
			});

		dotMaterial.uniforms.texture.value = new THREE.TextureLoader().load( './images/dot.png' );
		var dotGeometry = new THREE.BufferGeometry();

		var position = new Float32Array( NUM_STARS * 3);
		var size = new Float32Array( NUM_STARS );
		var opacity = new Float32Array( NUM_STARS );

		//position dots + set size
		for ( var i = 0; i < NUM_STARS; i ++ ) {

			var pos = ATUtil.randomVector3(RANGE);
			pos.toArray( position, i * 3 );

			//clump size of dots
			var n = (noise.noise3d(pos.x * noiseScale, pos.y * noiseScale, pos.z * noiseScale) + 1 ) /2;
			n = Math.pow(n,3);
			size[ i ] = ATUtil.lerp(n, 2 , 20);
			opacity[ i ] = Math.random() * OPACITY;
		}

		dotGeometry.addAttribute( 'position', new THREE.BufferAttribute( position, 3 ) );
		dotGeometry.addAttribute( 'size', new THREE.BufferAttribute( size, 1 ));
		dotGeometry.addAttribute( 'opacity', new THREE.BufferAttribute( opacity, 1 ));
		scope.dots = new THREE.Points( dotGeometry, dotMaterial );

		scope.holder = new THREE.Object3D();
		scope.holder.add(scope.dots);
		parent.add(scope.holder);


	};

};
