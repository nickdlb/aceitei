export default function HeroSection() {
    return (
        <section className="bg-acbg relative px-6 py-20 overflow-hidden">
            <div className="max-w-[1400px] pt-[10vh] mx-auto flex flex-col items-center relative z-10 min-h-[60vh]">
                <div className="text-center flex flex-col justify-center items-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-acpreto">
                        Transforme feedbacks caóticos em processos <br /> eficientes com o <span className="text-acazul">Feedybacky</span> </h1>
                    <p className="mt-4 text-acpreto text-lg max-w-[1000px]">
                        Você sabe como é frustrante procurar por alterações e sugestões espalhadas em múltiplos canais. Organize tudo com o Feedybacky, aumente sua produtividade e acelere as aprovações!
                    </p>
                    <div className="mt-6 flex flex-wrap gap-4 justify-center">
                        <button className="gap-2 bg-acazul text-acbrancohover px-4 py-2 rounded-full">
                            <a href="/register">Teste Grátis</a>
                        </button>
                        <button className="gap-2 bg-acpreto text-acbranco px-4 py-2 rounded-full">
                            Como funciona<span className="text-xl"></span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
