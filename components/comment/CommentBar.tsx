// CommentBar.tsx
import SidebarFooter from '../sidebar/SidebarFooter';
import { CommentSidebarProps } from '@/types/CommentsProps';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { useState, useEffect, useRef } from 'react';
import { saveComment as saveComment } from '@/utils/commentUtils';
import { deleteComment, changeCommentStatus, editComment, checkEditCommentPermissions } from '@/utils/commentUtils';
import { createReply } from '@/utils/replyUtils';
import CommentFilter from './CommentFilter';
import CommentHeader from './CommentHeader';
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
  loadRepliesForPin,
  setShowAuthPopup
}: CommentSidebarProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [localComments, setLocalComments] = useState<{ [key: string]: string }>(comments || {});
  const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({});
  const [isPageOwner, setIsPageOwner] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
  const openRepliesRef = useRef<{ [key: string]: boolean }>({});
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setLocalComments(comments || {});
  }, [comments]);

  useEffect(() => {
    openRepliesRef.current = showReplies;
  }, [showReplies]);

  useEffect(() => {
    // This will run after pins or comments change (which happens after loadComments)
    // Restore the open state for any pins that had their replies open
    if (Object.keys(openRepliesRef.current).length > 0) {
      setShowReplies(prev => ({
        ...prev,
        ...openRepliesRef.current
      }));
    }
  }, [pins]);

  useEffect(() => {
    const loadPermissions = async () => {
      let isPageOwner = false;
      const perms: { [key: string]: boolean } = {};

      if (pins.length > 0) {
        // Obter o primeiro pin para verificar a propriedade do documento
        const firstPin = pins[0];
        const { isDocumentOwner } = await checkEditCommentPermissions(firstPin, session);
        isPageOwner = isDocumentOwner;
      }

      setIsPageOwner(isPageOwner);

      // Verificar permissões para cada pin
      for (const pin of pins) {
        const { hasPermission } = await checkEditCommentPermissions(pin, session);
        perms[pin.id] = hasPermission;
      }

      setPermissions(perms);
    };

    loadPermissions();
  }, [pins, session]);

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

  useEffect(() => {
    // Inicializar o estado de showReplies com base nos pins carregados
    const initialShowReplies: { [key: string]: boolean } = {};
    pins.forEach(pin => {
      // Verificar se o pin tem reactions
      if (pin.reactions && pin.reactions.length > 0) {
        // Preservar o estado atual se existir, caso contrário iniciar como oculto
        initialShowReplies[pin.id] = showReplies[pin.id] || openRepliesRef.current[pin.id] || false;
      }
    });

    // Mesclar com o estado atual para preservar pins que já estão abertos
    setShowReplies(prev => ({
      ...initialShowReplies,
      ...prev, // Manter o estado atual para pins que já estão sendo exibidos
      ...openRepliesRef.current // Garantir que os pins marcados como abertos na ref permaneçam abertos
    }));
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
          const { data: userData, error: userError } = await createSupabaseClient
            .from('users')
            .select('nome')
            .eq('user_id', userId)
          if (userError || !userData || userData.length === 0) {
            // Não logar erro, apenas usar nome padrão
            namesMap[userId] = 'Usuário Anônimo';
          } else {
            // Armazena o nome encontrado na tabela users
            namesMap[userId] = userData[0]?.nome || 'Usuário Anônimo';
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
  }, [pins, initialUserNames]);

  const CommentChange = (pinId: string, value: string) => {
    editComment(pinId, value, setLocalComments);
  };

  const CommentSave = async (pinId: string) => {
    await saveComment(
      pinId,
      pins,
      localComments,
      () => loadComments(),
      setEditingPinId,
      loadComments,
      setRefreshKey,
      session
    );
  };

  const CommentDelete = async (pinId: string) => {
    try {
      await deleteComment(
        pinId,
        pins,
        () => loadComments(),
        () => loadComments(),
        setEditingPinId,
        setRefreshKey
      );

      // Após a exclusão, recarrega os comentários para garantir sincronização
      await loadComments();
    } catch (error) {
      console.error("Erro ao deletar pin:", error);
    }
  };

  const CommentStatusChange = async (pinId: string) => {
    await changeCommentStatus(
      pinId,
      pins,
      () => loadComments(),
      session,
      loadComments
    );
  };

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLTextAreaElement>, pinId: string) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      await CommentSave(pinId);
    }
  };

  const handleReplyLocal = async (pinId: string) => {
    // Mark this pin's replies as open in our ref
    openRepliesRef.current = {
      ...openRepliesRef.current,
      [pinId]: true
    };

    await createReply(
      pinId,
      replyText,
      session,
      setReplyText,
      setShowAuthPopup,
      loadComments,
      setShowReplies
    );
  };

  const toggleRepliesLocal = (pinId: string) => {
    // Determinar o novo estado com base no estado atual
    const newState = !showReplies[pinId];

    // Atualizar o estado
    setShowReplies(prev => ({
      ...prev,
      [pinId]: newState
    }));

    // Atualizar também a referência para manter a consistência
    openRepliesRef.current = {
      ...openRepliesRef.current,
      [pinId]: newState
    };
  };

  const handleReplyKeyPressLocal = (event: React.KeyboardEvent<HTMLTextAreaElement>, pinId: string) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      // Marcar este pin como aberto em nossa referência
      openRepliesRef.current = {
        ...openRepliesRef.current,
        [pinId]: true
      };
      handleReplyLocal(pinId);
    }
    // Note: The ESC key handling for replies is now in CommentListItem component
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 border-r border-gray-300 relative">
      <div className="flex-1 overflow-y-auto pb-8 ">
        {/* Cabeçalho com contagem de comentários */}
        <CommentHeader/>

        {/* Filtros de status */}
        <CommentFilter
          totalComments={pins.length}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Lista de comentários */}
        <div className="p-4">
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
                CommentChange={CommentChange}
                CommentSave={CommentSave}
                CommentDelete={CommentDelete}
                CommentStatusChange={CommentStatusChange}
                setEditingPinId={setEditingPinId}
                handleReplyLocal={handleReplyLocal}
                setReplyText={setReplyText}
                toggleReplies={toggleRepliesLocal}
                handleReplyKeyPressLocal={handleReplyKeyPressLocal}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <SidebarFooter />
      </div>
    </div>
  );
};

export default CommentBar;
