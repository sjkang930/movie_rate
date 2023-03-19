import NextAuth, { getServerSession, NextAuthOptions, DefaultSession } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import { JWT } from "next-auth/jwt";


const authOptions = {
    providers: [
        CognitoProvider({
            clientId: process.env.COGNITO_CLIENT_ID,
            clientSecret: process.env.COGNITO_CLIENT_SECRET,
            issuer: process.env.COGNITO_ISSUER,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        jwt({ token, user, account, profile, isNewUser }) {
            if (account && token) {
                token.accessToken = account?.access_token ?? "";
            }
            return token;
        },
        session({ session, token }) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
};

export default NextAuth(authOptions);
