import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Usamos "as any" para que TypeScript no se queje de que el modelo User 
  // en Prisma tiene campos extra (como 'role') que el Adapter estándar no conoce.
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Esto ayuda a evitar errores de PKCE/Cookies en entornos locales
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // El evento 'jwt' intercepta el inicio de sesión
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // Inmediatamente después del SSO, marcamos a la sesión como NO verificada por OTP:
        token.isTwoFactorVerified = false; 
      }
      // Si recibimos una petición manual de "revalidar estado" después de poner el OTP:
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