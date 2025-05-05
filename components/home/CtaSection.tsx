export default function CtaSection() {
    return(
        <section className="bg-gradient-to-r from-blue-500 to-teal-400 py-16 text-white text-center px-6">
        <h2 className="text-3xl font-bold mb-6">Inscreva-se e receba um desconto especial no lançamento!</h2>
            <form className="grid gap-4 max-w-md mx-auto">
                <input className="px-4 py-2 rounded text-black" placeholder="Nome" />
                <input className="px-4 py-2 rounded text-black" placeholder="Email" />
                <input className="px-4 py-2 rounded text-black" placeholder="Profissão" />
                <button className="bg-white text-blue-700 px-4 py-2 rounded hover:bg-gray-100">Inscrever</button>
            </form>
        </section>
    )
    }