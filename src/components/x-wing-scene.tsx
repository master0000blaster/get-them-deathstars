import "../styles.css";
import { Engine, Scene, SceneEventArgs, Skybox } from "react-babylonjs";
import * as core from "@babylonjs/core";
import { ActionManager, ExecuteCodeAction, ISceneLoaderAsyncResult, PointerEventTypes, SceneLoader, Sound } from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/loaders";
import { useState } from "react";
import ControlsConfig from "../controls-config";
import AssetManager from "../managers/asset-manager";
import GameManager from "../managers/game-manager";
import { Button, Grid, Paper } from "@mui/material";
import { LaserManager } from "../managers/laser-manager";
import DeathStarManager from "../managers/death-star-manager";

export default function XWingScene() {

    const [leftPressed, setLeftPressed] = useState(false);
    const [rightPressed, setRightPressed] = useState(false);

    const cameraCreated = (camera: core.FlyCamera, scene: core.Scene) => {

        AssetManager.flyCamera = camera;
        camera.lockedTarget = DeathStarManager.deathStars[24];
        camera.inputs.clear();
    };

    // is called every frame
    const sceneBeforeRender = () => {
        if (!GameManager.isPaused) {

            LaserManager.advanceLaserBeamPositions();

            const { xwingMesh, flyCamera } = AssetManager;
            if (xwingMesh && flyCamera) {

                const rotationSpeed: number = 0.03;

                if (leftPressed) {
                    xwingMesh.rotation.z += rotationSpeed;
                    flyCamera.rotation.z += rotationSpeed;
                }

                if (rightPressed) {
                    xwingMesh.rotation.z -= rotationSpeed;
                    flyCamera.rotation.z -= rotationSpeed;
                }
            }
        }
    };

    const createPointerLock = (scene: core.Scene | undefined) => {
        const canvas = scene?.getEngine().getRenderingCanvas();

        if (canvas) {
            canvas.addEventListener("click", event => {
                canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
                if (canvas.requestPointerLock) {
                    canvas.requestPointerLock();
                }
            }, false);
        }
    };

    const introEnded = () => {

        const { flyCamera, xwingMesh, scene } = AssetManager;

        createPointerLock(scene);

        if (flyCamera) {
            flyCamera.lockedTarget = undefined;
            flyCamera.inputs.addMouse();
            flyCamera.inputs.addKeyboard();
            flyCamera.keysUp.push(87);
            flyCamera.keysLeft = [];
            flyCamera.keysRight = [];
            flyCamera.speed = 4;
            flyCamera.inertia = 0.87;
        }

        if (xwingMesh && flyCamera) {
            xwingMesh.parent = flyCamera;
        }

        GameManager.isPaused = false;
    }

    const fireLaser = () => {
        LaserManager.fireLaser();
    };

    const onSceneMount = (args: SceneEventArgs) => {

        AssetManager.scene = args.scene;
        AssetManager.canvas = args.canvas;
        const { scene } = AssetManager;

        GameManager.isPaused = true;
        AssetManager.pewSound = new Sound('pew', '/static/sounds/PEW.mp3', scene, null, { loop: false, autoplay: false });
        AssetManager.introAudio = new Sound('intro', '/static/sounds/PEW.mp3', scene, null, { loop: false, autoplay: true });
        AssetManager.outroAudio = new Sound('outro', '/static/sounds/PEW.mp3', scene, null, { loop: false, autoplay: false });
        AssetManager.introAudio.onended = introEnded;

        SceneLoader.ImportMeshAsync('', '/static/3dmodels/', 'xwing.glb', scene)
            .then((result: ISceneLoaderAsyncResult) => {
                AssetManager.xwingMesh = result.meshes[0];
            });

        SceneLoader.ImportMeshAsync('', '/static/3dmodels/', 'deathstar.glb', scene)
            .then((result: ISceneLoaderAsyncResult) => {
                DeathStarManager.setupDeathStars(result.meshes[0]);
            });

        scene.actionManager = new ActionManager(scene);

        scene.onPointerObservable.add((pointerInfo: core.PointerInfo) => {

            if (!GameManager.isPaused) {
                switch (pointerInfo.type) {
                    case PointerEventTypes.POINTERDOWN: {
                        if (GameManager.screenCapHasClicked) {
                            AssetManager.pewSound?.play(0);
                            fireLaser();
                        }

                        //do not register the first click. it is the screen cap click.
                        GameManager.screenCapHasClicked = true;
                        break;
                    }
                    default:
                        break;
                }
            }
        });

        // keydown
        scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
            if (evt.sourceEvent.type == "keydown" && !GameManager.isPaused) {

                const config = new ControlsConfig();
                switch (evt.sourceEvent.key.toLowerCase()) {
                    case config.RollLeft: {
                        setLeftPressed(true);
                        break;
                    }
                    case config.RollRight: {
                        setRightPressed(true);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }));

        // keyup
        scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
            if (evt.sourceEvent.type == "keyup" && !GameManager.isPaused) {

                const config = new ControlsConfig();
                switch (evt.sourceEvent.key.toLowerCase()) {
                    case config.RollLeft: {
                        setLeftPressed(false);
                        break;
                    }
                    case config.RollRight: {
                        setRightPressed(false);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }));
    };

    return (
        <Grid container flexDirection={"column"}>
            <Grid item alignItems={"flex-start"}>
                <Button color={"info"} variant="contained" href="https://github.com/master0000blaster/get-them-deathstars" target={"_blank"} >
                    <img style={{ maxWidth: 50 }} src="/static/images/GitHub_Logo.png" />
                    Project
                </Button>
            </Grid>
            <Grid item>
                <Paper elevation={2}>
                    <Engine antialias adaptToDeviceRatio canvasId="xwing-canvas">
                        <Scene beforeRender={sceneBeforeRender} onSceneMount={onSceneMount}>
                            <flyCamera onCreated={cameraCreated} name="xwingcamera"
                                position={new Vector3(0, 0, -30)}
                                bankedTurn={true}
                                rollCorrect={0}
                                bankedTurnMultiplier={2}
                                noRotationConstraint={true}
                            />
                            <hemisphericLight
                                name="light1"
                                intensity={0.7}
                                direction={new Vector3(0.5, 1, 0)}
                            />
                            <Skybox size={10000} rootUrl="/static/images/space-skybox/" name={'skybox'} />
                        </Scene>
                    </Engine>
                </Paper>
            </Grid>
        </Grid>
    );
}
