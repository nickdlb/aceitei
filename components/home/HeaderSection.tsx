export default function HeaderSection() {
    return(
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
            <img src="/logo-pinify.svg" alt="Pinify" className="h-8" />
            <nav className="flex gap-4 items-center">
                <a href="#como-funciona" className="text-sm font-medium">Como funciona?</a>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">Inscreva-se</button>
            </nav>
        </header>
    )
    }