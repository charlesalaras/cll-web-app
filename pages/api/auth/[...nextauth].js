import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
    adapter: MongoDBAdapter(clientPromise),
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
        async signIn({ account, profile }) {
            if(account.provider === "google") {
                // Might want to fix this later, only accepts .edu accounts
                return profile.email_verified && profile.email.endsWith(".edu")
            }
            return true // Should never happen
        }
    },
    strategy: {
        session: "jwt",
    },
    */
    secret: process.env.NEXTAUTH_SECRET,
    database: process.env.MONGODB_URI,
});
