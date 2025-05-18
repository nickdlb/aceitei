export default function EfficiencySection() {
    return (
        <section className="bg-acbg py-20 px-6">
            <div className="max-w-[1400px] mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">
                <div className="w-full lg:w-1/2">
                    <p className="text-sm text-acazul font-medium uppercase mb-2">
                        FEEDBACKS DESORGANIZADOS? PROJETOS ATRASADOS?
                    </p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-acpreto mb-6 leading-tight">
                        <span className="text-acazul">Feedybacky</span> é a maneira mais eficiente de gerenciar os feedbacks visuais
                    </h2>
                    <p className="text-acpreto text-base mb-6">
                        Se você já perdeu tempo buscando sugestões espalhadas em e-mails, mensagens e comentários soltos,
                        sabe como isso atrasa seu fluxo de trabalho e gera retrabalho desnecessário. Com o Feedybacky,
                        você transforma o caos da revisão em um processo simples, eficiente e visual!
                    </p>
                    <div className="flex flex-wrap gap-3 mb-6">
                        {[
                            "Comentários direto na arte",
                            "Compartilhamento fácil",
                            "Rastreamento de alterações",
                            "Acesso de qualquer lugar",
                            "Aprovações rápidas",
                            "Histórico completo"
                        ].map((item) => (
                            <span key={item} className="bg-acbgbranco text-sm text-acpreto font-medium px-4 py-2 rounded-full" >
                                {item}
                            </span>
                        ))}
                    </div>
                    <button className="gap-2 bg-acazul text-acbrancohover px-4 py-2 rounded-full">
                        <a href="/register">Teste Grátis</a>
                    </button>
                </div>
                <div className="w-full lg:w-1/2">
                    <img src="/print-feedybacky.png" alt="Dashboard do Feedybacky" className="w-full rounded-xl shadow-xl" />
                </div>
            </div>
        </section>
    )
}
