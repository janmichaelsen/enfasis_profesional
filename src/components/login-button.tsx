"use client";

import { signIn } from "next-auth/react";

export function LoginButton({ role, lang }: { role: string; lang: string }) {
  return (
    <button
      onClick={() => signIn("google", { 
        callbackUrl: `/dashboard?role=${role}&lang=${lang}` 
      })}
      className="w-full flex items-center justify-center gap-3 bg-white text-black font-black py-4 rounded-2xl hover:bg-gray-200 transition-all shadow-xl active:scale-95"
    >
      <img src="https://authjs.dev/img/providers/google.svg" className="w-5 h-5" alt="Google" />
      {lang === "es" ? "Entrar con Google" : "Sign in with Google"}
    </button>
  );
}