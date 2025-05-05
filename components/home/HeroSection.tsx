export default function HeroSection() {
    return (
        <section className="bg-gradient-to-b from-acbranco to-acazul/10 relative px-6 py-20 overflow-hidden">
            {/* Fundo com padrão pontilhado opcional */}
            <div className="absolute inset-0 bg-[url('/dot-grid.svg')] bg-repeat opacity-10 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">

                {/* Texto à esquerda */}
                <div className="max-w-xl text-center lg:text-left">
                    <img src="/logo-feedybacky.png" alt="Feedybacky" className="mb-8 h-8 lg:hidden mx-auto" />
                    <h1 className="text-4xl md:text-5xl font-extrabold text-acpreto leading-tight">
                        Transforme feedbacks <br /> caóticos em processos <br /> eficientes com o <span className="text-acazul">Feedybacky</span>
                    </h1>
                    <p className="mt-4 text-accinza text-lg">
                        Você sabe como é frustrante procurar por alterações e sugestões espalhadas em múltiplos canais. Organize tudo com o Feedybacky, aumente sua produtividade e acelere as aprovações!
                    </p>
                    <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
                        <button className="flex items-center gap-2 bg-acazul text-acbranco px-5 py-3 rounded-full hover:bg-acazul/80 transition">
                            Como funciona? <span className="text-xl">🤯</span>
                        </button>
                        <button className="flex items-center gap-2 border border-acazul text-acazul px-5 py-3 rounded-full hover:bg-acazul/10 transition">
                            Inscrevesse <span className="text-xl">→</span>
                        </button>
                    </div>
                </div>

                {/* Formulário à direita */}
                <div className="bg-acbranco rounded-xl shadow-lg p-6 w-full max-w-md mt-12 lg:mt-0">
                    <h3 className="text-acpreto text-base font-medium mb-4">
                        Entre na lista de espera agora e seja um dos primeiros a testar o <span className="text-acazul font-semibold">Feedybacky!</span>
                    </h3>
                    <form className="space-y-4">
                        <input type="text" placeholder="Nome" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-acazul" />
                        <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-acazul" />
                        <select className="w-full px-4 py-2 border rounded text-accinza focus:outline-none focus:ring-2 focus:ring-acazul">
                            <option value="">Qual é o seu perfil profissional?</option>
                            <option value="designer">Designer</option>
                            <option value="freelancer">Freelancer</option>
                            <option value="empresa">Empresa</option>
                        </select>
                        <button type="submit" className="w-full bg-acazul text-acbranco py-2 rounded hover:bg-acazul/80 transition">
                            Entrar
                        </button>
                    </form>
                    <p className="mt-4 text-sm text-accinza font-semibold">
                        Fique tranquilo! Sua inscrição é totalmente gratuita e sem compromisso.
                    </p>
                </div>

            </div>
        </section>
    )
}
