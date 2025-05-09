import React, { useState, useRef, useCallback } from 'react';
import ImagePin from './ImagePin';
import { ImageAreaProps } from '@/types';
import ImageAreaHeader from './ImageAreaHeader';

interface Props extends ImageAreaProps {
  onTitleUpdate: (newTitle: string) => Promise<void | undefined>;
  onTogglePages: () => void;
}

const ImageArea: React.FC<Props> = ({
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
  isPagesOpen,
  pagesCount,
}) => {
  const [zoomLevel, setZoomLevel] = useState('100');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(imageTitle);

  const toggleEditTitle = () => {
    setIsEditingTitle((prev) => !prev);
  };

  const handleZoomChange = useCallback((value: string) => {
    setZoomLevel(value);
    if (scrollContainerRef.current) {
      const scale = parseInt(value) / 100;
      scrollContainerRef.current.style.transform = `scale(${scale})`;
      scrollContainerRef.current.style.transformOrigin = 'top center';
    }
  }, []);

  const handleTitleEdit = useCallback(async () => {
    if (isEditingTitle) {

      if (newTitle.trim()) {
        try {
          await onTitleUpdate(newTitle);

          setIsEditingTitle(false);
        } catch (error: any) {
          console.error('Erro ao atualizar título:', error?.message || JSON.stringify(error) || 'Erro desconhecido');

        }
      } else {

        setIsEditingTitle(false);
        setNewTitle(imageTitle);
      }
    } else {

      setNewTitle(imageTitle);
      setIsEditingTitle(true);
    }
  }, [isEditingTitle, newTitle, imageTitle, onTitleUpdate, setNewTitle, setIsEditingTitle]);

  const getFileFormat = useCallback((url: string | undefined) => {
    if (!url) return '';
    const extension = url.split('.').pop()?.toLowerCase() || '';
    return extension === 'jpg' ? 'JPEG' : extension.toUpperCase();
  }, []);

  const handleDownload = useCallback(async () => {
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
  }, [exibirImagem, imageTitle, getFileFormat]);

  return (
    <div className="flex-1 flex-col">
      <ImageAreaHeader
        toggleEditTitle={toggleEditTitle}
        imageTitle={imageTitle}
        exibirImagem={exibirImagem}
        isEditingTitle={isEditingTitle}
        newTitle={newTitle}
        zoomLevel={zoomLevel}
        isPagesOpen={isPagesOpen || false}
        handleTitleEdit={handleTitleEdit}
        handleDownload={handleDownload}
        handleZoomChange={handleZoomChange}
        onTogglePages={onTogglePages || (() => { })}
        setNewTitle={setNewTitle}
        pagesCount={pagesCount}
      />

      <div
        ref={containerRef}
        className="flex-1 overflow-auto relative flex items-start justify-center bg-acbg"
        style={{
          height: 'calc(100vh - 3.5rem)'
        }}
      >
        <div
          ref={scrollContainerRef}
          className="relative transition-transform duration-300 ease-in-out pt-4"
        >
          <div className="relative">
            <img ref={imageRef} src={exibirImagem} alt={imageTitle || "Imagem para comentários"} className="max-h-[calc(100vh-5rem)] w-auto object-contain" onClick={(e) => {
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
