'use client';

import React from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import AccountContainer from '@/components/account/AccountContainer';
import { useAuthChecker } from '@/utils/useAuthChecker';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useEffect } from 'react'; // Import useEffect

const MinhaConta = () => {
  const { isLoading, isAuthenticated, shouldRedirect } = useAuthChecker(); // Get shouldRedirect
  const router = useRouter(); // Initialize router

  // Perform redirect if the hook indicates it's needed
  useEffect(() => {
    console.log(`[account/page.tsx Effect] isLoading: ${isLoading}, shouldRedirect: ${shouldRedirect}`);
    if (!isLoading && shouldRedirect) {
      console.log('[account/page.tsx] Triggering replace redirect to /login');
      router.replace('/login'); // Use replace instead of push
    }
    // Depend on shouldRedirect to trigger effect
  }, [isLoading, shouldRedirect, router]);

  if (isLoading) {
    console.log('[account/page.tsx] Rendering Loading state');
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Render redirecting message or null if redirect is needed or not authenticated
  if (shouldRedirect || !isAuthenticated) {
    console.log(`[account/page.tsx] Rendering Redirecting state (shouldRedirect: ${shouldRedirect}, isAuthenticated: ${isAuthenticated})`);
    return <div className="flex h-screen items-center justify-center">Redirecting...</div>; // Or null
  }

  console.log('[account/page.tsx] Rendering main content');
  // Render content only if authenticated and no redirect needed
  return (
    <div className="flex h-screen bg-acbg">
      <Sidebar />
      <AccountContainer />
    </div>
  );
};

export default MinhaConta;
