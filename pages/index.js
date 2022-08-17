import Head from 'next/head';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';
import NavBar from '../components/NavBar';
import { signOut, useSession } from 'next-auth/react';
import clientPromise from '../lib/mongodb'

export default function Home({ isConnected }) {
    const { data: session } = useSession();
    
    return (
        <div className="container">
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
                <Button onClick={() => signOut()}>Sign Out</Button>
            </Card>
            </>
            : <div>ERROR: Not logged in! How are you here?</div>
        }
        {isConnected ? (
          <h2 className="subtitle">You are connected to MongoDB</h2>
        ) : (
          <h2 className="subtitle">
            You are NOT connected to MongoDB. Check the <code>README.md</code>{' '}
            for instructions.
          </h2>
        )}
        </div>
    )
}

export async function getServerSideProps(context) {
  try {
    await clientPromise
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}
