'use client'

import React from 'react';
import FaqSection from '@/components/home/FaqSection';
import HeroSection from '@/components/home/HeroSection';
import ProfissionalsSection from '@/components/home/ProfissionalsSection';
import FooterSection from '@/components/home/FooterSection';
import CtaSection from '@/components/home/CtaSection';
import HeaderSection from '@/components/home/HeaderSection';
import RevisionSection from '@/components/home/RevisionSection';
import EfficiencySection2 from '@/components/home/EfficiencySection2';
import LaptopSection from '@/components/home/LaptopSection';
import BentoboxSession from '@/components/home/BentoboxSection';

const HomePage = () => {
  return (
    <div className='flex items-center justify-center w-full bg-acbranco'>
      <div className="text-gray-800 font-sans w-full max-w-full">
        <HeaderSection/>
        <HeroSection/>
        <LaptopSection/>
        <ProfissionalsSection/>
        <BentoboxSession/>
        <EfficiencySection2/>
        <RevisionSection/>
        <FaqSection/>
        <CtaSection/>
        <FooterSection/>
      </div>
    </div>
  );
};

export default HomePage;
