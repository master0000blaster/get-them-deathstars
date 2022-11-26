import { AbstractMesh, FlyCamera, Scene, Sound, Vector3 } from "@babylonjs/core";
import GameManager from "./game-manager";

export default class AssetManager {

    static flyCamera: FlyCamera | undefined;
    static xwingMesh: AbstractMesh | undefined;
    static scene: Scene | undefined;
    static canvas: HTMLCanvasElement | undefined;
    static pewSound: Sound | undefined;
    static introAudio: Sound | undefined;
    static outroAudio: Sound | undefined;
    static explosionSound: Sound | undefined;

    static resetCameraPosition = () => {
        if (AssetManager.flyCamera) {
            AssetManager.flyCamera.position = new Vector3(0, 0, 0);
            AssetManager.flyCamera.rotation = new Vector3(0, 0, 0);
        }
    };

    static setupFlyCamera = () => {

        const { flyCamera, xwingMesh, scene } = AssetManager;
        GameManager.createPointerLock(scene);

        if (flyCamera) {
            flyCamera.position = new Vector3(0, 0, 0);
            flyCamera.rotation = new Vector3(0, 0, 0);
            flyCamera.lockedTarget = undefined;
            flyCamera.inputs.addMouse();
            flyCamera.inputs.addKeyboard();
            flyCamera.keysUp.push(87);
            flyCamera.keysLeft = [];
            flyCamera.keysRight = [];
            flyCamera.speed = 4;
            flyCamera.inertia = 0.87;
        }

        if (xwingMesh && flyCamera) {
            xwingMesh.parent = flyCamera;
        }
    };
}