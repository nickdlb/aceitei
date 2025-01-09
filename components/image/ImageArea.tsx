import { useRef, useEffect } from 'react';
import { ImageAreaProps } from '@/types/ImageArea';
import { Pin } from '@/types/Pin';
import ImagePin from './ImagePin';
import InteractiveImage from './InteractiveImage';
import { useImageAspectRatio } from '@/hooks/useImageAspectRatio';

export default function ImageArea({
    exibirImagem,
    pins,
    handleImageClick,
    draggingPin,
    setDraggingPin,
    isDragging,
    setIsDragging,
    updatePinPosition
}: ImageAreaProps) {
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useImageAspectRatio(imageRef, imageContainerRef, exibirImagem);

    const handleImageClickInternal = (event: React.MouseEvent<HTMLImageElement>) => {
        const target = event.target as HTMLImageElement;
        const rect = target.getBoundingClientRect();
        const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
        const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
        handleImageClick(xPercent, yPercent);
    };

    const handlePinMouseDown = (pin: Pin) => {
        setDraggingPin(pin);
        setIsDragging(true);
    };

    const handlePinMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(false);
        if (draggingPin && imageRef.current) {
            const imageRect = imageRef.current.getBoundingClientRect();
            const xPercent = ((event.clientX - imageRect.left) / imageRect.width) * 100;
            const yPercent = ((event.clientY - imageRect.top) / imageRect.height) * 100;
            updatePinPosition(draggingPin.id, xPercent, yPercent);
        }
        setDraggingPin(null);
    };

    const handlePinMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging && draggingPin && imageRef.current) {
            const imageRect = imageRef.current.getBoundingClientRect();
            const xPercent = ((event.clientX - imageRect.left) / imageRect.width) * 100;
            const yPercent = ((event.clientY - imageRect.top) / imageRect.height) * 100;
            setDraggingPin({ ...draggingPin, x: xPercent, y: yPercent });
        }
    };

    return (
        <div 
            className="flex flex-1 items-center justify-center overflow-hidden" 
            ref={imageContainerRef} 
            onMouseUp={handlePinMouseUp}
            onMouseMove={handlePinMouseMove}
        >
            <div className="relative h-fit w-fit mx-auto">
                <InteractiveImage
                    src={exibirImagem}
                    onClick={handleImageClickInternal}
                    imageRef={imageRef}
                />

                {pins.map((pin) => (
                    <ImagePin
                        key={pin.id}
                        pin={pin}
                        onMouseDown={handlePinMouseDown}
                    />
                ))}
            </div>
        </div>
    );
}