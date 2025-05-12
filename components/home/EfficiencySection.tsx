'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  History
} from 'lucide-react';

const tabs = [
  {
    title: 'Dashboard',
    heading: 'Painel Centralizado',
    description:
      'Visualize todo o fluxo de feedbacks em tempo real, com dados centralizados e acessíveis em uma única tela.',
    image: '/gestao-preview.png',
    icon: LayoutDashboard
  },
  {
    title: 'Colaboração',
    heading: 'Trabalho em Equipe',
    description:
      'Trabalhe em equipe de forma organizada. Todos os comentários em um só lugar, sem ruídos na comunicação.',
    image: '/comentarios.png',
    icon: Users
  },
  {
    title: 'Aprovações',
    heading: 'Fluxo de Aprovação Visual',
    description:
      'Facilite o processo de aprovação com um sistema visual, claro e direto para seus clientes e equipe.',
    image: '/gestao-preview.png',
    icon: CheckCircle
  },
  {
    title: 'Histórico',
    heading: 'Registro de Alterações',
    description:
      'Acompanhe todas as interações e mudanças feitas no projeto, com histórico completo de revisões.',
    image: '/gestao-preview.png',
    icon: History
  },
];

export default function EfficiencySection() {
  const [activeTab, setActiveTab] = useState(0);
  const current = tabs[activeTab];

  return (
    <section className="relative bg-acbranco min-h-[820px] py-20 sm:py-32 overflow-hidden">
      <div className="relative z-10 max-w-[1300px] mx-auto px-6 lg:px-0 flex flex-col lg:flex-row items-start gap-8">
        {/* CONTEÚDO PRINCIPAL */}
        <div className="w-full lg:w-1/2 pr-0 lg:pr-5 flex flex-col items-center lg:items-start text-center lg:text-left">
          <p
            className="text-sm font-medium uppercase tracking-wide mb-5 inline-block px-4 py-2 rounded-full"
            style={{
              backgroundColor: '#EEF1FF',
              color: '#4A5EFF',
            }}
          >
            COMO FUNCIONA?
          </p>

          <h2 className="text-3xl sm:text-5xl font-bold text-acpreto mb-6 leading-tight">
            maneira mais eficiente de gerenciar feedbacks visuais
          </h2>

          {/* Botões com ícones */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
            {tabs.map((tab, i) => {
              const Icon = tab.icon;
              return (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition ${
                    activeTab === i
                      ? 'bg-acazul text-white border-acazul'
                      : 'text-acpreto border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  {tab.title}
                </button>
              );
            })}
          </div>

          <div className="pt-[10px]">
            <h3 className="text-2xl font-semibold text-acpreto mb-2">
              {current.heading}
            </h3>
            <p className="text-lg text-accinza mb-6">{current.description}</p>
          </div>

          {/* Botão mostrado apenas no desktop */}
          <a
            href="#inscricao"
            className="hidden lg:inline-flex items-center border border-acroxo text-acroxo px-6 py-3 rounded-full font-medium hover:bg-acroxo hover:text-white transition"
          >
            Comece agora <span className="ml-2">→</span>
          </a>
        </div>

        {/* IMAGEM MOBILE (visível apenas no mobile) */}
        <div className="block lg:hidden w-full mt-10">
          <div className="relative h-[300px] sm:h-[400px] w-full">
            <AnimatePresence mode="sync">
              <motion.div
                key={current.image + activeTab}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
              >
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                  <img
                    src={current.image}
                    alt={current.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Botão "Comece agora" somente no mobile */}
          <div className="mt-6 flex justify-center">
            <a
              href="#inscricao"
              className="inline-flex items-center border border-acroxo text-acroxo px-6 py-3 rounded-full font-medium hover:bg-acroxo hover:text-white transition"
            >
              Comece agora <span className="ml-2">→</span>
            </a>
          </div>
        </div>

        {/* IMAGEM DESKTOP (inalterada) */}
        <div className="hidden lg:block w-1/2" />
      </div>

      <div className="hidden lg:flex absolute right-0 top-0 h-full w-[50vw] z-0 items-center">
        <div className="relative h-[600px] w-full py-12">
          <AnimatePresence mode="sync">
            <motion.div
              key={current.image + activeTab + '-desktop'}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
            >
              <div className="w-full h-full rounded-l-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
