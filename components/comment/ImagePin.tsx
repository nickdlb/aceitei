import React, { useState, useEffect } from 'react';
import { ImagePinProps } from '@/types/CommentsProps';

interface ExtendedImagePinProps extends ImagePinProps {
  style?: React.CSSProperties;
}

const ImagePin: React.FC<ExtendedImagePinProps> = ({
  pin,
  draggingPin,
  setDraggingPin,
  isDragging: isParentDragging,
  setIsDragging: setParentDragging,
  updatePinPosition,
  style
}) => {
  const [dragPosition, setDragPosition] = useState({ x: pin.x, y: pin.y });
  const [localIsDragging, setLocalIsDragging] = useState(false);

  useEffect(() => {
    setDragPosition({ x: pin.x, y: pin.y });
  }, [pin.x, pin.y]);

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    setLocalIsDragging(true);
    setParentDragging(true);
    setDraggingPin(pin);
  };

  const handleDrag = (e: React.DragEvent) => {
    if (!e.clientX || !e.clientY) return;

    const target = e.currentTarget.parentElement;
    if (target) {
      const rect = target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setDragPosition({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y))
      });
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalIsDragging(false);
    setParentDragging(false);
    setDraggingPin(null);

    if (e.clientX && e.clientY) {
      const target = e.currentTarget.parentElement;
      if (target) {
        const rect = target.getBoundingClientRect();
        // Calculate coordinates as percentages
        let x = ((e.clientX - rect.left) / rect.width) * 100;
        let y = ((e.clientY - rect.top) / rect.height) * 100;

        // Clamp coordinates to be within 0% and 100%
        x = Math.max(0, Math.min(100, x));
        y = Math.max(0, Math.min(100, y));

        updatePinPosition(pin.id, x, y);
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={`absolute cursor-grab active:cursor-grabbing transition-all duration-75 ${localIsDragging ? 'opacity-50' : ''
        }`}
      style={{
        left: `${dragPosition.x}%`,
        top: `${dragPosition.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: localIsDragging ? 30 : 20
      }}
    >
      <div className="flex items-center justify-center w-6 h-6 bg-acazul text-acbrancohover rounded-full text-xs font-bold">
        {pin.num}
      </div>
    </div>
  );
};

export default ImagePin;
