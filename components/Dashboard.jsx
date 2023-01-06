import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Dashboard({ session }) {
    const supabase = useSupabaseClient()
    const user = useUser()
    //const [loading, setLoading] = useState(true);
    
    const [username, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [courses, setCourses] = useState([])

    useEffect(() => {
        getProfile()
    }, [session])

    async function getProfile() {
        console.log(user)
        if(user) {
            const { data, error } = await supabase
                .from('profiles')
                .upsert({ id: user.id, full_name: user.user_metadata.full_name, email: user.user_metadata.email })
                .select()

            if(error) alert("ERROR: Could not upsert account")

            if(data) {
                setName(data[0].full_name);
                setEmail(data[0].email);
                setCourses(data[0].courses);
            }
        }
    }

    return(
        <div>
            <p>Hello there!</p>
            <p>User: {username}</p>
            <p>Email: {email}</p>
            <p>Courses: {courses}</p>
            <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </div>
    );
}
