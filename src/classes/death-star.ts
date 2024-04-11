import { AbstractMesh } from "@babylonjs/core";

export default class DeathStar {

    deathStarMesh: AbstractMesh;

    constructor(deathStarMesh: AbstractMesh) {
        this.deathStarMesh = deathStarMesh;
    }
}