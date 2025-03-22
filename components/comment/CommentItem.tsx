import { useState } from 'react';
import CommentReactionProps from '@/types/CommentReactionProps';
import { createSupabaseClient } from '@/utils/supabaseClient';
import CommentItemProps from '@/types/CommentItemProps';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

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
        <Card className="p-4">
            {/* Conteúdo existente do comentário */}
            <div className="mt-2 flex items-center gap-2">
                <Button
                    variant="link"
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    Responder
                </Button>
            </div>

            {isReplying && (
                <div className="mt-3">
                    <div className="relative">
                      <textarea
                        value={replyText}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyText(e.target.value)}
                        placeholder="Digite sua resposta..."
                        rows={2} className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="mt-2 flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsReplying(false)}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleReply}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Enviar
                        </Button>
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
        </Card>
    );
};

export default CommentItem;
