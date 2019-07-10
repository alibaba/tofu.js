/* global THREE, SimplexNoise, Stats, Events, dat, window, document, Power2,
requestAnimationFrame, Stars , Confetti , Ribbon , ATUtil , TweenMax , RIBBON_LEN */


/*

	Procedural Ribbons

	(c) @felixturner / www.airtight.cc

*/


var seed = Math.random()* 10000;

//some nice seeds
//seed = 6702.011744602003;
//seed = 8371.247929504061;
//seed = 74.20897096757307
//seed = 7331.417626086938;
//seed = 1666.0390875061482;

console.log('RANDOM SEED:', seed);
Math.seedrandom(seed);

var noise = new SimplexNoise();
var events = new Events();
var BOUNDS = 1000; //bounded space goes from - BOUNDS to +BOUNDS
var ribbons = [];
var ribbonGrpIds = [0,0,0,0,1,1,1,2,3,4]; //GOOD
var RIBBON_COUNT = ribbonGrpIds.length;
var tiltSpeed = 0.0002;
var rotRng = Math.PI ;
var noiseTime = 0;//Math.random()*1000;
var camera, scene, renderer;
var stats, controls;
var lightHolder;
var lights = [];
var worldHolder;
var boundsMesh;
var boundsHolder;
var ribbonHolder;
var ppo = {};
var composer;
var guiParams;
var tiltTime = 0;
var outerHolder;
var isDev = false;

function init() {

	isDev = window.location.href.indexOf('?dev') > -1;

	noiseTime = Math.random()*1000;

	initGUI();

	//INIT THREEJS WORLD
	camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 300;
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({ antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.querySelector('.webgl').appendChild( renderer.domElement );

	outerHolder = new THREE.Group();
	scene.add(outerHolder);

	worldHolder = new THREE.Group();
	outerHolder.add(worldHolder);

	//STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	if (isDev) document.querySelector('.webgl').appendChild( stats.domElement );

	//CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.minDistance = 250;
	controls.maxDistance = 1800;

	//CREATE RIBBONS
	ribbonHolder = new THREE.Group();
	worldHolder.add(ribbonHolder);

	for (var i = 0; i < RIBBON_COUNT; i++) {
		var r = new Ribbon();
		r.init(ribbonHolder,ribbonGrpIds[i]*100 + i + noiseTime);
		ribbons.push(r);
	}

	//do RIBBON_LEN updates to create init ribbons
	for ( i = 0; i < RIBBON_LEN; i ++ ) {
		ribbons.forEach(function(ribbon){
			ribbon.update();
		});
		noiseTime += guiParams.ribbonSpeed;
	}

	//ADD STARS
	var stars = new Stars();
	stars.init(worldHolder);

	//ADD CONFETTI
	var confetti = new Confetti();
	confetti.init(worldHolder);

	//ADD BOUNDS BOX
	boundsHolder = new THREE.Group();
	worldHolder.add( boundsHolder );
	var boundsMaterial = new THREE.MeshBasicMaterial( { color: 0xAA0000 , wireframe: true} );
	var boundsGeom  = new THREE.BoxGeometry( BOUNDS*2, BOUNDS*2, BOUNDS*2 );
	boundsMesh = new THREE.Mesh( boundsGeom, boundsMaterial );
	boundsHolder.add( boundsMesh );
	var gridHelper = new THREE.GridHelper( 1000, 10 , 0x00AA00, 0x888888);
	boundsHolder.add( gridHelper );

	addLights();

	initPostprocessing();

	window.addEventListener( 'resize', onResize, false );
	onResize();
	onParamsChange();

	setInterval(doJump,8000);

	//fadeup
	TweenMax.from(ppo.superPass.uniforms.brightness, 2, {value:-1});
	// TweenMax.to(document.querySelector('.over'),2,{opacity:1, delay: 1});

	// document.querySelector('.big-btn').onclick = function(){
	// 	TweenMax.to(document.querySelector('.over'),0.5,{autoAlpha:0, delay: 0});
	// };

	animate();
}

function initPostprocessing() {

	//create passes
	ppo.renderPass = new THREE.RenderPass( scene, camera );
	ppo.skyPass = new THREE.ShaderPass(THREE.SpaceShader);
	//FXAA smooths out jaggies
	ppo.fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );
	ppo.rgbPass = new THREE.ShaderPass( THREE.CustomRGBShiftShader );
	//SuperPass adds glow and vignette
	ppo.superPass = new THREE.ShaderPass( THREE.SuperShader );
	ppo.noisePass = new THREE.ShaderPass( THREE.NoiseShader );
	ppo.tiltShiftPass = new THREE.ShaderPass( THREE.CustomTiltShiftShader );

	//Add passes to composer
	composer = new THREE.EffectComposer( renderer );

	composer.addPass( ppo.renderPass );
	composer.addPass( ppo.skyPass );
	composer.addPass( ppo.fxaaPass );
	composer.addPass( ppo.tiltShiftPass );
	composer.addPass( ppo.superPass );
	composer.addPass( ppo.rgbPass );
	composer.addPass( ppo.noisePass );

	ppo.noisePass.renderToScreen = true;

	onResize();

}

function addLights(){

	//LIGHTS
	var ambientLight = new THREE.AmbientLight( 0x333333 );
	scene.add( ambientLight );

	lights[ 0 ] = new THREE.PointLight( 0xffffff, 2, 700 ); //origin light
	lights[ 0 ].position.set( 0, 0, 0 );

	lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 1000 ); //cam light
	lights[ 1 ].position.set( 0, 0,  1000 );

	lights[ 2 ] = new THREE.DirectionalLight( 0xffffff, 1 ); //front light
	lights[ 2 ].position.set( 0, 0, 1 );

	lights[ 3 ] = new THREE.DirectionalLight( 0xffffff, 1 ); //up light
	lights[ 3 ].position.set( 0, 1, 0 );

	lightHolder = new THREE.Object3D();
	worldHolder.add(lightHolder);

	lights.forEach(function(light){
		lightHolder.add( light );
	});

}

