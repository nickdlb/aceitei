import React, { useState, useRef } from 'react';
import ImagePin from './ImagePin';
import { ImageAreaProps } from '@/types/CommentsProps';
import { ArrowDownTrayIcon, PencilIcon, Squares2X2Icon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { createSupabaseClient } from '@/utils/supabaseClient';

const ImageArea: React.FC<ImageAreaProps> = ({
  exibirImagem,
  imageTitle,
  imageId,
  pins,
  handleImageClick,
  draggingPin,
  setDraggingPin,
  isDragging,
  setIsDragging,
  updatePinPosition,
  imageRef,
  onTitleUpdate,
  onTogglePages,
  isPagesOpen
}) => {
  const [zoomLevel, setZoomLevel] = useState('100');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(imageTitle);

  const handleZoomChange = (value: string) => {
    setZoomLevel(value);
    if (scrollContainerRef.current) {
      const scale = parseInt(value) / 100;
      scrollContainerRef.current.style.transform = `scale(${scale})`;
      scrollContainerRef.current.style.transformOrigin = 'top center';
    }
  };

  const handleTitleEdit = async () => {
    if (isEditingTitle && newTitle.trim()) {
      try {
        // Chamar diretamente a função onTitleUpdate que foi passada como prop
        await onTitleUpdate(newTitle);
      } catch (error: any) {
        // Melhorar o tratamento de erro para exibir mais detalhes
        console.error('Erro ao atualizar título:', error?.message || JSON.stringify(error) || 'Erro desconhecido');
        // Reverter para o título original em caso de erro
        setNewTitle(imageTitle);
      }
    }
    setIsEditingTitle(!isEditingTitle);
  };

  const getFileFormat = (url: string | undefined) => {
    if (!url) return '';
    const extension = url.split('.').pop()?.toLowerCase() || '';
    return extension === 'jpg' ? 'JPEG' : extension.toUpperCase();
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(exibirImagem);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${imageTitle || 'imagem'}.${getFileFormat(exibirImagem).toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar imagem:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Barra de informações e controles */}
      <div className="h-14 bg-white border-b flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleTitleEdit();
                  }
                }}
              />
            ) : (
              <h2 className="text-sm font-medium text-gray-900">{imageTitle}</h2>
            )}
            <button
              onClick={handleTitleEdit}
              className="p-1 rounded hover:bg-gray-100"
              title={isEditingTitle ? "Salvar título" : "Editar título"}
            >
              <PencilIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <p className="text-xs text-gray-500">Formato: {getFileFormat(exibirImagem)}</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={zoomLevel}
            onChange={(e) => handleZoomChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="100">100%</option>
            <option value="150">150%</option>
            <option value="200">200%</option>
          </select>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
            title="Baixar imagem"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
          <button
            onClick={onTogglePages}
            className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${isPagesOpen ? 'bg-gray-100' : ''
              }`}
            title={isPagesOpen ? "Ocultar páginas" : "Mostrar páginas"}
          >
            <DocumentDuplicateIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Container com scroll */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto relative flex items-start justify-center"
        style={{
          height: 'calc(100vh - 3.5rem)'
        }}
      >
        {/* Container da imagem com zoom */}
        <div
          ref={scrollContainerRef}
          className="relative transition-transform duration-300 ease-in-out pt-4"
        >
          <div className="relative">
            <img
              ref={imageRef}
              src={exibirImagem}
              alt={imageTitle || "Imagem para comentários"}
              className="max-h-[calc(100vh-5rem)] w-auto object-contain"
              onClick={(e) => {
                if (zoomLevel === '100' && !isDragging && !draggingPin) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  handleImageClick(x, y);
                }
              }}
              style={{ cursor: zoomLevel === '100' ? 'crosshair' : 'default' }}
            />
            {pins.map((pin) => (
              <ImagePin
                key={pin.id}
                pin={pin}
                draggingPin={draggingPin}
                setDraggingPin={setDraggingPin}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                updatePinPosition={updatePinPosition}
                style={{
                  position: 'absolute',
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageArea;
