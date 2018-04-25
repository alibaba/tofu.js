THREE.ReflectorNode = function ( mirror ) {

	THREE.TempNode.call( this, 'v4' );

	if ( mirror ) this.setMirror( mirror );

};

THREE.ReflectorNode.prototype = Object.create( THREE.TempNode.prototype );
THREE.ReflectorNode.prototype.constructor = THREE.ReflectorNode;
THREE.ReflectorNode.prototype.nodeType = "Reflector";

THREE.ReflectorNode.prototype.setMirror = function ( mirror ) {

	this.mirror = mirror;

	this.textureMatrix = new THREE.Matrix4Node( this.mirror.material.uniforms.textureMatrix.value );

	this.localPosition = new THREE.PositionNode( THREE.PositionNode.LOCAL );

	this.coord = new THREE.OperatorNode( this.textureMatrix, this.localPosition, THREE.OperatorNode.MUL );
	this.coordResult = new THREE.OperatorNode( null, this.coord, THREE.OperatorNode.ADD );

	this.texture = new THREE.TextureNode( this.mirror.material.uniforms.tDiffuse.value, this.coord, null, true );

};

THREE.ReflectorNode.prototype.generate = function ( builder, output ) {

	var material = builder.material;

	if ( builder.isShader( 'fragment' ) ) {

		this.coordResult.a = this.offset;
		this.texture.coord = this.offset ? this.coordResult : this.coord;

		if ( output === 'sampler2D' ) {

			return this.texture.build( builder, output );

		}

		return builder.format( this.texture.build( builder, this.type ), this.type, output );

	} else {

		console.warn( "THREE.ReflectorNode is not compatible with " + builder.shader + " shader." );

		return builder.format( 'vec4(0.0)', this.type, output );

	}

};

THREE.ReflectorNode.prototype.toJSON = function ( meta ) {

	var data = this.getJSONNode( meta );

	if ( ! data ) {

		data = this.createJSONNode( meta );

		data.mirror = this.mirror.uuid;

		if ( this.offset ) data.offset = this.offset.toJSON( meta ).uuid;

	}

	return data;

};
