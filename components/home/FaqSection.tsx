'use client'

import React, { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type Question = {
  id: string
  question: string
  answer?: string
}

interface FaqColumnProps {
  questions: Question[]
  activeId: string
  setActiveId: (id: string) => void
  gradient: string
}

const FaqColumn: React.FC<FaqColumnProps> = ({
  questions,
  activeId,
  setActiveId,
  gradient
}) => (
  <div className="flex flex-col gap-3">
    {questions.map(({ id, question, answer }) => (
      <Accordion
        key={id}
        type="single"
        collapsible
        value={activeId}
        onValueChange={(newId) => newId && setActiveId(newId)}
        className="bg-white rounded-xl shadow-md"
      >
        <AccordionItem value={id}>
          <AccordionTrigger
            className={`px-6 py-5 text-base font-semibold text-left hover:no-underline transition-colors ${
              activeId === id
                ? `${gradient} text-white rounded-t-xl rounded-b-none`
                : "text-gray-800 bg-white rounded-xl"
            }`}
          >
            {question}
          </AccordionTrigger>

          <AnimatePresence initial={false}>
            {activeId === id && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="overflow-hidden px-6"
              >
                <div className="py-4 text-base text-gray-600">
                  {answer ?? `Resposta para "${question}".`}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AccordionItem>
      </Accordion>
    ))}
  </div>
)

export default function FaqSection() {
  const [activeLeft, setActiveLeft] = useState("item-0")
  const [activeRight, setActiveRight] = useState("item-0")

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const x = useTransform(mouseX, [0, window.innerWidth], [-15, 15])
  const y = useTransform(mouseY, [0, window.innerHeight], [-10, 10])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const leftQuestions: Question[] = [
    {
      id: "item-0",
      question: "O que é o Feedybacky?",
      answer:
        "O Feedybacky é uma plataforma para gerenciar feedbacks de maneira organizada, permitindo comentários diretos sobre artes e postagens.",
    },
    {
      id: "item-1",
      question: "Como o Feedybacky funciona?",
      answer:
        "O Feedybacky permite que você envie uma arte ou link, e receba feedbacks visuais diretamente nos pontos que precisam de ajuste.",
    },
    {
      id: "item-2",
      question: "Quem pode usar o Feedybacky?",
      answer:
        "Designers, criadores de conteúdo, equipes de marketing, fotógrafos, freelancers e qualquer profissional que precise gerenciar revisões visuais.",
    },
    {
      id: "item-3",
      question: "O Feedybacky vai ser gratuito?",
      answer:
        "Teremos um plano gratuito com funcionalidades básicas e planos pagos com recursos avançados para equipes e empresas.",
    },
    {
      id: "item-4",
      question: "O Feedybacky precisa ser instalado?",
      answer:
        "Não! O Feedybacky é 100% online e funciona diretamente no seu navegador, sem necessidade de instalação.",
    },
    {
      id: "item-5",
      question: "O Feedybacky funciona em dispositivos móveis?",
      answer:
        "Sim! A plataforma é totalmente responsiva e otimizada para celulares, tablets e computadores.",
    },
  ]

  const rightQuestions: Question[] = [
    {
      id: "item-0",
      question: "Como os feedbacks são adicionados?",
      answer:
        "Os usuários clicam diretamente sobre a arte ou o site para deixar comentários precisos no local certo.",
    },
    {
      id: "item-1",
      question: "É possível rastrear mudanças?",
      answer:
        "Sim, cada comentário pode ser marcado como resolvido e há um histórico de interações e versões.",
    },
    {
      id: "item-2",
      question: "Posso compartilhar feedbacks com qualquer pessoa?",
      answer:
        "Sim! É possível gerar um link público ou convidar pessoas específicas por e-mail.",
    },
    {
      id: "item-3",
      question: "O Feedybacky permite aprovações finais?",
      answer:
        "Sim, você pode aprovar uma arte ou uma versão com um clique, indicando que ela está pronta para produção.",
    },
    {
      id: "item-4",
      question: "Meus arquivos estão seguros no Feedybacky?",
      answer:
        "Sim. Todos os arquivos e comentários são armazenados com segurança na nuvem, com criptografia e backup.",
    },
    {
      id: "item-5",
      question: "Como posso obter suporte caso tenha dúvidas?",
      answer:
        "Oferecemos suporte via chat, e-mail e uma central de ajuda com tutoriais e respostas frequentes.",
    },
  ]

  return (
    <section className="relative bg-acbg pt-20 pb-[250px] px-6 overflow-visible">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at top center, rgba(253, 217, 69, 0.2) 0%, rgba(255, 255, 255, 0) 45%)',
          pointerEvents: 'none',
        }}
      />

      <motion.img
        src="/logofeedybacky.png"
        alt="Logo Flutuante"
        style={{
          x,
          y,
          rotate: '-15deg',
          width: '180px',
        }}
        className="hidden lg:block absolute top-[-20px] translate-y-[-40%] left-[10%] z-10 pointer-events-none"
      />

      <motion.img
        src="/emoji-thinking.png"
        alt="Emoji Pensando"
        style={{
          x: useTransform(x, (v) => -v),
          y: useTransform(y, (v) => -v),
          rotate: '10deg',
          width: '150px',
        }}
        className="hidden lg:block absolute top-0 translate-y-[-30%] right-[10%] z-10 pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <p className="text-sm font-medium uppercase tracking-wide mb-5 inline-block px-4 py-2 rounded-full bg-[#EEF1FF] text-[#4A5EFF]">
          PERGUNTAS FREQUENTES
        </p>

        <h2 className="text-4xl md:text-5xl font-bold text-acpreto mb-12">
          O que todo mundo quer saber <br />
          sobre o{' '}
          <span className="bg-gradient-to-r from-[#fdd945] to-[#fc7db0] bg-clip-text text-transparent">
            Feedybacky
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6 text-left">
          <FaqColumn
            questions={leftQuestions}
            activeId={activeLeft}
            setActiveId={setActiveLeft}
            gradient="bg-gradient-to-r from-acroxo to-acazul"
          />
          <FaqColumn
            questions={rightQuestions}
            activeId={activeRight}
            setActiveId={setActiveRight}
            gradient="bg-gradient-to-r from-acazul to-acroxo"
          />
        </div>
      </div>
    </section>
  )
}
