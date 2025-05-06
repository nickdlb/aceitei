'use client';

import React from 'react';
import Sidebar from '@/components/dashboard/sidebar/Sidebar';
import AccountContainer from '@/components/account/AccountContainer';
import { useAuthChecker } from '@/utils/useAuthChecker';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const MinhaConta = () => {
  const { isLoading, isAuthenticated, shouldRedirect } = useAuthChecker();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && shouldRedirect) {
      router.replace('/login');
    }

  }, [isLoading, shouldRedirect, router]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (shouldRedirect || !isAuthenticated) {
    return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
  }

  return (
    <div className="flex h-screen bg-acbg">
      <Sidebar />
      <AccountContainer />
    </div>
  );
};

export default MinhaConta;
