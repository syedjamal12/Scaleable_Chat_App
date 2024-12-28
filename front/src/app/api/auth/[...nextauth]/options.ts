import NextAuth, { ISODateString } from "next-auth"
import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import dotenv from "dotenv";
import { JWT } from "next-auth/jwt";
dotenv.config();

export interface CustomSession {
  user?:CustomUser;
  expires:ISODateString
}
export interface CustomUser{
  id?:string|null,
  name?:string|null,
  email?:string|null,
  image?:string|null,
  provider?:string|null,
  token?:string|null

}

export const authOptions: AuthOptions = {
    pages:{
        signIn: "/",
    },

  
  callbacks: {
    
    async session({ session, user, token }:{session:CustomSession,user:CustomUser,token:JWT}) {
      session.user=token.user as CustomUser
      return session
    },
    async jwt({ token, user}) {
      if(user){
        token.user=user
      }
      return token
    }

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

