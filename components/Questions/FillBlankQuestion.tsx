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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
// Typescript Interface
import { QuestionProps } from "./QuestionProps";

export default function MultipleChoiceQuestion(props: QuestionProps) {
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
    }, [data.attempts]);
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

    return();
}