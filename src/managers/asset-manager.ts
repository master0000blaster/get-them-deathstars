import { AbstractMesh, FlyCamera, Nullable, Scene, Sound } from "@babylonjs/core";


export default class AssetManager {

    flyCamera: FlyCamera | undefined;
    xwingMesh: AbstractMesh | undefined;
    deathStarMeshes: Nullable<AbstractMesh>[] = [];
    scene: Scene | undefined;
    canvas: HTMLCanvasElement | undefined;
    pewSound: Sound | undefined;
    introAudio: Sound | undefined;
    outroAudio: Sound | undefined;
    laserMesh: AbstractMesh | undefined;
}