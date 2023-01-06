import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Dashboard from '../components/Dashboard'

export default function Home() {
    const session = useSession()
    const supabase = useSupabaseClient()

    return(
        <div id="container">
        {!session ? (
            <>
            <div>
            <strong>{"IMPORTANT: Use your given UCR email, with <netid>@ucr.edu. Alternatively, click the button 'Sign in with Google' and log in with your school provided email."}</strong>
            </div>
            <Auth 
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google']}
                theme="light"
            />
            </>
        ) :
        (<Dashboard session={session}/>)}
        </div>
    );
}
