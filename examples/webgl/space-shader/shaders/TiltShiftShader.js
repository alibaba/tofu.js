/**

 	Custom TiltShift

 	Added H blur
 	Added amount + brightness uniforms

 	@author felixturner / airtight.cc
 	@author alteredq / http://alteredqualia.com/

 */

THREE.CustomTiltShiftShader = {

	uniforms: {

		'tDiffuse': 	{ type: 't', value: null },
		'focusPos': 	{ type: 'f', value: 0.35 }, 	// focus Y position 0 = bottom, 1 = top
		'range': 		{ type: 'f', value: 0.5 }, 		// distance to fade between none and full blur
		'offset': 		{ type: 'f', value: 0.05 }, 	// blur distance
		'strength': 	{ type: 'f', value: 0.5 } ,		// 0 = passthru, 1 = full

	},

	vertexShader: [

		'varying vec2 vUv;',

		'void main() {',

			'vUv = uv;',
			'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

		'}'

	].join( '\n' ),

	fragmentShader: [

		'uniform sampler2D tDiffuse;',
		'uniform float focusPos;',
		'uniform float offset;',
		'uniform float range;',
		'uniform float strength;',

		'varying vec2 vUv;',

		'void main() {',

			'vec4 orig = texture2D(tDiffuse, vUv);',

			'vec2 uv = vUv;',

			'float tiltAmt = 1.0 - smoothstep(focusPos - range,focusPos,uv.y) + smoothstep(focusPos,focusPos + range,uv.y) ;',

			//blur image
			'vec4 blurImg = vec4( 0.0 );',

			'float offset9 = offset * 0.9;',
			'float offset7 = offset * 0.7;',
			'float offset4 = offset * 0.4;',

			'blurImg += texture2D( tDiffuse, vUv.xy );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.0,   0.4  )  * offset );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.15,  0.37 )  * offset );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.29,  0.29 )  * offset );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.37,  0.15 )  * offset );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.40,  0.0  )  * offset );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.37, -0.15 )  * offset );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.29, -0.29 )  * offset );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.15, -0.37 )  * offset );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.0,  -0.4  )  * offset );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.15,  0.37 )  * offset );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.29,  0.29 )  * offset );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.37,  0.15 )  * offset );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.4,   0.0  )  * offset );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.37, -0.15 )  * offset );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.29, -0.29 )  * offset );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.15, -0.37 )  * offset );',

			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.15,  0.37 )  * offset9 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.37,  0.15 )  * offset9 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.37, -0.15 )  * offset9 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.15, -0.37 )  * offset9 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.15,  0.37 )  * offset9 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.37,  0.15 )  * offset9 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.37, -0.15 )  * offset9 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.15, -0.37 )  * offset9 );',

			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.29,  0.29 )  * offset7 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.40,  0.0  )  * offset7 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.29, -0.29 )  * offset7 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.0,  -0.4  )  * offset7 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.29,  0.29 )  * offset7 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.4,   0.0  )  * offset7 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.29, -0.29 )  * offset7 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.0,   0.4  )  * offset7 );',

			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.29,  0.29 )  * offset4 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.4,   0.0  )  * offset4 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.29, -0.29 )  * offset4 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.0,  -0.4  )  * offset4 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.29,  0.29 )  * offset4 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.4,   0.0  )  * offset4 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2( -0.29, -0.29 )  * offset4 );',
			'blurImg += texture2D( tDiffuse, vUv.xy + vec2(  0.0,   0.4  )  * offset4 );',

			'blurImg = blurImg / 41.0;',

			'gl_FragColor = mix(orig, blurImg, tiltAmt * strength);',

		'}'

	].join( '\n' )

};
