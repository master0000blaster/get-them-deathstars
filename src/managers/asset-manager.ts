import { AbstractMesh, FlyCamera, Mesh, Nullable, Scene, Sound } from "@babylonjs/core";

export default class AssetManager {

    static flyCamera: FlyCamera | undefined;
    static xwingMesh: AbstractMesh | undefined;
    static deathStarMeshes: Nullable<AbstractMesh>[] = [];
    static scene: Scene | undefined;
    static canvas: HTMLCanvasElement | undefined;
    static pewSound: Sound | undefined;
    static introAudio: Sound | undefined;
    static outroAudio: Sound | undefined;
    static deathStarGroupCollisionmesh: Mesh | undefined;
}