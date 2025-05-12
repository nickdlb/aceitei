export default function FeaturesSection() {
  return (
    <section className="relative w-full pt-16 pb-20 px-4 sm:px-8 md:px-16 overflow-visible z-10 bg-[radial-gradient(ellipse_at_top_left,_#FFD43B_0%,_#EC6D88_50%)]">
      {/* Imagem do Laptop sobreposta à seção anterior */}
      <img
        src="/laptop-preview.png"
        alt="Demo do produto"
        className="absolute top-[-120px] sm:top-[-250px] md:top-[-300px] left-1/2 -translate-x-1/2 z-20 w-[120%] sm:w-[1000px] md:w-[1200px]"
      />

      {/* Benefícios com espaçamento para baixo da imagem */}
      <div className="pt-[80px] sm:pt-[300px] md:pt-[350px] mx-auto max-w-[1300px] grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        {/* Bloco 1 */}
        <div className="flex flex-col items-start border-l-2 pl-6 border-white/40">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-1">
              <img
                src="/alvo.png"
                alt="Centralize Feedbacks"
                className="w-9 h-9 md:w-auto md:h-auto"
              />
            </div>
            <h3 className="text-xl font-semibold text-white text-left">
              Centralize Feedbacks
            </h3>
          </div>
          <p className="mt-2 text-white text-left text-sm md:text-base">
            Tenha todos os comentários organizados diretamente sobre a arte ou postagem, sem perder nada pelo caminho.
          </p>
        </div>

        {/* Bloco 2 */}
        <div className="flex flex-col items-start border-l-2 pl-6 border-white/40">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-1">
              <img
                src="/foguete.png"
                alt="Reduza Retrabalho"
                className="w-9 h-9 md:w-auto md:h-auto"
              />
            </div>
            <h3 className="text-xl font-semibold text-white text-left">
              Reduza Retrabalho
            </h3>
          </div>
          <p className="mt-2 text-white text-left text-sm md:text-base">
            Evite refazer tarefas desnecessárias e acelere aprovações com um sistema de revisão mais ágil.
          </p>
        </div>

        {/* Bloco 3 */}
        <div className="flex flex-col items-start border-l-2 pl-6 border-white/40">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-1">
              <img
                src="/aviao-papel.png"
                alt="Colabore com Facilidade"
                className="w-9 h-9 md:w-auto md:h-auto"
              />
            </div>
            <h3 className="text-xl font-semibold text-white text-left">
              Colabore com Facilidade
            </h3>
          </div>
          <p className="mt-2 text-white text-left text-sm md:text-base">
            Envie rapidamente para clientes e equipe, tornando a colaboração mais fluida e eficiente.
          </p>
        </div>
      </div>
    </section>
  );
}
