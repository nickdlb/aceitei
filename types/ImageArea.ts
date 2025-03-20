import { Pin } from '@/types/Pin';
import { Dispatch, SetStateAction, RefObject } from 'react';

export interface ImageAreaProps {
    exibirImagem: string;
    pins: Pin[];
    handleImageClick: (xPercent: number, yPercent: number) => void;
    draggingPin: Pin | null;
    setDraggingPin: Dispatch<SetStateAction<Pin | null>>;
    isDragging: boolean;
    setIsDragging: Dispatch<SetStateAction<boolean>>;
    updatePinPosition: (pinId: string, x: number, y: number) => void;
    imageRef: RefObject<HTMLImageElement> | any;
    pinsContainerRef?: RefObject<HTMLDivElement> | any;
}
