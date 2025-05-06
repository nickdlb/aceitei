import { PinProps } from './PinProps';

export interface ImageAreaProps {
    exibirImagem: string;
    imageTitle: string;
    imageId: string;
    pins: PinProps[];
    handleImageClick: (x: number, y: number) => void;
    draggingPin: PinProps | null;
    setDraggingPin: (pin: PinProps | null) => void;
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
    updatePinPosition: (pinId: string, x: number, y: number) => void;
    imageRef: React.RefObject<HTMLImageElement | null>;
    onTitleUpdate: (newTitle: string) => void;
    onTogglePages?: () => void;
    isPagesOpen?: boolean;
    pagesCount?: number;
}

export interface SiteAreaProps {
    exibirImagem: string;
    imageTitle: string;
    imageId: string;
    pins: PinProps[];
    handleImageClick: (x: number, y: number) => void;
    draggingPin: PinProps | null;
    setDraggingPin: (pin: PinProps | null) => void;
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
    updatePinPosition: (pinId: string, x: number, y: number) => void;
    imageRef: React.RefObject<HTMLImageElement | null>;
    onTitleUpdate: (newTitle: string) => void;
    onTogglePages?: () => void;
    isPagesOpen?: boolean;
    pagesCount?: number;
}
