import nodemailer from "nodemailer";

export const sendOTPEmail = async (email: string, token: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Estructura del correo, a quién va dirigido, asunto y cuerpo con el código de seguridad
    const mailOptions = {
      from: `"Seguridad de la Plataforma" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Tu Código de Verificación OTP",
      // HTML básico para que el correo se vea bien
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f3f4f6; color: #111827; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Tu Código de Verificación</h2>
          <p>¡Hola!</p>
          <p>Hemos detectado un intento de inicio de sesión y necesitamos validar tu identidad.</p>
          <div style="margin: 20px 0; font-size: 36px; font-weight: bold; letter-spacing: 5px; color: #111827; text-align: center; border: 2px dashed #4f46e5; padding: 10px; border-radius: 5px;">
            ${token}
          </div>
          <p style="color: #4b5563; font-size: 14px;">Este código expirará exactamente en 10 minutos.</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">Si tú no solicitaste este acceso, por favor ignora este correo de inmediato.</p>
        </div>
      `,
    };

    // Se envía el correo y forzamos a esperar la respuesta de éxito 
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente: %s", info.messageId);
    return true;

  } catch (error) {
    console.error("Fallo crítico al intentar enviar el correo: ", error);
    return false;
  }
};


