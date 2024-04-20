import { AbstractMesh, Mesh, MeshBuilder, Nullable } from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import * as core from "@babylonjs/core";
import AssetManager from "../managers/asset-manager";
import DeathStar from "../classes/death-star";

export default class DeathStarManager {

    static explosionParticleSet?: core.ParticleSystemSet;
    static deathStarGroupCollisionMesh?: Mesh;
    static deathStars: DeathStar[] = [];
    static originalDeathStarMesh?: AbstractMesh;

    static blowUp = () => {

        AssetManager.resetCameraPosition();
        DeathStarManager.deathStars.forEach((ds) => {
            ds.deathStarMesh.dispose();
        });
        DeathStarManager.explosionParticleSet?.start(DeathStarManager.deathStarGroupCollisionMesh);
    };

    static setupDeathStars = () => {

        if (!DeathStarManager.originalDeathStarMesh || !AssetManager.scene) {
            return;
        }

        if (DeathStarManager.deathStars && DeathStarManager.deathStars.length > 0) {
            DeathStarManager.deathStars.forEach((ds) => {
                ds.deathStarMesh.dispose();
            });
            DeathStarManager.deathStars = [];
        }

        DeathStarManager.originalDeathStarMesh.isVisible = false;
        const deathStarMesh: Nullable<AbstractMesh> = DeathStarManager.originalDeathStarMesh.clone('deathstar0', null, false);

        const xIncrement: number = 100;
        const groupOffsetX: number = 400;
        const groupOffsetY: number = 200;
        const groupZ: number = 1000;
        const scale: number = 3;

        if (deathStarMesh) {
            deathStarMesh.isVisible = true;
            DeathStarManager.deathStars.push(new DeathStar(deathStarMesh));

            for (let i: number = 0; i < 49; i++) {
                const newDeathStarMesh = deathStarMesh.clone('deathstar' + (i + 1), null, false);

                if (newDeathStarMesh) {
                    newDeathStarMesh.isVisible = true;
                    DeathStarManager.deathStars.push(new DeathStar(newDeathStarMesh));
                }
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

        if (DeathStarManager.deathStarGroupCollisionMesh) {
            DeathStarManager.deathStarGroupCollisionMesh.dispose();
        }

        DeathStarManager.deathStarGroupCollisionMesh = MeshBuilder.CreateBox("ds_collider");
        const { deathStarGroupCollisionMesh } = DeathStarManager;
        deathStarGroupCollisionMesh.isVisible = false;
        deathStarGroupCollisionMesh.scaling = new Vector3(1000, 600, 100);
        deathStarGroupCollisionMesh.position = DeathStarManager.deathStars[24].deathStarMesh.position;

        if (AssetManager.scene) {
            core.ParticleHelper.CreateAsync("explosion", AssetManager.scene).then((particleSet) => {
                DeathStarManager.explosionParticleSet = particleSet;
                particleSet.systems.forEach(sys => {
                    sys.disposeOnStop = true;
                    sys.maxSize = 30;
                    sys.minSize = 10;
                    sys.gravity = new Vector3(0, 0, 0);
                    sys.minEmitPower = 1;
                    sys.maxEmitPower = 3;
                    sys.maxLifeTime = 4;
                });
            });
        }

        DeathStarManager.originalDeathStarMesh.position = DeathStarManager.deathStars[49].deathStarMesh.position;
    }
}