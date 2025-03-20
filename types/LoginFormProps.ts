export default interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  error: string;
  handleLogin: (e: React.FormEvent) => void;
  handleGoogleLogin: () => void;
}