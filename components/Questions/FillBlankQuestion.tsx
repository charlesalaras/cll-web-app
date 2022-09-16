// Logical Imports
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
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
// Typescript Interface
import { QuestionProps } from "./QuestionProps";
// FIXME: Need to load states from database if available
export default function FillBlankQuestion(props: QuestionProps) {
    // Asynchronous Fetches
    const { data, error } = useSWR("/api/questions/" + String(props.identifier), fetcher);
    const { mutate } = useSWRConfig();
    const [variant, setVariant] = useState({id: "", params: {}, results: {}});
    // Question Statistics
    const [score, setScore] = useState(0);
    const [correct, setCorrect] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [duration, setDuration] = useState(Date.now());
    const [answer, setAnswer] = useState({});
    // Internal Values
    const [questionError, setError] = useState(false);
    const [helperText, setHelperText] = useState(" ");
    // Dynamic questions use this to update its variant
    useEffect(() => {
        // Data non-existent
        if(!data) return;
        // Checks if question is dynamic, triggers only if data changed anyways
        if(Object.hasOwn(data, "smart")) setVariant({ id: data._id, params: data.params, results: data.results });
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
        const keys = Object.keys(variant.results);
        for(let key in keys) {
            if(Object.hasOwn(answer, String(keys[key]))) { // Does the key exist in the object?
                // @ts-ignore
                if(answer[keys[key]] === "") {
                    setHelperText("Please answer all blanks.");
                    return;
                }
            } else { // Key wasn't existent at all
                setHelperText("Please answer all blanks.");
                return;
            }
        }
        // Check correct answer FIXME
        const answerSize = Object.keys(answer).length;
        var calcScore = 0;
        var currCorrect = true;
        for(let key in answer) {
            // @ts-ignore
            if(Object.hasOwn(variant.results, String(key)) && String(answer[key]) === String(variant.results[key])) {
                calcScore = calcScore + (1 / answerSize);
            }
            else {
                currCorrect = false;
            }
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
            answer, 
            Object.hasOwn(data, "smart") == true ? String(variant.id) : "");

        // Tell module about question status
        if((attempts + 1) >= maxAttempts || currCorrect) {
            props.callback(calcScore);
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

    function recordAnswer(event: any, key: string) {
        event.preventDefault();
        var added = {
            [key]: String(event.target.value).trim(),
        };
        var newAnswer = answer;
        Object.assign(newAnswer, added);
        setAnswer(newAnswer);
    }

    function createAnswers(answerBody: string) {
        var str = answerBody;
        const regex = /\<<(.*?)\>>/gm;
        const objects = str.split(regex); // Split the string into components
        const matches = Array.from(str.matchAll(regex)).map(a => a[1]);
        return (
            <>
            <div id="answers" style={{ display: 'inline-flex', alignItems: 'center' }}>
                {Array.from(objects).map((object) => {
                    return(matches.includes(object) == true ?
                        <TextField 
                            key={String(object)}
                            id={String(object)} 
                            label={String(object)} 
                            size="small"
                            onChange={(e) => recordAnswer(e, String(object))}
                            variant="filled"
                            required
                            >
                        </TextField>
                         : 
                        <Latex key={String(object)}>{String(object)}</Latex>
                    )
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
        <FormControl>
        <FormLabel id="answers">Answers</FormLabel>
        {createAnswers(data.labels)}
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
