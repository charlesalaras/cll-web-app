import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { makeStyles } from '@material-ui/core'
import Button from "@mui/material/Button";
import Container from '@material-ui/core/Container'

import Builder from "../components/BuilderForm";

const useStyles = makeStyles({
    field: {
        marginTop: 20,
        marginBottom: 20,
        display: 'block'
    },

    buildContainer: {

    }
})

export default function QuestionBuilder() {
    const classes = useStyles()

    const [questionTitle, setTitle] = useState('')
    const [questionBody, setBody] = useState('')
    const [questionType, setType] = useState('')

    
    return(
        <Grid container spacing={2} columnSpacing={2}>

            <Grid item lg={6}>
                <Paper>
                  
                <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                >
                    Question Builder
                </Typography>

                <form noValidate autoComplete="off">
                    
                    <TextField
                        onChange={(e) => setTitle(e.target.value)}
                        className={classes.field}
                        label="Question Title"
                        variant="filled"
                        fullWidth
                        required
                    />

                    <InputLabel>Question Type</InputLabel>
                    <Select
                        onChange={(e) => setType(e.target.value)}
                        value={questionType}
                        label="Question Type"
                        variant="filled"
                        fullWidth
                        required
                    >
                        <MenuItem value={'MultipleChoice'}>Multiple Choice</MenuItem>
                        <MenuItem value={'TrueFalse'}>True or False</MenuItem>
                        <MenuItem value={'MultipleAnswer'}>Multiple Answers</MenuItem>
                        <MenuItem value={'FillInTheBlank'}>Fill in the Blank</MenuItem>
                    </Select>


                    <TextField
                        onChange={(e) => setBody(e.target.value)}
                        className={classes.field}
                        label="Question Body"
                        variant="filled"
                        multiline
                        rows={5}
                        fullWidth
                        required
                    />

                </form>
                </Paper>
            </Grid>


        </Grid>
    );
}
