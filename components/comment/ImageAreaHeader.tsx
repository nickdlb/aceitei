'use client';

import React, { useState, useCallback } from 'react';
import { Download, Pencil, LayoutList } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { usePageContext } from '@/contexts/PageContext';
import { useEffect } from 'react';

interface ImageAreaHeaderProps {
  exibirImagem: string;
  onTitleUpdate: (newTitle: string) => Promise<void | undefined>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>; // ← aqui está o ajuste
  onTogglePages: () => void;
  isPagesOpen: boolean;
  pagesCount?: number;
}

const ImageAreaHeader: React.FC<ImageAreaHeaderProps> = ({
  exibirImagem,
  onTitleUpdate,
  scrollContainerRef,
  onTogglePages,
  isPagesOpen,
  pagesCount,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [zoomLevel, setZoomLevel] = useState('100');
  const { documentData } = usePageContext();
  const [newTitle, setNewTitle] = useState(documentData.title);

  const toggleEditTitle = () => {
    setIsEditingTitle((prev) => !prev);
  };

  const handleTitleEdit = useCallback(async () => {
    if (isEditingTitle) {
      if (newTitle.trim()) {
        try {
          await onTitleUpdate(newTitle);
          toast.success('Título atualizado com sucesso');
          setIsEditingTitle(false);
        } catch (error: any) {
          toast.error('Erro ao atualizar título: ' + (error?.message || 'Erro desconhecido'));
        }
      } else {
        toast.error('O título não pode ser vazio.');
        setNewTitle(documentData.title);
        setIsEditingTitle(false);
      }
    } else {
      setNewTitle(documentData.title);
      setIsEditingTitle(true);
    }
  }, [isEditingTitle, newTitle, documentData.title, onTitleUpdate]);

  const getFileFormat = (url: string | undefined) => {
    if (!url) return '';
    const extension = url.split('.').pop()?.toLowerCase() || '';
    return extension === 'jpg' ? 'JPEG' : extension.toUpperCase();
  };

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(exibirImagem);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentData.title || 'imagem'}.${getFileFormat(exibirImagem).toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Erro ao baixar imagem.');
      console.error('Erro ao baixar imagem:', error);
    }
  }, [exibirImagem, documentData.title]);

  const handleZoomChange = useCallback((value: string) => {
    setZoomLevel(value);
    const scale = parseInt(value) / 100;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.transform = `scale(${scale})`;
      scrollContainerRef.current.style.transformOrigin = 'top center';
    }
  }, [scrollContainerRef]);

  useEffect(() => {
  setZoomLevel('100');
  if (scrollContainerRef.current) {
    scrollContainerRef.current.style.transform = 'scale(1)';
    scrollContainerRef.current.style.transformOrigin = 'top center';
  }
}, [exibirImagem]);

  return (
    <div className="h-16 bg-acbgbranco flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        {isEditingTitle ? (
          <Input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="text-sm border-none !ring-0 pl-0 font-medium !leading-8 min-w-full"
            autoFocus
            maxLength={50}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleTitleEdit();
            }}
          />
        ) : (
          <h2 className="text-sm font-medium text-actextocinza">{documentData.title}</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleEditTitle}
          className="text-acpreto min-w-fit hover:text-aclaranja"
        >
          <Pencil className="size-4" />
        </Button>
        <p className="min-w-fit text-xs text-actextocinza">
          Formato: {getFileFormat(exibirImagem)}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <select
          value={zoomLevel}
          onChange={(e) => handleZoomChange(e.target.value)}
          className="rounded px-2 py-1 text-sm text-acpretohover"
        >
          <option value="100">100%</option>
          <option value="150">150%</option>
          <option value="200">200%</option>
        </select>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
          className="text-acpreto hover:text-acazul"
        >
          <Download className="w-5 h-5" />
        </Button>
        {pagesCount && pagesCount > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onTogglePages}
            className="text-acpreto hover:text-aclaranja"
          >
            <LayoutList className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageAreaHeader;
