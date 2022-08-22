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
    // Error Function for errors
    // Name of user
}

export default function NewQuestion() {
    return(<div>NewQuestion</div>);
}
