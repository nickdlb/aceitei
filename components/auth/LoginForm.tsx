import React, { useState } from 'react'; // Import useState
import Link from 'next/link';
import LoginFormProps from '@/types/LoginFormProps';
import { Eye, EyeOff } from 'lucide-react'; // Import icons

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
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-sm px-2 py-2 border rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm mb-1">
            Senha
          </label>
          <div className="relative"> {/* Added relative container */}
            <input
              type={showPassword ? 'text' : 'password'} // Dynamic type
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-2 py-3 pr-10 text-sm border rounded focus:outline-none focus:border-blue-500" // Added pr-10
              required
            />
            <button
              type="button" // Prevent form submission
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#FF5722] hover:bg-[#5448C8] text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline w-full mb-4"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <button
        onClick={handleGoogleLogin}
        className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-xl border border-gray-300 focus:outline-none focus:shadow-outline w-full"
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google Logo" className="inline h-6 w-6 mr-2" />
        Entrar com Google
      </button>
      <div className="mt-4 text-center">
        <Link href="/register" className="text-blue-500 hover:text-blue-700">
          Criar uma conta
        </Link>
      </div>
    </>
  );
};

export default LoginForm;
