import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";


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
    <>
    <Box sx={{ width: '100%' }}>
        <Stepper orientation="vertical">
            {steps.map((step) => 
                <Step key={step}>
                   <StepLabel>{step}</StepLabel> 
                </Step>
            )}
        </Stepper>
    </Box>
    <ButtonGroup>
        <Button>◀ Previous</Button>
        <Button>Next ▶</Button>
    </ButtonGroup>
    </>
    );
}
