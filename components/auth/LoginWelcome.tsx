import { UserCircleIcon } from '@heroicons/react/24/outline';

const LoginWelcome = () => {
  return (
    <div className="flex-1 bg-gray-200 flex items-center justify-center">
      <div className="bg-white p-16 rounded-lg shadow-lg">
        <UserCircleIcon className="w-48 h-48 text-gray-400 mb-8" />
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Aceitei</h1>
        <p className="text-gray-600 text-lg">
          Gerencie seus projetos e feedbacks com facilidade.
        </p>
      </div>
    </div>
  )
}

export default LoginWelcome
