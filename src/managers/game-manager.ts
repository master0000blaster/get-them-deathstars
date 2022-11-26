import AssetManager from "./asset-manager";
import * as core from "@babylonjs/core";
import DeathStarManager from "./death-star-manager";

export default class GameManager {

    static isPaused: boolean = true;
    static screenCapHasClicked: boolean = false;
    static youTubeEndingVideoURL: string = 'https://www.youtube.com/watch?v=Tj-GZJhfBmI';
    static endingVideoEndSeconds: number = 112;
    static endingVideoStartSeconds: number = 97;
    static hasReset: boolean = false;

    static resetGame = () => {
        GameManager.hasReset = true;
        GameManager.screenCapHasClicked = false;
        DeathStarManager.setupDeathStars();
        AssetManager.setupFlyCamera();
        GameManager.isPaused = false;
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
}