'use client';

import React, { useState, useRef } from 'react';
import ImagePin from './ImagePin';
import { ImageAreaProps } from '@/types';
import ImageAreaHeader from './ImageAreaHeader';
import { usePageContext } from '@/contexts/PageContext';

interface Props extends ImageAreaProps {
  onTitleUpdate: (newTitle: string) => Promise<void | undefined>;
  onTogglePages: () => void;
}

const ImageArea: React.FC<Props> = ({
  exibirImagem,
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { documentData } = usePageContext();

  return (
    <div className="flex-1 flex-col">
      <ImageAreaHeader
        exibirImagem={exibirImagem}
        onTitleUpdate={onTitleUpdate}
        isPagesOpen={isPagesOpen || false}
        onTogglePages={onTogglePages || (() => {})}
        pagesCount={pagesCount}
        scrollContainerRef={scrollContainerRef}
      />

      <div
        ref={containerRef}
        className="flex-1 overflow-auto relative flex items-center justify-center bg-acbg"
        style={{ height: 'calc(100vh - 3.5rem)' }}
      >
        <div ref={scrollContainerRef}
          className="relative transition-transform duration-300 ease-in-out pt-4"
        >
          <div className="relative">
            <img
              ref={imageRef}
              src={exibirImagem}
              alt={documentData.title || 'Imagem para comentários'}
              className="max-h-[calc(100vh-5rem)] w-auto object-contain"
              onClick={(e) => {
                if (!scrollContainerRef.current || isDragging || draggingPin) return;

                const style = window.getComputedStyle(scrollContainerRef.current);
                const matrix = new DOMMatrixReadOnly(style.transform);
                const scale = matrix.a || 1; // .a é o scaleX do transform matrix

                const rect = e.currentTarget.getBoundingClientRect();
                const offsetX = (e.clientX - rect.left) / scale;
                const offsetY = (e.clientY - rect.top) / scale;
                const scaledWidth = rect.width / scale;
                const scaledHeight = rect.height / scale;

                const x = (offsetX / scaledWidth) * 100;
                const y = (offsetY / scaledHeight) * 100;

                handleImageClick(x, y);
              }}
              style={{ cursor: 'crosshair' }}
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
                  transform: 'translate(-50%, -50%)',
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
