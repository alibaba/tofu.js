/**
 	PointCloud material shader.
 	Draw dots from a texture with randomized modulating opacity.

 	@author felixturner / http://airtight.cc/

 */

StarShader = {

  uniforms: {
    'texture':   { type: 't'},
  },
  
  attributes: {
    'size': { type: 'f', value: []},
    'opacity': { type: 'f', value: []}
  },
  
  vertexShader: [
  
      'attribute float size;',
      'attribute float opacity;',
  
      'varying float vOpacity;',
  
      'void main() {',
  
        'vOpacity = opacity;',
  
        'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
        'gl_PointSize = size * ( 300.0 / length( mvPosition.xyz ) );',
        'gl_Position = projectionMatrix * mvPosition;',
  
      '}'
  
  ].join('\n'),
  
  fragmentShader: [
  
      'uniform sampler2D texture;',
      'varying float vOpacity;',
  
      'void main() {',
  
        'gl_FragColor = texture2D( texture, gl_PointCoord );',
        'gl_FragColor.a *= vOpacity;',
  
      '}'
  
    ].join('\n')
  
  };
