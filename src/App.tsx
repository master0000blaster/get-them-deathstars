import { Container, Grid, Paper } from "@mui/material";
import XWingScene from "./components/x-wing-scene";


export default function App() {
  return (
    <Container maxWidth="lg">
      <Paper id='tab-content-container' elevation={2}>
        <Grid container item direction="column" alignItems={'center'} justifyContent={'space-around'}>
          <Grid item>
            <XWingScene />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
