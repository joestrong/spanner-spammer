import * as BABYLON from 'babylonjs';
import CANNON from 'cannon';

const canvas = <HTMLCanvasElement> document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true
});

const MOUSE_LEFT = 0;

const THROW_POWER = 20;

const createScene = () => {
  const scene = new BABYLON.Scene(engine);

  const gravityVector = new BABYLON.Vector3(0,-9.81, 0);
  const physicsPlugin = new BABYLON.CannonJSPlugin(true, 10, CANNON);
  scene.enablePhysics(gravityVector, physicsPlugin);

  const camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, false);
  camera.keysUp = [];
  camera.keysDown = [];
  camera.keysLeft = [];
  camera.keysRight = [];

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

  const box = BABYLON.Mesh.CreateBox('box1', 2, scene, false, BABYLON.Mesh.FRONTSIDE);
  box.position.x = -1;
  box.position.y = 1;
  box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.5, restitution: 0.9 }, scene);

  const box2 = box.createInstance('box2');
  box2.position.x = 1;
  box2.position.y = 1;
  box2.physicsImpostor = new BABYLON.PhysicsImpostor(box2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.5, restitution: 0.9 }, scene);

  const box3 = box.createInstance('box3');
  box3.position.x = 0;
  box3.position.y = 3;
  box3.physicsImpostor = new BABYLON.PhysicsImpostor(box3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.5, restitution: 0.9 }, scene);

  const ground = BABYLON.Mesh.CreateGround('ground1', 12, 12, 2, scene, false);
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

  canvas.onclick = function() {
    canvas.requestPointerLock();
  };

  scene.onPointerDown = (e) => {
    if (e.button === MOUSE_LEFT) {
      const spanner = BABYLON.Mesh.CreateSphere('spanner', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
      spanner.position.x = camera.position.x;
      spanner.position.y = camera.position.y;
      spanner.position.z = camera.position.z;
      spanner.physicsImpostor = new BABYLON.PhysicsImpostor(spanner, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0.25, restitution: 0 }, scene);
      spanner.physicsImpostor.setLinearVelocity(
        (spanner.physicsImpostor.getLinearVelocity() || new BABYLON.Vector3(0, 0, 0))
          .add(camera.getForwardRay().direction.scale(THROW_POWER))
      );
    }
  };

  return scene;
};

const scene = createScene();
engine.runRenderLoop(() => {
  scene.render();
});
window.addEventListener('resize', () => {
  engine.resize();
});
