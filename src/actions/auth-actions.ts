"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/mail";

export async function sendOTP(email: string) {
  try {
    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Se convierte el código en hash para guardarlo en la base de datos
    const salt = await bcrypt.genSalt(10);
    const hashedCode = await bcrypt.hash(code, salt);

    // Definir expiración (ejemplo: 5 minutos)
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

    // Se borra el token anterior si el usuario apretó enviar dos veces
    const existingToken = await prisma.twoFactorToken.findFirst({
      where: { email },
    });

    if (existingToken) {
      await prisma.twoFactorToken.delete({
        where: { id: existingToken.id },
      });
    }

    // Insertar en DB
    await prisma.twoFactorToken.create({
      data: {
        email,
        token: hashedCode,
        expires,
      },
    });

    // Se envía el correo con el código y se verifica si se envió correctamente 
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
    });

    if (!existingToken) {
      return { error: "Token inválido o expirado" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "El código ha expirado, solicita uno nuevo." };
    }

    // Compara el hash del código ingresado con el hash guardado en la base de datos
    const isValid = await bcrypt.compare(code, existingToken.token);

    if (!isValid) {
      return { error: "Código incorrecto." };
    }

    // Se elimina el token de la base de datos
    await prisma.twoFactorToken.delete({
      where: { id: existingToken.id },
    });

    return { success: "¡OTP verificado exitosamente!" };
  } catch (error) {
    console.error("Error al validar:", error);
    return { error: "Hubo un error al verificar." };
  }
}
