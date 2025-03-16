export interface Pin {
    id: string;
    x: number;
    y: number;
    num: number;
    comment: string;
    created_at: string;
    status: 'ativo' | 'resolvido';
    user_id: string;
    page_id: string;
    reactions?: CommentReaction[];
    isEditing?: boolean;
}

export interface CommentReaction {
    id: string;
    comment_id: string;
    user_id: string;
    reaction_type: string;
    created_at: string;
}
