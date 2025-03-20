import { Comment } from '@/types/CommentsProps';
import { Session } from '@supabase/supabase-js';

export default interface CommentItemProps {
    comment: Comment;
    session: Session | null;
}