import { useState, useEffect } from 'react';
import { Pin } from '@/types/Pin';
import { supabase } from '@/utils/supabaseClient';
import { handleImageClick as handleImageClickUtil } from '@/utils/handleImageClick';
import { handleAuth } from '@/utils/handleAuth';

interface PageWithDocument {
    documents: {
        user_id: string;
    };
}

export const usePins = (pageId: string, session: any) => {
    const [pins, setPins] = useState<Pin[]>([]);
    const [editingPinId, setEditingPinId] = useState<string | null>(null);
    const [comments, setComments] = useState<{ [key: string]: string }>({});
    const [parentComments, setParentComments] = useState<{ [key: string]: Comment[] }>({});
    const [statusFilter, setStatusFilter] = useState<'ativo' | 'resolvido'>('ativo');
    const [refreshKey, setRefreshKey] = useState(0);
    const [draggingPin, setDraggingPin] = useState<Pin | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const [pendingClick, setPendingClick] = useState<{ x: number, y: number } | null>(null);
    const [loadAttempts, setLoadAttempts] = useState(0);

    const loadPins = async (pageId: string) => {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('page_id', pageId);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error loading pins:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchPins = async () => {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('page_id', pageId);

            if (error) {
                console.error('Error fetching pins:', error);
                return;
            }

            setPins(data);
        };

        fetchPins();
    }, [pageId]);

    useEffect(() => {
        loadPins(pageId);
    }, [pageId, refreshKey, loadAttempts]);

    useEffect(() => {
        const fetchUserNames = async () => {
            const names: { [key: string]: string } = {};
            for (const pin of pins) {
                if (pin.user_id) {
                    const { data } = await supabase
                        .from('anonymous_users')
                        .select('name')
                        .eq('auth_id', pin.user_id)
                        .single();
                    if (data && data.name) {
                        names[pin.id] = data.name;
                    }
                }
            }
            setUserNames(names);
        };
        fetchUserNames();
    }, [pins]);

    const loadComments = async () => {
        try {
            console.log('Iniciando carregamento de comentários...');

            const { data: commentsData, error: commentsError } = await supabase
                .from('comments')
                .select('*')
                .eq('page_id', pageId);

            if (commentsError) throw commentsError;

            console.log('Comentários carregados:', commentsData);

            if (!commentsData || commentsData.length === 0) {
                setPins([]);
                setComments({});
                return;
            }

            const commentIds = commentsData.map(comment => comment.id);

            const { data: reactionsData, error: reactionsError } = await supabase
                .from('comment_reactions')
                .select('*')
                .in('comment_id', commentIds);

            if (reactionsError) throw reactionsError;

            console.log('Reações carregadas:', reactionsData);

            const commentReactionsMap = new Map();

            if (reactionsData) {
                reactionsData.forEach(reaction => {
                    if (!commentReactionsMap.has(reaction.comment_id)) {
                        commentReactionsMap.set(reaction.comment_id, []);
                    }
                    commentReactionsMap.get(reaction.comment_id).push(reaction);
                });
            }

            const pinsData = commentsData.map(comment => {
                const reactions = commentReactionsMap.get(comment.id) || [];

                console.log(`Comentário ${comment.id} tem ${reactions.length} reações`);

                return {
                    id: comment.id,
                    x: comment.pos_x,
                    y: comment.pos_y,
                    num: comment.pin_number,
                    comment: comment.content || '',
                    created_at: comment.created_at,
                    status: comment.status || 'ativo',
                    user_id: comment.user_id,
                    page_id: comment.page_id,
                    reactions: reactions
                };
            });

            console.log('Pins com reações:', pinsData);

            setPins(pinsData);

            const commentState: { [key: string]: string } = {};
            commentsData.forEach(comment => {
                commentState[comment.id] = comment.content || '';
            });
            setComments(commentState);
        } catch (error) {
            console.error('Erro ao carregar comentários:', error);
        }
    };

    const updatePinPosition = async (pinId: string, xPercent: number, yPercent: number) => {
        try {
            await supabase
                .from('comments')
                .update({ pos_x: xPercent, pos_y: yPercent })
                .eq('id', pinId);

            const updatedPins = await loadPins(pageId);
            if (updatedPins) {
                const pinsFormatados = updatedPins.map((pin: any) => ({
                    id: pin.id,
                    x: pin.pos_x,
                    y: pin.pos_y,
                    num: pin.pin_number,
                    comment: pin.comment,
                    created_at: pin.created_at,
                    status: pin.status || 'ativo',
                    user_id: pin.user_id,
                    page_id: pin.page_id
                }));
                setPins(pinsFormatados);
            }
        } catch (error) {
            console.error('Erro ao atualizar posição do pin:', error);
        }
    };

    useEffect(() => {
        if (pageId) {
            console.log('Carregando comentários para a página:', pageId);
            loadComments();
        }
    }, [pageId]);

    return {
        pins,
        editingPinId,
        comments,
        parentComments,
        statusFilter,
        draggingPin,
        isDragging,
        userNames,
        showAuthPopup,
        setStatusFilter,
        setEditingPinId,
        setDraggingPin,
        setIsDragging,
        updatePinPosition,
        setShowAuthPopup,
        handleAuth: (name: string, email: string) => handleAuth(name, email, pageId, pins, setPins, setComments, setEditingPinId, statusFilter, setStatusFilter, pendingClick, setShowAuthPopup, handleImageClickUtil),
        loadComments,
    };
};
