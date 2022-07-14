import Latex from "react-latex";
import FormControl from "@mui/material/FormControl";

interface QuestionProps {
    type: string,
    body: string,
    answers: string[],
    correct: string[],
    attempts: number,
    figures: string[]
}

function Question(props: QuestionProps) {
    const [attempts, setAttempts] = useState(props.attempts); // Number of used attempts
    const [score, setScore] = useState(0); // Value between 0-1
    const [duration, setDuration] = useState(Date.now()); // End Time - Current Time

    const inputs = 0;
    return(
        <>
        <Latex>{props.body}</Latex>
        <FormControl>

        </FormControl>
        </>
    );
}
