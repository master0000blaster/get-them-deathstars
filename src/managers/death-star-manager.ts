import "../styles.css";
import * as core from "@babylonjs/core";
import { AbstractMesh, MeshBuilder } from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/loaders";
import AssetManager from "../managers/asset-manager";

export default class DeathStarManager {

    static setupDeathStars = (deathStarMesh: AbstractMesh) => {

        const xIncrement: number = 100;
        const groupOffsetX: number = 400;
        const groupOffsetY: number = 200;
        const groupZ: number = 1000;
        const scale: number = 3;
        const { deathStarMeshes } = AssetManager;

        deathStarMesh.name = 'deathstar0';
        deathStarMeshes?.push(deathStarMesh);

        for (let i: number = 0; i < 49; i++) {
            const newDeathStar = deathStarMesh.clone('deathstar' + (i + 1), null, false);
            deathStarMeshes.push(newDeathStar);
        }

        let deathStarLevel = 0;
        let xPos = 0;

        for (let i: number = 0; i < 50; i++) {
            const newDeathStar = deathStarMeshes[i];

            if (i > 0 && i % 10 === 0) {
                deathStarLevel += xIncrement;
                xPos = 0;
            }

            if (newDeathStar !== null) {
                xPos += xIncrement;
                let randY = Math.abs(Math.random() * 7) + 90;

                deathStarMeshes.push(newDeathStar);
                newDeathStar.position = new Vector3(xPos - groupOffsetX, deathStarLevel - groupOffsetY, groupZ);
                newDeathStar.rotation = new Vector3(0, randY, 0);
                newDeathStar.scaling = new Vector3(scale, scale, scale);
            }
        }

        if (deathStarMeshes[0] && deathStarMeshes[24]) {
            AssetManager.deathStarGroupCollisionmesh = MeshBuilder.CreateBox("ds_collider");
            const { deathStarGroupCollisionmesh } = AssetManager;
            deathStarGroupCollisionmesh.material = new core.StandardMaterial("dt_collision", AssetManager.scene);
            deathStarGroupCollisionmesh.scaling = new Vector3(1000, 600, 100);
            deathStarGroupCollisionmesh.position = deathStarMeshes[24].position;
        }
    }
}