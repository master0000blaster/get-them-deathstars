import { AbstractMesh, FlyCamera, Mesh, Scene, Sound } from "@babylonjs/core";
import DeathStar from "../classes/death-star";

export default class AssetManager {

    static flyCamera: FlyCamera | undefined;
    static xwingMesh: AbstractMesh | undefined;
    static scene: Scene | undefined;
    static canvas: HTMLCanvasElement | undefined;
    static pewSound: Sound | undefined;
    static introAudio: Sound | undefined;
    static outroAudio: Sound | undefined;
    static deathStarGroupCollisionMesh: Mesh | undefined;
}