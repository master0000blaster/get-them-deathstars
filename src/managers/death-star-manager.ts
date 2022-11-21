import "../styles.css";
import { AbstractMesh, MeshBuilder } from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import * as core from "@babylonjs/core";
import "@babylonjs/loaders";
import AssetManager from "../managers/asset-manager";
import DeathStar from "../classes/death-star";

export default class DeathStarManager {

    static explosionParticleSet: core.ParticleSystemSet | undefined;
    static deathStars: DeathStar[] = [];

    static blowUp = () => {
        DeathStarManager.explosionParticleSet?.start(AssetManager.deathStarGroupCollisionMesh);
        DeathStarManager.deathStars.forEach((ds) => {
            ds.deathStarMesh.dispose();
        });
    };

    static setupDeathStars = (deathStarMesh: AbstractMesh) => {

        const xIncrement: number = 100;
        const groupOffsetX: number = 400;
        const groupOffsetY: number = 200;
        const groupZ: number = 1000;
        const scale: number = 3;

        deathStarMesh.name = 'deathstar0';
        DeathStarManager.deathStars.push(new DeathStar(deathStarMesh));

        for (let i: number = 0; i < 49; i++) {
            const newDeathStar = deathStarMesh.clone('deathstar' + (i + 1), null, false);
            if (newDeathStar) {
                DeathStarManager.deathStars.push(new DeathStar(newDeathStar));
            }
        }

        let deathStarLevel = 0;
        let xPos = 0;

        for (let i: number = 0; i < 50; i++) {
            const dsMesh = DeathStarManager.deathStars[i].deathStarMesh;

            if (i > 0 && i % 10 === 0) {
                deathStarLevel += xIncrement;
                xPos = 0;
            }

            if (dsMesh) {
                xPos += xIncrement;
                let randY = Math.abs(Math.random() * 7) + 90;

                dsMesh.position = new Vector3(xPos - groupOffsetX, deathStarLevel - groupOffsetY, groupZ);
                dsMesh.rotation = new Vector3(0, randY, 0);
                dsMesh.scaling = new Vector3(scale, scale, scale);
            }
        }

        AssetManager.deathStarGroupCollisionMesh = MeshBuilder.CreateBox("ds_collider");
        const { deathStarGroupCollisionMesh: deathStarGroupCollisionmesh } = AssetManager;
        deathStarGroupCollisionmesh.isVisible = false;
        deathStarGroupCollisionmesh.scaling = new Vector3(1000, 600, 100);
        deathStarGroupCollisionmesh.position = DeathStarManager.deathStars[24].deathStarMesh.position;

        if (AssetManager.scene) {
            core.ParticleHelper.CreateAsync("explosion", AssetManager.scene).then((particleSet) => {
                DeathStarManager.explosionParticleSet = particleSet;
                particleSet.systems.forEach(s => {
                    s.disposeOnStop = true;
                    s.maxSize = 30;
                    s.minSize = 10;
                    s.gravity = new Vector3(0, 0, 0);
                    s.minEmitPower = 1;
                    s.maxEmitPower = 3;
                    s.maxLifeTime = 4;
                });
            });
        }
    }
}