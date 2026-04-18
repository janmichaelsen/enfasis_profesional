"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/mail";
import { signIn } from "@/auth"; // <--- Agregamos esta importación

// --- FUNCIÓN PARA GOOGLE (La que le faltaba a tu botón) ---
export async function handleGoogleSignIn() {
  try {
    await signIn("google");
  } catch (error) {
    // Es vital lanzar el error para que Auth.js maneje el redireccionamiento
    throw error;
  }
}

// --- TUS FUNCIONES DE OTP (Las que ya tenías) ---
export async function sendOTP(email: string) {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedCode = await bcrypt.hash(code, salt);
    // Definir expiración (10 minutos para coincidir con el correo)
    const expires = new Date(new Date().getTime() + 10 * 60 * 1000);

    const existingToken = await prisma.twoFactorToken.findFirst({
      where: { email },
    });

    if (existingToken) {
      await prisma.twoFactorToken.delete({
        where: { id: existingToken.id },
      });
    }

    await prisma.twoFactorToken.create({
      data: {
        email,
        token: hashedCode,
        expires,
      },
    });

    const emailSent = await sendOTPEmail(email, code);

    if (!emailSent) {
      return { error: "No pudimos enviar el correo. Revisa tus credenciales o conexión." }
    }

    return { success: "¡Código OTP enviado a tu bandeja de correo!" };
  } catch (error) {
    console.error("Error al generar OTP:", error);
    return { error: "Hubo un error del servidor. Inténtalo más tarde." };
  }
}

export async function verifyOTP(email: string, code: string) {
  try {
    const existingToken = await prisma.twoFactorToken.findFirst({
      where: { email },
      orderBy: { expires: "desc" },
    });


    if (!existingToken) {
      return { error: "Token inválido o expirado" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      await prisma.twoFactorToken.delete({ where: { id: existingToken.id } });
      return { error: "Token inválido o expirado" };
    }

    const isValid = await bcrypt.compare(code, existingToken.token);

    if (!isValid) {
      return { error: "Token inválido o expirado" };
    }

    await prisma.twoFactorToken.delete({ where: { id: existingToken.id } });
    return { success: "¡OTP verificado exitosamente!" };
  } catch (error) {
    console.error("Error al verificar OTP:", error);
    return { error: "Error al verificar el código" };
  }
}