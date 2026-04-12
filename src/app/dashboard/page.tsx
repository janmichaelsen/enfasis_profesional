import { auth, signOut } from "@/auth";
import { createPackage, deliverPackage } from "@/app/lib/actions";
import { prisma } from "@/lib/prisma";

// Definimos el tipo para que acepte la Promesa de searchParams
interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  // 1. Resolvemos las promesas primero (Crucial para Next.js 15+)
  const [session, resolvedParams] = await Promise.all([
    auth(),
    searchParams
  ]);

  const role = session?.user?.role;
  const activeTab = resolvedParams.tab || "ingresar";

  // 2. Obtenemos los paquetes
  const allPackages = await prisma.package.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#0d1117] text-white p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-12 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">Adquete</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1">
              Sistema de Conserjería
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-[10px] text-green-500 font-mono">{role}</p>
            </div>
            {/* Server Action para cerrar sesión */}
            <form action={async () => { "use server"; await signOut(); }}>
              <button className="text-xs bg-red-900/10 text-red-400 px-3 py-1.5 rounded border border-red-900/30 hover:bg-red-900/50 transition">
                Cerrar Sesión
              </button>
            </form>
          </div>
        </header>

        {role === "CONCIERGE" ? (
          <>
            {/* NAVEGACIÓN */}
            <nav className="flex gap-2 p-1 bg-[#161b22] rounded-xl border border-gray-800 w-fit mb-10">
              <a 
                href="?tab=ingresar" 
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${activeTab === 'ingresar' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                Nuevo Ingreso
              </a>
              <a 
                href="?tab=ver" 
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${activeTab === 'ver' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                Inventario / Entrega
              </a>
            </nav>

            {/* VISTA: REGISTRO */}
            {activeTab === "ingresar" && (
              <section className="bg-blue-600/5 border border-blue-500/20 p-8 rounded-2xl animate-in fade-in duration-500">
                <h2 className="text-xl font-semibold mb-2 text-blue-300">Registrar Nuevo Paquete</h2>
                <p className="text-sm text-gray-400 mb-8">Ingresa los datos para notificar al residente.</p>
                
                <form action={createPackage} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase text-gray-500 ml-1">Código Tracking</label>
                        <input name="trackingId" placeholder="Ej: ST-9988" required className="bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase text-gray-500 ml-1">Peso (kg)</label>
                        <input name="weight" type="number" step="0.1" placeholder="0.0" className="bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none text-sm" />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] uppercase text-gray-500 ml-1">Descripción y Depto</label>
                        <input name="description" placeholder="Ej: Depto 402 - Amazon" required className="bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none text-sm" />
                    </div>
                    <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-2 transition shadow-lg shadow-blue-900/20">
                        Confirmar Ingreso
                    </button>
                </form>
              </section>
            )}

            {/* VISTA: INVENTARIO */}
            {activeTab === "ver" && (
              <section className="space-y-4 animate-in slide-in-from-bottom-2 duration-500">
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-xl font-semibold text-gray-200">Paquetes en Bodega</h2>
                    <p className="text-xs text-gray-500">{allPackages.length} registros totales</p>
                </div>
                
                <div className="grid gap-3">
                  {allPackages.map((pkg: any) => (
                    <div key={pkg.id} className="bg-[#161b22] border border-gray-800 p-5 rounded-xl flex justify-between items-center group hover:border-gray-600 transition">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono text-blue-500 uppercase">{pkg.trackingId}</span>
                        <p className="text-sm font-medium text-gray-200">{pkg.description}</p>
                        <span className="text-[9px] text-gray-600 italic">Recibido: {new Date(pkg.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div>
                        {pkg.status === "RECEIVED" ? (
                          <form action={async () => { "use server"; await deliverPackage(pkg.id); }}>
                            <button type="submit" className="text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-2 rounded-lg uppercase font-black hover:bg-green-500 hover:text-white transition duration-200">
                              Entregar
                            </button>
                          </form>
                        ) : (
                          <span className="text-[10px] bg-gray-800 text-gray-500 px-4 py-2 rounded-lg uppercase font-bold border border-gray-700">
                            Entregado ✓
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          /* VISTA RESIDENTE */
          <section className="bg-[#161b22] p-20 rounded-3xl border border-gray-800 text-center">
            <h2 className="text-2xl font-bold mb-4">¡Hola, {session?.user?.name}!</h2>
            <p className="text-gray-500">Pronto podrás ver tus paquetes aquí.</p>
          </section>
        )}
      </div>
    </main>
  );
}