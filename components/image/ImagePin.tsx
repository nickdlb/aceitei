export interface ImageAreaProps {
    exibirImagem: string;
    pins: Pin[];
    handleImageClick: (xPercent: number, yPercent: number) => void;
    draggingPin: Pin | null;
    setDraggingPin: (pin: Pin | null) => void;
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
    updatePinPosition: (pinId: string, x: number, y: number) => void;
}