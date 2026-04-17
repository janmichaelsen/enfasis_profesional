"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function sendOTP(email: string) {
  try {
    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Se convierte el código en hash para guardarlo en la base de datos
    const salt = await bcrypt.genSalt(10);
    const hashedCode = await bcrypt.hash(code, salt);

    // Se imprime el código y su hash en consola temporalmente simulando el envío de email (para probar temporalmente)
    console.log(`\n=================================================`);
    console.log(`[SEGURIDAD - OTP SOLICITADO]`);
    console.log(`Email Objetivo: ${email}`);
    console.log(`CÓDIGO GENERADO: ${code}`);
    console.log(`HASH (Que se guarda en BD): ${hashedCode}`);
    console.log(`=================================================\n`);

    // Expiración de 10 minutos
    const expires = new Date(new Date().getTime() + 10 * 60 * 1000);

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

    return { success: "¡Código OTP generado y enviado! (Revisa tu consola)" };
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
