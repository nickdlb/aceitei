'use client';

import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import LoginHeader from '@/components/auth/LoginHeader';
import useAuthLogin from '@/hooks/useAuthLogin';
import { Toggle } from '@/components/ui/toggleDarkmode';

const LoginPage = () => {
  // Only keep the state and handlers needed for the login form itself
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
    handleGoogleLogin,
  } = useAuthLogin();

  // Always render the login page structure
  return (
    <div className="flex h-screen bg-acbg">
      <div className="w-1/2 bg-cover  bg-[url(/noite-estrelada-comentada.jpg)]">
      </div>
      <div className='w-1/2 bg-acbg p-40 flex justify-center items-center'>
        <div className="bg-acbgbranco p-10 w-[500px] h-min rounded-xl flex flex-col">
          <LoginHeader />
          <div className="">
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading} // Keep loading state for the form button
              error={error}     // Keep error state for displaying login errors
              handleLogin={handleLogin}
              handleGoogleLogin={handleGoogleLogin}
            />
          </div>
          <div className='absolute right-4 bottom-4 hover:bg-acbgcinzafraco hover:text-acbrancohover text-acpreto size-9 rounded-full'> <Toggle /> </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
