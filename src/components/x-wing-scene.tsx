import "../styles.css";
import { Engine, Scene, SceneEventArgs, Skybox } from "react-babylonjs";
import * as core from "@babylonjs/core";
import { AbstractMesh, ActionManager, AnimationEvent, Color3, Color4, ExecuteCodeAction, FlyCamera, ISceneLoaderAsyncResult, Mesh, MeshBuilder, Nullable, PlaySoundAction, PointerEventTypes, Ray, SceneLoader, Sound, StandardMaterial } from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/loaders";
import { useRef, useState } from "react";
import ControlsConfig from "../controls-config";
import AssetManager, { LaserManager } from "../managers/asset-manager";
import GameManager from "../managers/game-manager";
import { Button } from "@mui/material";
import { maxWidth } from "@mui/system";

interface XWingSceneProps {
};

export default function XWingScene(props: XWingSceneProps) {

    const assetManager = useRef<AssetManager>(new AssetManager());
    const laserManager = useRef<LaserManager>(new LaserManager());
    const gameManager = useRef<GameManager>(new GameManager());
    const [leftPressed, setLeftPressed] = useState(false);
    const [rightPressed, setRightPressed] = useState(false);

    const cameraCreated = (camera: core.FlyCamera, scene: core.Scene) => {

        assetManager.current.flyCamera = camera;
        camera.lockedTarget = assetManager.current.deathStarMeshes[24];
        camera.inputs.clear();
    };

    // is called every frame
    const sceneBeforeRender = () => {
        if (!gameManager.current.isPaused) {

            laserManager.current.advanceLaserBeamPositions();

            const { xwingMesh, flyCamera } = assetManager.current;
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

    const setupDeathStars = (deathStarMesh: AbstractMesh) => {

        const xIncrement: number = 100;
        const groupOffsetX: number = 400;
        const groupOffsetY: number = 200;
        const groupZ: number = 1000;
        const scale: number = 3;
        const { deathStarMeshes } = assetManager.current;

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
    }

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

        const { flyCamera, xwingMesh, scene } = assetManager.current;

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

        gameManager.current.isPaused = false;
    }

    const fireLaser = () => {
        laserManager.current.fireLaser(assetManager.current.flyCamera, assetManager.current.scene);
    };

    const onSceneMount = (args: SceneEventArgs) => {

        assetManager.current.scene = args.scene;
        assetManager.current.canvas = args.canvas;
        const { scene } = assetManager.current;

        gameManager.current.isPaused = true;
        assetManager.current.pewSound = new Sound('pew', '/static/sounds/PEW.mp3', scene, null, { loop: false, autoplay: false });
        assetManager.current.introAudio = new Sound('pew', '/static/sounds/PEW.mp3', scene, null, { loop: false, autoplay: true });
        assetManager.current.outroAudio = new Sound('pew', '/static/sounds/outro.mp3', scene, null, { loop: false, autoplay: false });
        assetManager.current.introAudio.onended = introEnded;

        SceneLoader.ImportMeshAsync('', '/static/3dmodels/', 'xwing.glb', scene)
            .then((result: ISceneLoaderAsyncResult) => {
                assetManager.current.xwingMesh = result.meshes[0];
            });

        SceneLoader.ImportMeshAsync('', '/static/3dmodels/', 'deathstar.glb', scene)
            .then((result: ISceneLoaderAsyncResult) => {
                setupDeathStars(result.meshes[0]);
            });

        scene.actionManager = new ActionManager(scene);

        scene.onPointerObservable.add((pointerInfo: core.PointerInfo) => {

            if (!gameManager.current.isPaused) {
                switch (pointerInfo.type) {
                    case PointerEventTypes.POINTERDOWN: {
                        if (gameManager.current.screenCapHasClicked) {
                            assetManager.current.pewSound?.play(0);
                            fireLaser();
                        }

                        //do not register the first click. it is the screen cap click.
                        gameManager.current.screenCapHasClicked = true;
                        break;
                    }
                    default:
                        break;
                }
            }
        });

        // keydown
        scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
            if (evt.sourceEvent.type == "keydown" && !gameManager.current.isPaused) {

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
            if (evt.sourceEvent.type == "keyup" && !gameManager.current.isPaused) {

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
        <div>
            <Button color={"info"} variant="contained" href="https://github.com/master0000blaster/get-them-deathstars" target={"_blank"} >
                <img style={{maxWidth: 50}} src="/static/images/GitHub_Logo.png" />
                Project
            </Button>
            <br/>
            <br/>
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
        </div>
    );
}
