import { useEffect, RefObject } from 'react';

export function useImageAspectRatio(
    imageRef: RefObject<HTMLImageElement | null>, // Changed type here
    containerRef: RefObject<HTMLDivElement | null>,
    imageSrc: string
) {
    useEffect(() => {
        if (imageRef?.current) {
            const img = imageRef.current;
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const container = containerRef?.current;

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
    }, [imageSrc]);
}
