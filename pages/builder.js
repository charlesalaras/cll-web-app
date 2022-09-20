import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";

import Builder from "../components/BuilderForm";

export default function QuestionBuilder() {
    return(
        <>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}>
            <Paper variant="outlined">
                <Typography variant="h2">Question Builder</Typography>
                <Builder/>
            </Paper>
            </Grid>
            <Grid item xs={7}>
            <Paper variant="outlined">
                <Typography variant="h2">Question Preview</Typography>
            </Paper>
            </Grid>
        </Grid>
        </>
    );
}
