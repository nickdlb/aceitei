'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/ui/select';
import { useGalleryContext } from '@/contexts/GalleryContext';

const OrdenacaoFiltro: React.FC = () => {
  const { sortOrder, setSortOrder } = useGalleryContext();

  return (
    <div className='flex items-center bg-acbranco px-4 py-2 rounded-xl'>
      <span className="text-sm text-actextocinza">Ordenar por:</span>
      <Select onValueChange={setSortOrder} value={sortOrder}>
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
