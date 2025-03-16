// CommentBar.tsx
import { Pin } from '@/types/Pin';
import SidebarFooter from '../sidebar/SidebarFooter';
import { CommentSidebarProps } from '@/types/comments';
import { supabase } from '@/utils/supabaseClient';
import { useState, useEffect } from 'react';
import { handleCommentSave as handleCommentSaveUtil } from '@/utils/handleCommentSave';
import { handleDeletePin as handleDeletePinUtil } from '@/utils/handleDeletePin';
import { handleStatusChange as handleStatusChangeUtil } from '@/utils/handleStatusChange';
import { handleReply, handleReplyKeyPress } from '@/utils/handleReplyFunctions';
import CommentHeader from './CommentHeader';
import CommentFilter from './CommentFilter';
import CommentListItem from './CommentListItem';

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
    try {
      // Chama a função de utilidade com todos os argumentos necessários
      await handleDeletePinUtil(
        pinId,
        pins,
        (updatedPins) => {
          // Não precisamos atualizar os pins aqui, pois loadComments fará isso
          console.log('Pins atualizados:', updatedPins);
        },
        (updatedComments) => {
          // Não precisamos atualizar os comentários aqui, pois loadComments fará isso
          console.log('Comentários atualizados:', updatedComments);
        },
        setEditingPinId,
        setRefreshKey
      );

      // Após a exclusão, recarrega os comentários para garantir sincronização
      await loadComments();
    } catch (error) {
      console.error("Erro ao deletar pin:", error);
    }
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

  const handleReplyLocal = async (pinId: string) => {
    await handleReply(
      pinId,
      replyText,
      session,
      setReplyText,
      setShowAuthPopup,
      loadComments,
      setShowReplies
    );
  };

  const toggleReplies = (pinId: string) => {
    setShowReplies(prev => ({
      ...prev,
      [pinId]: !prev[pinId]
    }));
    // Não limpar o texto da resposta aqui
  };

  // Adicionar esta função para lidar com o pressionamento de tecla
  const handleReplyKeyPressLocal = (event: React.KeyboardEvent<HTMLTextAreaElement>, pinId: string) => {
    handleReplyKeyPress(event, pinId, handleReplyLocal);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 border-r border-gray-300">
      <div className="flex-1 overflow-y-auto">
        <CommentHeader totalComments={pins.length} />
        <CommentFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

        <div className="p-4 bg-white">
          <div className="space-y-4 thin-scrollbar">
            {pins.sort((a, b) => a.num - b.num).map((pin) => (
              <CommentListItem
                key={pin.id}
                pin={pin}
                localComments={localComments}
                editingPinId={editingPinId}
                permissions={permissions}
                userNames={userNames}
                showReplies={showReplies}
                replyText={replyText}
                handleCommentChange={handleCommentChange}
                handleCommentSave={handleCommentSave}
                handleDeletePin={handleDeletePin}
                handleStatusChange={handleStatusChange}
                setEditingPinId={setEditingPinId}
                handleReplyLocal={handleReplyLocal}
                setReplyText={setReplyText}
                toggleReplies={toggleReplies}
                handleReplyKeyPressLocal={handleReplyKeyPressLocal}
              />
            ))}
          </div>
        </div>
      </div>
      <SidebarFooter />
    </div>
  );
};

export default CommentBar;