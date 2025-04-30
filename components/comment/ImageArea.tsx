import React, { useState, useRef, useCallback } from 'react';
import ImagePin from './ImagePin';
import ImageAreaHeader from './ImageAreaHeader';
import { ImageAreaProps } from '@/types';
import { usePageContext } from '@/contexts/PageContext';


interface Props extends ImageAreaProps {
  onTogglePages: () => void;
}

const ImageArea: React.FC<Props> = ({
  exibirImagem,
  imageId,
  pins,
  handleImageClick,
  draggingPin,
  setDraggingPin,
  isDragging,
  setIsDragging,
  updatePinPosition,
  imageRef,
  onTogglePages,
  isPagesOpen,
}) => {
  const [zoomLevel, setZoomLevel] = useState('100');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { documentData } = usePageContext();

  const handleZoomChange = useCallback((value: string) => {
    setZoomLevel(value);
    if (scrollContainerRef.current) {
      const scale = parseInt(value) / 100;
      scrollContainerRef.current.style.transform = `scale(${scale})`;
      scrollContainerRef.current.style.transformOrigin = 'top center';
    }
  }, []);

  const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
  
    // Coordenadas relativas em porcentagem
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
  
    handleImageClick(x, y);
  };

  return (
    <div className="flex-1 flex-col">
      <ImageAreaHeader
        exibirImagem={exibirImagem}
        zoomLevel={zoomLevel}
        onTogglePages={onTogglePages || (() => {})}
        isPagesOpen={isPagesOpen || false}
        handleZoomChange={handleZoomChange}
      />

      <div
        ref={containerRef}
        className="flex-1 overflow-auto relative flex items-start justify-center bg-acbg"
        style={{ height: 'calc(100vh - 3.5rem)' }}
      >
        <div
          ref={scrollContainerRef}
          className="relative transition-transform duration-300 ease-in-out pt-4"
        >
          <div className="relative">
            <iframe width='600px' height='800px' src={documentData?.url ?? 'https://agenciadlb.com.br'}>
            </iframe>
            <div
              onClick={handleDivClick}
              className="absolute top-0 left-0 w-full h-full z-10"
              style={{ background: 'transparent', cursor: 'crosshair' }}
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
