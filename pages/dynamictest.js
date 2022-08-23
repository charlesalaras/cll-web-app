import { useState, useEffect } from "react";
import Head from "next/head";
import useSWR from "swr";
import Latex from "react-latex";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Casino from "@mui/icons-material/Casino";
import Paper from "@mui/material/Paper";

const fetcher = async (url) => fetch(url).then((res) => res.json());

export default function Dynamic() {
    const { data, error } = useSWR("/api/questions/6303f13efc796e579c05925a", fetcher);
    
    const [variant, setVariant] = useState({id: "", params: {}, results: {}});
    const [fetchError, setError] = useState(false);

    if(error) return(<Alert severity="error">Could not fetch question data</Alert>);
    if(!data) return("Data not found!");

    function replaceParams(body, params) {
        var p = body;
        const regex = /\{{(.*?)\}}/gm;
        const matches = p.matchAll(regex);
        for(const match of matches) {
            p = p.replace(match[0], params[match[1]]);
        }
        return p;
    }

    function handleClick() {
        /*
        let {varParams, varError} = useSWR("/api/questions/6303f13efc796e579c05925a", fetcher);
        if(varError) {
            setError(true);
        }
        else {
            setError(false);
        }
        if(!varParams) return;
        setVariant({id: _id, params: varParams.params, results: varParams.results});
        */
        alert('Button clicked!');
    }

    return(
        <>
        <Head>
        <link
            href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css"
            rel="stylesheet"
        />
        </Head>
        <Typography variant="h1" gutterBottom>Dynamic Question Example</Typography>
        <Paper elevation={24} square>
        <Latex>{replaceParams(data.body, variant.params)}</Latex>
        <br></br>
        <Latex>{data.labels}</Latex>
        <br></br>
        <img src={data.figures}></img>
        <p>{`Variant: ${variant._id}`}</p>
        </Paper>
        <Button variant="contained" size="large" onClick={handleClick} color="info" startIcon={<Casino />}>Random</Button>
        {fetchError ? <Alert severity="error">Could not fetch!</Alert> : null}
        </>
    );
}
