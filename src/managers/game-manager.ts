import AssetManager from "./asset-manager";
import * as core from "@babylonjs/core";

export default class GameManager {
    static isPaused: boolean = true;
    static screenCapHasClicked: boolean = false;
    static youTubeEndingVideoURL: string = 'https://www.youtube.com/watch?v=Tj-GZJhfBmI';
    static endingVideoEndSeconds: number = 112;
    static endingVideoStartSeconds: number = 97;
    static outroAudioComlpete: () => any;
    static resetGame = () => {
        location.href = location.href;
    };

    static createPointerLock = (scene: core.Scene | undefined) => {
        const canvas = scene?.getEngine().getRenderingCanvas();

        if (canvas) {
            canvas.addEventListener("click", event => {
                canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
                if (canvas.requestPointerLock) {
                    canvas.requestPointerLock();
                }
            }, false);
        }
    };

    static introEnded = () => {

        const { flyCamera, xwingMesh, scene } = AssetManager;
        GameManager.createPointerLock(scene);

        if (flyCamera) {
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

        GameManager.isPaused = false;
    }
}