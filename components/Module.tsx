import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

export default function Module() {
    const steps = [
        "Concept Quiz", 
        "Lecture Video 1", 
        "Test Your Understanding", 
        "Lecture Video 2", 
        "Test Your Understanding 2",
        "Final Quiz"
        ];
    return(
    <Grid container spacing={2}>
    <Grid item xs={12}>
    <Typography align="center" variant="h3">Moments of Forces</Typography>
    </Grid>
    <Grid item xs={4}>
        <Typography variant="h5">Module Progress</Typography>
        <Stepper orientation="vertical">
            {steps.map((step) => 
                <Step key={step}>
                   <StepLabel>{step}</StepLabel> 
                </Step>
            )}
        </Stepper>
        <ButtonGroup>
            <Button>◀ Previous</Button>
            <Button>Next ▶</Button>
        </ButtonGroup>
    </Grid>
    </Grid>
    );
}
