import NextAuth from "next-auth"
import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
export const authOptions: AuthOptions = {
    pages:{
        signIn: "/",
    },
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
            }
          }
      })
    // ...add more providers here
  ],
}

