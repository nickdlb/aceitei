export default interface CommentReactionProps {
    id: string;
    comment_id: string;
    user_id: string;
    reaction_type: string;
    created_at: string;
    parent_reaction_id?: string;
    replies?: CommentReactionProps[];
} 