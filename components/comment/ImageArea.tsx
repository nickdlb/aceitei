import React, { useState, useRef, useCallback } from 'react';
import ImagePin from './ImagePin';
import { ImageAreaProps } from '@/types/CommentsProps';
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
}) => {
  const [zoomLevel, setZoomLevel] = useState('100');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(imageTitle);

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
      // Save the title if it's being edited and is not empty
      if (newTitle.trim()) {
        try {
          await onTitleUpdate(newTitle);
          // Keep editing mode active after successful save? Or toggle off?
          // For now, let's toggle off after save.
          setIsEditingTitle(false);
        } catch (error: any) {
          console.error('Erro ao atualizar título:', error?.message || JSON.stringify(error) || 'Erro desconhecido');
          // Don't toggle editing state on error, allow user to retry or cancel
          // Optionally reset newTitle to imageTitle here if desired on error
          // setNewTitle(imageTitle);
        }
      } else {
         // If title is empty, just exit edit mode without saving
         setIsEditingTitle(false);
         setNewTitle(imageTitle); // Reset to original title if save is cancelled/empty
      }
    } else {
      // Entering edit mode: Set newTitle to the current imageTitle
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
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Barra de informações e controles */}
      <ImageAreaHeader
        imageTitle={imageTitle}
        exibirImagem={exibirImagem}
        isEditingTitle={isEditingTitle}
        newTitle={newTitle}
        zoomLevel={zoomLevel}
        isPagesOpen={isPagesOpen || false}
        handleTitleEdit={handleTitleEdit}
        getFileFormat={getFileFormat}
        handleDownload={handleDownload}
        handleZoomChange={handleZoomChange}
        onTogglePages={onTogglePages || (() => {})}
        setNewTitle={setNewTitle}
      />

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
