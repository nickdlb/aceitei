export default function RevisionSection() {
    return (
        <section className="bg-acbg py-20 px-6">
            <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-12">
                <div className="w-full lg:w-1/2">
                    <h2 className="w-fit text-sm bg-acpreto text-acbranco font-medium uppercase mb-5 px-4 py-2 rounded-full">
                        POR QUE ESCOLHER A FEEDYBACKY?
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-acpreto mb-6">
                        Deixe a bagunça no passado e descubra um fluxo de revisão perfeito!
                    </h3>
                    <p className="text-acpreto mb-6"> Sabemos que existem outras ferramentas por aí, mas o Feedybacky foi feito sob medida para quem precisa de um fluxo de revisão rápido, organizado e intuitivo. Veja o que nos torna únicos: </p>
                    <button className="gap-2 bg-acazul text-acbrancohover px-4 py-2 rounded-full">
                        <a href="/register">Teste Grátis</a>
                    </button>
                </div>
                <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-acazul to-acverde text-acbranco rounded-xl p-6 shadow-md">
                        <div className="text-3xl mb-4">📌</div>
                        <h4 className="text-lg font-semibold mb-1 text-acbrancohover">Feedback onde realmente importa</h4>
                        <p className="text-sm text-acbrancohover"> Diga adeus a comentários espalhados! No Feedybacky, todas as sugestões ficam visíveis exatamente no ponto certo, sem confusão. </p>
                    </div>
                    <div className="bg-acbgbranco rounded-xl p-6 shadow-md">
                        <div className="text-3xl mb-4">😤</div>
                        <h4 className="text-lg font-semibold mb-1 text-acpreto">Aprovações sem estresse</h4>
                        <p className="text-sm text-acpreto"> Esqueça retrabalho desnecessário. O Feedybacky mantém tudo organizado para acelerar cada etapa. </p>
                    </div>
                    <div className="bg-acbgbranco rounded-xl p-6 shadow-md">
                        <div className="text-3xl mb-4">🔗</div>
                        <h4 className="text-lg font-semibold mb-1 text-acpreto">Compartilhamento sem complicação</h4>
                        <p className="text-sm text-acpreto"> Clientes e equipe acessam e interagem com um clique, sem precisar instalar nada.</p>
                    </div>
                    <div className="bg-acbgbranco rounded-xl p-6 shadow-md">
                        <div className="text-3xl mb-4">🔍</div>
                        <h4 className="text-lg font-semibold mb-1 text-acpreto">Fluxo organizado e transparente</h4>
                        <p className="text-sm text-acpreto"> Saiba exatamente quem pediu alterações e quando, mantendo o controle total. </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
