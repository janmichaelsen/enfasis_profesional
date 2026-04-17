"use client";

import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sendOTP, verifyOTP } from "@/actions/auth-actions";

export default function OTPPage() {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Redirigir al dashboard si ya está validado o al login si no hay sesión inicial
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.isTwoFactorVerified) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  const handleSendOTP = async () => {
    if (!session?.user?.email) return;
    
    setError("");
    setMessage("");

    startTransition(async () => {
      const res = await sendOTP(session.user.email!);
      if (res.error) setError(res.error);
      if (res.success) setMessage(res.success);
    });
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return;
    if (code.length < 6) {
      setError("Ingresa los 6 dígitos");
      return;
    }

    setError("");
    setMessage("");

    startTransition(async () => {
      const res = await verifyOTP(session.user.email!, code);
      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        setMessage(res.success);
        // Actualizamos la sesión en NextAuth para estampar la variable isTwoFactorVerified
        await update({ isTwoFactorVerified: true });
        router.push("/dashboard");
      }
    });
  };

  if (status === "loading" || !session) {
    return <div className="flex h-screen items-center justify-center">Cargando perfil...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Verificación de Seguridad
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Hemos detectado un inicio de sesión para <br/>
            <span className="font-semibold">{session.user.email}</span>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div>
            <label htmlFor="code" className="sr-only">Código OTP</label>
            <input
              id="code"
              name="code"
              type="text"
              required
              maxLength={6}
              disabled={isPending}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Solo números
              className="relative block w-full rounded-md border-0 py-3 text-center text-2xl tracking-[0.5em] text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
              placeholder="000000"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending || code.length < 6}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400 transition-colors"
            >
              {isPending ? "Procesando..." : "Verificar Código"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">¿No has recibido el código?</p>
          <button
            onClick={handleSendOTP}
            disabled={isPending}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-semibold hover:underline"
          >
            Solicitar código a mi consola/correo
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center font-medium">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm text-center font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
