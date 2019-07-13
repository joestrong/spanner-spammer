import * as BABYLON from 'babylonjs';

const canvas = <HTMLCanvasElement> document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true
});

const createScene = function(){
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, false);

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

  const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
  sphere.position.y = 1;

  const ground = BABYLON.Mesh.CreateGround('ground1', 12, 12, 2, scene, false);

  return scene;
};

const scene = createScene();
engine.runRenderLoop(function(){
  scene.render();
});
window.addEventListener('resize', function(){
  engine.resize();
});
