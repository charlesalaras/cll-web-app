import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

export default function QuestionBuilder() {
    // FIXME: Give topics chips
    return(
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Paper elevation={4}>
                    <Typography variant="h4">Write a Question</Typography>
                    <FormControl fullWidth>
                    <InputLabel id="question-type-label">Question Type</InputLabel>
                    <Select
                        labelId="question-type-label"
                        id="question-type"
                        label="Question Type"
                    >
                        <MenuItem>True / False</MenuItem>
                        <MenuItem>Multiple Choice</MenuItem>
                    </Select>
                    <TextField
                        variant="outlined"
                        id="question-body"
                        label="Question Body"
                        required
                        multiline
                    />
                    <InputLabel id="question-topics-label">Core Topics</InputLabel>
                    <Select
                        labelId="question-topics-label"
                        id="question-topics"
                        multiple
                        value={[]}
                    >
                        <MenuItem>2D Vectors</MenuItem>
                        <MenuItem>Momentum</MenuItem>
                    </Select>
                    </FormControl>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper elevation={4}>
                    <Typography variant="h4">Question Preview</Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}
