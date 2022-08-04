import Head from 'next/head';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';
import NavBar from '../components/NavBar';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
    const { data: session } = useSession();
    
    return (
        <div className="container">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
        {session ? 
            <Card>
                <CardContent>
                    <Typography>You are logged in!</Typography>
                </CardContent>
                <Button onClick={() => signOut()}>Sign Out</Button>
            </Card>
            :
            <Card>
                <CardContent>
                    <Button variant="outlined" startIcon={<GoogleIcon/>} onClick={() => signIn()}>Sign in with Google</Button>
                    <Typography>* Please use Google account provided by educational institution</Typography>
                </CardContent>
            </Card>
        }
        </div>
    )
}

