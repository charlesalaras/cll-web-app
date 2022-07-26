import { useState } from "react";
import Latex from "react-latex";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import useSWR from "swr";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";

interface QuestionProps {
    identifier: string
}

const fetcher = async (url) => fetch(url).then((res) => res.json());

export default function Question(props: QuestionProps) {
    const [value, setValue] = useState('');
    const [attempts, setAttempts] = useState(props.attempts); // Number of used attempts
    const [score, setScore] = useState(0); // Value between 0-1
    const [duration, setDuration] = useState(Date.now()); // End Time - Current Time

    const { data, error } = useSWR("/api/questions/" + String(props.identifier), fetcher);
    
    if(error) return ('An error has occurred')
    if(!data) return ('Loading')

    const handleRadioChange = (event) => {
        setValue(event.target.value);
    }
	function checkAnswer(e) {
        e.preventDefault();
        if(value === data.correct[0]) { // FIXME: Rudimentary implementation only, need to handle multi answer case
            alert("Answer is correct!");
        }
        else {
            alert("Answer is incorrect!");
        }
        // Send a record of answer
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
			{data.answers.map((answer) => <FormControlLabel value={answer} control={<Radio/>} label={<Latex>{answer}</Latex>}/>)}
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
			{data.answers.map((answer) => <FormControlLabel value={answer} control={<Radio/>} label={<Latex>{answer}</Latex>}/>)}
        </RadioGroup>);
        }
        else if(data.type === "pm") { // Pick Many
        return(
        <FormGroup>
        </FormGroup>);
        }
        else if(data.type === "ic") { // Image Choice

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
        <Button variant="contained" type="submit">Submit</Button>
        </FormControl>
        </form>
        {renderFigures()}
        </>
    );
}
