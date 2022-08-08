import Head from 'next/head';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';
import NavBar from '../components/NavBar';
import { signOut, useSession } from 'next-auth/react';

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
                    <Typography>Signed in as {session.user.email}</Typography>
                </CardContent>
                <Button onClick={() => signOut()}>Sign Out</Button>
            </Card>
            : <div>ERROR: Not logged in! How are you here?</div>
        }
        </div>
    )
}
