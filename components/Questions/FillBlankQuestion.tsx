// Logical Imports
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetcher, replaceParams } from "./QuestionProps";
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

export default function FillBlankQuestion(props: QuestionProps) {
    // Asynchronous Fetches
    const { data, error } = useSWR("/api/questions/" + String(props.identifier), fetcher);
    const { mutate } = useSWRConfig();
    const { data: session } = useSession();
    const [variant, setVariant] = useState({id: "", params: {}, results: {}});
    // Question Statistics
    const [score, setScore] = useState(0);
    const [correct, setCorrect] = useState(false);
    const [attempts, setAttempts] = useState(-1);
    const [duration, setDuration] = useState(Date.now());
    const [answer, setAnswer] = useState({});
    // Internal Values
    const [questionError, setError] = useState(false);
    const [helperText, setHelperText] = useState("");
    // Dynamic questions use this to update its variant
    useEffect(() => {
        // Data non-existent
        if(!data) return;
        // Checks if question is dynamic, triggers only if data changed anyways
        if(Object.hasOwn(data, "smart")) setVariant({ id: data._id, params: data.params, results: data.results });
    }, [data]);
    // Checks if pertinent data exists
    useEffect(() => {
        if(!data) return;
        setAttempts(data.attempts);
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

    function checkAnswer(e) {
        e.preventDefault();

    }

    function createAnswers(answerBody: string) {
        var str = answerBody;
        const regex = /\<<(.*?)\>>/gm;
        const objects = str.split(regex); // Split the string into components
        const matches = Array.from(str.matchAll(regex)).map(a => a[1]);
        // FIXME: I'm not sure if this works... 
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
                            onChange={(e) => setAnswer(e.target.value)}
                            variant="filled">
                        </TextField>
                         : 
                        <Latex key={String(object)}>{String(object)}</Latex>
                    )
                })}
            </div>
            </>
        );
    }
    console.log(data);
    return(
    <>
        <Latex>{Object.hasOwn(data, "smart") ? replaceParams(data.body, variant.params) : data.body}</Latex>
        <br/>
        <form onSubmit={checkAnswer}>
        <FormControl>
        <FormLabel id="answers">Answers</FormLabel>
        {createAnswers(data.labels)}
        <Button variant="contained" type="submit" disabled={attempts == 0 || correct}>Submit</Button>
        </FormControl>
        </form>
        {data.figures.map((figure) => <img key={figure} src={figure} style={{float: 'right'}} alt="Figure for Question"/>)}
        {String(answer)}
        <Typography variant="subtitle1" sx={{ color: 'warning.main'}}>{String(attempts)} attempts remaining.</Typography>
    </>
    );
}
