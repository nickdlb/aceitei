export default function BenefitsSection() {
    return(
        <section className="bg-acazul w-full py-4 pb-20 px-16">
            <div className="mx-auto max-w-[1400px] grid grid-cols-3 gap-10 text-center *:flex *:flex-col *:border-l-2 *:pl-4 *:border-gray-300 *:border-opacity-40">
                <div className="flex justify-start">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-300 rounded-full">
                            <img src="/alvo.png"></img>
                        </div>
                        <h3 className="text-xl font-semibold text-acbrancohover text-left">Centralize Feedbacks</h3>
                    </div>
                    <p className="mt-2 text-acbrancohover text-justify">Tenha todos os comentários organizados diretamente sobre a arte ou postagem, sem perder nada.</p>
                </div>
                <div className="flex justify-start">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-300 rounded-full">
                            <img src="/foguete.png"></img>
                        </div>
                        <h3 className="text-xl font-semibold text-acbrancohover text-left">Reduza Retrabalho</h3>
                    </div>
                    <p className="mt-2 text-acbrancohover text-justify">Evite refazer tarefas desnecessárias e acelere as aprovações com um sistema de revisão mais ágil.</p>
                </div>
                <div className="flex justify-start">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-300 rounded-full">
                            <img src="/aviao-papel.png"></img>
                        </div>
                        <h3 className="text-xl font-semibold text-acbrancohover text-left">Colabore com Facilidade</h3>
                    </div>
                    <p className="mt-2 text-acbrancohover text-justify">Envie rapidamente para clientes e equipe, tornando a colaboração mais fluida e eficiente.</p>
                </div>
            </div>
        </section>
    )
    }
