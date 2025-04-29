export interface AuthPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, email: string) => Promise<void>;
}