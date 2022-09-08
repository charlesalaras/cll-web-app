import Head from 'next/head';
import FillBlankQuestion from "../components/Questions/FillBlankQuestion";

export default function DynamicTest() {
    return(
        <>
        <Head>
            <link
                href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css"
                rel="stylesheet"
            />
        </Head>
        <FillBlankQuestion identifier='6303f13efc796e579c05925a'/>
        </>
    );
}
