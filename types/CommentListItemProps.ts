import { PinProps } from './PinProps';
import { Session } from '@supabase/supabase-js';

export interface CommentListItemProps {
  pin: PinProps;
  localComments: { [key: string]: string };
  editingPinId: string | null;
  permissions: { [key: string]: { canEdit: boolean, canDelete: boolean, canChangeStatus: boolean } };
  userNames: { [key: string]: string };
  showReplies: { [key: string]: boolean };
  replyText: string;
  CommentChange: (pinId: string, value: string) => void;
  CommentSave: (pinId: string) => Promise<void>;
  CommentDelete: (pinId: string) => Promise<void>;
  CommentStatusChange: (pinId: string) => Promise<void>;
  setEditingPinId: (pinId: string | null) => void;
  handleReplyLocal: (pinId: string) => Promise<void>;
  setReplyText: (text: string) => void;
  toggleReplies: (pinId: string) => void;
  handleReplyKeyPressLocal: (event: React.KeyboardEvent<HTMLTextAreaElement>, pinId: string) => void;
  currentUserId: string | null | undefined;
  session: Session | null;
  loadComments: () => Promise<void>;
}
