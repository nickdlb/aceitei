import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/ui/select';

interface OrdenacaoFiltroProps {
    sortOrder: string;
    handleSort: (value: string) => void;
}

const OrdenacaoFiltro: React.FC<OrdenacaoFiltroProps> = ({ sortOrder, handleSort }) => {
    return (
        <div className='flex items-center bg-acbranco px-4 py-2 rounded-xl'>
            <span className="text-sm text-actextocinza">Ordenar por:</span>
            <Select onValueChange={handleSort} value={sortOrder}>
                <SelectTrigger className="px-2 !h-7 text-sm ml-2">
                    <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent className='bg-acbgbranco border-none'>
                    <SelectItem value="date">Data</SelectItem>
                    <SelectItem value="title">Título</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default OrdenacaoFiltro;