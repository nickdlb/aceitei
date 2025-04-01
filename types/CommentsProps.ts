import { Session } from '@supabase/supabase-js';
import PinProps from './PinProps';

export interface Comment {
    id: string;
}

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
    pagesCount?: number; // Add pagesCount prop
}

export interface CommentSidebarProps {
    pins: PinProps[];
    statusFilter: 'ativo' | 'resolvido' | null;
    setStatusFilter: (filter: 'ativo' | 'resolvido' | null) => void;
    editingPinId: string | null;
    comments: { [key: string]: string };
    setEditingPinId: (pinId: string | null) => void;
    userNames: { [key: string]: string };
    session: Session | null;
    loadComments: () => Promise<void>;
    loadRepliesForPin?: (pinId: string) => Promise<void>;
    setShowAuthPopup: (show: boolean) => void;
}

export interface CommentItemProps {
    pin: PinProps;
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
    pin: PinProps;
    draggingPin: PinProps | null;
    setDraggingPin: (pin: PinProps | null) => void;
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
    updatePinPosition: (pinId: string, x: number, y: number) => void;
}

export interface CommentReaction {
    id: string;
    comment_id: string;
    user_id: string;
    reaction_type: string;
    created_at: string;
}
