import { auth } from "@/auth";
import { redirect } from "next/navigation";
import es from "@/locales/es.json";
import en from "@/locales/en.json";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { lang?: string; role?: string };
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const lang = searchParams.lang || "es";
  const t: any = lang === "en" ? en : es;

  const userRole = (session.user as any).role || searchParams.role || "resident";
  const isConcierge = userRole === "concierge";

  return (
    <div className="min-h-screen bg-[#0a0c14] text-white font-sans">
      <nav className="border-b border-white/5 py-4 px-8 flex justify-between items-center bg-[#0a0c14]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-xs font-black">AD</div>
          <span className="font-bold tracking-tighter">Adquete</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold">{session.user?.name}</p>
            <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest">{isConcierge ? t.role_concierge : t.role_resident}</p>
          </div>
          <img src={session.user?.image || ""} className="w-9 h-9 rounded-full border border-white/10 shadow-lg" alt="Profile" />
        </div>
      </nav>

      <main className="p-8 max-w-6xl mx-auto">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl font-black tracking-tight">
            {isConcierge ? t.dash_register_title : `${t.dash_resident_welcome}, ${session.user?.name?.split(' ')[0]}!`}
          </h2>
          <div className="mt-8 bg-[#161b22] border border-white/5 p-12 rounded-[48px] text-center border-dashed text-gray-500 italic">
            {isConcierge ? t.dash_register_subtitle : t.dash_resident_no_packages}
          </div>
        </div>
      </main>
    </div>
  );
}