import { AbstractMesh } from "@babylonjs/core";
import * as core from "@babylonjs/core";
import AssetManager from "../managers/asset-manager";

export default class DeathStar {

    deathStarMesh: AbstractMesh;

    constructor(deathStarMesh: AbstractMesh) {
        this.deathStarMesh = deathStarMesh;
    }
}