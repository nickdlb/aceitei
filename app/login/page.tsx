'use client';

import React, { useEffect } from 'react';
import useAuthLogin from '@/hooks/useAuthLogin';
import { useAuthChecker } from '@/utils/useAuthChecker';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';

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
  const { theme, logo } = useTheme()

  const { isLoading, isAuthenticated, shouldRedirect } = useAuthChecker();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);
  if (isLoading) return <div>Loading...</div>;
  if (isAuthenticated || shouldRedirect) return <div>Redirecting...</div>;

  return (
    <div className="flex h-screen w-full bg-acbg">
      <div className="w-1/2 bg-cover bg-[url(/noite-estrelada-comentada.jpg)]"></div>
      <div className='w-1/2 bg-acbg p-40 flex justify-center items-center'>
        <div className="bg-acbgbranco p-10 w-[500px] h-min rounded-xl flex gap-4 flex-col">
          {logo !== '' && (
              <Link title="home" href="/"><img src={logo} alt="Feedybacky" className="w-[160px]" />
              </Link>
          )}
          <h1 className='text-xl font-semibold'> Acesse sua conta</h1>
          <button onClick={handleGoogleLogin} className="bg-acbgbranco hover:bg-acbg text-actextocinza flex gap-2 justify-center font-bold py-2 px-4 rounded-xl border border-acpreto focus:outline-none focus:shadow-outline w-full">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google Icon" className="size-6" />
            Entrar com Google
          </button>
          <p className='text-sm'>Em breve teremos acesso por e-mail/senha</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
