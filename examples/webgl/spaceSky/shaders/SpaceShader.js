
/**

	Nice color wash for a sky. Fade btwn 2 color gradients with noise brightness.
	Additively blended on top of scene.

	@author felixturner / http://airtight.cc/

**/

THREE.SpaceShader = {

	uniforms: {

		'tDiffuse': { value: null },
		'time': 		{ value: 0 },
		'opacity':     	{ value: 0.05 },

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
		'uniform float time;',
		'uniform float opacity;',

		'varying vec2 vUv;',

		'#define PI 3.14159265359',

		'mat2 rotate2d(float _angle){',
			'return mat2(cos(_angle),-sin(_angle),',
				'sin(_angle),cos(_angle));',
		'}',

		'float hash( vec2 p )',
		'{',
			'float h = dot(p,vec2(127.1,311.7));',

			'return -1.0 + 2.0*fract(sin(h)*43758.5453123);',
		'}',

		//cheap value noise https://www.shadertoy.com/view/lsf3WH
		'float noise( in vec2 p )',
		'{',
			'vec2 i = floor( p );',
			'vec2 f = fract( p );',

			'vec2 u = f*f*(3.0-2.0*f);',

			'return mix( mix( hash( i + vec2(0.0,0.0) ),',
			' hash( i + vec2(1.0,0.0) ), u.x),',
			'mix( hash( i + vec2(0.0,1.0) ),',
			' hash( i + vec2(1.0,1.0) ), u.x), u.y);',
		'}',

		'void main( )',
		'{',

			'vec2 uv = vUv;',
			'vec3 orig = texture2D(tDiffuse, uv).rgb;',

			//rotate uv space
			'uv -= 0.5;',
			'uv = rotate2d( fract(time/40.0)*2.0*PI ) * uv;',
			'uv += 0.5;',

			//4 corner grad blue/pink
			'vec3 col1 = vec3(uv,1.0);',

			//4 corner grad pink/orang
			'vec3 col2 = vec3(1,uv);',

			//mix over time
			'float t = abs(2.0 * fract(time/10.0) - 1.0);',
			'vec3 col = mix(col1,col2,t);',

			//noise clouds additive blend
			//f returns in -1 - 1 range'
			//simple 1 octave
			'float tn = time/5.0;',
			'vec2 uvn = uv * 2.; // noise scale',
			'float f  = noise( uvn + tn);',
			'f *= 0.8;',
			'col += f;',
			//darker
			'col -= 0.4;',

			'gl_FragColor = vec4(orig + col * opacity, 1.0);',

		'}'

	].join( '\n' )

};
