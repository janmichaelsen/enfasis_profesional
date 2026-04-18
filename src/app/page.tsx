"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  Package, 
  ChevronDown, 
  Check, 
  ShieldCheck, 
  UserCircle2 
} from "lucide-react"; 
import es from "@/locales/es.json";
import en from "@/locales/en.json";

export default function Home() {
  const [lang, setLang] = useState("es");
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t: any = lang === "es" ? es : en;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0c14] text-white font-sans selection:bg-indigo-500/30">
      <nav className="border-b border-white/5 py-5 px-6 md:px-12 sticky top-0 bg-[#0a0c14]/80 backdrop-blur-xl z-[100]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-2.5 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/10">
              <Package size={26} className="text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white">Adquete</span>
          </Link>
          <div className="flex items-center gap-4">
            <div ref={menuRef} className="relative w-[130px]">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all duration-300 ${isOpen ? 'bg-white/10 border-indigo-500/50 text-white shadow-[0_0_20px_rgba(79,130,246,0.1)]' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{lang === 'es' ? '🇪🇸' : '🇬🇧'}</span>
                  <span className="text-xs font-black uppercase tracking-widest">{lang}</span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-300 opacity-40 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="absolute top-[calc(100%+12px)] right-0 w-48 bg-[#161b22]/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] animate-in fade-in zoom-in-95 duration-200 z-[110]">
                  <div className="p-1.5">
                    <button onClick={() => {setLang('es'); setIsOpen(false)}} className={`w-full p-3 rounded-xl text-left text-sm flex items-center justify-between transition-all ${lang === 'es' ? 'bg-indigo-600 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                      <div className="flex items-center gap-3"><span>🇪🇸</span> Español</div>
                      {lang === 'es' && <Check size={14} />}
                    </button>
                    <button onClick={() => {setLang('en'); setIsOpen(false)}} className={`w-full p-3 rounded-xl text-left text-sm flex items-center justify-between transition-all mt-1 ${lang === 'en' ? 'bg-indigo-600 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                      <div className="flex items-center gap-3"><span>🇬🇧</span> English</div>
                      {lang === 'en' && <Check size={14} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <Link href={`/login?lang=${lang}`} className="bg-white text-black px-7 py-2.5 rounded-full font-bold text-sm whitespace-nowrap hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5">
              {t.nav_login}
            </Link>
          </div>
        </div>
      </nav>
      <main className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[11px] font-black uppercase tracking-[0.2em] mb-12 border border-indigo-500/20">
            {t.hero_badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-10 tracking-tight leading-[1.3] text-white">
            {t.hero_title}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed">
            {t.hero_subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link href={`/login?role=concierge&lang=${lang}`} className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-[24px] font-bold flex items-center gap-3 transition-all hover:-translate-y-1 shadow-2xl shadow-indigo-500/30">
              <ShieldCheck size={24} /> {t.btn_concierge}
            </Link>
            <Link href={`/login?role=resident&lang=${lang}`} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-5 rounded-[24px] font-bold flex items-center gap-3 transition-all hover:bg-white/10">
              <UserCircle2 size={24} /> {t.btn_resident}
            </Link>
          </div>
        </div>
      </main>
      <footer className="border-t border-white/5 py-12 text-center">
        <p className="text-gray-600 text-sm font-medium">{t.footer_copy}</p>
      </footer>
    </div>
  );
}