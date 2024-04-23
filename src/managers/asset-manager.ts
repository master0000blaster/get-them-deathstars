import { AbstractMesh, FlyCamera, Scene, Sound, Vector3 } from "@babylonjs/core";

export default class AssetManager {

    static flyCamera?: FlyCamera;
    static xwingMesh?: AbstractMesh;
    static scene?: Scene;
    static canvas?: HTMLCanvasElement;
    static pewSound?: Sound;
    static introAudio?: Sound;
    static outroAudio?: Sound;
    static explosionSound?: Sound;

    static resetCameraPosition = () => {
        if (AssetManager.flyCamera) {
            AssetManager.flyCamera.position = new Vector3(0, 0, 0);
            AssetManager.flyCamera.rotation = new Vector3(0, 0, 0);
        }
    };

    static setupFlyCamera = () => {

        const { flyCamera, xwingMesh } = AssetManager;
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