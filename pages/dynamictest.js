import { useState, useEffect } from "react";
import Head from "next/head";
import useSWR, { useSWRConfig } from "swr";
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
    const { mutate } = useSWRConfig();

    const [variant, setVariant] = useState({id: "", params: {}, results: {}});
    const [fetchError, setError] = useState(false);

    useEffect(() => {
        if(!data) return;
        setVariant({id: data._id, params: data.params, results: data.results});
    }, [data]);

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

    function createAnswers(labels) {
        var str = labels;
        const regex = /\<<(.*?)\>>/gm;
        var objects = str.split(regex);
        const matches = [...str.matchAll(regex)].map(a => a[1]);

        return ( // NOTE: This only applies to fill in the blank questions.
            <div id="answers" style={{display: 'inline-flex', alignItems: 'center'}}>
                {objects.map((object) => {
                    if(matches.includes(object)) { 
                        return (<TextField id={object} label={object} size="small" variant="filled"></TextField>)
                    }
                    else {
                        return(<Latex>{object}</Latex>)
                    }
                })}
            </div>);
    }

    console.log(variant);
    function handleClick() {
        mutate("/api/questions/6303f13efc796e579c05925a");
        setVariant({id: data._id, params: data.params, results: data.results});
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
        <Paper elevation={24} square style={{lineHeight: "2.5"}}>
        <Latex>{replaceParams(data.body, variant.params)}</Latex>
        <br></br>
        {createAnswers(data.labels)}
        <br></br>
        <Typography>{`Correct Answers: ${JSON.stringify(variant.results)}`}</Typography>
        <img src={data.figures}></img>
        <p>{`Variant: ${variant.id}`}</p>
        </Paper>
        <Button variant="contained" size="large" onClick={handleClick} color="info" startIcon={<Casino />}>Random</Button>
        {fetchError ? <Alert severity="error">Could not fetch!</Alert> : null}
        </>
    );
}
