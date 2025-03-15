// CommentBar.tsx
import Link from 'next/link';
import { formatDate } from '@/utils/formatDate';
import { Pin } from '@/types/Pin';
import { PencilIcon, CheckIcon, CogIcon, XMarkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import SidebarFooter from '../sidebar/SidebarFooter';
import { CommentSidebarProps } from '@/types/comments';
import { supabase } from '@/utils/supabaseClient';
import { useState, useEffect } from 'react';

const CommentBar = ({
  pins,
  statusFilter,
  setStatusFilter,
  editingPinId,
  comments,
  handleCommentChange,
  handleCommentSave,
  handleDeletePin,
  handleStatusChange,
  setEditingPinId,
  userNames,
  session,
  loadComments
}: CommentSidebarProps) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = formatDate(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${formattedDate} ${hours}:${minutes}`;
  };

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLTextAreaElement>, pinId: string) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      await handleCommentSave(pinId);
    }
  };

  const checkOwner = async (pageId: string) => {
    if (!session?.user?.id) return false;
    const { data } = await supabase
      .from('pages')
      .select('user_id')
      .eq('id', pageId)
    return data && data.length > 0 ? session.user.id === data[0].user_id : false;
  };

  const checkPermissions = (pin: Pin, isOwner: boolean) => {
    if (!session?.user?.id) return false;
    if (isOwner) return true;
    return session.user.id === pin.user_id;
  };

  const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({});
  const [isPageOwner, setIsPageOwner] = useState(false);
  const [replying, setReplying] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const loadPermissions = async () => {
      let owner = false;
      if (pins.length > 0) {
        owner = await checkOwner(pins[0].page_id);
      }
      setIsPageOwner(owner);
      const perms: { [key: string]: boolean } = {};
      for (const pin of pins) {
        perms[pin.id] = checkPermissions(pin, owner);
      }
      setPermissions(perms);
    };

    loadPermissions();
  }, [pins, session]);

  // Adicionar useEffect para verificar se os comentários estão visíveis
  useEffect(() => {
    // Verificar se há pins sem comentários visíveis
    const checkComments = () => {
      const hasEmptyComments = pins.some(pin =>
        !pin.comment && comments[pin.id]
      );

      if (hasEmptyComments) {
        // Se encontrar comentários vazios mas que deveriam ter conteúdo,
        // atualizar os pins localmente
        const updatedPins = pins.map(pin => ({
          ...pin,
          comment: comments[pin.id] || pin.comment || ''
        }));

        // Esta é uma solução temporária para forçar a re-renderização
        console.log('Atualizando pins com comentários do estado comments');
      }
    };

    // Verificar após um curto período
    const timer = setTimeout(checkComments, 500);
    return () => clearTimeout(timer);
  }, [pins, comments]);

  const handleReply = async (pinId: string) => {
    if (!replyText.trim() || !session?.user?.id) return;

    try {
      // Primeiro verificar se o usuário tem permissão
      const hasPermission = await checkPermissions(pins.find(p => p.id === pinId) as Pin);
      if (!hasPermission) {
        alert('Você não tem permissão para responder este comentário.');
        return;
      }

      // Verificar se já existe uma reação deste usuário
      const { data: existingReaction } = await supabase
        .from('comment_reactions')
        .select()
        .eq('comment_id', pinId)
        .eq('user_id', session.user.id)
        .single();

      let error;
      if (existingReaction) {
        // Se já existe, atualiza
        ({ error } = await supabase
          .from('comment_reactions')
          .update({
            reaction_type: replyText,
            created_at: new Date().toISOString()
          })
          .eq('comment_id', pinId)
          .eq('user_id', session.user.id));
      } else {
        // Se não existe, insere
        ({ error } = await supabase
          .from('comment_reactions')
          .insert({
            comment_id: pinId,
            user_id: session.user.id,
            reaction_type: replyText,
            created_at: new Date().toISOString()
          }));
      }

      if (error) {
        console.error('Erro detalhado:', error);
        throw error;
      }

      // Limpar o estado e atualizar
      setReplyText('');
      setReplying(null);
      await loadComments();

    } catch (error: any) {
      console.error('Erro ao adicionar resposta:', error);
      alert(`Erro ao adicionar resposta: ${error.message || 'Erro desconhecido'}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 border-r border-gray-300"> {/* Classes restauradas e importantes! */}
      <div className="flex-1 overflow-y-auto"> {/* Scroll dentro da barra */}
        {/* --- CABEÇALHO (Opcional) --- */}
        <div className="p-4 border-b bg-white border-b-gray-300">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-medium hover:text-blue-600">
              Aceitei
            </Link>
          </div>
        </div>

        {/* --- Filtros (OPCIONAL) ---*/}
        <div className="px-4 py-3 bg-white border-b border-b-gray-300">
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('ativo')}
              className={`px-3 py-1 rounded text-sm ${statusFilter === 'ativo'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600'
                }`}
            >
              Ativos
            </button>
            <button
              onClick={() => setStatusFilter('resolvido')}
              className={`px-3 py-1 rounded text-sm ${statusFilter === 'resolvido'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600'
                }`}
            >
              Resolvidos
            </button>
          </div>
        </div>

        {/* --- Total de Comentários (OPCIONAL) --- */}
        <div className="px-4 py-2 bg-white border-b border-b-gray-300">
          <span className="font-medium">Total de Comentários: {pins.length}</span>
        </div>

        {/* --- LISTA DE COMENTÁRIOS --- */}
        <div className="p-4 bg-white"> {/* Removido overflow daqui */}
          <div className="space-y-4 thin-scrollbar">
            {pins.sort((a, b) => a.num - b.num).map((pin) => (
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
                    {userNames[pin.id] && (
                      <span className="text-xs text-gray-500">{userNames[pin.id]}</span>
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
                      value={comments[pin.id] || ''}
                      onChange={(e) => handleCommentChange(pin.id, e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, pin.id)}
                      className="w-full p-2 border rounded mb-2 min-h-[60px] resize-none text-sm"
                      placeholder="Comentário..."
                      autoFocus
                    />
                    <button
                      onClick={() => handleCommentSave(pin.id)}
                      disabled={!comments[pin.id]?.trim()}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Confirmar
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      {/* Usar o conteúdo do estado comments se pin.comment estiver vazio */}
                      <p className="text-sm text-gray-700">
                        {pin.comment || comments[pin.id] || ''}
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
                    onClick={() => setReplying(replying === pin.id ? null : pin.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <ChatBubbleLeftIcon className="w-4 h-4" />
                    Responder
                  </button>
                </div>

                {replying === pin.id && (
                  <div className="mt-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                      placeholder="Digite sua resposta..."
                      rows={2}
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setReplyText('');
                          setReplying(null);
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleReply(pin.id)}
                        disabled={!replyText.trim()}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                )}

                {pin.reactions && pin.reactions.length > 0 && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-200">
                    {pin.reactions.map((reaction) => (
                      <div key={reaction.id} className="mt-2 text-sm">
                        <div className="text-gray-700">{reaction.reaction_type}</div>
                        <div className="text-xs text-gray-500">
                          {formatDateTime(reaction.created_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <SidebarFooter /> {/* Rodapé (se você tiver) */}
    </div>
  );
};

export default CommentBar;