import React, { useRef, useEffect } from 'react';
    import { Pin } from '@/types/Pin';

    interface ImagePinProps {
      pin: Pin;
      draggingPin: Pin | null;
      setDraggingPin: (pin: Pin | null) => void;
      isDragging: boolean;
      setIsDragging: (isDragging: boolean) => void;
      updatePinPosition: (pinId: string, x: number, y: number) => void;
      imageRef: React.RefObject<HTMLImageElement> | any;
      pinsContainerRef: React.RefObject<HTMLDivElement> | any;
    }

    const ImagePin: React.FC<ImagePinProps> = ({
      pin,
      draggingPin,
      setDraggingPin,
      isDragging,
      setIsDragging,
      updatePinPosition,
      imageRef,
      pinsContainerRef
    }) => {
      const pinRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
          if (draggingPin && draggingPin.id === pin.id && imageRef.current && pinsContainerRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            const containerRect = pinsContainerRef.current.getBoundingClientRect();
            const pinRect = pinRef.current?.getBoundingClientRect();
            if (pinRect) {
              const x = ((event.clientX - rect.left) / rect.width) * 100;
              const y = ((event.clientY - rect.top) / rect.height) * 100;
              updatePinPosition(pin.id, x, y);
            }
          }
        };

        if (isDragging) {
          document.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
        };
      }, [draggingPin, pin, isDragging, updatePinPosition, imageRef, pinsContainerRef]);

      const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setDraggingPin(pin);
        setIsDragging(true);
      };

      const calculatePinPosition = () => {
        if (imageRef.current && pinsContainerRef.current) {
          const rect = imageRef.current.getBoundingClientRect();
          const containerRect = pinsContainerRef.current.getBoundingClientRect();
          const x = (pin.x / 100) * rect.width;
          const y = (pin.y / 100) * rect.height;
          return { x, y };
        }
        return { x: 0, y: 0 };
      };

      const { x, y } = calculatePinPosition();

      return (
        <div
          ref={pinRef}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            transform: 'translate(-50%, -50%)',
          }}
          className="w-6 h-6 bg-red-500 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center"
          onMouseDown={handleMouseDown}
        >
          <span className="text-white text-xs">{pin.num}</span>
        </div>
      );
    };

    export default ImagePin;
