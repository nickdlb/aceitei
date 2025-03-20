import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PencilIcon, ChatBubbleLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import CardContentProps from '@/types/CardContentProps';

export const CardContent = ({
    title,
    created_at,
    active_comments,
    resolved_comments,
    isEditing,
    setTitle,
    handleTitleEdit,
    setIsEditing
}: CardContentProps) => {
    return (
        <div className="p-4">
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-sm font-medium p-1 border rounded flex-1"
                            autoFocus
                            onBlur={handleTitleEdit}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') handleTitleEdit();
                            }}
                        />
                    ) : (
                        <>
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                {title || 'Sem título'}
                            </h3>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditing(true);
                                }}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <PencilIcon className="w-3 h-3 text-gray-400" />
                            </button>
                        </>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                        <ChatBubbleLeftIcon className="w-4 h-4 text-gray-600" />
                        <span className="text-xs text-gray-500 ml-1">{active_comments || 0}</span>
                    </div>
                    <div className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 text-gray-600" />
                        <span className="text-xs text-gray-500 ml-1">{resolved_comments || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
