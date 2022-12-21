import Head from 'next/head';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import NavBar from '../components/NavBar';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Home() {
    const session = useSession();
    const supabase = useSupabaseClient();

    return (
        <div className="container" style={{ padding: '50px 0px 100px 0'}}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
        {session ?
            <>
            <NavBar/>
            <Card>
                <CardContent>
                    <Typography>Signed in as {session.user.email}</Typography>
                </CardContent>
            </Card>
            </>
            :
            <Auth 
                supabaseClient={supabase} 
                appearance={{ theme: ThemeSupa }} 
                theme="light" 
                providers={['google']}
            />
        }
        </div>
    )
}

