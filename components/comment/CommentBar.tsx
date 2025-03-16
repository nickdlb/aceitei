// CommentBar.tsx
import Link from 'next/link';
import { formatDate } from '@/utils/formatDate';
import { Pin } from '@/types/Pin';
import { PencilIcon, CheckIcon, CogIcon, XMarkIcon, ChatBubbleLeftIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';
import SidebarFooter from '../sidebar/SidebarFooter';
import { CommentSidebarProps, CommentReaction } from '@/types/comments';
import { supabase } from '@/utils/supabaseClient';
import { useState, useEffect } from 'react';
import { handleCommentSave as handleCommentSaveUtil } from '@/utils/handleCommentSave';
import { handleDeletePin as handleDeletePinUtil } from '@/utils/handleDeletePin';
import { handleStatusChange as handleStatusChangeUtil } from '@/utils/handleStatusChange';

const CommentBar = ({
  pins,
  statusFilter,
  setStatusFilter,
  editingPinId,
  comments,
  setEditingPinId,
  userNames: initialUserNames,
  session,
  loadComments,
  setShowAuthPopup
}: CommentSidebarProps) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = formatDate(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${formattedDate} ${hours}:${minutes}`;
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [localComments, setLocalComments] = useState<{ [key: string]: string }>(comments || {});

  // Update localComments when comments prop changes
  useEffect(() => {
    setLocalComments(comments || {});
  }, [comments]);

  // Create local implementations that call the utility functions
  const handleCommentChange = (pinId: string, value: string) => {
    // Update local comments state directly
    setLocalComments(prev => ({
      ...prev,
      [pinId]: value
    }));
  };

  const handleCommentSave = async (pinId: string) => {
    await handleCommentSaveUtil(
      pinId,
      pins,
      localComments,
      (pinsOrUpdater) => {
        // This is a simplified implementation
        loadComments();
      },
      setEditingPinId,
      loadComments,
      setRefreshKey,
      session
    );
  };

  const handleDeletePin = async (pinId: string) => {
    await handleDeletePinUtil(
      pinId,
      pins,
      (pinsOrUpdater) => {
        // This is a simplified implementation
        loadComments();
      },
      (commentsOrUpdater) => {
        // This is a simplified implementation
        loadComments();
      },
      setEditingPinId,
      setRefreshKey
    );
  };

  const handleStatusChange = async (pinId: string) => {
    await handleStatusChangeUtil(
      pinId,
      pins,
      (pinsOrUpdater) => {
        // This is a simplified implementation
        loadComments();
      },
      session,
      loadComments
    );
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
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});

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
        !pin.comment && localComments[pin.id]
      );

      if (hasEmptyComments) {
        // Se encontrar comentários vazios mas que deveriam ter conteúdo,
        // atualizar os pins localmente
        const updatedPins = pins.map(pin => ({
          ...pin,
          comment: localComments[pin.id] || pin.comment || ''
        }));

        // Esta é uma solução temporária para forçar a re-renderização
        console.log('Atualizando pins com comentários do estado comments');
      }
    };

    // Verificar após um curto período
    const timer = setTimeout(checkComments, 500);
    return () => clearTimeout(timer);
  }, [pins, localComments]);

  // Adicione este useEffect para verificar as respostas ao carregar
  useEffect(() => {
    // Inicializar o estado de showReplies com base nos pins carregados
    const initialShowReplies: { [key: string]: boolean } = {};
    pins.forEach(pin => {
      // Verificar se o pin tem reactions
      if (pin.reactions && pin.reactions.length > 0) {
        initialShowReplies[pin.id] = false; // Inicialmente ocultas
      }
    });
    setShowReplies(initialShowReplies);
  }, [pins]);

  useEffect(() => {
    const loadUserNames = async () => {
      // Identificar todos os user_ids únicos nos pins
      const userIds = [...new Set(pins.map(pin => pin.user_id))];
      
      if (userIds.length === 0) return;
      
      // Criar um objeto para armazenar os nomes
      const namesMap: { [key: string]: string } = {};

      // Busca os nomes de todos os usuários identificados
      for (const userId of userIds) {
        // Verificar se já temos o nome deste usuário
        if (initialUserNames[userId]) {
          namesMap[userId] = initialUserNames[userId];
          continue;
        }
        
        try {
          // Buscar na tabela users
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('nome')
            .eq('user_id', userId)
            .single();

          if (userError || !userData || !userData.nome) {
            // Não logar erro, apenas usar nome padrão
            namesMap[userId] = 'Usuário Anônimo';
          } else {
            // Armazena o nome encontrado na tabela users
            namesMap[userId] = userData.nome || 'Usuário Anônimo';
          }
        } catch (error) {
          // Em caso de erro, usar nome padrão
          namesMap[userId] = 'Usuário Anônimo';
        }
      }
      
      // Atualizar o estado uma única vez com todos os nomes
      setUserNames(prev => ({
        ...prev,
        ...namesMap
      }));
    };

    loadUserNames();
  }, [pins]);

  const handleReply = async (pinId: string) => {
    if (!replyText.trim()) return;

    // Verifique se o usuário está logado
    if (!session?.user?.id) {
      setShowAuthPopup(true); // Abre o popup de identificação
      return;
    }

    try {
      // Inserir nova resposta
      const { error } = await supabase
        .from('comment_reactions')
        .insert({
          comment_id: pinId,
          user_id: session.user.id,
          reaction_type: replyText,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro detalhado:', error);
        throw error;
      }

      setReplyText(''); // Limpa o texto da resposta após enviar
      await loadComments(); // Carrega os comentários novamente

      // Não fechar as respostas
    } catch (error: any) {
      console.error('Erro ao adicionar resposta:', error);
      alert(`Erro ao adicionar resposta: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const toggleReplies = (pinId: string) => {
    setShowReplies(prev => ({
      ...prev,
      [pinId]: !prev[pinId]
    }));
    // Não limpar o texto da resposta aqui
  };

  // Adicionar esta função para lidar com o pressionamento de tecla
  const handleReplyKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>, pinId: string) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleReply(pinId);
    }
  };

  // Componente para renderizar uma única resposta
  const CommentReply = ({
    reaction,
    level = 0,
    parentId
  }: {
    reaction: CommentReaction;
    level?: number;
    parentId: string;
  }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleSubmitReply = async () => {
      if (!replyText.trim() || !session?.user?.id) return;

      try {
        // Inserir nova resposta usando apenas as colunas existentes
        const { error } = await supabase
          .from('comment_reactions')
          .insert({
            comment_id: parentId,
            user_id: session.user.id,
            reaction_type: replyText,
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error('Erro detalhado:', error);
          throw error;
        }

        setReplyText('');
        setShowReplyForm(false);
        if (loadComments) {
          await loadComments();
        }

      } catch (error: any) {
        console.error('Erro ao adicionar resposta:', error);
        alert(`Erro ao adicionar resposta: ${error.message || 'Erro desconhecido'}`);
      }
    };

    return (
      <div className={`mt-2 ${level > 0 ? 'ml-4' : ''}`}>
        <div className="text-gray-700 text-sm">{reaction.reaction_type}</div>
        <div className="text-xs text-gray-500 mt-1">
          {formatDateTime(reaction.created_at)}
        </div>

        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-xs text-blue-600 hover:text-blue-800 mt-1"
        >
          Responder
        </button>

        {showReplyForm && (
          <div className="mt-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={(e) => handleReplyKeyPress(e, parentId)}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="Digite sua resposta..."
              rows={2}
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setReplyText('');
                  setShowReplyForm(false);
                }}
                className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitReply}
                disabled={!replyText.trim()}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          </div>
        )}
      </div>
    );
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
                      onKeyPress={(e) => handleKeyPress(e, pin.id)}
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
                      {/* Usar o conteúdo do estado comments se pin.comment estiver vazio */}
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
                    {/* Caixa de nova resposta */}
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={(e) => handleReplyKeyPress(e, pin.id)}
                      placeholder="Digite sua resposta..."
                      className="border rounded p-2 w-full"
                    />
                    <button
                      onClick={() => handleReply(pin.id)}
                      className="mt-2 bg-blue-500 text-white rounded px-4 py-2"
                    >
                      Enviar
                    </button>
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