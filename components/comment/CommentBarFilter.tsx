interface CommentFilterProps {
  statusFilter: 'ativo' | 'resolvido' | null;
  setStatusFilter: (filter: 'ativo' | 'resolvido' | null) => void;
  totalComments: number;
}

const CommentFilter: React.FC<CommentFilterProps> = ({ statusFilter, setStatusFilter, totalComments }) => {
  return (
    <div className="pt-4 pl-4 pb-3">
      <div className="flex flex-wrap gap-2">
        <span className=" text-acpreto font-semibold w-full text-sm ">
          Total de Comentários: {totalComments}
        </span>

        <button
          onClick={() => setStatusFilter('ativo')}
          className={`px-3 py-1 rounded-md text-sm ${statusFilter === 'ativo'
            ? 'bg-yellow-500 text-acbrancohover'
            : 'bg-acbg text-actextocinza'
            }`}
        >
          Ativos
        </button>
        <button
          onClick={() => setStatusFilter('resolvido')}
          className={`px-3 py-1 rounded-md text-sm ${statusFilter === 'resolvido'
            ? 'bg-green-500 text-acbrancohover'
            : 'bg-acbg text-actextocinza'
            }`}
        >
          Resolvidos
        </button>
      </div>
    </div>
  );
};

export default CommentFilter;
