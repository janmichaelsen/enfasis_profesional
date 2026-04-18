'use client'

import { useSearchParams } from "next/navigation";
import { LoginButton } from "@/components/login-button";
import { UserCircle2, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import es from "@/locales/es.json";
import en from "@/locales/en.json";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const lang = searchParams.get("lang") || "es";
  const t: any = lang === "en" ? en : es;

  if (!role) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0c14] text-white p-6">
        <div className="w-full max-w-4xl text-center">
          <Link href={`/?lang=${lang}`} className="inline-flex items-center text-sm text-gray-500 hover:text-white mb-10 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t.login_back}
          </Link>
          <h2 className="text-5xl font-black mb-4 tracking-tighter">{t.login_how_to_enter}</h2>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <Link href={`/login?role=concierge&lang=${lang}`} className="bg-[#161b22] border border-white/5 p-12 rounded-[40px] hover:border-indigo-500/50 transition-all group">
              <div className="inline-flex p-6 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-8 group-hover:scale-110 transition-transform"><ShieldCheck size={54} /></div>
              <h3 className="text-3xl font-black mb-3">{t.role_concierge}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t.login_concierge_desc}</p>
            </Link>
            <Link href={`/login?role=resident&lang=${lang}`} className="bg-[#161b22] border border-white/5 p-12 rounded-[40px] hover:border-blue-500/50 transition-all group">
              <div className="inline-flex p-6 rounded-2xl bg-blue-500/10 text-blue-400 mb-8 group-hover:scale-110 transition-transform"><UserCircle2 size={54} /></div>
              <h3 className="text-3xl font-black mb-3">{t.role_resident}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t.login_resident_desc}</p>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isConcierge = role === "concierge";

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0c14] text-white p-4">
      <div className="w-full max-w-md relative z-10">
        <Link href={`/login?lang=${lang}`} className="inline-flex items-center text-sm text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t.login_change_profile}
        </Link>
        <div className="bg-[#161b22] p-12 rounded-[48px] border border-white/5 shadow-2xl text-center">
          <div className="inline-flex p-4 rounded-2xl bg-indigo-600/10 text-indigo-400 mb-6 ring-1 ring-indigo-500/20">
            {isConcierge ? <ShieldCheck size={40} /> : <UserCircle2 size={40} />}
          </div>
          <h2 className="text-4xl font-black mb-2 tracking-tight italic">Adquete</h2>
          <p className="text-gray-400 mb-12 text-sm font-medium">
            {t.login_access_for} <span className="text-white font-black uppercase">{isConcierge ? t.role_concierge : t.role_resident}</span>
          </p>
          <LoginButton role={role} lang={lang} />
        </div>
      </div>
    </main>
  );
}