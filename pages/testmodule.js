import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function TestModule({ question }) {

    return(
        <>
        <Head>
        <link
            href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css"
            rel="stylesheet"
        />
        </Head>

        <NavBar/>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const supabase = useSupabaseClient(ctx);
    
    const { data, error } = await supabase.from("questions").select('*').single();

    if(error) {
        console.log("ERROR: " + error.message);
        return {
            props: {
                question: null,
            }
        }
    }

    return {
        props: {
            question: data,
        }
    }
}
