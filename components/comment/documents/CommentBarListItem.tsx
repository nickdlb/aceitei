import { formatDate } from '@/utils/formatDate';
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Check, Cog, X, MessageCircle } from "lucide-react";
import { deleteReaction } from '@/utils/reactionUtils';
import { PinProps } from '@/types';
import { Session } from '@supabase/supabase-js';

interface CommentListItemProps {
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

const CommentListItem: React.FC<CommentListItemProps> = ({
  pin,
  localComments,
  editingPinId,
  permissions,
  userNames,
  showReplies,
  replyText,
  CommentChange,
  CommentSave,
  CommentDelete,
  CommentStatusChange,
  setEditingPinId,
  handleReplyLocal,
  setReplyText,
  toggleReplies,
  handleReplyKeyPressLocal,
  currentUserId,
  session,
  loadComments
}) => {

  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);

  const [editedReplyText, setEditedReplyText] = useState<string>('');

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = formatDate(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${formattedDate} ${hours}:${minutes}`;
  };

  const handleEnterPress = async (event: React.KeyboardEvent<HTMLTextAreaElement>, pinId: string) => {
    event.preventDefault();
    await CommentSave(pinId);
  };

  const handleEscapePress = async (event: React.KeyboardEvent<HTMLTextAreaElement>, pinId: string) => {
    event.preventDefault();

    const pinComment = pin.comment?.trim() || '';

    if (!pinComment) {

      await CommentDelete(pinId);
    } else {

      setEditingPinId(null);
    }
  };

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLTextAreaElement>, pinId: string) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      await handleEnterPress(event, pinId);
    } else if (event.key === 'Escape') {
      await handleEscapePress(event, pinId);
    }
  };

  const maxReplyLength = 300;

  const handleEditReply = (replyId: string, currentText: string) => {
    setEditingReplyId(replyId);
    setEditedReplyText(currentText);
  };

  const handleSaveReply = async (replyId: string) => {
    console.log("Saving reply:", replyId, editedReplyText);

    setEditingReplyId(null);
    setEditedReplyText('');
  };

  const handleDeleteReply = async (replyId: string) => {
    try {
      await deleteReaction(replyId, session, loadComments);
    } catch (error) {
      console.error('Erro ao excluir resposta:', error);
    }
  };

  const handleCancelEditReply = () => {
    setEditingReplyId(null);
    setEditedReplyText('');
  };

  const handleReplyEditKeyPress = async (event: React.KeyboardEvent<HTMLTextAreaElement>, replyId: string) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      await handleSaveReply(replyId);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      handleCancelEditReply();
    }
  };

  return (
    <Card key={pin.id} className="pl-4 pr-4 pt-4 pb-3 bg-acbg !border-none shadow gap-1" id={`comment-list-item-${pin.id}`}>
      <div id={`comment-header-${pin.id}`} className="flex gap-3 items-center align-middle pr-2">
        <div className="flex items-center gap-2">
          <span className="flex font-semibold text-xs text-acbranco bg-acazul h-6 w-6 items-center justify-center rounded-full">{pin.num}</span>
          <Badge
            variant={pin.status === 'ativo' ? "secondary" : "default"}
            className={pin.status === 'ativo' ? "bg-yellow-500 text-acbrancohover" : "bg-green-500 text-acbrancohover"}
          >
            {pin.status === 'ativo' ? 'Ativo' : 'Resolvido'}
          </Badge>
        </div>
        <div className='flex align-middle flex-shrink min-w-0 overflow-hidden'> {/* Enhanced for better shrinking and overflow control */}
          {userNames[pin.user_id] && (
            <span
              className="text-xs font-semibold text-actextocinza truncate" /* Added truncate for CSS-based ellipsis */
              title={userNames[pin.user_id]} /* Use full name for tooltip */
            >
              {userNames[pin.user_id]} {/* Display full name, CSS will truncate */}
            </span>
          )}
        </div>
        <div className="flex items-center ml-0.5 min-w-20">
          <span className="text-xs text-actextocinza">{formatDateTime(pin.created_at)}</span>
        </div>
        <div id="novadiv" className='!min-w-4 flex justify-between items-center align-middle ml-auto'>
          {(() => {
            const canDelete = permissions[pin.id]?.canDelete;
            return canDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => CommentDelete(pin.id)}
                className="!h-4 !w-4 text-acpreto hover:text-acvermelho"
              >
                <X className="" />
              </Button>
            );
          })()}
        </div>
      </div>

      {editingPinId === pin.id ? (

        <div id={`comment-edit-${pin.id}`} className="pt-2">
          <div className="relative w-full pr-3">
            <textarea
              value={localComments[pin.id] || ''}
              onChange={(e) => CommentChange(pin.id, e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, pin.id)}
              className="w-full h-16 pr-14 resize-none text-sm text-actextocinza break-all bg-transparent border-b-2 focus:outline-none focus:border-b-2 focus:border-accinza focus:ring-0 "
              placeholder="Comentário..."
              autoFocus
              maxLength={300}
            />
            <div className="absolute right-6 bottom-2 text-xs text-actextocinza">
              {(localComments[pin.id] || '').length}/300
            </div>
          </div>
          <Button className='!text-xs h-8 px-4 bg-acazul opacity-100 disabled:bg-acazul text-acbrancohover mt-2'
            onClick={() => CommentSave(pin.id)}
            disabled={!localComments[pin.id]?.trim()}
          >
            Enviar
          </Button>
        </div>
      ) : (

        <div className="flex justify-between items-start pt-2" id={`comment-content-${pin.id}`}>
          <div className="flex flex-col">
            <p className="text-sm text-actextocinza max-w-full break-all pr-10">
              {pin.comment || localComments[pin.id] || ''}
            </p>
          </div>
        </div>
      )}
      <div className='flex items-center justify-between'>
        <div className="flex items-center" id={`comment-replies-toggle-${pin.id}`}>
          <Button
            variant="link"
            onClick={() => toggleReplies(pin.id)}
            className="!pl-0 text-xs text-acazul hover:text-acazul flex items-center gap-1"
          >
            <MessageCircle className="w-4 h-4" />
            {showReplies[pin.id]
              ? 'Ocultar respostas'
              : pin.reactions && pin.reactions.length > 0
                ? `Ver respostas (${pin.reactions.length})`
                : 'Responder'}
          </Button>
        </div>
        <div className="flex items-center">
          {permissions[pin.id]?.canEdit && !editingPinId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingPinId(pin.id)}
              className="text-acpreto hover:text-aclaranja"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
          {permissions[pin.id]?.canChangeStatus && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => CommentStatusChange(pin.id)}
              className="text-acpreto hover:text-acverde"
            >
              {pin.status === 'ativo' ? (
                <Check className="w-4 h-4 hover:text-green-500" />
              ) : (
                <Cog className="w-4 h-4 hover:text-green-500" />
              )}
            </Button>
          )}
        </div>
      </div>
      {showReplies[pin.id] && (

        <div className="mt-[-4px]" id={`comment-replies-${pin.id}`}>
          {pin.reactions && pin.reactions.length > 0 && (
            <div className="mb-3">
              {pin.reactions.map((reaction) => {
                const hasReplyPermission = currentUserId === reaction.user_id;
                const isEditingThisReply = editingReplyId === reaction.id;

                return (
                  <div key={reaction.id} className="mt-2 text-sm mb-3" id={`comment-reply-${reaction.id}`}>
                    <div className="flex gap-4 items-center mb-1">
                      <span className="text-xs font-semibold text-actextocinza">
                        {userNames[reaction.user_id] || 'Usuário'}
                      </span>
                      <span className="text-xs text-actextocinza">
                        {formatDateTime(reaction.created_at)}
                      </span>
                    </div>
                    {isEditingThisReply ? (

                      <div id={`reply-edit-${reaction.id}`} className="pt-1">
                        <div className="relative w-full">
                          <textarea
                            value={editedReplyText}
                            onChange={(e) => setEditedReplyText(e.target.value)}
                            onKeyDown={(e) => handleReplyEditKeyPress(e, reaction.id)}
                            className="w-full pr-12 resize-none text-sm text-actextocinza break-all bg-transparent focus:outline-none focus:border-b-2 focus:border-gray-200 focus:ring-0 focus:border-transparent border-b-2"
                            placeholder="Editar resposta..."
                            autoFocus
                            maxLength={maxReplyLength}
                          />
                          <div className="absolute right-4 bottom-2 text-xs text-actextocinza">
                            {editedReplyText.length}/{maxReplyLength}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-1">
                          <Button className='!text-xs h-7 px-3 bg-acazul opacity-100 disabled:bg-acazul text-acbranco'
                            onClick={() => handleSaveReply(reaction.id)}
                            disabled={!editedReplyText?.trim()}
                          >
                            Salvar
                          </Button>
                          <Button variant="ghost" className='!text-xs h-7 px-3' onClick={handleCancelEditReply}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (

                      <div className="flex justify-between items-start" id={`reply-content-${reaction.id}`}>
                        <div className="text-actextocinza break-all pr-2">{reaction.reaction_type}</div>
                        <div className="flex items-center space-x-4 pr-3">
                          {hasReplyPermission && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditReply(reaction.id, reaction.reaction_type)}
                              className="!h-4 !w-4 hover:text-orange-500"
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                          )}
                          {permissions[reaction.id]?.canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteReply(reaction.id)}
                              className="!h-4 !w-4 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="relative w-full mt-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  toggleReplies(pin.id);
                } else {
                  handleReplyKeyPressLocal(e, pin.id);
                }
              }}
              placeholder="Digite sua resposta..."
              className="w-full pr-12 resize-none text-sm text-actextocinza break-all bg-transparent focus:outline-none focus:ring-0 focus:border-transparent"
              maxLength={maxReplyLength}
            />
            <div className="absolute right-4 bottom-2 text-xs text-actextocinza">
              {replyText.length}/{maxReplyLength}
            </div>
          </div>
          <Button
            onClick={() => handleReplyLocal(pin.id)}
            className='!text-xs h-8 px-4 bg-acazul opacity-100 disabled:bg-acazul text-acbrancohover mt-2'
            disabled={!replyText?.trim()}
          >
            Enviar
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CommentListItem;
