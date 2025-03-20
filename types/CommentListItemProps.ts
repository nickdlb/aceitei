import PinProps from './PinProps';

export default interface CommentListItemProps {
  pin: PinProps;
  localComments: { [key: string]: string };
  editingPinId: string | null;
  permissions: { [key: string]: boolean };
  userNames: { [key: string]: string };
  showReplies: { [key: string]: boolean };
  replyText: string;
  handleCommentChange: (pinId: string, value: string) => void;
  handleCommentSave: (pinId: string) => Promise<void>;
  handleDeletePin: (pinId: string) => Promise<void>;
  handleStatusChange: (pinId: string) => Promise<void>;
  setEditingPinId: (pinId: string | null) => void;
  handleReplyLocal: (pinId: string) => Promise<void>;
  setReplyText: (text: string) => void;
  toggleReplies: (pinId: string) => void;
  handleReplyKeyPressLocal: (event: React.KeyboardEvent<HTMLTextAreaElement>, pinId: string) => void;
}