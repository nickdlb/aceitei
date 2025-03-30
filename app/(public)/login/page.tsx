'use client';

import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import LoginHeader from '@/components/auth/LoginHeader';
import LoginWelcome from '@/components/auth/LoginWelcome';
import useAuthLogin from '@/hooks/useAuthLogin';

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
    <div className="flex h-screen bg-gray-100">
      <div className='w-1/2 bg-cover  bg-[url(/noite-estrelada-comentada.jpg)]'>
      </div>
      <div className='w-1/2 bg-gray-900 p-40 flex justify-center items-center'>
        <div className="bg-white p-10 w-[500px] h-min rounded-xl flex flex-col">
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
        </div>        
      </div>

    </div>
  );
};

export default LoginPage;
