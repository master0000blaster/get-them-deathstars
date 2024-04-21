import AssetManager from "./asset-manager";
import DeathStarManager from "./death-star-manager";

export default class GameManager {

    /// -------------------------- DEVELOPER MODE ----------------- !!!!!!!!!!!!!
    /// -------------------------- DEVELOPER MODE ----------------- !!!!!!!!!!!!!
    // skips most dialog and ending video
    static isDeveloperMode: boolean = true;
    /// -------------------------- DEVELOPER MODE ----------------- !!!!!!!!!!!!!
    /// -------------------------- DEVELOPER MODE ----------------- !!!!!!!!!!!!!


    static isPaused: boolean = true;
    static screenCapHasClicked: boolean = false;
    static youTubeOutroVideoURL: string = 'https://www.youtube.com/watch?v=Tj-GZJhfBmI';
    static outroVideoEndSeconds: number = !GameManager.isDeveloperMode ? 112 : 98;
    static outroVideoStartSeconds: number = 97;
    static rotationSpeed: number = 0.03;
    static hasReset: boolean = false;
    static pointerId: number = 0;

    static resetGame = () => {
        GameManager.hasReset = true;
        GameManager.screenCapHasClicked = false;
        DeathStarManager.setupDeathStars();
        AssetManager.setupFlyCamera();
        GameManager.isPaused = false;
    };

    static createPointerLock = () => {
        const engine = AssetManager.scene?.getEngine();
        if (!engine) return;
        engine.enterPointerlock();
    };

    static letGoOfPointer = () => {
        const engine = AssetManager.scene?.getEngine();
        if (!engine) return;
        engine.exitPointerlock();
    };
}