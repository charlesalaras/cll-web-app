import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

type SectionType = {
    title: string,
    type: string,
    size: number,
    content: string[]
}

interface ModuleProps {
    _id: string,
    name: string,
    sections: SectionType[]
}

export default function Module(props: ModuleProps) {
    /* Module data
     * - Section Titles
     *    - Need to know content of sections to render to a section
     * - Module Progress
     * - Module Score
     * - Section Iterator
     */
    const [moduleProgress, setModuleProgress] = useState(0)
    const [moduleScore, setModuleScore] = useState(0)
    const [sectionIterator, setIterator] = useState(0)

    function handleNext() {
        setModuleProgress(moduleProgress + 1);
    }

    function handlePrev() {
        setModuleProgress(moduleProgress - 1);
    }

    useEffect(() => {
       console.log(moduleProgress) 
    }, [moduleProgress])

    return(
    <Grid container spacing={2}>
    <Grid item xs={8}>
    <Typography variant="h3">Moments of Forces</Typography>
    </Grid>
    <Grid item xs={4}>
        <ButtonGroup variant="contained">
            <Button>❌ Close without Saving</Button>
            <Button>💾 Save and Close</Button>
        </ButtonGroup>
    </Grid>
    <Grid item xs={4}>
        <Typography variant="h5">Module Progress</Typography>
        <Stepper orientation="vertical">
            {(props.sections).map((step) => 
                <Step key={step.title}>
                   <StepLabel>{step.title}</StepLabel> 
                </Step>
            )}
        </Stepper>
        <ButtonGroup>
            <Button onClick={handlePrev}>◀ Previous</Button>
            <Button onClick={handleNext}>Next ▶</Button>
        </ButtonGroup>
    </Grid>
    <Grid item xs={8}>
        <Paper variant="outlined">
        </Paper>
    </Grid>
    </Grid>
    );
}
