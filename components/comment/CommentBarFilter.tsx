interface CommentFilterProps {
  statusFilter: 'ativo' | 'resolvido' | null;
  setStatusFilter: (filter: 'ativo' | 'resolvido' | null) => void;
  totalComments: number;
}

const CommentFilter: React.FC<CommentFilterProps> = ({ statusFilter, setStatusFilter, totalComments }) => {
  return (
    <div className="p-4 bg-white">
      <div className="flex flex-wrap gap-2">
        <span className=" font-semibold w-full text-sm ">
            Total de Comentários: {totalComments}
        </span>

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