import { AbstractMesh, Color3, FlyCamera, Mesh, MeshBuilder, Nullable, Ray, Scene, Sound, StandardMaterial, Vector3 } from "@babylonjs/core";
import * as core from "@babylonjs/core";

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

    constructor(flyCamera: FlyCamera, scene: Scene) {
        this.flyCamera = flyCamera;
        this.scene = scene;
        this.laserMesh = MeshBuilder.CreateCylinder('laser_times', {
            diameter: 1,
            height: 2
        }, this.scene);

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
    };

    advanceBeamPosition = (): void => {

        if(this.frameCounter > this.maxFrame) {
            if(this.laserMesh) {
                this.laserMesh.dispose();
            }
            return;
        }

        this.laserMesh.position = this.startPosition.add(this.forwardDirection.scale(this.displacement));
        this.displacement += 8;
        this.frameCounter ++;
    };
}

export class LaserManager {
    laserBeams: LaserBeam[] = [];

    fireLaser = (flyCamera: FlyCamera | undefined, scene: Scene | undefined): void => {
        if(flyCamera && scene) {
           this.laserBeams.push(new LaserBeam(flyCamera, scene));
        }
    };

    advanceLaserBeamPositions = (): void => {
        this.laserBeams.forEach((lb) => {
            if(lb.laserMesh) {
                lb.advanceBeamPosition();
            }            
        });
    };
}

export interface IAssetManager {
    flyCamera: FlyCamera | undefined;
    scene: Scene | undefined;
    xwingMesh: AbstractMesh | undefined;
    deathStarMeshes: Nullable<AbstractMesh>[];
    canvas: HTMLCanvasElement | undefined;
    pewSound: Sound | undefined;
    introAudio: Sound | undefined;
    outroAudio: Sound | undefined;
}

export default class AssetManager implements IAssetManager {

    flyCamera: FlyCamera | undefined;
    xwingMesh: AbstractMesh | undefined;
    deathStarMeshes: Nullable<AbstractMesh>[] = [];
    scene: Scene | undefined;
    canvas: HTMLCanvasElement | undefined;
    pewSound: Sound | undefined;
    introAudio: Sound | undefined;
    outroAudio: Sound | undefined;
}