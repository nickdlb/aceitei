export default function EfficiencySection() {
    return (
        <section className="bg-acbg py-20 px-6">
            <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">

                {/* Texto à esquerda */}
                <div className="w-full lg:w-1/2">
                    <p className="text-sm text-acazul font-medium uppercase mb-2">
                        FEEDBACKS DESORGANIZADOS? PROJETOS ATRASADOS?
                    </p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-acpreto mb-6 leading-tight">
                        <span className="text-acazul">Feedybacky</span> é a maneira mais eficiente de gerenciar feedbacks visuais
                    </h2>
                    <p className="text-accinza text-base mb-6">
                        Se você já perdeu tempo buscando sugestões espalhadas em e-mails, mensagens e comentários soltos,
                        sabe como isso atrasa seu fluxo de trabalho e gera retrabalho desnecessário. Com o Feedybacky,
                        você transforma o caos da revisão em um processo simples, eficiente e visual!
                    </p>

                    {/* Lista de benefícios em formato de "pills" */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {[
                            "Comentários direto na arte",
                            "Compartilhamento fácil",
                            "Rastreio de alterações",
                            "Acesso de qualquer lugar",
                            "Aprovações rápidas",
                            "Histórico completo"
                        ].map((item) => (
                            <span
                                key={item}
                                className="bg-acbgbranco text-sm text-acpreto font-medium px-4 py-2 rounded-full"
                            >
                                {item}
                            </span>
                        ))}
                    </div>

                    {/* Botão de inscrição */}
                    <a
                        href="#inscricao"
                        className="inline-flex items-center border border-acroxo text-acroxo px-6 py-3 rounded-full font-medium hover:bg-acbg transition"
                    >
                        Inscrevesse <span className="ml-2">→</span>
                    </a>
                </div>

                {/* Imagem de demonstração do app */}
                <div className="w-full lg:w-1/2">
                    <img
                        src="/gestao-preview.png"
                        alt="Dashboard do Feedybacky"
                        className="w-full rounded-xl shadow-xl"
                    />
                </div>
            </div>
        </section>
    )
}
