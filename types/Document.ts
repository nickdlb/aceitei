export interface Document {
    id: string;
    title: string;
    created_at: string;
    user_id: string;
}

export interface Page {
    id: string;
    document_id: string;
    image_url: string;
    page_number: number;
    imageTitle: string;
    user_id: string;
    created_at: string;
    documents?: Document;
}

export interface Comment {
    id: string;
    page_id: string;
    user_id: string;
    parent_id?: string;
    content: string;
    pos_x: number;
    pos_y: number;
    pin_number: number;
    status: 'ativo' | 'resolvido';
    created_at: string;
}

export interface CommentReaction {
    id: string;
    comment_id: string;
    user_id: string;
    reaction_type: string;
    created_at: string;
} 