// Logical Imports
import React from "react";
import { useEffect, useState } from "react";
import { fetcher, replaceParams, sendAttempt } from "./QuestionProps";
import useSWR, { useSWRConfig } from "swr";
// Component Imports
import Latex from "react-latex";
import Typography from "@mui/material/Typography";
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
// Typescript Interface
import { QuestionProps } from "./QuestionProps";
// FIXME: Need to load states from database if available
export default function ImageQuestion(props: QuestionProps) {
    // Asynchronous Fetches
    const { data, error } = useSWR("/api/questions/" + String(props.identifier), fetcher);
    const { mutate } = useSWRConfig();
    const [variant, setVariant] = useState({id: "", params: {}});
    // Question Statistics
    const [score, setScore] = useState(0);
    const [correct, setCorrect] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [duration, setDuration] = useState(Date.now());
    const [answer, setAnswer] = useState("");
    // Internal Values
    const [questionError, setError] = useState(false);
    const [helperText, setHelperText] = useState(" ");
    // Dynamic questions use this to update its variant
    useEffect(() => {
        // Data non-existent
        if(!data) return;
        // Checks if question is dynamic, triggers only if data changed anyways
        if(Object.hasOwn(data, "smart")) setVariant({ id: data._id, params: data.params });
    }, [data]);
    // Does question data exist?
    if(error) {
        return (
            <Alert severity="error">
                <AlertTitle>SWR Fetch Failed</AlertTitle>
                {`Error: Could not fetch data of question ${props.identifier}`}
            </Alert>
        );
    }
    if(!data) {
        return (<CircularProgress />);
    }

    const maxAttempts = data.attempts;

    function checkAnswer(e: any) {
        e.preventDefault();
        // Ensure an answer was existent
        if(answer === "") {
            setHelperText("Please select an answer.");
            setError(true);
            return;
        }
        // Check correct answer
        var calcScore = 0;
        var currCorrect = false;
        if(answer === String(data.correct)) {
            currCorrect = true;
            calcScore = 1;
        }
        // Send record
        const time = new Date(Date.now());

        sendAttempt(
            props.uuid,
            time.toISOString(),
            (Date.now() - duration) / 1000,
            calcScore,
            currCorrect, 
            props.identifier, 
            attempts + 1, 
            {answer: answer}, 
            Object.hasOwn(data, "smart") == true ? String(variant.id) : "");

        // Tell module about question status
        if((attempts + 1) >= maxAttempts || currCorrect) {
            props.callback(calcScore, currCorrect);
        }
        // Update states
        setScore(Math.max(score, calcScore));
        setCorrect(currCorrect);
        setAttempts(attempts + 1);
        setDuration(Date.now());
        // Update variant here if possible
        if((attempts + 1) < maxAttempts && !currCorrect && Object.hasOwn(data, "smart")) { 
            mutate('/api/questions/' + String(props.identifier));
        }
    }
    
    const handleRadioChange = (event: any) => {
        setAnswer((event.target as HTMLInputElement).value);
        setHelperText(' ');
        setError(false);
    }

    function createAnswers(params: string[]) {
        return (
            <>
            <div id="answers">
                    {Array.from(params).map((object) => {
                        return(
                            <>
                            <FormControlLabel 
                                value={object} 
                                control={<Radio />} 
                                label={<img src={object}></img>}
                                onChange={handleRadioChange}
                            />
                            </>
                        );
                    })}
            </div>
            </>
        );
    }

    return(
    <>
        <Latex>{Object.hasOwn(data, "smart") ? replaceParams(data.body, variant.params) : data.body}</Latex>
        <br/>
        <form onSubmit={checkAnswer} noValidate autoComplete="off">
        <FormControl error={questionError}>
        <FormLabel id="answers">Answers</FormLabel>
        <RadioGroup>
        {createAnswers(data.answers)}
        </RadioGroup>
        <FormHelperText>{helperText}</FormHelperText>
        <div>
        <Button variant="contained" type="submit" size="large" disabled={attempts == maxAttempts || correct}>Submit</Button>
        </div>
        </FormControl>
        </form>
        {data.figures.map((figure: string) => <img key={figure} src={figure} style={{float: 'right'}} alt="Figure for Question"/>)}
        <Typography variant="subtitle1" sx={{ color: 'warning.main'}}>{String(maxAttempts - attempts)} attempts remaining.</Typography>
    </>
    );
}
