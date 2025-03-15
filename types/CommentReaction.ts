export interface CommentReaction {
    id: string;
    comment_id: string;
    user_id: string;
    reaction_type: string;
    created_at: string;
    parent_reaction_id?: string; // ID da resposta pai (se for uma resposta de resposta)
    replies?: CommentReaction[]; // Array de respostas aninhadas
} 