import * as BABYLON from 'babylonjs';
import CANNON from 'cannon';

window.CANNON = CANNON;

const canvas = <HTMLCanvasElement> document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true
});

const createScene = function(){
  const scene = new BABYLON.Scene(engine);

  const gravityVector = new BABYLON.Vector3(0,-9.81, 0);
  const physicsPlugin = new BABYLON.CannonJSPlugin();
  scene.enablePhysics(gravityVector, physicsPlugin);

  const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, false);

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

  const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
  sphere.position.y = 1;
  sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);

  const ground = BABYLON.Mesh.CreateGround('ground1', 12, 12, 2, scene, false);
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

  return scene;
};

const scene = createScene();
engine.runRenderLoop(function(){
  scene.render();
});
window.addEventListener('resize', function(){
  engine.resize();
});
