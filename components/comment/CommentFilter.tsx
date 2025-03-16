interface CommentFilterProps {
  statusFilter: 'ativo' | 'resolvido' | null;
  setStatusFilter: (filter: 'ativo' | 'resolvido' | null) => void;
}

const CommentFilter: React.FC<CommentFilterProps> = ({ statusFilter, setStatusFilter }) => {
  return (
    <div className="px-4 py-3 bg-white border-b border-b-gray-300">
      <div className="flex gap-2">
        <button
          onClick={() => setStatusFilter('ativo')}
          className={`px-3 py-1 rounded text-sm ${statusFilter === 'ativo'
            ? 'bg-yellow-500 text-white'
            : 'bg-gray-100 text-gray-600'
            }`}
        >
          Ativos
        </button>
        <button
          onClick={() => setStatusFilter('resolvido')}
          className={`px-3 py-1 rounded text-sm ${statusFilter === 'resolvido'
            ? 'bg-green-500 text-white'
            : 'bg-gray-100 text-gray-600'
            }`}
        >
          Resolvidos
        </button>
      </div>
    </div>
  );
};

export default CommentFilter;