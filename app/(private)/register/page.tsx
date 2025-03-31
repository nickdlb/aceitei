'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';

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
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-acbg">
      <div className="w-96 bg-acbg border-r border-gray-300 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b bg-acbgbranco border-b-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-acazul rounded"></div>
            <div className="flex items-center justify-between flex-1">
              <Link href="/" className="font-medium hover:text-acazul">
                Aceitei
              </Link>
            </div>
          </div>
        </div>
        {/* Registration Form */}
        <div className="flex-1 p-6 bg-acbgbranco">
          <h1 className="text-2xl font-bold mb-4">Criar Conta</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-actextocinza font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-acazul"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-actextocinza font-bold mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-acazul"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-acazul hover:bg-acazul text-acbranco font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/login" className="text-acazul hover:text-acazul">
              Já tem uma conta? Entrar
            </Link>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-acbgbranco p-16 rounded-lg shadow-lg">
          <UserCircleIcon className="w-48 h-48 text-actextocinza mb-8" />
          <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Aceitei</h1>
          <p className="text-actextocinza text-lg">
            Gerencie seus projetos e feedbacks com facilidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
