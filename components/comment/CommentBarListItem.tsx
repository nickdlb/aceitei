import { formatDate } from '@/utils/formatDate';
import CommentListItemProps from '@/types/CommentListItemProps';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Check, Cog, X, MessageCircle } from "lucide-react";

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
  handleReplyKeyPressLocal
}) => {
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

    // Check if this is a new pin by looking at the original pin.comment
    // If pin.comment is empty/null, it means this pin hasn't been saved yet
    const pinComment = pin.comment?.trim() || '';

    if (!pinComment) {
      // If it's a new pin (not yet saved), delete it
      await CommentDelete(pinId);
    } else {
      // If it's an existing pin being edited, just discard the edit
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

  return (
    <Card key={pin.id} className="pl-4 pr-4 pt-4 pb-3 bg-white shadow gap-1" id={`comment-list-item-${pin.id}`}>
      <div id={`comment-header-${pin.id}`} className="flex gap-4 items-center align-middle pr-2">
        <div className="flex items-center gap-2">
          <span className="flex font-semibold text-xs">{pin.num}</span>
          <Badge
            variant={pin.status === 'ativo' ? "secondary" : "default"}
            className={pin.status === 'ativo' ? "bg-yellow-500 text-white" : "bg-green-500 text-white"}
          >
            {pin.status === 'ativo' ? 'Ativo' : 'Resolvido'}
          </Badge>
        </div>
        <div className='flex align-middle'>
          {userNames[pin.user_id] && (() => {
            const fullName = userNames[pin.user_id];
            const displayName = fullName.length > 15 ? fullName.substring(0, 13) + '...' : fullName;
            return (
              <span
                className="text-xs font-medium text-gray-700"
                title={fullName} // Tooltip with full name
              >
                {displayName} {/* Display truncated name */}
              </span>
            );
          })()}
        </div>
        <div className="flex items-center ml-0.5 min-w-20">
          <span className="text-xs text-gray-500">{formatDateTime(pin.created_at)}</span>          
        </div>
        <div id="novadiv" className='!min-w-4 flex justify-between items-center align-middle ml-auto'>
          {(() => {
              const hasPermission = permissions[pin.id];
              // console.log(`permissions[${pin.id}]:`, hasPermission); // Removed console.log for cleaner code
              return hasPermission && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => CommentDelete(pin.id)}
                  className="!h-4 !w-4 hover:text-red-500"
                >
                  <X className="" />
                </Button>
              );
            })()}
        </div>
      </div>

      {editingPinId === pin.id ? (
        <div id={`comment-edit-${pin.id}`}>
          {/* Wrapper for positioning */}
          <div className="relative w-full">
            <textarea
              value={localComments[pin.id] || ''}
              onChange={(e) => CommentChange(pin.id, e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, pin.id)}
              // Added pb-6 for padding below text, removed mb-1
              className="w-full pl-2 pt-2 pb-6 border rounded resize-none text-sm"
              placeholder="Comentário..."
              autoFocus
              maxLength={300} // Limit comment length
            />
            {/* Absolutely positioned Character Counter */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {(localComments[pin.id] || '').length}/300
            </div>
          </div>
          <Button className='!text-xs h-8 px-4 bg-blue-700 opacity-100 disabled:bg-blue-500 text-white mt-2' // Kept margin-top
            onClick={() => CommentSave(pin.id)}
            disabled={!localComments[pin.id]?.trim()}
          >
            Enviar
          </Button>
        </div>
      ) : (
        <div className="flex justify-between items-start" id={`comment-content-${pin.id}`}>
          <div className="flex flex-col">
            <p className="text-sm text-gray-700 max-w-full break-all">
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
            className="!pl-0 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
              {permissions[pin.id] && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingPinId(pin.id)}
                  className="hover:text-orange-500"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
              {permissions[pin.id] && (
                <Button
                  variant="ghost"
                  size="icon"
onClick={() => {
                    console.log(`CommentStatusChange(${pin.id}) clicked`);
                    CommentStatusChange(pin.id);
                  }}
                  className="hover:text-green-500"
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
        <div className="" id={`comment-replies-${pin.id}`}>
          {pin.reactions && pin.reactions.length > 0 && (
            <div className="pl-4 border-l-2 border-gray-200 mb-3">
              {pin.reactions.map((reaction) => (
                <div key={reaction.id} className="mt-2 text-sm" id={`comment-reply-${reaction.id}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700">
                      {userNames[reaction.user_id] || 'Usuário'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDateTime(reaction.created_at)}
                    </span>
                  </div>
                  <div className="text-gray-700">{reaction.reaction_type}</div>
                </div>
              ))}
            </div>
          )}
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                toggleReplies(pin.id); // Close replies section when ESC is pressed
              } else {
                handleReplyKeyPressLocal(e, pin.id);
              }
            }}
            placeholder="Digite sua resposta..."
            className="text-sm border rounded p-2 w-full exp resize-none"
          />
          <Button
            onClick={() => handleReplyLocal(pin.id)}
            className="mt-2"
          >
            Enviar
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CommentListItem;
