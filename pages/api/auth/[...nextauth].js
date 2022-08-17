import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google';
//import clientPromise from "../../../lib/mongodb";

export default NextAuth({
    //adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            }
        })
    ],
    /*
    callbacks: {
        jwt: async ({ token, user }) => {
            user && (token.user = user)
            return token;
        },
        session: async ({ session, token }) => {
            session.user = token.user
            return session
        }
    },
    */
    secret: process.env.NEXTAUTH_SECRET,
});
