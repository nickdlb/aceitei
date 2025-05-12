export interface PinProps {
    id: string;
    x: number;
    y: number;
    num: number;
    comment: string;
    created_at: string;
    status: 'ativo' | 'resolvido';
    user_id: string;
    page_id: string;
    reactions?: CommentReactionPin[];
    isEditing?: boolean;
    url_comentario: string | null | any
    iframeSize: string
}

export interface CommentReactionPin {
    id: string;
    comment_id: string;
    user_id: string;
    reaction_type: string;
    created_at: string;
}
