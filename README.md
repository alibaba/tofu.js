tofu.js — The 3D building framework
=============

The official web framework for UC WebAR.

## Introduction

`tofu.js` is a helper framework for building `AR` `VR` `3D` application.

- `AR`: you can use `ARViewer` (get from `tofu.js`) to create a ar-view, you can tracking a nft-marker easy.

- `XR`: XR was cover `VR` and `3D`, you can use `XRViewer` (get from `tofu.js`) to create a powerful xr-view, `XRViewer` built-in support `vrmode` and `vrsensor`.

- `interaction`: tofu.js base on `three.js` but surpass it. `tofu.js` support full interaction manager, it means you can add interaction-event like browser-dom. 

- `timeline`: tofu.js has built-in animation timeline, you can let any display-object start a animate, and you can manager it like timeline.

- `after-effect`: so cool, if you use `tofu.js` you can add after-effect very easy.

## Getting Started

### AR Case
```javascript
import { Mesh, BoxGeometry, MeshLambertMaterial } from 'three';
import { ARViewer, ARGlue } from 'tofu.js';

const width = window.innerWidth;
const height = window.innerHeight;
const arViewer = new ARViewer({
  canvas: '#webar', // `required` pass a `canvas-dom` or `css-selector`
  width,
  height,
});

// new a `AR-Glue`, it was glue container, can paste some 3d-model to video stream
const arGlue = new ARGlue({
  name: 'glue-name',
});
// add a glue to scene
arViewer.add(arGlue);

// assume `demoModel` was a 3d-model to tracker video stream
const demoModel = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshLambertMaterial({ color: 0xffffff })
));
// add a 3d-model to `AR-Glue`
arGlue.add(demoModel);

// set camera matrix, on get camera internal parameters
arViewer.updateCameraMatrix(matrix);

// set markers poses, on detector markers' poses
arViewer.updatePoses(poses);

// start render
arViewer.start();
```

### XR Case
```javascript
import { Mesh, BoxGeometry, MeshLambertMaterial } from 'three';
import { XRViewer } from 'tofu.js';
const xrViewer = new XRViewer({
  canvas: '#webgl',
  fov: 75,
  width: WIDTH,
  height: HEIGHT,
  near: 0.01,
  far: 3000,
  vrmode: true, // turn on vr-mode ?
  vrsensor: true, // turn on vr-sensor ?
  aeEnable: true, // turn on after effect ?
});

// create a cube
const cube = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshLambertMaterial({ color: 0xffffff })
);

xrViewer.add(cube);

// start render
xrViewer.start();
```

### Animation Case

`tofu.js` add an animator patch for `three.js`, so you can start a animation very easy, this animator built-in support `animate` `motion` and `runners` type animations.

#### animate
```javascript
const timeline = cube.animate({
  from: { 'position.x': 0 }, // optional, play an animation start with this pose
  to: { 'position.x': 0 }, // play an animation to this pose
  duration: 1000, // animation duration
  repeat: 1, // do you need repeat once?
  infinite: true, // you want infinite repeat this animation?
  alternate: true, // you want repeat with alternate, just like yoyo?
  ease: Tween.Bounce.Out, // you want to use which timing function?
});
timeline.on('update', () => {}); // call on each update
timeline.on('complete', () => {}); // call on complete animation

timeline.pause(); // pause animation progress
timeline.restart(); // restart animation progress, use with pause
timeline.stop(); // stop animation to end, will trigger onComplete callback
timeline.cancle(); // cancle animation right now, will not trigger onComplete callback
timeline.timeScale = 0.5; // set timeScale, get a Slow motion，just like speed * 0.5
```

#### motion
```javascript
const timeline = cube.motion({
  path: curve, // should instance of Curve
  lengthMode: false, // whether move with length-mode or not
  attachTangent: false, // whether display-object should attach tangent or not
  duration: 1, // animation duration
  repeat: 1, // do you need repeat once?
  infinite: true, // you want infinite repeat this animation?
  alternate: true, // you want repeat with alternate, just like yoyo?
  ease: Tween.Bounce.Out, // you want to use which timing function?
});
// timeline same with before
```

#### runners
```javascript
const timeline = cube.runners({
  runners: [], // combine animation, support `animate`、`motion`
  repeat: 1, // do you need repeat once?
  infinite: true, // you want infinite repeat this animation?
  ease: Tween.Bounce.Out, // you want to use which timing function?
});
// timeline same with before
```

### Interaction Case

```javascript
// bind interaction-event for cube, like click、touchstart and so on
cube.on('click', function(ev) {});
cube.on('touchstart', function(ev) {});
cube.on('mousedown', function(ev) {});
// and so on ...
```
> you can also listen on parent-node or any display-tree node,source event will bubble up along with display-tree.you can stop the bubble-up by invoke ev.stopPropagation function.

### AE Case
```javascript
import { BloomPass, FilmPass, FocusShader } from 'tofu.postprogressing.js';
import { XRViewer, RenderPass, ShaderPass } from 'tofu.js';
const xrViewer = new XRViewer({
  canvas: '#webgl',
  fov: 75,
  width: WIDTH,
  height: HEIGHT,
  near: 0.01,
  far: 3000,
  aeEnable: true, // turn on after effect ?
});

const renderModel = new RenderPass();
const effectBloom = new BloomPass(1.05);
const effectFilm = new FilmPass(0.15, 0.15, 1500, false);
const effectFocus = new ShaderPass(FocusShader);
effectFocus.uniforms["screenWidth"].value = WIDTH;
effectFocus.uniforms["screenHeight"].value = HEIGHT;
effectFocus.renderToScreen = true;

xrViewer.composer.addPass(renderModel);
xrViewer.composer.addPass(effectBloom);
xrViewer.composer.addPass(effectFilm);
xrViewer.composer.addPass(effectFocus);

xrViewer.start();
```

## Documentation

run http-server and go to `./docs` directory
```sh
npm run http
```

## Examples

run http-server and go to `./examples` directory
```sh
npm run http
```
