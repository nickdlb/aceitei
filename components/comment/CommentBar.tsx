
import UserProfileSidebar from '@/components/dashboard/sidebar/UserProfile';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { useState, useEffect, useRef } from 'react';
import { saveComment as saveComment } from '@/utils/commentUtils';
import { deleteComment, changeCommentStatus, editComment, checkCommentPermissions } from '@/utils/commentUtils';
import { createReply } from '@/utils/replyUtils';
import CommentFilter from './CommentBarFilter';
import CommentHeader from './CommentBarHeader';
import CommentListItem from './CommentBarListItem';
import { usePageContext } from '@/contexts/PageContext';
import { Session } from '@supabase/supabase-js';
import { PinProps } from '@/types';

interface CommentBarProps {
    pins: PinProps[];
    statusFilter: 'ativo' | 'resolvido' | null;
    setStatusFilter: (filter: 'ativo' | 'resolvido' | null) => void;
    editingPinId: string | null;
    comments: { [key: string]: string };
    setEditingPinId: (pinId: string | null) => void;
    userNames: { [key: string]: string };
    session: Session | null;
    loadComments: () => Promise<void>;
    loadRepliesForPin?: (pinId: string) => Promise<void>;
    setShowAuthPopup: (show: boolean) => void;
}

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
}: CommentBarProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [localComments, setLocalComments] = useState<{ [key: string]: string }>(comments || {});
  const { documentData } = usePageContext();
  const [permissions, setPermissions] = useState<{ [key: string]: { canEdit: boolean, canDelete: boolean, canChangeStatus: boolean } }>({});
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
  const openRepliesRef = useRef<{ [key: string]: boolean }>({});
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    console.log('✅ document:', documentData);
  });

  useEffect(() => {
    setLocalComments(comments || {});
  }, [comments]);

  useEffect(() => {
    openRepliesRef.current = showReplies;
  }, [showReplies]);

  useEffect(() => {

    if (Object.keys(openRepliesRef.current).length > 0) {
      setShowReplies(prev => ({
        ...prev,
        ...openRepliesRef.current
      }));
    }
  }, [pins]);

  useEffect(() => {
    const loadPermissions = async () => {
      const perms: { [key: string]: { canEdit: boolean, canDelete: boolean, canChangeStatus: boolean } } = {};

      for (const pin of pins) {

        const commentPermission = await checkCommentPermissions(pin, session);

        if (typeof commentPermission === 'object' && !Array.isArray(commentPermission)) {

          perms[pin.id] = commentPermission;
        } else if (commentPermission === true) {

          perms[pin.id] = { canEdit: true, canDelete: true, canChangeStatus: true };
        } else {

          perms[pin.id] = { canEdit: false, canDelete: false, canChangeStatus: false };
        }
      }

      setPermissions(perms);
    };

    if (pins && pins.length > 0 && session) {
      loadPermissions();
    } else {

      setPermissions({});
    }
  }, [pins, session]);

  useEffect(() => {

    const checkComments = () => {
      const hasEmptyComments = pins.some(pin =>
        !pin.comment && localComments[pin.id]
      );

      if (hasEmptyComments) {

        const updatedPins = pins.map(pin => ({
          ...pin,
          comment: localComments[pin.id] || pin.comment || ''
        }));

        console.log('Atualizando pins com comentários do estado comments');
      }
    };

    const timer = setTimeout(checkComments, 500);
    return () => clearTimeout(timer);
  }, [pins, localComments]);

  useEffect(() => {

    const initialShowReplies: { [key: string]: boolean } = {};
    pins.forEach(pin => {

      if (pin.reactions && pin.reactions.length > 0) {

        initialShowReplies[pin.id] = showReplies[pin.id] || openRepliesRef.current[pin.id] || false;
      }
    });

    setShowReplies(prev => ({
      ...initialShowReplies,
      ...prev,
      ...openRepliesRef.current
    }));
  }, [pins]);

  useEffect(() => {
    const loadUserNames = async () => {

      const userIds = [...new Set(pins.map(pin => pin.user_id))];

      if (userIds.length === 0) return;

      const namesMap: { [key: string]: string } = {};

      for (const userId of userIds) {

        if (initialUserNames[userId]) {
          namesMap[userId] = initialUserNames[userId];
          continue;
        }

        try {

          const { data: userData, error: userError } = await createSupabaseClient
            .from('users')
            .select('nome')
            .eq('user_id', userId)
          if (userError || !userData || userData.length === 0) {

            namesMap[userId] = 'Usuário Anônimo';
          } else {

            namesMap[userId] = userData[0]?.nome || 'Usuário Anônimo';
          }
        } catch (error) {

          namesMap[userId] = 'Usuário Anônimo';
        }
      }

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
        setRefreshKey,
        session
      );

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

    const newState = !showReplies[pinId];

    setShowReplies(prev => ({
      ...prev,
      [pinId]: newState
    }));

    openRepliesRef.current = {
      ...openRepliesRef.current,
      [pinId]: newState
    };
  };

  const handleReplyKeyPressLocal = (event: React.KeyboardEvent<HTMLTextAreaElement>, pinId: string) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      openRepliesRef.current = {
        ...openRepliesRef.current,
        [pinId]: true
      };
      handleReplyLocal(pinId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-acbgbranco">
      <div className="flex-1 overflow-y-auto pb-4">
        <CommentHeader totalComments={pins.length} />
        <CommentFilter
          totalComments={pins.length}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <div>
          <div className="px-4 space-y-6 thin-scrollbar">
            {pins.sort((a, b) => a.num - b.num).map((pin) => (
              <CommentListItem
                key={pin.id}
                pin={pin}
                currentUserId={session?.user?.id || ''}
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
                session={session}
                loadComments={loadComments}
              />
            ))}
          </div>
        </div>
      </div>
      <UserProfileSidebar />
    </div>
  );
};

export default CommentBar;
