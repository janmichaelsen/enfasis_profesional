import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = user.role ?? "RESIDENT";
        token.isTwoFactorVerified = false;
      }
      if (trigger === "update" && session?.isTwoFactorVerified === true) {
        token.isTwoFactorVerified = true;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.isTwoFactorVerified = token.isTwoFactorVerified ?? false;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;