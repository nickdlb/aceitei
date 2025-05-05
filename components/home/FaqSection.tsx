'use client'

import React, { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FaqSection() {
  const [activeLeft, setActiveLeft] = useState("item-0")
  const [activeRight, setActiveRight] = useState("item-0")

  return (
    <section className="bg-[#f9fafc] py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm text-indigo-600 font-medium uppercase mb-2">
          PERGUNTAS FREQUENTES
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12">
          O que todo mundo quer saber sobre o <span className="text-blue-500">Pinify</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 text-left">
          {/* Coluna Esquerda */}
          <Accordion
            type="single"
            collapsible
            value={activeLeft}
            onValueChange={(value) => setActiveLeft(value)}
            className="bg-white rounded-xl overflow-hidden shadow"
          >
            <AccordionItem value="item-0">
              <AccordionTrigger
                className={`px-6 py-4 text-sm font-semibold hover:no-underline ${
                  activeLeft === "item-0"
                    ? "bg-gradient-to-r from-indigo-500 to-cyan-400 text-white"
                    : "text-gray-900"
                }`}
              >
                O que é o Pinify?
              </AccordionTrigger>
              <AccordionContent className="bg-white px-6 py-4 text-sm text-gray-700">
                O Pinify é uma plataforma para gerenciar feedbacks visuais de maneira organizada, permitindo comentários diretos sobre artes e postagens.
              </AccordionContent>
            </AccordionItem>

            {[
              "Como o Pinify funciona?",
              "Quem pode usar o Pinify?",
              "O Pinify vai ser gratuito?",
              "O Pinify precisa ser instalado?",
              "O Pinify funciona em dispositivos móveis?"
            ].map((q, i) => {
              const id = `item-${i + 1}`
              return (
                <AccordionItem value={id} key={id}>
                  <AccordionTrigger
                    className={`px-6 py-4 text-sm font-medium text-left hover:no-underline ${
                      activeLeft === id
                        ? "bg-gradient-to-r from-indigo-500 to-cyan-400 text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-2 text-sm text-gray-600">
                    Resposta para "{q}".
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>

          {/* Coluna Direita */}
          <Accordion
            type="single"
            collapsible
            value={activeRight}
            onValueChange={(value) => setActiveRight(value)}
            className="bg-white rounded-xl overflow-hidden shadow"
          >
            <AccordionItem value="item-0">
              <AccordionTrigger
                className={`px-6 py-4 text-sm font-semibold hover:no-underline ${
                  activeRight === "item-0"
                    ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-white"
                    : "text-gray-900"
                }`}
              >
                Como os feedbacks são adicionados?
              </AccordionTrigger>
              <AccordionContent className="bg-white px-6 py-4 text-sm text-gray-700">
                Os usuários podem clicar diretamente sobre a arte ou postagem para adicionar comentários e sugestões de melhoria.
              </AccordionContent>
            </AccordionItem>

            {[
              "É possível rastrear mudanças?",
              "Posso compartilhar feedbacks com qualquer pessoa?",
              "O Pinify permite aprovações finais?",
              "Meus arquivos estão seguros no Pinify?",
              "Como posso obter suporte caso tenha dúvidas?"
            ].map((q, i) => {
              const id = `item-2-${i + 1}`
              return (
                <AccordionItem value={id} key={id}>
                  <AccordionTrigger
                    className={`px-6 py-4 text-sm font-medium text-left hover:no-underline ${
                      activeRight === id
                        ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-2 text-sm text-gray-600">
                    Resposta para "{q}".
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
