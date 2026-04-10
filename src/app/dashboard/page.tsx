import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
    const session = await auth();

    return (
        <main className="min-h-screen bg-[#0d1117] text-white p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-12 border-b border-gray-800 pb-6">
                    <h1 className="text-2xl font-bold text-blue-400">Panel de Control - Adquete</h1>
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-gray-400">Bienvenido, {session?.user?.name}</p>
                        <form action={async () => { "use server"; await signOut(); }}>
                            <button className="text-xs bg-red-900/30 text-red-400 px-3 py-1 rounded border border-red-900/50 hover:bg-red-900/50 transition">
                                Cerrar Sesión
                            </button>
                        </form>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#161b22] p-6 rounded-xl border border-gray-800">
                        <h3 className="text-gray-400 text-sm mb-2">Estado del Usuario</h3>
                        <p className="text-green-400 font-mono">Autenticado con Google ✓</p>
                    </div>
                </section>
            </div>
        </main>
    );
}