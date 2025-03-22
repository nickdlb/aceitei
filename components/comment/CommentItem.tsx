import { useState } from 'react';
import CommentReactionProps from '@/types/CommentReactionProps';
import { createSupabaseClient } from '@/utils/supabaseClient';
import CommentItemProps from '@/types/CommentItemProps';

const CommentItem: React.FC<CommentItemProps> = ({ comment, session, ...props }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replies, setReplies] = useState<CommentReactionProps[]>([]);

    const handleReply = async () => {
        if (!replyText.trim()) return;

        try {
            const { data, error } = await createSupabaseClient
                .from('comment_reactions')
                .insert({
                    comment_id: comment.id,
                    user_id: session?.user?.id,
                    reaction_type: replyText,
                })
                .select()
                .single();

            if (error) throw error;

            setReplies([...replies, data]);
            setReplyText('');
            // Removed setIsReplying(false) to keep the reply section open
        } catch (error) {
            console.error('Erro ao adicionar resposta:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg p-4 shadow">
            {/* Conteúdo existente do comentário */}
            <div className="mt-2 flex items-center gap-2">
                <button
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    Responder
                </button>
            </div>

            {isReplying && (
                <div className="mt-3">
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Digite sua resposta..."
                        rows={2}
                    />
                    <div className="mt-2 flex justify-end gap-2">
                        <button
                            onClick={() => setIsReplying(false)}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleReply}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            )}

            {/* Lista de respostas */}
            {replies.length > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-gray-200">
                    {replies.map((reply) => (
                        <div key={reply.id} className="mt-2 text-sm">
                            <div className="text-gray-600">
                                {reply.reaction_type}
                            </div>
                            <div className="text-xs text-gray-400">
                                {new Date(reply.created_at).toLocaleDateString('pt-BR')}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;
