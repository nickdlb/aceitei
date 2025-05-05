export default function RevisionSection() {
    return(
        <section className="bg-white py-20 px-6">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            {/* Texto à esquerda */}
            <div className="w-full lg:w-1/2">
                <p className="text-sm text-indigo-600 font-medium uppercase mb-2">
                POR QUE ESCOLHER O PINIFY?
                </p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
                Deixe a bagunça no passado e descubra um fluxo de revisão perfeito!
                </h2>
                <p className="text-gray-600 mb-6">
                Sabemos que existem outras ferramentas por aí, mas o Pinify foi feito sob medida para quem precisa de um fluxo de revisão rápido, organizado e intuitivo. Veja o que nos torna únicos:
                </p>
                <a
                href="#inscricao"
                className="inline-flex items-center border border-indigo-500 text-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-indigo-50 transition"
                >
                Inscrevesse <span className="ml-2">→</span>
                </a>
            </div>

            {/* Cards à direita */}
            <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Card 1 - azul gradiente */}
                <div className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-4">📌</div>
                <h4 className="text-lg font-semibold mb-1">Feedback onde realmente importa</h4>
                <p className="text-sm">
                    Diga adeus a comentários espalhados! No Pinify, todas as sugestões ficam visíveis exatamente no ponto certo, sem confusão.
                </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-4">😤</div>
                <h4 className="text-lg font-semibold mb-1">Aprovações sem estresse</h4>
                <p className="text-sm text-gray-600">
                    Esqueça retrabalho desnecessário. O Pinify mantém tudo organizado para acelerar cada etapa.
                </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-4">🔗</div>
                <h4 className="text-lg font-semibold mb-1">Compartilhamento sem complicação</h4>
                <p className="text-sm text-gray-600">
                    Clientes e equipe acessam e interagem com um clique, sem precisar instalar nada.
                </p>
                </div>

                {/* Card 4 */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-4">🔍</div>
                <h4 className="text-lg font-semibold mb-1">Fluxo organizado e transparente</h4>
                <p className="text-sm text-gray-600">
                    Saiba exatamente quem pediu alterações e quando, mantendo o controle total.
                </p>
                </div>
            </div>
            </div>
        </section>
    )
    }