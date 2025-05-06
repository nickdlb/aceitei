import Lottie from "lottie-react";
import designersLottie from "@/components/lotties/designers-lottie.json";
import criadoresLottie from "@/components/lotties/criadores-lottie.json";
import equipesLottie from "@/components/lotties/equipes-lottie.json";
import cameraLottie from "@/components/lotties/camera-lottie.json";
import agenciasLottie from "@/components/lotties/agencias-lottie.json";
import empreendedoresLottie from "@/components/lotties/empreendedores-lottie.json";
import { StripePlans } from "../account/StripePlans";

export default function ProfissionalsSection() {

  const professionals = [
    {
      animation: designersLottie,
      title: "Designers e ilustradores",
      description: "Simplifique a revisão de artes e evite perder feedbacks importantes.",
    },
    {
      animation: criadoresLottie,
      title: "Criadores de conteúdo",
      description: "Receba sugestões organizadas diretamente sobre suas postagens e crie com mais confiança.",
    },
    {
      animation: equipesLottie,
      title: "Equipes de marketing",
      description: "Centralize aprovações, reduza retrabalho e acelere campanhas com um fluxo otimizado.",
    },
    {
      animation: cameraLottie,
      title: "Fotógrafos e editores",
      description: "Compartilhe imagens para revisão, receba ajustes visuais claros e finalize projetos mais rápido.",
    },
    {
      animation: agenciasLottie,
      title: "Agências e estúdios",
      description: "Facilite a comunicação com clientes e equipe, garantindo que todas as alterações fiquem documentadas.",
    },
    {
      animation: empreendedoresLottie,
      title: "Empreendedores e freelancers",
      description: "Organize feedbacks de parceiros e clientes sem complicação, mantendo controle total das mudanças.",
    },
  ];

  return (
    <section className="bg-acbranco flex items-center justify-center py-20 px-6">
      <div className="max-w-[1400px] flex flex-col items-center justify-center text-center">
        <div className="max-w-[80%] flex flex-col items-center justify-center">
          <p className="text-sm text-acazul font-medium uppercase tracking-wide mb-2"> Feedybacky É PARA VOCÊ? DESCUBRA AGORA </p>
          <h2 className="text-5xl font-extrabold text-acpreto mb-12 w-[70%]">Profissionais que vão elevar sua produtividade com o <span className="text-acazul">Feedybacky</span> </h2>
        </div>
        <div className=" mb-8 grid md:grid-cols-3 gap-4 bg-acbg p-4 rounded-2xl">
          {professionals.map((item) => (
            <div key={item.title} className="bg-acbranco p-6 rounded-xl shadow-md text-left hover:shadow-lg transition">
              <div className="w-16 h-16 bg-acazul rounded-full flex items-center justify-center mb-4">
                <Lottie animationData={item.animation} loop={true} autoplay={true} className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold text-acpreto mb-2">{item.title}</h3>
              <p className="text-acpreto text-sm">{item.description}</p>
            </div>
          ))}
        </div>
        <StripePlans/>
      </div>
    </section>
  )
}
