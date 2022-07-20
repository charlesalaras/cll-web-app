import { useState } from "react";
import Latex from "react-latex";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import useSWR from "swr";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";

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

	console.log(data.answers.map((answer) => <li>{answer}</li>));
    return(
        <>
        <Latex>{String(data.body)}</Latex>
		<br/>
		<form onSubmit={checkAnswer}>
    	<FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Answers</FormLabel>
        <RadioGroup
        	aria-labelledby="demo-radio-buttons-group-label"
        	name="radio-buttons-group"
            value={value}
            onChange={handleRadioChange}
        >
			{data.answers.map((answer) => <FormControlLabel value={answer} control={<Radio/>} label={answer}/>)}
        </RadioGroup>
		<Button variant="contained" type="submit">Submit</Button>
    	</FormControl>
        </form>
        </>
    );
}
