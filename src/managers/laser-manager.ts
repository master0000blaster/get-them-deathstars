import { LaserBeam } from "../classes/laser-beam";
import AssetManager from "./asset-manager";
import DeathStarManager from "./death-star-manager";
import GameManager from "./game-manager";

export class LaserManager {
    static laserBeams: LaserBeam[] = [];

    static fireLaser = (): void => {
        if (AssetManager.flyCamera && AssetManager.scene) {
            LaserManager.laserBeams.push(new LaserBeam(AssetManager.flyCamera, AssetManager.scene, (laserBeam) => {
                GameManager.isPaused = true;
                DeathStarManager.blowUp();

                if (AssetManager.explosionSound) {

                    const explosionSoundEnded = () => {
                        if (AssetManager.outroAudio) {
                            AssetManager.outroAudio.play(1);
                        }
                    };

                    AssetManager.explosionSound.onended = explosionSoundEnded;
                }

                AssetManager.explosionSound?.play();
            }));
        }
    };

    static removeLaser = (laser: LaserBeam): void => {
        const laserIndex: number = LaserManager.laserBeams.indexOf(laser);
        if (laserIndex > -1) {
            LaserManager.laserBeams.splice(laserIndex, 1);
        }
    };

    static advanceLaserBeamPositions = (): void => {
        LaserManager.laserBeams.forEach((lb) => {
            if (lb.laserMesh) {
                lb.advanceBeamPosition();
            }
        });
    };
}