import { useRef, useEffect } from 'react';
import { Pin } from '@/types/Pin';

interface ImageAreaProps {
    exibirImagem: string;
    pins: Pin[];
    handleImageClick: (xPercent: number, yPercent: number) => void;
    draggingPin: Pin | null;
    setDraggingPin: (pin: Pin | null) => void;
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
    updatePinPosition: (pinId: string, x: number, y: number) => void;
}

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

    useEffect(() => {
        if (imageRef.current) {
            const img = imageRef.current;
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const container = imageContainerRef.current;

            if (container) {
                if (aspectRatio > 1) {
                    container.style.width = 'auto';
                    container.style.height = '100%';
                } else {
                    container.style.height = 'auto';
                    container.style.width = '100%';
                }
            }
        }
    }, [exibirImagem]);

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
                <img 
                    src={exibirImagem} 
                    onClick={handleImageClickInternal} 
                    className="max-w-screen-md h-fit w-fit max-h-screen max-w-screen object-contain" 
                    alt="Interactive image"
                    ref={imageRef}
                />

                {pins.map((pin) => (
                    <div
                        key={pin.id}
                        className={`absolute text-xs text-black flex items-center justify-center font-bold w-5 h-5 ${
                            pin.status === 'ativo' ? 'bg-yellow-500' : 'bg-green-500'
                        } rounded-full cursor-pointer hover:cursor-grab hover:opacity-90`}
                        style={{ 
                            left: `${pin.x}%`, 
                            top: `${pin.y}%` 
                        }}
                        onMouseDown={() => handlePinMouseDown(pin)}
                    >
                        {pin.num}
                    </div>
                ))}
            </div>
        </div>
    );
}