function initGUI(){

	guiParams = {

		animate : true,
		autoRotate: true,
		showBounds: false,
		wireframe: false,
		ribbonSpeed: 0.001,
		usePostProc : true,

		//tiltshift
		tiltPos:	0.5,
		tiltRange:	0.5,
		tiltStrength: 0.9,
		tiltOffset: 0.02,

		//super
		glowAmount: 0.3,
		glowSize:2,
		vigOffset:1.3,
		saturation:0,
		contrast:0.0,
		brightness:0,
		rgbShiftAmount: 0.02,

		//noise
		noiseAmount: 0.08,
		noiseSpeed: 0.5,
		skyOpacity: 0.15
	};

	//INIT DAT GUI
	var gui = new dat.GUI({autoPlace: isDev});

	var sceneFolder = gui.addFolder('Scene');

	sceneFolder.add(guiParams, 'animate');
	sceneFolder.add(guiParams, 'autoRotate').onChange( onParamsChange );
	sceneFolder.add(guiParams, 'showBounds').onChange( onParamsChange );
	sceneFolder.add(guiParams, 'wireframe').onChange( onParamsChange );
	sceneFolder.add(guiParams, 'ribbonSpeed', 0, 0.01, 0.001);

	var ppoFolder = gui.addFolder('PPO');

	ppoFolder.add(guiParams, 'usePostProc');

	ppoFolder.add( guiParams, 'tiltPos', 0, 1, 0.5 ).onChange( onParamsChange );
	ppoFolder.add( guiParams, 'tiltRange', 0, 1, 1).onChange( onParamsChange );
	ppoFolder.add( guiParams, 'tiltStrength', 0, 1, 0.5 ).onChange( onParamsChange );
	ppoFolder.add( guiParams, 'tiltOffset', 0, 0.1, 0.02 ).onChange( onParamsChange );

	ppoFolder.add( guiParams, 'glowAmount', 0, 1 ).onChange( onParamsChange );
	ppoFolder.add( guiParams, 'glowSize', 0, 3 ).onChange( onParamsChange );
	ppoFolder.add( guiParams, 'vigOffset', 0, 3, 0.5 ).onChange( onParamsChange );
	ppoFolder.add( guiParams, 'saturation', -1, 1, 0 ).onChange( onParamsChange );
	ppoFolder.add( guiParams, 'contrast', 0, 1, 0 ).onChange( onParamsChange );
	ppoFolder.add( guiParams, 'brightness', -1, 1, 0 ).onChange( onParamsChange );
	ppoFolder.add( guiParams, 'rgbShiftAmount', 0, 0.1, 0 ).onChange( onParamsChange );

	ppoFolder.add( guiParams, 'noiseAmount', 0, 1 ).onChange( onParamsChange );
	ppoFolder.add( guiParams, 'noiseSpeed', 0, 1, 0.5 ).onChange( onParamsChange );

	ppoFolder.add( guiParams, 'skyOpacity', 0, 1, 0.1 ).onChange( onParamsChange );

	///////////////////

}

