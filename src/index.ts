import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import CANNON from 'cannon';

const canvas = <HTMLCanvasElement> document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true
});

const MOUSE_LEFT = 0;

const THROW_POWER = 20;
const THROW_SPIN = 10;

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

  let spanner: BABYLON.Mesh;
  BABYLON.SceneLoader.ImportMesh(["Spanner"], "./models/", 'spanner.babylon', scene, function (meshes: BABYLON.AbstractMesh[]) {
    spanner = <BABYLON.Mesh> meshes[0];
  });

  scene.onPointerDown = (e) => {
    if (document.pointerLockElement !== canvas) {
      return;
    }

    if (e.button === MOUSE_LEFT) {
      const cameraDirection = camera.getForwardRay().direction;
      const projectile = spanner.createInstance('spanner');
      projectile.position = camera.position;
      projectile.physicsImpostor = new BABYLON.PhysicsImpostor(projectile, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0.25, restitution: 0 }, scene);
      projectile.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, Math.PI/2, (camera.rotation.y * -1) + Math.PI/2);
      projectile.translate(BABYLON.Axis.Y, -5);
      projectile.physicsImpostor.setLinearVelocity(
        (projectile.physicsImpostor.getLinearVelocity() || new BABYLON.Vector3(0, 0, 0))
          .add(cameraDirection.scale(THROW_POWER))
      );
      let throwSpin = new BABYLON.Vector3(cameraDirection.z, 0, (cameraDirection.x * -1)).scale(THROW_SPIN);
      projectile.physicsImpostor.setAngularVelocity(throwSpin);
    }
  };

  canvas.onclick = function() {
    canvas.requestPointerLock();
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
