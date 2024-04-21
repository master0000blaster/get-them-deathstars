import { Container, Grid } from "@mui/material";
import Game from "./components/game";
import { Global } from "@emotion/react";

export default function App() {
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
