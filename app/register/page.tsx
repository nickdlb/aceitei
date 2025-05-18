'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import useAuthLogin from '@/hooks/useAuthLogin';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { handleGoogleLogin } = useAuthLogin()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Conta criada com sucesso! Verifique seu e-mail para confirmar sua conta.');
        setEmail('');
        setPassword('');
        router.push("/account")
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-acbg">
      <div className="w-1/2 bg-cover bg-[url(/noite-estrelada-comentada.jpg)]"></div>
      <div className='w-1/2 bg-acbg p-40 flex justify-center items-center'>
        <div className="bg-acbgbranco p-10 w-[500px] h-min rounded-xl flex gap-4 flex-col">
            <Image src="/logo-feedybacky-white.png" alt="logo feedybacky" width={200} height={200}/>
            <h1 className="text-2xl font-bold">Crie a sua Conta</h1>
          <button onClick={handleGoogleLogin} className="bg-acbgbranco hover:bg-acbg text-actextocinza flex gap-2 justify-center font-bold py-2 px-4 rounded-xl border border-acpreto focus:outline-none focus:shadow-outline w-full">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google Icon" className="size-6" />
            Entrar com Google
          </button>
          <p className='text-sm'>Por enquanto estamos aceitando apenas novas contas pelo Google</p>
            <Link href="/login" className="text-acazul hover:text-acazul">
              Já tem uma conta? Entrar
            </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
