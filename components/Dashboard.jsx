import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Dashboard({ session }) {
    const supabase = useSupabaseClient()
    const user = useUser()
    const [loading, setLoading] = useState(true);
    
    const [username, setName] = useState(null)
    const [courses, setCourses] = useState([])

    useEffect(() => {
        getProfile()
    }, [session])

    async function getProfile() {
        try {
            setLoading(true)
           
            let { data, error, status } = await supabase
                .from('profiles')
                .select(`username, courses`)
                .eq('id', user.id)
                .single()

            if(error && status !== 406) {
                throw error
            }
            if(data) {
                // Update user data variables here
                setName(data.name)
                setCourses(data.courses)
            }
        } catch (error) {
            alert('Error loading user data!')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return(
        <div>
            <p>{username}</p>
            <p>{courses}</p>
        </div>
    );
}
