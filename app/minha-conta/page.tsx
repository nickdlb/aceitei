'use client';

import React from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import AccountContainer from '@/components/account/AccountContainer';

const MinhaConta = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <AccountContainer />
    </div>
  );
};

export default MinhaConta;