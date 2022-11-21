import { Color3, FlyCamera, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import * as core from "@babylonjs/core";
import { LaserManager } from "../managers/laser-manager";
import AssetManager from "../managers/asset-manager";

export class LaserBeam {

    laserMesh: Mesh;
    frameRate: number = 20;
    flyCamera: FlyCamera;
    scene: Scene;
    startPosition: Vector3 = Vector3.Up();
    endPosition: Vector3 = Vector3.Up();
    forwardDirection: Vector3 = Vector3.Up();
    displacement: number = 0;
    unitVec: Vector3 = Vector3.Up();
    frameCounter: number = 0;
    maxFrame: number = 60;
    laserMoveIncrement: number = 8;
    isAHit: boolean = false;
    onBeamEndCallBack: (laserBeam:LaserBeam) => void;

    constructor(flyCamera: FlyCamera, scene: Scene, beamEndCallback: (laserBeam:LaserBeam) => void) {
        this.flyCamera = flyCamera;
        this.scene = scene;
        this.laserMesh = MeshBuilder.CreateCylinder('laser_times', {
            diameter: 1,
            height: 2
        }, this.scene);

        this.onBeamEndCallBack = beamEndCallback;
        this.createLaserBeam();
    }

    createLaserBeam = (): void => {

        const laserMaterial = new StandardMaterial("material", this.scene);
        laserMaterial.specularPower = 5;
        laserMaterial.diffuseColor = Color3.FromHexString('#ff0000');
        laserMaterial.emissiveColor = Color3.FromHexString('#ff0000');
        laserMaterial.useEmissiveAsIllumination = true;
        this.laserMesh.material = laserMaterial;

        const glowLayer = new core.GlowLayer("glow", this.scene);
        glowLayer.addIncludedOnlyMesh(this.laserMesh);
        
        this.laserMesh.alignWithNormal(this.flyCamera.getForwardRay().direction);
        this.startPosition = this.flyCamera.position.clone();
        this.laserMesh.position = this.startPosition;
        const forwardRay = this.flyCamera.getForwardRay(4000).clone();
        this.forwardDirection = forwardRay.direction.normalizeToNew();

        if(AssetManager.deathStarGroupCollisionMesh) {
            this.isAHit = forwardRay.intersectsMesh(AssetManager.deathStarGroupCollisionMesh).hit;
        }        
    };

    advanceBeamPosition = (): void => {

        if(this.frameCounter > this.maxFrame) {
            if(this.laserMesh) {
                if(this.isAHit && this.onBeamEndCallBack) {
                    this.onBeamEndCallBack(this);
                }
                LaserManager.removeLaser(this);
                this.laserMesh.dispose();
            }
            return;
        }

        this.laserMesh.position = this.startPosition.add(this.forwardDirection.scale(this.displacement));
        this.displacement += this.laserMoveIncrement;
        this.frameCounter ++;
    };
}