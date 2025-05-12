export default function RevisionSection() {
    return (
      <section className="bg-acbranco pt-[80px] pb-[150px] px-6">
        <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Cards à esquerda (60%) */}
          <div className="w-full lg:w-[55%] grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
          <div className="min-h-[320px] flex-1 rounded-2xl p-10 text-acbranco flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-gradient-to-br from-[#FDD945] to-[#FC7DB0]">
  <div className="w-[60px] h-[60px] mb-4 rounded-full bg-white flex items-center justify-center ">
    <img
      src="pin.png"
      alt="Ícone lupa"
      className="w-[60px] h-[60px]"
    />
  </div>
  <h4 className="text-xl font-semibold mb-2">Feedback onde realmente importa</h4>
  <p className="text-base">
    Diga adeus a comentários espalhados! No feedybacky, todas as sugestões ficam visíveis exatamente no ponto certo, sem confusão.
  </p>
</div>
  
            <div className="min-h-[320px] flex-1 bg-white rounded-2xl p-10 text-acpreto flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="w-[80px] h-[80px] mb-4 rounded-full bg-white flex items-center justify-center ">
                <img
                  src="icone-aprovacao.png"
                  alt="Ícone bravo"
                  className="w-[60px] h-[60px]"
                />
              </div>
              <h4 className="text-xl font-semibold mb-2">Aprovações sem estresse</h4>
              <p className="text-base text-accinza">
                Esqueça retrabalho desnecessário. O feedybacky mantém tudo organizado para acelerar cada etapa.
              </p>
            </div>
  
            <div className="min-h-[320px] flex-1 bg-white rounded-2xl p-10 text-acpreto flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="w-[80px] h-[80px] mb-4 rounded-full bg-white flex items-center justify-center ">
                <img
                  src="icone-compartilhamento.png"
                  alt="Ícone link"
                  className="w-[60px] h-[60px]"
                />
              </div>
              <h4 className="text-xl font-semibold mb-2">Compartilhamento sem complicação</h4>
              <p className="text-base text-accinza">
                Clientes e equipe acessam e interagem com um clique, sem precisar instalar nada.
              </p>
            </div>
  
            <div className="min-h-[320px] flex-1 bg-white rounded-2xl p-10 text-acpreto flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="w-[80px] h-[80px] mb-4 rounded-full bg-white flex items-center justify-center ">
                <img
                  src="icone-fluxo.png"
                  alt="Ícone pin"
                  className="w-[60px] h-[60px]"
                />
              </div>
              <h4 className="text-xl font-semibold mb-2">Fluxo organizado e transparente</h4>
              <p className="text-base text-accinza">
                Saiba exatamente quem pediu alterações e quando, mantendo o controle total.
              </p>
            </div>
          </div>
  
          {/* Texto à direita (40%) */}
          <div className="w-full lg:w-[45%]">
            <p
              className="text-sm font-medium uppercase tracking-wide mb-5 inline-block px-4 py-2 rounded-full"
              style={{
                backgroundColor: '#EEF1FF',
                color: '#4A5EFF'
              }}
            >
              POR QUE ESCOLHER O FEEDYBACKY?
            </p>
            <h2 className="text-5xl font-bold text-acpreto mb-6 leading-tight">
              Deixe a bagunça no passado e descubra um fluxo de revisão perfeito!
            </h2>
            <p className="text-accinza text-base mb-6">
              Sabemos que existem outras ferramentas por aí, mas o Feedybacky foi feito sob medida para quem precisa de um fluxo de revisão rápido, organizado e intuitivo. Veja o que nos torna únicos:
            </p>
            <a
              href="#inscricao"
              className="inline-flex items-center border border-acroxo text-acroxo px-6 py-3 rounded-full font-medium hover:bg-acbg transition"
            >
              Comece agora <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>
    );
  }
  