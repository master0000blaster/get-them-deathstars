import { Container, Grid } from "@mui/material";
import Game from "./components/game";
import { Global } from "@emotion/react";
import GameManager from "./managers/game-manager";

export default function App() {

  const rootElement = document.getElementById("root");

  rootElement!.addEventListener("pointerdown", (event) => {
    GameManager.pointerId = event.pointerId;
  },
    false,
  );

  return (
    <Container maxWidth="lg">
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - 0)`,
            overflow: 'visible',
          },
        }}
      />
      <Grid container item direction="column" alignItems={'center'} justifyContent={'space-around'}>
        <Grid item>
          <Game />
        </Grid>
      </Grid>
    </Container>
  );
}
