import { LOGIN_URL } from "@/lib/apiEndPoints";
import axios from "axios";
import dotenv from "dotenv";
import { Account, AuthOptions, ISODateString } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

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
  secret: process.env.NEXTAUTH_SECRET, // Add this line
  
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user, account }: { user: CustomUser; account: Account | null }) {
      try {
        const payload = {
          name: user.name,
          email: user.email,
          oauth_id: account?.providerAccountId,
          provider: account?.provider,
          image: user.image,
        };
        const { data } = await axios.post(LOGIN_URL, payload);
        user.id = data?.user?.id?.toString();
        user.provider = data?.user?.provider;
        user.token = data?.user?.token;
        return true;
      } catch (error) {
        console.error("API call failed:", error);
        return false;
      }
    },
    async session({ session, token }) {
      session.user = token.user as CustomUser;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
};

console.log("next auth>>",process.env.NEXTAUTH_SECRET)


{
  console.log("env checkkk",process.env.GOOGLE_CLIENT_ID)
}