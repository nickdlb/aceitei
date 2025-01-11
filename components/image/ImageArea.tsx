import React, { useState, useRef, useEffect } from 'react';
import InteractiveImage from './InteractiveImage';
import ImagePin from './ImagePin';
import { ImageAreaProps } from '@/types/ImageArea';
import { Pin } from '@/types/Pin';
import { useImageAspectRatio } from '@/hooks/useImageAspectRatio';

const ImageArea: React.FC<ImageAreaProps> = ({
  exibirImagem,
  pins,
  handleImageClick,
  draggingPin,
  setDraggingPin,
  isDragging,
  setIsDragging,
  updatePinPosition,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImageAspectRatio(imageRef, containerRef, exibirImagem);

  const handleMouseDown = (event: React.MouseEvent<HTMLImageElement>) => {
    if (imageRef.current) { // Added null check
      const rect = imageRef.current.getBoundingClientRect();
      const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
      handleImageClick(xPercent, yPercent);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setDraggingPin(null);
      setIsDragging(false);
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [setDraggingPin, setIsDragging]);

  return (
    <div className="flex-1 flex items-center justify-center relative container-imagem" ref={containerRef}>
      <InteractiveImage src={exibirImagem} onClick={handleMouseDown} imageRef={imageRef} />
      {pins.map((pin) => (
        <ImagePin
          key={pin.id}
          pin={pin}
          draggingPin={draggingPin}
          setDraggingPin={setDraggingPin}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          updatePinPosition={updatePinPosition}
        />
      ))}
    </div>
  );
};

export default ImageArea;
