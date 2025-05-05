import { Toggle } from "../ui/toggleDarkmode"

export default function HeaderSection() {
    return (
        <header className="flex items-center justify-center">
            <div className="max-w-[1400px] w-full flex justify-between items-center px-6 py-4 bg-acbranco">
                <img src="/logo-feedybacky.png" alt="Feedybacky" className="h-8" />
                <nav className="flex gap-4 items-center">
                    <a href="#como-funciona" className="text-sm font-medium text-acpreto">Como funciona?</a>
                    <a href="/login" className="text-sm font-medium text-acpreto"> Login </a>
                    <a href="/dashboard" className="text-sm font-medium text-acpreto"> Dashboard </a>
                    <button className="bg-acazul text-acbranco px-4 py-2 rounded hover:bg-acazul/80 text-sm">Inscreva-se</button>
                </nav>
            </div>

        </header>
    )
}
