import React, { useState, useRef, useEffect, useCallback } from 'react';
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
      const pinsContainerRef = useRef<HTMLDivElement>(null);
      const [imageLoaded, setImageLoaded] = useState(false);

      useImageAspectRatio(imageRef, containerRef, exibirImagem);

      const handleMouseDown = (event: React.MouseEvent<HTMLImageElement>) => {
        if (imageRef.current) {
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

      const handleImageLoad = useCallback(() => {
        if (imageRef.current && pinsContainerRef.current) {
          const rect = imageRef.current.getBoundingClientRect();
          pinsContainerRef.current.style.width = `${rect.width}px`;
          pinsContainerRef.current.style.height = `${rect.height}px`;
          pinsContainerRef.current.style.position = 'absolute';
          pinsContainerRef.current.style.top = '0';
          pinsContainerRef.current.style.left = '0';
          setImageLoaded(true);
        }
      }, []);

      return (
        <div className="flex-1 flex flex-col items-center justify-center relative container-imagem" ref={containerRef}>
          <div className="relative">
            <InteractiveImage src={exibirImagem} onClick={handleMouseDown} imageRef={imageRef} onLoad={handleImageLoad} />
            <div className="absolute top-0 left-0" ref={pinsContainerRef} style={{ pointerEvents: 'none' }}>
              {pins.map((pin) => (
                <ImagePin
                  key={pin.id}
                  pin={pin}
                  draggingPin={draggingPin}
                  setDraggingPin={setDraggingPin}
                  isDragging={isDragging}
                  setIsDragging={setIsDragging}
                  updatePinPosition={updatePinPosition}
                  imageRef={imageRef}
                  pinsContainerRef={pinsContainerRef}
                />
              ))}
            </div>
          </div>
        </div>
      );
    };

    export default ImageArea;
