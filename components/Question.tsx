import { useState, useEffect } from "react";
import Latex from "react-latex";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import useSWR from "swr";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useSession } from "next-auth/react";
import CheckBox from "@mui/material/Checkbox";

interface QuestionProps {
    identifier: string,
    success: (arg0: boolean) => void,
    //passClearStateFunc: (params: any) => void,
}

const fetcher = async (url) => fetch(url).then((res) => res.json());

export default function Question(props: QuestionProps) {
    // Grab question data
    const { data, error } = useSWR("/api/questions/" + String(props.identifier), fetcher);
    const { data: session } = useSession();

    const [apiError, setAPIError] = useState("");
    const [formError, setError] = useState(false);
    const [helperText, setHelperText] = useState(' ');
    const [value, setValue] = useState('');
    const [attempts, setAttempts] = useState(0); // Number of used attempts

    const [score, setScore] = useState(0); // Value between 0-1
    const [duration, setDuration] = useState(Date.now()); // End Time - Current Time 

    useEffect(() => { // Update important info on first contentful render
        if(!data) return;
        if(data.attempts) {
            setAttempts(data.attempts);
        }
        setDuration(Date.now()); // FIXME: This doesn't update correctly?
    }, [data]);

    const [disableButton, setDisable] = useState(false);
    
    if(error) return ('An error has occurred')
    if(!data) return ('Loading')
  
    const handleRadioChange = (event) => {
        setHelperText(' ');
        setError(false);
        setValue(event.target.value);
    }
    // Resets the component's state on parent reRender
    /*
    function clearState() { // FIXME: How do we let them return safely?
        setDisable(false);
        setError(false);
        setHelperText(' ');
        setValue('');
        setAttempts(0);
        setScore(0);
        setDuration(Date.now()); // FIXME: How should we calculate and send duration to records?
    }
    props.passClearStateFunc(clearState);
    */
	function checkAnswer(e) {
        e.preventDefault();
        if(value === '') {
            setHelperText('Please select an option.');
            setError(true);
            return;
        }
        const time = new Date(Date.now());
        if(session) {
            setAPIError("");
            var userName = session.user.name;
        }
        else {
            setAPIError("Invalid session token!");
            return;
        }
        var responseObject = {
            "iso8601": time.toISOString(),
            "name": String(userName),
            "verb": "answered",
            "question": props.identifier,
            "variant": "",
            "answer": String(value),
            "correct": false,
            "duration": (Date.now() - duration) / 1000,
        }
        if(value === data.correct[0]) { // FIXME: Rudimentary implementation only, need to handle multi answer case
            // Disable submit button here
            setHelperText('Correct! Select \'Next\' to continue.');
            setError(false);
            props.success(true); // FIXME: Still have to let them pass even if they failed
            setValue('');
            responseObject.correct = true;
            setDisable(true);
        }
        else {
            setHelperText('Incorrect!');
            setError(true);
            props.success(false);
            if(attempts > 0) {
                setAttempts(attempts - 1);
            }
        }
        if(attempts == 1) {
            setDisable(true);
        }
        // Send a record of answer
        // console.log(responseObject);

        fetch('/api/record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(responseObject),
        })
	}
    
    function renderFigures() {
        return (
            <>
            {data.figures.map((figure) => <img key={figure} src={figure} style={{float: 'right'}} alt="Figure for Question"/>)}
            </>);
    }

    function createContent() {
        if(data.type === "tf") { // True : False
        return(
        <RadioGroup
        	aria-labelledby="demo-radio-buttons-group-label"
        	name="radio-buttons-group"
            value={value}
            onChange={handleRadioChange}
        >
			{data.answers.map((answer) => <FormControlLabel key={answer} value={answer} control={<Radio/>} label={<Latex>{answer}</Latex>}/>)}
        </RadioGroup>);
        }
        else if(data.type === "mc") { // Multiple Choice
        return(
        <RadioGroup
        	aria-labelledby="demo-radio-buttons-group-label"
        	name="radio-buttons-group"
            value={value}
            onChange={handleRadioChange}
        >
			{data.answers.map((answer) => <FormControlLabel key={answer} value={answer} control={<Radio/>} label={<Latex>{answer}</Latex>}/>)}
        </RadioGroup>);
        }
        else if(data.type === "pm") { // Pick Many
        return(
        <FormGroup>
            {data.answers.map((answer) => <FormControlLabel key={answer} value={answer} control={<Checkbox/>} label={<Latex>{answer}</Latex>}/>)}
        </FormGroup>);
        }
        else if(data.type === "ic") { // Image Choice
        return(
        <RadioGroup>
            {data.answers.map((answer) => <FormControlLabel key={answer} value={answer} control={<Radio/>}/>)}
        </RadioGroup>
        );
        }
        else if(data.type === "mi") { // Multiple Images

        }
        else if(data.type === "fb") { // Fill in the Blank

        }
        else if(data.type === "mb") { // Multiple Blanks

        }
    }

    return(
        <>
        <Latex>{String(data.body)}</Latex>
		<br/>
		<form onSubmit={checkAnswer}>
    	<FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Answers</FormLabel>
		{createContent()}
        <FormHelperText sx={formError ? {color: 'error.main'} : {color: 'success.main'}}>{helperText}</FormHelperText>
        {disableButton ? 
            <Button variant="contained" type="submit" disabled>Submit</Button> :
            <Button variant="contained" type="submit">Submit</Button>
        }
        </FormControl>
        </form>
        <div>{attempts} attempts remaining.</div>
        {renderFigures()}
        { apiError === "" ? 
          null 
        : 
        <Alert severity="error">
            <AlertTitle>API Error</AlertTitle>
            Alert: {apiError}
        </Alert> }
        </>
    );
}
