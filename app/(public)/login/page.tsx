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
    <div className="flex h-screen bg-gray-50">
      <div className="w-96 bg-gray-100 border-r border-gray-300 flex flex-col h-full">
        <LoginHeader />
        <div className="flex-1 p-6 bg-white">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
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
      <LoginWelcome />
    </div>
  );
};

export default LoginPage;
