import "../styles.css";
import { Engine, Scene, SceneEventArgs, Skybox } from "react-babylonjs";
import * as core from "@babylonjs/core";
import { AbstractMesh, ActionManager, ExecuteCodeAction, FlyCamera, ISceneLoaderAsyncResult, Nullable, SceneLoader } from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/loaders";
import { useRef, useState } from "react";
import ControlsConfig from "../controls-config";

interface XWingSceneProps {
};

export default function XWingScene(props: XWingSceneProps) {

    const cameraRef = useRef<FlyCamera>(null);
    const xwingMeshRef = useRef<AbstractMesh>();
    const deathstarMeshesRef = useRef<Nullable<AbstractMesh>[]>([]);
    const sceneRef = useRef<core.Scene>();
    const canvasRef = useRef<HTMLCanvasElement>();
    const [leftPressed, setLeftPressed] = useState(false);
    const [rightPressed, setRightPressed] = useState(false);

    const cameraCreated = (camera: core.FlyCamera, scene: core.Scene) => {        

        camera.inputs.clear();
        camera.inputs.addMouse();
        camera.inputs.addKeyboard();
        camera.keysUp.push(87);
        camera.keysLeft = [];
        camera.keysRight = [];
        camera.speed = 12;
        camera.inertia = 0.8;
    };

    // is called every frame
    const sceneBeforeRender = () => {
        if (xwingMeshRef.current && sceneRef.current && cameraRef.current) {

            const rotationSpeed: number = 0.03;

            if (leftPressed) {
                xwingMeshRef.current.rotation.z += rotationSpeed;
                cameraRef.current.rotation.z += rotationSpeed;
            }

            if (rightPressed) {
                xwingMeshRef.current.rotation.z -= rotationSpeed;
                cameraRef.current.rotation.z -= rotationSpeed;
            }
        }
    };

    function setupDeathStars(deathStarMesh: AbstractMesh) {

        const xIncrement: number = 100;
        const groupOffsetX: number = 400;
        const groupOffsetY: number = 200;
        const groupZ: number = 1000;
        const scale: number = 3;

        deathStarMesh.name = 'deathstar0';
        deathstarMeshesRef.current.push(deathStarMesh);

        for (let i: number = 0; i < 49; i++) {
            const newDeathStar = deathStarMesh.clone('deathstar' + (i + 1), null, false);
            deathstarMeshesRef.current.push(newDeathStar);
        }

        let deathStarLevel = 0;
        let xPos = 0;

        for (let i: number = 0; i < 50; i++) {
            const newDeathStar = deathstarMeshesRef.current[i];

            if (i > 0 && i % 10 === 0) {
                deathStarLevel += xIncrement;
                xPos = 0;
            }

            if (newDeathStar !== null) {
                xPos += xIncrement;
                let randY = Math.abs(Math.random() * 7) + 90;

                deathstarMeshesRef.current.push(newDeathStar);
                newDeathStar.position = new Vector3(xPos - groupOffsetX, deathStarLevel - groupOffsetY, groupZ);
                newDeathStar.rotation = new Vector3(0, randY, 0);
                newDeathStar.scaling = new Vector3(scale, scale, scale);
            }
        }
    }

    const createPointerLock = function (scene: core.Scene) {
        const canvas = scene.getEngine().getRenderingCanvas();

        if (canvas) {
            canvas.addEventListener("click", event => {
                canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
                if (canvas.requestPointerLock) {
                    canvas.requestPointerLock();
                }
            }, false);
        }
    };

    const onSceneMount = (args: SceneEventArgs) => {

        const scene = args.scene;
        sceneRef.current = scene;
        canvasRef.current = args.canvas;

        createPointerLock(scene);

        SceneLoader.ImportMeshAsync('', '/static/3dmodels/', 'xwing.glb', scene)
            .then((result: ISceneLoaderAsyncResult) => {
                if (cameraRef.current) {
                    xwingMeshRef.current = result.meshes[0];
                    xwingMeshRef.current.parent = cameraRef.current;
                }
            });

        SceneLoader.ImportMeshAsync('', '/static/3dmodels/', 'deathstar.glb', scene)
            .then((result: ISceneLoaderAsyncResult) => {
                setupDeathStars(result.meshes[0]);
            });

        scene.actionManager = new ActionManager(scene);

        // keydown
        scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
            if (evt.sourceEvent.type == "keydown") {

                const config = new ControlsConfig();
                switch (evt.sourceEvent.key) {
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
            if (evt.sourceEvent.type == "keyup") {

                const config = new ControlsConfig();
                switch (evt.sourceEvent.key) {
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
            <Engine antialias adaptToDeviceRatio canvasId="xwing-canvas">
                <Scene beforeRender={sceneBeforeRender} onSceneMount={onSceneMount}>
                    <flyCamera onCreated={cameraCreated} ref={cameraRef} name="xwingcamera"
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
