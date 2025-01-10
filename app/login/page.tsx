'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        router.push('/');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) {
        setError(error.message);
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-96 bg-gray-100 border-r border-gray-300 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b bg-white border-b-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded"></div>
            <div className="flex items-center justify-between flex-1">
              <Link href="/" className="font-medium hover:text-blue-600">
                Aceitei
              </Link>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Free</span>
            </div>
          </div>
        </div>
        {/* Login Form */}
        <div className="flex-1 p-6 bg-white">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
            >
              {loading ? 'Logging in...' : 'Entrar'}
            </button>
          </form>
          <button
            onClick={handleGoogleLogin}
            className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded border border-gray-300 focus:outline-none focus:shadow-outline w-full"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google Logo" className="inline h-6 w-6 mr-2" />
            Login com Google
          </button>
          <div className="mt-4 text-center">
            <Link href="/register" className="text-blue-500 hover:text-blue-700">
              Criar uma conta
            </Link>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-16 rounded-lg shadow-lg">
          <UserCircleIcon className="w-48 h-48 text-gray-400 mb-8" />
          <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Aceitei</h1>
          <p className="text-gray-600 text-lg">
            Gerencie seus projetos e feedbacks com facilidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
