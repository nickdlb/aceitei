import { PencilIcon, CheckIcon, CogIcon, XMarkIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/utils/formatDate';
import CommentListItemProps from '@/types/CommentListItemProps';

const CommentListItem: React.FC<CommentListItemProps> = ({
  pin,
  localComments,
  editingPinId,
  permissions,
  userNames,
  showReplies,
  replyText,
  handleCommentChange,
  handleCommentSave,
  handleDeletePin,
  handleStatusChange,
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
    await handleCommentSave(pinId);
  };

  const handleEscapePress = async (event: React.KeyboardEvent<HTMLTextAreaElement>, pinId: string) => {
    event.preventDefault();

    // Check if this is a new pin by looking at the original pin.comment
    // If pin.comment is empty/null, it means this pin hasn't been saved yet
    const pinComment = pin.comment?.trim() || '';

    if (!pinComment) {
      // If it's a new pin (not yet saved), delete it
      await handleDeletePin(pinId);
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
    <div key={pin.id} className="bg-white rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-black">{pin.num}</span>
          <span
            className={`text-xs px-2 py-1 rounded ${pin.status === 'ativo'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
              }`}
          >
            {pin.status === 'ativo' ? 'Ativo' : 'Resolvido'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{formatDateTime(pin.created_at)}</span>
          {userNames[pin.user_id] && (
            <span className="text-xs font-medium text-gray-700">{userNames[pin.user_id]}</span>
          )}
          {permissions[pin.id] && (
            <button
              onClick={() => handleDeletePin(pin.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {editingPinId === pin.id ? (
        <div>
          <textarea
            value={localComments[pin.id] || ''}
            onChange={(e) => handleCommentChange(pin.id, e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, pin.id)}
            className="w-full p-2 border rounded mb-2 min-h-[60px] resize-none text-sm"
            placeholder="Comentário..."
            autoFocus
          />
          <button
            onClick={() => handleCommentSave(pin.id)}
            disabled={!localComments[pin.id]?.trim()}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Confirmar
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <p className="text-sm text-gray-700">
              {pin.comment || localComments[pin.id] || ''}
            </p>
          </div>
          <div className="flex gap-2">
            {permissions[pin.id] && (
              <button
                onClick={() => setEditingPinId(pin.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            )}
            {permissions[pin.id] && (
              <button
                onClick={() => handleStatusChange(pin.id)}
                className={`${pin.status === 'ativo'
                  ? 'text-yellow-500 hover:text-yellow-600'
                  : 'text-green-500 hover:text-green-600'
                  }`}
              >
                {pin.status === 'ativo' ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <CogIcon className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => toggleReplies(pin.id)}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <ChatBubbleOvalLeftIcon className="w-4 h-4" />
          {showReplies[pin.id]
            ? 'Ocultar respostas'
            : pin.reactions && pin.reactions.length > 0
              ? `Ver respostas (${pin.reactions.length})`
              : 'Responder'}
        </button>
      </div>

      {showReplies[pin.id] && (
        <div className="mt-3">
          {pin.reactions && pin.reactions.length > 0 && (
            <div className="pl-4 border-l-2 border-gray-200 mb-3">
              {pin.reactions.map((reaction) => (
                <div key={reaction.id} className="mt-2 text-sm">
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
            className="border rounded p-2 w-full"
          />
          <button
            onClick={() => handleReplyLocal(pin.id)}
            className="mt-2 bg-blue-500 text-white rounded px-4 py-2"
          >
            Enviar
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentListItem;
