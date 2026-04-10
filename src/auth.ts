import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma" // Asegúrate de tener este export en tu proyecto

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        // Aquí es donde vincularemos el OTP y los Roles más adelante
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
                // session.user.role = user.role; // Esto lo activaremos cuando probemos los roles
            }
            return session;
        },
    },
    pages: {
        signIn: "/login", // Tu página personalizada de login
    },
})