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
    console.log(`[account/page.tsx Effect] isLoading: ${isLoading}, shouldRedirect: ${shouldRedirect}`);
    if (!isLoading && shouldRedirect) {
      console.log('[account/page.tsx] Triggering replace redirect to /login');
      router.replace('/login');
    }

  }, [isLoading, shouldRedirect, router]);

  if (isLoading) {
    console.log('[account/page.tsx] Rendering Loading state');
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (shouldRedirect || !isAuthenticated) {
    console.log(`[account/page.tsx] Rendering Redirecting state (shouldRedirect: ${shouldRedirect}, isAuthenticated: ${isAuthenticated})`);
    return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
  }

  console.log('[account/page.tsx] Rendering main content');

  return (
    <div className="flex h-screen bg-acbg">
      <Sidebar />
      <AccountContainer />
    </div>
  );
};

export default MinhaConta;
