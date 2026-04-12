import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Usamos "as any" para que TypeScript no se queje de que el modelo User 
  // en Prisma tiene campos extra (como 'role') que el Adapter estándar no conoce.
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Esto ayuda a evitar errores de PKCE/Cookies en entornos locales
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    // El evento 'session' ocurre cada vez que el cliente pregunta por la sesión
    // Aquí es donde inyectamos el ID y el ROLE para usarlos en el Dashboard
    async session({ session, user }: any) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role; 
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