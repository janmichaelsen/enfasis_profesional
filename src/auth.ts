import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({

  // "as any" para apagar la alerta de TypeScrypt, dado que tiene un rol extra "role" que no espera por defecto 
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Ayuda a ingresar varias veces sin que google se alarme por ataque, útil para el desarrollo
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // El evento "jwt" intercepta el inicio de sesión
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // Justo después del SSO se marca el 2FA como falso para obligar el OTP
        token.isTwoFactorVerified = false;
      }
      // Cambia 2FA a true cuando el usuario aprueba el código de 6 digitos
      if (trigger === "update" && session?.isTwoFactorVerified) {
        token.isTwoFactorVerified = true;
      }
      return token;
    },
    async session({ session, token }: any) {
      // El evento session inyecta lo que hay en el token hacia el frontend
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isTwoFactorVerified = token.isTwoFactorVerified;
      }
      return session;
    },
  },
  // Configuración de páginas personalizadas (opcional)
  pages: {
    signIn: "/login",
    error: "/api/auth/error",
  },
});