export default function CtaSection() {
    return(
        <section className="bg-gradient-to-r flex justify-center from-acazul to-acverde py-16 text-acbranco text-center px-6">
            <div className="max-w-[1400px]">
                <h2 className="text-3xl font-bold mb-6">Inscreva-se e receba um desconto especial no lançamento!</h2>
                <form className="grid gap-4 max-w-md mx-auto">
                    <input className="px-4 py-2 rounded text-acpreto" placeholder="Nome" />
                    <input className="px-4 py-2 rounded text-acpreto" placeholder="Email" />
                    <input className="px-4 py-2 rounded text-acpreto" placeholder="Profissão" />
                    <button className="bg-acbranco text-acazul px-4 py-2 rounded hover:bg-acbg">Inscrever</button>
                </form>
            </div>
        </section>
    )
    }
