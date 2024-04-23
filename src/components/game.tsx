import "../styles.css";
import { Engine, Scene, SceneEventArgs, Skybox } from "react-babylonjs";
import * as core from "@babylonjs/core";
import { ActionManager, ExecuteCodeAction, ISceneLoaderAsyncResult, PointerEventTypes, SceneLoader, Sound } from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/loaders";
import { useEffect, useState } from "react";
import AssetManager from "../managers/asset-manager";
import GameManager from "../managers/game-manager";
import { Button, Dialog, DialogContent, Grid, Paper, Typography } from "@mui/material";
import { LaserManager } from "../managers/laser-manager";
import DeathStarManager from "../managers/death-star-manager";
import ReactPlayer from "react-player";
import Chip from '@mui/material/Chip';

export default function Game() {

  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);
  const [startDisplayIsVisible, setStartDisplayIsVisible] = useState(true);
  const [skipIntroIsVisible, setSkipIntroIsVisible] = useState(false);
  const [endVideoDialogIsOpen, setEndVideoDialogIsOpen] = useState(false);
  const [endVideoIsPlaying, setEndVideoIsPlaying] = useState(false);

  const cameraCreated = (camera: core.FlyCamera, scene: core.Scene) => {
    AssetManager.flyCamera = camera;
    AssetManager.flyCamera.lockedTarget = DeathStarManager.deathStars[24];
    AssetManager.flyCamera.inputs.clear();
  };

  // is called every frame
  const sceneBeforeRender = () => {
    LaserManager.advanceLaserBeamPositions();

    if (GameManager.isPaused) return;

    const { xwingMesh, flyCamera } = AssetManager;
    if (!xwingMesh || !flyCamera) return;

    if (leftPressed) {
      xwingMesh.rotation.z += GameManager.rotationSpeed;
      flyCamera.rotation.z += GameManager.rotationSpeed;
    }

    if (rightPressed) {
      xwingMesh.rotation.z -= GameManager.rotationSpeed;
      flyCamera.rotation.z -= GameManager.rotationSpeed;
    }
  };

  const outroEnded = () => {
    GameManager.letGoOfPointer();
    setEndVideoDialogIsOpen(true);
    setEndVideoIsPlaying(true);
  };

  const endingEnded = () => {
    GameManager.letGoOfPointer();
    setEndVideoDialogIsOpen(false);
    setEndVideoIsPlaying(false);
    resetGame();
  };

  const fireLaser = () => {
    LaserManager.fireLaser();
  };

  const resetGame = () => {
    GameManager.letGoOfPointer();
    setEndVideoDialogIsOpen(false);
    setSkipIntroIsVisible(false);
    setStartDisplayIsVisible(true);
    GameManager.isPaused = true;
  };

  const introLoaded = () => {
  };

  const introEnded = () => {
    setStartDisplayIsVisible(false);
    GameManager.isPaused = false;
    GameManager.resetGame();
    setSkipIntroIsVisible(false);
    GameManager.grabPointer();
  };

  const startGame = () => {
    setStartDisplayIsVisible(false);
    setSkipIntroIsVisible(true);

    if (core.Engine.audioEngine && core.Engine.audioEngine.audioContext) {
      core.Engine.audioEngine.audioContext.resume();
    }

    if (GameManager.isDeveloperMode) {
      AssetManager.introAudio?.play(0, 0, 1);
    } else {
      AssetManager.introAudio?.play();
    }

    GameManager.isPaused = true;
    GameManager.screenCapHasClicked = false;
    DeathStarManager.setupDeathStars();
    AssetManager.setupFlyCamera();
  };

  const skipIntro = () => {
    AssetManager.introAudio?.stop();
    setSkipIntroIsVisible(false);
    GameManager.isPaused = false;
    GameManager.grabPointer();
  };

  const onSceneMount = (args: SceneEventArgs) => {

    AssetManager.scene = args.scene;
    AssetManager.canvas = args.canvas;
    const { scene } = AssetManager;

    GameManager.isPaused = true;
    AssetManager.pewSound = new Sound("pew", "/static/sounds/PEW.mp3", scene, null, { loop: false, autoplay: false });
    AssetManager.introAudio = new Sound("intro", "/static/sounds/intro.mp3", scene, introLoaded, { loop: false, autoplay: false });
    AssetManager.introAudio.onended = introEnded;
    AssetManager.outroAudio = new Sound("outro", "/static/sounds/outro.mp3", scene, null, { loop: false, autoplay: false });
    AssetManager.outroAudio.onended = outroEnded;
    AssetManager.explosionSound = new Sound("explosion", "/static/sounds/explosion.mp3", scene, null, { loop: false, autoplay: false });

    SceneLoader.ImportMeshAsync("", "/static/3dmodels/", "xwing.glb", scene).then((result: ISceneLoaderAsyncResult) => {
      AssetManager.xwingMesh = result.meshes[0];
    });

    SceneLoader.ImportMeshAsync("", "/static/3dmodels/", "deathstar.glb", scene).then((result: ISceneLoaderAsyncResult) => {
      DeathStarManager.originalDeathStarMesh = result.meshes[0];
    });

    scene.actionManager = new ActionManager(scene);

    scene.onPointerObservable.add((pointerInfo: core.PointerInfo) => {

      if (GameManager.isPaused) return;

      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN: {
          if (true) { //GameManager.screenCapHasClicked) {
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
    });

    // keydown
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {

        if (GameManager.isPaused) return;

        if (evt.sourceEvent.type == "keydown") {
          switch (evt.sourceEvent.key.toLowerCase()) {
            case "a": {
              setLeftPressed(true);
              break;
            }
            case "d": {
              setRightPressed(true);
              break;
            }
            default: {
              break;
            }
          }
        }
      })
    );

    // keyup
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {

        if (GameManager.isPaused) return;

        if (evt.sourceEvent.type == "keyup") {
          switch (evt.sourceEvent.key.toLowerCase()) {
            case "a": {
              setLeftPressed(false);
              break;
            }
            case "d": {
              setRightPressed(false);
              break;
            }
            default: {
              break;
            }
          }
        }
      })
    );

    setStartDisplayIsVisible(true);
  };

  const endVideoOnClose = () => {
    setEndVideoDialogIsOpen(false);
    setStartDisplayIsVisible(true);
    GameManager.isPaused = true;
  };

  return (
    <Grid container flexDirection={"column"}>
      <h2>Get them Death Stars</h2>

      <Grid item alignItems={"flex-start"}>
        <Grid container spacing={3} item justifyContent={"space-between"} flexDirection={"row"}>
          <Grid item container>
            W: Forward | S: Backward | A: Roll Left | D: Roll Right | Fire: Left Mouse
          </Grid>
          <Grid item container flexDirection={"row"} justifyContent={"space-between"} alignContent={"flex-end"}>
            <Chip label="Press ESC at anytime to release the pointer lock." />
            <Button color={"info"} variant="contained" href="https://github.com/master0000blaster/get-them-deathstars" target={"_blank"}>
              <img style={{ maxWidth: 50 }} src="/static/images/GitHub_Logo.png" />
              Project
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Paper elevation={2}>
          <Engine antialias adaptToDeviceRatio canvasId="xwing-canvas">
            <Scene beforeRender={sceneBeforeRender} onSceneMount={onSceneMount}>
              <flyCamera
                onCreated={cameraCreated}
                name="xwingcamera"
                position={new Vector3(0, 0, -30)}
                bankedTurn={true}
                rollCorrect={0}
                bankedTurnMultiplier={2}
                noRotationConstraint={true} />
              <hemisphericLight name="light1" intensity={0.7} direction={new Vector3(0.5, 1, 0)} />
              <Skybox size={10000} rootUrl="/static/images/space-skybox/" name={"skybox"} />
            </Scene>
          </Engine>
        </Paper>
      </Grid>
      <Dialog maxWidth={"xl"} open={endVideoDialogIsOpen} onClose={endVideoOnClose}>
        <DialogContent>
          <Grid container alignItems={"center"} flexDirection={"column"}>
            <Grid item>
              <Typography color={"black"} fontSize={40} fontFamily={"Arial"}>
                You're Champion of the Galaxy!
              </Typography>
            </Grid>
            <Grid item>
              <ReactPlayer
                url={GameManager.youTubeOutroVideoURL}
                onEnded={endingEnded}
                playing={endVideoIsPlaying}
                config={{
                  youtube: {
                    playerVars: {
                      // https://developers.google.com/youtube/player_parameters
                      autoplay: 0,
                      start: GameManager.outroVideoStartSeconds,
                      end: GameManager.outroVideoEndSeconds,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item>
              <Button color={"info"} variant="contained" onClick={resetGame}>
                Reset Game
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Paper elevation={8} style={{ position: "relative", top: "-400px", display: startDisplayIsVisible ? "block" : "none" }} >
        <Grid container
          alignItems={"center"}
          alignContent={"space-around"}
          padding={4}
          justifyContent={"space-around"}
          flexDirection={"column"}>
          <Grid item>
            <Typography color={"black"} fontSize={60} fontFamily={"Arial"}>
              Ready?
            </Typography>
          </Grid>
          <Grid item>
            <Button color={"info"} variant="contained" onClick={startGame}>
              START
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={8} style={{ position: "relative", top: "-500px", display: skipIntroIsVisible ? "block" : "none" }} >
        <Grid container
          alignItems={"center"}
          alignContent={"space-around"}
          padding={4}
          justifyContent={"space-around"}
          flexDirection={"column"}>
          <Grid item>
            <Button color={"primary"} variant="outlined" onClick={skipIntro}>
              Skip Intro {">"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
