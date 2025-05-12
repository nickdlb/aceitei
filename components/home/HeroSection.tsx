'use client';

export default function HeroSection() {
  return (
    <section className="min-h-[90vh] z-0 pt-16 sm:pt-24 flex items-center sm:items-start justify-center bg-[linear-gradient(180deg,_#F5F5F700_40%,_#FFFFFF_100%),url('/bg_img.png')] bg-repeat bg-[length:200px]">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col items-center text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-acpreto leading-tight">
          Transforme feedbacks <br className="hidden sm:block" />
          caóticos em processos <br className="hidden sm:block" />
          eficientes com o{' '}
          <span className="bg-gradient-to-r from-[#fdd945] to-[#fc7db0] bg-clip-text text-transparent">
            Feedybacky
          </span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-accinza max-w-md sm:max-w-2xl">
          Você sabe como é frustrante procurar por alterações e sugestões espalhadas em múltiplos canais.
          Organize tudo com o Feedybacky, aumente sua produtividade e acelere as aprovações!
        </p>
        <div className="mt-6 flex flex-wrap gap-3 sm:gap-4 justify-center">
          <button className="flex items-center gap-2 bg-acazul text-acbranco px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base rounded-full hover:bg-acazul/80 transition">
            Como funciona?
            <img
              src="/hushed-face_1f62f.gif"
              alt="Emoji surpreso"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </button>
          <button className="flex items-center gap-2 border border-acazul text-acazul px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base rounded-full hover:bg-acazul/10 transition">
            Comece agora! - Grátis <span className="text-lg sm:text-xl">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}