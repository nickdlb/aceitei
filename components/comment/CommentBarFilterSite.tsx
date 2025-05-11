import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CommentFilterSiteProps {
  statusFilter: 'ativo' | 'resolvido' | null;
  setStatusFilter: (filter: 'ativo' | 'resolvido' | null) => void;
  groupByFilter: 'Link' | 'Nenhum';
  setGroupByFilter: (filter: 'Link' | 'Nenhum') => void;
  totalComments: number;
}

const CommentFilterSite: React.FC<CommentFilterSiteProps> = ({
  statusFilter,
  setStatusFilter,
  groupByFilter,
  setGroupByFilter,
  totalComments,
}) => {
  return (
    <div className="pt-4 pl-4 pb-3 space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-acpreto font-semibold text-sm mr-2">
          Total: {totalComments}
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
      <div className="flex items-center gap-2">
        <span className="text-acpreto font-semibold text-sm">Agrupar por:</span>
        <Select onValueChange={(value: 'Link' | 'Nenhum') => setGroupByFilter(value)} value={groupByFilter}>
          <SelectTrigger className="w-auto min-w-[120px]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Link">Link</SelectItem>
              <SelectItem value="Nenhum">Nenhum</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CommentFilterSite;
