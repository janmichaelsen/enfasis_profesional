import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { authConfig } from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = user.role ?? "RESIDENT";
        token.isTwoFactorVerified = false;
      }
      if (token.email && !user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { role: true },
        });
        if (dbUser?.role) token.role = dbUser.role;
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
  secret: process.env.AUTH_SECRET,
  trustHost: true,
})