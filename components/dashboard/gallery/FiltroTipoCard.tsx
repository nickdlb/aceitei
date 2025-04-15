import React from 'react';
import { List, Image, Globe } from 'lucide-react';

interface FiltroTipoCardProps {
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
}

const FiltroTipoCard: React.FC<FiltroTipoCardProps> = ({ activeFilter, setActiveFilter }) => {
    const handleFilterClick = (filter: string) => {
        setActiveFilter(filter);
    };

    return (
        <div className="flex gap-2 bg-white rounded-xl px-4 py-3">
            <button
                onClick={() => handleFilterClick('todos')}
                className={`flex items-center gap-1 px-3 py-1 rounded-xl text-sm font-medium ${activeFilter === 'todos' ? 'bg-acazul text-acbrancohover' : 'bg-acbg text-actext'}`}
            >
                <List className="h-4 w-4" />
                Todos
            </button>
            <button
                onClick={() => handleFilterClick('imagens')}
                className={`flex items-center gap-1 px-3 py-1 rounded-xl text-sm font-medium ${activeFilter === 'imagens' ? 'bg-acazul text-acbrancohover' : 'bg-acbg text-actext'}`}
            >
                <Image className="h-4 w-4" />
                Imagens
            </button>
            <button
                onClick={() => handleFilterClick('sites')}
                className={`flex items-center gap-1 px-3 py-1 rounded-xl text-sm font-medium ${activeFilter === 'sites' ? 'bg-acazul text-acbrancohover' : 'bg-acbg text-actext'}`}
            >
                <Globe className="h-4 w-4" />
                Sites
            </button>
        </div>
    );
};

export default FiltroTipoCard;
