import { Session } from '@supabase/supabase-js';
import { Pin } from './Pin';

export interface ImageAreaProps {
    exibirImagem: string;
    imageTitle: string;
    imageId: string;
    pins: Pin[];
    handleImageClick: (x: number, y: number) => void;
    draggingPin: Pin | null;
    setDraggingPin: (pin: Pin | null) => void;
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
    updatePinPosition: (pinId: string, x: number, y: number) => void;
    imageRef: React.RefObject<HTMLImageElement | null>;
    onTitleUpdate: (newTitle: string) => void;
    onTogglePages?: () => void;
    isPagesOpen?: boolean;
}

export interface CommentSidebarProps {
    pins: Pin[];
    statusFilter: 'ativo' | 'resolvido';
    setStatusFilter: (status: 'ativo' | 'resolvido') => void;
    editingPinId: string | null;
    comments: { [key: string]: string };
    handleCommentChange: (pinId: string, value: string) => void;
    handleCommentSave: (pinId: string) => void;
    handleDeletePin: (pinId: string) => void;
    handleStatusChange: (pinId: string) => void;
    setEditingPinId: (pinId: string | null) => void;
    userNames: { [key: string]: string };
    session: Session | null;
    loadComments: () => Promise<void>;
}

export interface CommentItemProps {
    pin: Pin;
    comment: string;
    isEditing: boolean;
    userName: string;
    onCommentChange: (value: string) => void;
    onCommentSave: () => void;
    onStatusChange: () => void;
    onDelete: () => void;
    onEdit: () => void;
}

export interface ImagePinProps {
    pin: Pin;
    draggingPin: Pin | null;
    setDraggingPin: (pin: Pin | null) => void;
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
    updatePinPosition: (pinId: string, x: number, y: number) => void;
}
