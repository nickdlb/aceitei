import React from 'react';

interface FiltroTipoCardProps {
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
}

const FiltroTipoCard: React.FC<FiltroTipoCardProps> = ({ activeFilter, setActiveFilter }) => {
    return (
        <div className="flex gap-2 bg-white rounded-xl px-4 py-3">
            <button
                onClick={() => setActiveFilter('todos')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${activeFilter === 'todos' ? 'bg-acazul text-acbrancohover' : 'bg-acbg text-actext'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Todos
            </button>
            <button
                onClick={() => setActiveFilter('imagens')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${activeFilter === 'imagens' ? 'bg-acazul text-acbrancohover' : 'bg-acbg text-actext'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Imagens
            </button>
            <button
                onClick={() => setActiveFilter('sites')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${activeFilter === 'sites' ? 'bg-acazul text-acbrancohover' : 'bg-acbg text-actext'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Sites
            </button>
        </div>
    );
};

export default FiltroTipoCard;
