import { connectToDatabase } from "../util/mongodb";
import Head from "next/head";
import Module from "../components/Module";
import NavBar from "../components/NavBar";


export default function TestModule({ module }) {
    return(
        <>
        <Head>
        <link
            href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css"
            rel="stylesheet"
        />
        </Head>

        <NavBar/>
        <Module {... module }/>
        </>
    );
}

export async function getServerSideProps() {
    const { db } = await connectToDatabase();

    const module = await db
        .collection("modules")
        .findOne({})

    return {
        props: { 
            module: JSON.parse(JSON.stringify(module))
        },
    };
}
