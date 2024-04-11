import { Container, Grid } from "@mui/material";
import Game from "./components/game";

export default function App() {
  return (
    <Container maxWidth="lg">
      <Grid container item direction="column" alignItems={'center'} justifyContent={'space-around'}>
        <Grid item>
          <Game />
        </Grid>
      </Grid>
    </Container>
  );
}
