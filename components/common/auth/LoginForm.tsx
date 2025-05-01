import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  error: string;
  handleLogin: (e: React.FormEvent) => void;
  handleGoogleLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  handleLogin,
  handleGoogleLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-actextocinza text-sm mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-acpretohover text-sm px-2 py-2 border rounded focus:outline-none focus:border-acazul"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-actextocinza text-sm mb-1">
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-acpretohover w-full px-2 py-3 pr-10 text-sm border rounded focus:outline-none focus:border-acazul"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-actextocinza hover:text-actextocinza focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-aclaranja hover:bg-acroxo text-acbrancohover font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline w-full mb-4"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <button
        onClick={handleGoogleLogin}
        className="bg-acbgbranco hover:bg-acbg text-actextocinza flex gap-2 justify-center font-bold py-2 px-4 rounded-xl border border-acpreto focus:outline-none focus:shadow-outline w-full"
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google Icon" className="size-6" />
        Entrar com Google
      </button>
      <div className="mt-4 text-center">
        <Link href="/register" className="text-acazul">
          Criar uma conta
        </Link>
      </div>
    </>
  );
};

export default LoginForm;
