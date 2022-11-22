import { AbstractMesh, FlyCamera, Scene, Sound, Vector3 } from "@babylonjs/core";

export default class AssetManager {

    static flyCamera: FlyCamera | undefined;
    static xwingMesh: AbstractMesh | undefined;
    static scene: Scene | undefined;
    static canvas: HTMLCanvasElement | undefined;
    static pewSound: Sound | undefined;
    static introAudio: Sound | undefined;
    static outroAudio: Sound | undefined;
    static explosionSound: Sound | undefined;

    static resetPosition = () => {
        if (AssetManager.flyCamera) {
            AssetManager.flyCamera.position = new Vector3(0, 0, 0);
            AssetManager.flyCamera.rotation = new Vector3(0, 0, 0);
        }
    };
}