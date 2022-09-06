import { useState, useEffect, Suspense } from "react";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import ArrowRight from "@mui/icons-material/ArrowRight";
import Skeleton from "@mui/icons-material/Skeleton";

type SectionType = {
    title: string,
    type: string,
    size: number,
    content: string[]
}

interface ModuleProps { // getStaticSideProps takes care of the data we need
    _id: string,
    name: string,
    sections: SectionType[],
    maxScore: number,
    userName: string,
}

const MultipleChoiceQuestion = React.lazy(() => import("./Questions/MultipleChoiceQuestion"));
const PickMultipleQuestion = React.lazy(() => import("./Questions/PickMultipleQuestion"));
const TrueFalseQuestion = React.lazy(() => import("./Questions/TrueFalseQuestion"));
const ImageQuestion = React.lazy(() => import("./Questions/ImageQuestion"));
const FillBlankQuestion = React.lazy(() => import("./Questions/FillBlankQuestion"));
const PickImageQuestion = React.lazy(() => import("./Questions/PickImageQuestion"));


export default function NewModule(props: any) {
    const [maxProgress, setMaxProgress] = useState([0, 0]); // Stores the max module & section progress so far
    const [moduleProgress, setModuleProgress] = useState(0); // Module progress based on sections
    const [sectionProgress, setSectionProgress] = useState(0); // Section progress
    const [moduleScore, setModuleScore] = useState(0); // Score in the module
    const [advance, setAdvance] = useState(false); // Ability to advance in a section / module
    const [error, setError] = useState(""); // Error message to be displayed if necessary

    let content: JSX.Element;
    // Effect that renders question or video based on where we are
    useEffect(() => {
        if(props.sections[moduleProgress].type == "question") {
            
        } else if(props.sections[moduleProgress].type == "video") {
            content = <iframe 
            src={props.sections[moduleProgress].content[sectionProgress]} 
            style={{height: '100%', width: '100%'}}>
            </iframe>
        } else if(props.sections[moduleProgress].type == "smart") {
            // Smart Question: Use struggling concepts / previous module questions to populate
        }
    }, [moduleProgress, sectionProgress]);

    function handlePrev() {
        if(sectionProgress > 0) {
            setSectionProgress(sectionProgress - 1);
        }
        else {
            if(moduleProgress != 0) {
                setModuleProgress(moduleProgress - 1);
                setSectionProgress(props.sections[moduleProgress].size - 1);
            }
        }
    }
    function handleNext() {
        if(sectionProgress < props.sections[moduleProgress].size -1) { // Inside of section
            setSectionProgress(sectionProgress + 1);
        }
        else { // Outside of section
            setModuleProgress(moduleProgress + 1);
            setSectionProgress(0);
        }
        if(props.sections[moduleProgress].type == "question") {
            setAdvance(false);
        }
    }
    function handleSave() {
    // FIXME: Update the save handling
    }
    function handleClose() {
        if(confirm("WARNING: Module progress is unsaved! Press 'OK' to continue")) {
            // close tab or go back
            history.back();
        }
    }
    
    function renderContent(content, slug): JSX.Element { // FIXME: Give me parameters!
        if(content === "video") {
            return <iframe></iframe>;
        }
        switch(content) {
            case "mc": // Multiple Choice
                return <MultipleChoiceQuestion {...slug}/>
            case "pm": // Pick Multiple
                return <PickMultipleQuestion {...slug}/>
            case "tf": // True False
                return <TrueFalseQuestion {...slug}/>
            case "im": // Image Choice
                return <ImageQuestion {...slug}/>
            case "fb": // Fill in the Blank
                return <FillBlankQuestion {...slug}/>
            case "pi": // Pick Image
                return <PickImageQuestion {...slug}/>
            default:
                return <div>ERROR</div>
        }
    }

    return(
    <Grid container spacing={2} sx={{ width: '100vw', height: '70vh'}}>
    <Grid item xs={9}>
    <Typography variant="h3">Moments of Forces</Typography>
    </Grid>
    <Grid item xs={3}>
        <ButtonGroup variant="contained" sx={{margin: '5%'}}>
            <Button onClick={handleClose} startIcon={<CloseIcon/>}>Close without Saving</Button>
            <Button onClick={handleSave} startIcon={<SaveIcon/>}>Save and Close</Button>
        </ButtonGroup>
    </Grid>
    <Grid item xs={3} sx={{height: '100%'}}>
        <Typography variant="h5">Module Progress</Typography>
        <Stepper orientation="vertical" activeStep={moduleProgress} sx={{height: '100%'}}>
            {(props.sections).map((step, index: number) => 
                <Step key={step.title}>
                   <StepLabel>{step.title}</StepLabel>
                   {index == moduleProgress ? 
                    <Typography variant="caption">Progress: {((sectionProgress / (step.size)) * 100).toFixed(1)}%</Typography> 
                    : null}
                </Step>
            )}
        </Stepper>
        <ButtonGroup>
            <Button onClick={handlePrev} startIcon={<ArrowLeft/>}>Previous</Button>
            <Button onClick={handleNext} endIcon={<ArrowRight/>} disabled={!advance}>Next</Button>
        </ButtonGroup>
    </Grid>
    <Grid item xs={9}>
        <Paper 
            elevation={8}
            sx={{height: '100%', boxSizing: 'border-box', padding: '20px'}}
        >
            <Suspense fallback={<Skeleton />}>
                {renderContent()}
            </Suspense>
        </Paper>
    </Grid>
    <Grid item xs={12}>
    {error === "" ? null : 
        <Alert severity="error">{error}</Alert>
    }
    </Grid>
    </Grid>
    );
}
