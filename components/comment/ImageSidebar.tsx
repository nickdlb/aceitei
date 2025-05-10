'use client';

import Image from 'next/image';
import { useRef, useCallback, useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { updatePageNumber } from '@/utils/updatePageNumber';

interface ImageSidebarProps {
  pages: Array<{
    id: string;
    image_url: string;
    page_number: number;
  }>;
  currentPage: string;
  onPageChange: (pageId: string) => void;
}

const ItemTypes = {
  IMAGE: 'image',
};

const DraggableImage = ({
  page,
  index,
  moveImage,
  onPageChange,
  currentPage,
  setDragging,
}: {
  page: any;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  onPageChange: (pageId: string) => void;
  currentPage: string;
  setDragging: (dragging: boolean) => void;
}) => {
  const imageUrl = `https://nokrffogsfxouxzrrkdp.supabase.co/storage/v1/object/public/files/${page.image_url}`;
  const isActive = page.id === currentPage;
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { id: page.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      setDragging(false); // só atualiza no fim do drag
    },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    hover(item: any) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
      setDragging(true); // marca como arrastando
    },
  });

  drag(drop(ref));

  return (
    <motion.div
      ref={ref}
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`relative rounded cursor-pointer hover:bg-acbg transition-colors ${
        isActive ? 'bg-actextocinza' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onPageChange(page.id)}
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={imageUrl}
          alt={`Página ${index + 1}`}
          fill
          className="object-cover rounded-md shadow-sm"
          sizes="120px"
          unoptimized
        />
        <div className="absolute top-1 right-1 bg-acpreto bg-opacity-50 text-acbranco text-xs px-1.5 py-0.5 rounded-sm">
          {index + 1}
        </div>
      </div>
    </motion.div>
  );
};

const ImageSidebar = ({
  pages,
  currentPage,
  onPageChange,
}: ImageSidebarProps) => {
  const [orderedPages, setOrderedPages] = useState(pages);
  const [isDragging, setDragging] = useState(false);

  const moveImage = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const updated = [...orderedPages];
      const [removed] = updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, removed);
      const updatedWithNumbers = updated.map((p, i) => ({
        ...p,
        page_number: i + 1,
      }));
      setOrderedPages(updatedWithNumbers);
    },
    [orderedPages]
  );

  useEffect(() => {
    if (isDragging) return;

    const persist = async () => {
      const hasPageOne = orderedPages.some((p) => p.page_number === 1);
      const allUnique = new Set(orderedPages.map((p) => p.page_number)).size === orderedPages.length;

      if (!hasPageOne || !allUnique) {
        toast.error('Erro: ordem inválida ou duplicada.');
        return;
      }

      await updatePageNumber(orderedPages);
      toast.success('Ordem salva com sucesso!');
    };

    persist();
  }, [orderedPages, isDragging]);

  return (
    <div className="w-36 bg-acbgbranco flex flex-col">
      <div className="p-4 h-14 items-center">
        <h2 className="text-sm font-semibold text-actextocinza">
          Páginas ({orderedPages.length})
        </h2>
      </div>
      <div className="pt-2 pr-2 pl-2 flex-1 overflow-y-auto space-y-2">
        <AnimatePresence>
          {orderedPages.map((page, index) => (
            <DraggableImage
              key={page.id}
              page={page}
              index={index}
              moveImage={moveImage}
              onPageChange={onPageChange}
              currentPage={currentPage}
              setDragging={setDragging}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const WrappedImageSidebar = ({
  pages,
  currentPage,
  onPageChange,
}: ImageSidebarProps) => (
  <DndProvider backend={HTML5Backend}>
    <ImageSidebar
      pages={pages}
      currentPage={currentPage}
      onPageChange={onPageChange}
    />
  </DndProvider>
);

export default WrappedImageSidebar;
