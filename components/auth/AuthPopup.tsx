import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AuthPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, email: string) => Promise<void>;
}

const AuthPopup = ({ isOpen, onClose, onSubmit }: AuthPopupProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await onSubmit(name, email);
            onClose();
        } catch (error: any) {
            setError(error.message || 'Erro ao salvar suas informações. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative overflow-hidden">
                {/* Cabeçalho */}
                <div className="bg-blue-50 p-6 pb-4">
                    <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-blue-900">
                            Identifique-se para comentar
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="mt-2 text-sm text-blue-700">
                        Para manter a qualidade das discussões e facilitar o acompanhamento dos comentários, 
                        precisamos saber quem você é.
                    </p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nome completo
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Salvando...' : 'Continuar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthPopup; 