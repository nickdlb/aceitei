'use client'

const StripePlans = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl text-acbranco font-semibold mb-2">Free</h2>
        <ul className="text-acbranco list-disc pl-5">
          <li>20MB de armazenamento</li>
          <li>Até 3 cards por mês</li>
        </ul>
        <Button className='bg-acbg'> Continuar </Button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl text-acbranco font-semibold mb-2">Premium</h2>
        <ul className="text-acbranco list-disc pl-5">
          <li>10GB de Armazenamento</li>
          <li>Cards Ilimitados</li>
          
        </ul>
        <Button className='bg-acazul'> Teste Grátis </Button>
      </div>
    </div>
  );
};


import Sidebar from '@/components/dashboard/sidebar/Sidebar'
import { Button } from '@/components/ui/button';
import React from 'react'

const page = () => {
  return (
    <div className="flex h-screen bg-acbg overflow-hidden">    
      <Sidebar/>
      <div className="w-full flex items-center justify-center">
        <StripePlans />
      </div>
    </div>
  );
};

export default page
