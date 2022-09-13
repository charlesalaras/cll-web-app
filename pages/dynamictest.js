import Head from 'next/head';
import FillBlankQuestion from "../components/Questions/FillBlankQuestion";
import { useState } from "react";

export default function DynamicTest() {

    const [score, setScore] = useState(0);

    function pretendScore(questionScore, correct) {
        setScore(score + questionScore);
        if(correct) {
            console.log("It's correct!");
        }
    }
    return(
        <>
        <Head>
            <link
                href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css"
                rel="stylesheet"
            />
        </Head>
        <FillBlankQuestion identifier='6303f13efc796e579c05925a' uuid="testsession" callback={pretendScore}/>
        <div>{score}</div>
        </>
    );
}