function onParamsChange () {

	boundsHolder.visible = guiParams.showBounds;
	ribbons.forEach(function(ribbon){
		ribbon.meshMaterial.wireframe = guiParams.wireframe;
	});

	ppo.tiltShiftPass.uniforms.focusPos.value = guiParams.tiltPos;
	ppo.tiltShiftPass.uniforms.range.value = guiParams.tiltRange;
	ppo.tiltShiftPass.uniforms.offset.value = guiParams.tiltOffset;
	ppo.tiltShiftPass.uniforms.strength.value = guiParams.tiltStrength;

	ppo.superPass.uniforms.glowAmount.value = guiParams.glowAmount;
	ppo.superPass.uniforms.glowSize.value = guiParams.glowSize;
	ppo.superPass.uniforms.vigOffset.value = guiParams.vigOffset;
	ppo.superPass.uniforms.saturation.value = guiParams.saturation;
	ppo.superPass.uniforms.contrast.value = guiParams.contrast;
	ppo.superPass.uniforms.brightness.value = guiParams.brightness;

	ppo.rgbPass.uniforms.amount.value = guiParams.rgbShiftAmount;

	ppo.noisePass.uniforms.amount.value = guiParams.noiseAmount;
	ppo.noisePass.uniforms.speed.value = guiParams.noiseSpeed;

	ppo.skyPass.uniforms.opacity.value = guiParams.skyOpacity;

}


function onResize() {
	var w = window.innerWidth;
	var h = window.innerHeight;
	camera.aspect =  w / h;
	camera.updateProjectionMatrix();
	renderer.setSize( w,h );
	composer.setSize(w ,h );
	ppo.fxaaPass.uniforms.resolution.value = new THREE.Vector2(1/w, 1/h);

}

function doJump(){

	if (!guiParams.autoRotate) return;

	//spin
	TweenMax.to(outerHolder.rotation, 1, {
		x: ATUtil.randomRange(-Math.PI,Math.PI),
		y: ATUtil.randomRange(-Math.PI,Math.PI),
		z: ATUtil.randomRange(-Math.PI,Math.PI),
		ease: Power2.easeInOut});
}

function animate() {

	ppo.skyPass.uniforms.time.value = noiseTime* 20;
	requestAnimationFrame( animate );

	controls.update();
	stats.update();

	if (guiParams.animate){
		noiseTime += guiParams.ribbonSpeed;
		ppo.noisePass.uniforms.time.value = noiseTime;
		events.emit('update');
	}

	if (guiParams.usePostProc){
		composer.render();
	}else{
		renderer.render( scene, camera );
	}

	//move camlight
	lights[ 1 ].position.copy(camera.position);

	if (guiParams.autoRotate){

		tiltTime += tiltSpeed;
		worldHolder.rotation.x = noise.noise(tiltTime ,0) * rotRng/4;
		worldHolder.rotation.y = noise.noise(tiltTime ,100) * rotRng;
		worldHolder.rotation.z = noise.noise(tiltTime ,200) * rotRng;
	}

}

init();
