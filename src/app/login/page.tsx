import { LoginButton } from "@/components/login-button";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white p-4">
            <div className="bg-[#161b22] p-8 rounded-2xl border border-gray-800 shadow-2xl w-full max-w-md text-center">
                <h2 className="text-3xl font-extrabold mb-2 text-blue-400">Adquete</h2>
                <p className="text-gray-400 mb-8">Gestión de Encomiendas P05</p>

                <div className="space-y-6">
                    <LoginButton />

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-800"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#161b22] px-2 text-gray-500 font-semibold">Otras opciones</span>
                        </div>
                    </div>

                    <button disabled className="w-full py-3 px-4 rounded-xl bg-gray-800/50 text-gray-600 cursor-not-allowed border border-gray-700 italic">
                        Próximamente: Credenciales Residentes
                    </button>
                </div>
            </div>
        </main>
    );
}