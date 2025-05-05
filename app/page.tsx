'use client'

import React from 'react';
import FaqSection from '@/components/home/FaqSection';
import HeroSection from '@/components/home/HeroSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import ProfissionalsSection from '@/components/home/ProfissionalsSection';
import FooterSection from '@/components/home/FooterSection';
import CtaSection from '@/components/home/CtaSection';
import HeaderSection from '@/components/home/HeaderSection';
import RevisionSection from '@/components/home/RevisionSection';
import EfficiencySection from '@/components/home/EfficiencySection';
import LaptopSection from '@/components/home/LaptopSection';


const HomePage = () => {
  return (
    <div className='flex items-center justify-center w-full bg-acbranco'>
      <div className="text-gray-800 font-sans w-full max-w-full">
        <HeaderSection/>
        <HeroSection/>
        <LaptopSection/>
        <BenefitsSection/>
        <ProfissionalsSection/>
        <EfficiencySection/>
        <RevisionSection/>
        <FaqSection/>
        <CtaSection/>
        <FooterSection/>
      </div>
    </div>
  );
};

export default HomePage;
