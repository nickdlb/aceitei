export default function EfficiencySection() {
    return (
      <section className="bg-acbg px-0 py-20 overflow-hidden relative">
        {/* Imagem fora do container, colada à direita */}
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-[calc(100%-160px)] z-0">
          <img
            src="/gestao-preview.png"
            alt="Dashboard do Feedybacky"
            className="h-full object-contain rounded-l-2xl shadow-2xl"
          />
        </div>
  
        {/* Conteúdo centralizado com limite de 1300px */}
        <div className="max-w-[1300px] mx-auto relative z-10 flex flex-col-reverse lg:flex-row items-center lg:items-stretch w-full px-6">
          
          {/* Texto à esquerda sem padding */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="w-full max-w-3xl">
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
  
              <a
                href="#inscricao"
                className="inline-flex items-center border border-acroxo text-acroxo px-6 py-3 rounded-full font-medium hover:bg-acbg transition"
              >
                Inscreva-se <span className="ml-2">→</span>
              </a>
            </div>
          </div>
  
          {/* Espaço reservado para alinhar com a imagem à direita */}
          <div className="w-full lg:w-1/2 hidden lg:block" />
        </div>
      </section>
    );
  }
  