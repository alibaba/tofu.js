 /*
	SuperShader combines common simple color manipulation
	- Glow
	- Vignette
	- Brightness / Contrast
	- Hue / Saturation

	@author felixturner / http://airtight.cc/

 */

THREE.SuperShader = {

	uniforms: {

		//Glow
		'tDiffuse': 	{ type: 't', value: null },
		'glowAmount':       { type: 'f', value: 0.5 },
		'glowSize':        	{ type: 'f', value: 4.0 },
		'resolution':   { type: 'v2', value: new THREE.Vector2( 800.0, 600.0 )  },

		//Vignette
		'vigOffset':   { type: 'f', value: 1.0 }, //amount of vig
		'vigDarkness': { type: 'f', value: 1.0 }, //vig color: -1 = white, 1 = black

		//BrightnessContrast
		'brightness': { type: 'f', value: 0 }, //brightness: -1 to 1 (-1 is solid black, 0 is no change, and 1 is solid white)
		'contrast':   { type: 'f', value: 0 }, //contrast: -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)

		//HueSaturationShader
		'saturation': { type: 'f', value: 0 },

		'rgbShiftAmount': { type: 'f', value: 0.01 },

	},

	vertexShader: [

		'varying vec2 vUv;',

		'void main() {',

			'vUv = uv;',
			'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

		'}'

	].join('\n'),

	fragmentShader: [

		'uniform sampler2D tDiffuse;',

		'uniform float glowSize;',
		'uniform float glowAmount;',
		'uniform vec2 resolution;',

		'uniform float vigOffset;',
		'uniform float vigDarkness;',

		'uniform float brightness;',
		'uniform float contrast;',

		'uniform float hue;',
		'uniform float saturation;',

		'uniform float rgbShiftAmount;',

		'varying vec2 vUv;',

		'const float rgbAngle = 0.1;',

		'void main() {',

			'float h = glowSize / resolution.x;',
			'float v = glowSize / resolution.y;',

			'vec4 sum = vec4( 0.0 );',

			//H Blur
			'sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;',
			'sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;',
			'sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;',
			'sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;',
			'sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;',
			'sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;',
			'sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;',
			'sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;',
			'sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;',

			//V Blur
			'sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;',
			'sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;',
			'sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;',
			'sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;',
			'sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;',
			'sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;',
			'sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;',
			'sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;',
			'sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;',

			//orig color
			'vec4 col = texture2D( tDiffuse, vUv );',

			//rgb shift wat=y from center
			'vec2 uv = ( vUv - vec2( 0.5 ) );',
			'float amt = dot( uv, uv );',
			'vec2 offset = rgbShiftAmount * vec2( cos(rgbAngle), sin(rgbAngle)) * amt;',
			'vec4 cr = texture2D(tDiffuse, vUv + offset);',
			'vec4 cga = texture2D(tDiffuse, vUv);',
			'vec4 cb = texture2D(tDiffuse, vUv - offset);',
			'col = vec4(cr.r, cga.g, cb.b, cga.a);',

			//Add Glow
			'col = min(col + sum * glowAmount, 1.0);',

			//vignette
			'vec2 uv2 = uv * vec2( vigOffset );',
			'col = vec4( mix( col.rgb, vec3( 1.0 - vigDarkness ), dot( uv2, uv2 ) ), col.a );',

			// //BrightnessContrast
			'col.rgb += brightness;',

			'if (contrast > 0.0) {',
				'col.rgb = (col.rgb - 0.5) / (1.0 - contrast) + 0.5;',
			'} else {',
				'col.rgb = (col.rgb - 0.5) * (1.0 + contrast) + 0.5;',
			'}',

			// // saturation
			'float average = (col.r + col.g + col.b) / 3.0;',
			'if (saturation > 0.0) {',
				'col.rgb += (average - col.rgb) * (1.0 - 1.0 / (1.001 - saturation));',
			'} else {',
				'col.rgb += (average - col.rgb) * (-saturation);',
			'}',

			'gl_FragColor = col;',

		'}'

	].join('\n')

};
