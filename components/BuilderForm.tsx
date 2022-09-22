import { useEffect, useState } from "react";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

interface BuilderProps {
    callback: Function,
}

const questionTypes = [
    { value: "tf", label: "True / False", },
    { value: "mc", label: "Multiple Choice", },
    { value: "fb", label: "Fill in the Blank", },
    { value: "pm", label: "Select All", },
    { value: "im", label: "Multiple Choice Image", },
    { value: "pi", label: "Select All Images", }
];

export default function Builder() {
    return(
        <Box sx={{ flexGrow: 1, padding: "10px" }}>
        <FormControl fullWidth>
        <InputLabel>Question Type</InputLabel>
        <Grid 
            container 
            spacing={2}
            justifyContent="center"
            alignItems="center"
        >
            <Grid item xs={12}>
            <Select label="Question Type" fullWidth>
                {questionTypes.map((type: any, i: number) => {
                    return(
                        <MenuItem key={String(i)} value={type.value}>{type.label}</MenuItem>
                    );
                })}
            </Select>
            </Grid>
        </Grid>
        </FormControl>
        </Box>
    );
}
