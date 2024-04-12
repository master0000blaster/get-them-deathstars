import AssetManager from "./asset-manager";
import DeathStarManager from "./death-star-manager";

export default class GameManager {

    static isDeveloperMode: boolean = false;
    static isPaused: boolean = true;
    static screenCapHasClicked: boolean = false;
    static youTubeEndingVideoURL: string = 'https://www.youtube.com/watch?v=Tj-GZJhfBmI';
    static endingVideoEndSeconds: number = !GameManager.isDeveloperMode ? 112 : 98;
    static endingVideoStartSeconds: number = 97;
    static rotationSpeed: number = 0.03;
    static hasReset: boolean = false;
    static pointerId?: number = undefined;

    static resetGame = () => {
        GameManager.hasReset = true;
        GameManager.screenCapHasClicked = false;
        DeathStarManager.setupDeathStars();
        AssetManager.setupFlyCamera();
        GameManager.isPaused = false;
    };

    static createPointerLock = () => {
        const canvas = AssetManager.scene?.getEngine().getRenderingCanvas();
        if (canvas) {
            canvas.addEventListener("click", event => {
                canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
                if (canvas.requestPointerLock) {
                    canvas.requestPointerLock();
                }
            }, false);
        }
    };

    static letGoOfPointer = () => {
        const canvas = AssetManager.scene?.getEngine().getRenderingCanvas();
        if (canvas && GameManager.pointerId) {
            canvas.releasePointerCapture(GameManager.pointerId);
        }
    };
}