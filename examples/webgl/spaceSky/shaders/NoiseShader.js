/*
	Noise Shader
 	Add random B+W pixels on top

 	@author felixturner / http://airtight.cc/

 */

THREE.NoiseShader = {

	uniforms: {

		'tDiffuse': { value: null },
		'amount':     { value: 1 },
		'speed':     { value: 1 },
		'time':     { value: 0 }

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
		'uniform float amount;',
		'uniform float speed;',
		'uniform float time;',

		'varying vec2 vUv;',


		'float random(vec2 n, float offset ){',
			'return .5 - fract(sin(dot(n.xy + vec2( offset, 0. ), vec2(12.9898, 78.233)))* 43758.5453);',
		'}',

		'void main() {',

			'vec3 color = texture2D(tDiffuse, vUv).rgb;',
			'color += vec3( amount * random( vUv, .0001 * speed * time ) );',
			'gl_FragColor = vec4(color,1.0);',

		'}'

	].join( '\n' )

};
