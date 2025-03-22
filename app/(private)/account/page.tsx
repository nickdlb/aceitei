'use client';

import React from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import AccountContainer from '@/components/account/AccountContainer';
import { useAuth } from '@/components/auth/AuthProvider';

const MinhaConta = () => {
  const { session, loading } = useAuth();
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <AccountContainer />
    </div>
  );
};

export default MinhaConta;