export default function CtaSection() {
    return (
      <section className="flex justify-center pb-4 px-4 relative z-20">
        <div className="relative w-full max-w-[1300px] min-h-[320px] rounded-2xl p-10 text-white flex flex-col items-center justify-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.06)] bg-gradient-to-br from-[#FDD945] to-[#FC7DB0] -mt-40 overflow-hidden">
          
          {/* Fundo com pattern e opacidade reduzida */}
          <div className="absolute inset-0 bg-[url('/img_pattern_pinify.png')] bg-repeat opacity-20 z-0" />
  
          {/* Conteúdo */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para revolucionar seus feedbacks?
            </h2>
            <p className="text-base md:text-lg mb-2">
              Chega de mensagens espalhadas, e-mails perdidos ou prints fora de contexto.
            </p>
            <p className="text-base md:text-lg mb-6">
              Com o <strong>Feedybacky</strong>, você centraliza, organiza e acelera seu fluxo de revisão visual.
            </p>
            <a
  href="#inscricao"
  className="inline-flex items-center border border-acroxo bg-white text-acroxo px-6 py-3 rounded-full font-medium transition hover:bg-acbg"
>
Comece agora <span className="ml-2">→</span>
</a>
          </div>
        </div>
      </section>
    );
  }
  