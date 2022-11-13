import { FlyCamera, Scene } from "@babylonjs/core";
import { LaserBeam } from "../classes/laser-beam";
import AssetManager from "./asset-manager";

export class LaserManager {
    static laserBeams: LaserBeam[] = [];

    static fireLaser = (): void => {
        if(AssetManager.flyCamera &&  AssetManager.scene) {
           LaserManager.laserBeams.push(new LaserBeam(AssetManager.flyCamera, AssetManager.scene));
        }
    };

    static removeLaser = (laser: LaserBeam): void => {
        const laserIndex: number = LaserManager.laserBeams.indexOf(laser);
        if(laserIndex > -1) {
            LaserManager.laserBeams.splice(laserIndex, 1);
        }
    };

    static advanceLaserBeamPositions = (): void => {
        LaserManager.laserBeams.forEach((lb) => {
            if(lb.laserMesh) {
                lb.advanceBeamPosition();
            }            
        });
    };
}