import React, { useRef, useEffect } from 'react';
import { Pin } from '@/types/Pin';

interface ImagePinProps {
  pin: Pin;
  draggingPin: Pin | null;
  setDraggingPin: (pin: Pin | null) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  updatePinPosition: (pinId: string, x: number, y: number) => void;
}

const ImagePin: React.FC<ImagePinProps> = ({
  pin,
  draggingPin,
  setDraggingPin,
  isDragging,
  setIsDragging,
  updatePinPosition,
}) => {
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (draggingPin && draggingPin.id === pin.id) {
        const rect = pinRef.current?.getBoundingClientRect();
        const x = event.clientX - (rect?.width || 0) / 2;
        const y = event.clientY - (rect?.height || 0) / 2;
        updatePinPosition(pin.id, x, y);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [draggingPin, pin, isDragging, updatePinPosition]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setDraggingPin(pin);
    setIsDragging(true);
  };

  return (
    <div
      ref={pinRef}
      style={{
        position: 'absolute',
        left: `${pin.x}px`,
        top: `${pin.y}px`,
      }}
      className="w-6 h-6 bg-red-500 rounded-full cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
    >
      <span className="text-white text-xs absolute top-[-10px] left-[-10px]">{pin.num}</span>
    </div>
  );
};

export default ImagePin;
