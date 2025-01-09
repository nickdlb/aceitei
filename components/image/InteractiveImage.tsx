import React, { useRef } from 'react';

interface InteractiveImageProps {
    src: string;
    onClick: (event: React.MouseEvent<HTMLImageElement>) => void;
    imageRef: React.RefObject<HTMLImageElement>;
}

export default function InteractiveImage({ src, onClick, imageRef }: InteractiveImageProps) {
    return (
        <img 
            src={src} 
            onClick={onClick} 
            className="max-w-screen-md h-fit w-fit max-h-screen max-w-screen object-contain" 
            alt="Interactive image"
            ref={imageRef}
        />
    );
}