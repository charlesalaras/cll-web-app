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
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import ArrowRight from "@mui/icons-material/ArrowRight";
import Question from "./Question";
import { useSession } from "next-auth/react";

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
    const { data: session } = useSession();

    const [moduleProgress, setModuleProgress] = useState(0)
    const [moduleScore, setModuleScore] = useState(0)
    const [sectionIterator, setIterator] = useState(0)
    const [questionSuccess, setSuccess] = useState(false)
    
    var clearState = null;

    function assignClear(childClearFunc) {
        clearState = childClearFunc;
    }
    function resetQuestion() {
        if(clearState) {
            clearState();
        }
    }
    function setPassage(result: boolean) {
        setSuccess(result)
    }
    function handleNext() {
        // Still within a section
        if(sectionIterator < props.sections[moduleProgress].size - 1) {
            if(props.sections[moduleProgress].type == "question" && questionSuccess == true) {
                setIterator(sectionIterator + 1);
                resetQuestion();
                setSuccess(false);
            }
        }
        // Outside of the section
        else {
            setModuleProgress(moduleProgress + 1);
            setIterator(0);
        }
    }

    function handlePrev() {
        if(sectionIterator > 0) {
            setIterator(sectionIterator - 1);   
        }
        else {
            if(moduleProgress != 0) {
                setModuleProgress(moduleProgress - 1);
                setIterator(0);
            }
        }
    }

    function handleContent() {
        if(props.sections[moduleProgress].type == "video") {
            return (
                <iframe src={props.sections[moduleProgress].content[sectionIterator]} style={{height: '100%', width: '100%'}}></iframe>
            );
        }
        else if(props.sections[moduleProgress].type == "question") {
            return (
                <Question
                    key={props.sections[moduleProgress].content[sectionIterator]}
                    identifier={props.sections[moduleProgress].content[sectionIterator]} 
                    success={setPassage}/>
            );
        }
    }

    function handleSave() {
        const time = new Date(Date.now());
        var completionObject = {
            "iso8601": time.toISOString(),
            "name": String(session.user.name),
            "module": props._id,
            "currentScore": moduleScore,
            "moduleProgress": moduleProgress,
        }
        fetch('/api/sendCompletion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(completionObject),
        }) 
    }
    /*
    let content = handleContent();

    useEffect(() => {
       content = handleContent(); 
    }, [moduleProgress, sectionIterator])
    */
    return(
    <Grid container spacing={2} sx={{ width: '100vw', height: '70vh'}}>
    <Grid item xs={9}>
    <Typography variant="h3">Moments of Forces</Typography>
    </Grid>
    <Grid item xs={3}>
        <ButtonGroup variant="contained" sx={{margin: '5%'}}>
            <Button startIcon={<CloseIcon/>}>Close without Saving</Button>
            <Button startIcon={<SaveIcon/>} onClick={handleSave}>Save and Close</Button>
        </ButtonGroup>
    </Grid>
    <Grid item xs={3} sx={{height: '100%'}}>
        <Typography variant="h5">Module Progress</Typography>
        <Stepper orientation="vertical" activeStep={moduleProgress} sx={{height: '100%'}}>
            {(props.sections).map((step, index) => 
                <Step key={step.title}>
                   <StepLabel>{step.title}</StepLabel>
                   {index == moduleProgress ? 
                    <Typography variant="caption">Progress: {((sectionIterator / (step.size)) * 100).toFixed(1)}%</Typography> 
                    : null}
                </Step>
            )}
        </Stepper>
        <ButtonGroup>
            <Button onClick={handlePrev} startIcon={<ArrowLeft/>}>Previous</Button>
            <Button onClick={handleNext} endIcon={<ArrowRight/>}>Next</Button>
        </ButtonGroup>
    </Grid>
    <Grid item xs={9}>
        <Paper 
            elevation={8}
            sx={{height: '100%', boxSizing: 'border-box', padding: '20px'}}
        >
            {handleContent()}
        </Paper>
    </Grid>
    </Grid>
    );
}
