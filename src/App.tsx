import { Container, Grid } from "@mui/material";
import XWingScene from "./components/x-wing-scene";


export default function App() {
  return (
    <Container maxWidth="lg">
      <Grid container item direction="column" alignItems={'center'} justifyContent={'space-around'}>
        <Grid item>
          <XWingScene />
        </Grid>
      </Grid>
    </Container>
  );
}
