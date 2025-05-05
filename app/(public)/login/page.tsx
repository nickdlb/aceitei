'use client';

import React from 'react';
import LoginForm from '@/components/common/auth/LoginForm';
import LoginHeader from '@/components/common/auth/LoginHeader';
import useAuthLogin from '@/hooks/useAuthLogin';
import { Toggle } from '@/components/ui/toggleDarkmode';

const LoginPage = () => {

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
              loading={loading}
              error={error}
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
