export default interface MultipleUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSeparate: () => void;
    onCombine: () => void;
    filesCount: number;
}