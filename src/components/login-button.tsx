import { signIn } from "@/auth"

export function LoginButton() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn("google")
            }}
            className="w-full"
        >
            <button
                type="submit"
                className="w-full bg-white text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3 shadow-lg border border-gray-200"
            >
                <img
                    src="https://authjs.dev/img/providers/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                />
                Entrar con Google
            </button>
        </form>
    )
}