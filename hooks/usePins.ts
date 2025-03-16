import { useState, useEffect } from 'react';
import { Pin } from '@/types/Pin';
import { supabase } from '@/utils/supabaseClient';
import loadPins from '@/utils/loadPins';
import { insertPin } from '@/utils/insertPinSupa';
import { Comment } from '@/types/Document';
import { CommentReaction } from '@/types/CommentReaction';
import { handleImageClick as handleImageClickUtil } from '@/utils/handleImageClick';
import { checkPermissions } from '@/utils/checkPermissions';

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
        const loadPins = async () => {
            if (pageId) {
                try {
                    console.log('Loading pins, attempt:', loadAttempts + 1);
                    const query = supabase
                        .from('comments')
                        .select(`
                            id,
                            content,
                            pos_x,
                            pos_y,
                            pin_number,
                            status,
                            created_at,
                            user_id,
                            page_id
                        `)
                        .eq('page_id', pageId)
                        .order('pin_number', { ascending: true });

                    const { data: commentsData, error } = await query;

                    if (error) {
                        console.error('Error loading comments:', error);
                        console.error('Error details:', error.message, error.stack);
                        throw error;
                    }

                    const pinsData = commentsData?.map(comment => ({
                        id: comment.id,
                        x: comment.pos_x,
                        y: comment.pos_y,
                        num: comment.pin_number,
                        comment: comment.content,
                        created_at: comment.created_at,
                        status: comment.status,
                        user_id: comment.user_id,
                        page_id: comment.page_id
                    }));

                    setPins(pinsData || []);

                    const commentState = commentsData?.reduce((acc, comment) => ({
                        ...acc,
                        [comment.id]: comment.content || ''
                    }), {} as { [key: string]: string });

                    setComments(commentState || {});

                    const hasEmptyComments = commentsData?.some(comment =>
                        comment.content === undefined || comment.content === null
                    );

                    if (hasEmptyComments && loadAttempts < 3) {
                        setTimeout(() => {
                            setLoadAttempts(prev => prev + 1);
                        }, 1000);
                    }
                } catch (error: any) {
                    console.error('Error loading comments:', error);
                    console.error('Error details:', error.message, error.stack);
                }
            }
        };

        loadPins();
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
                const pinsFormatados = updatedPins.map(pin => ({
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

    const handleAuth = async (name: string, email: string) => {
        try {
            const { data: { session }, error: authError } = await supabase.auth.signInAnonymously();

            if (authError) throw authError;
            if (!session) throw new Error('Falha ao criar sessão anônima');

            const { error: userError } = await supabase
                .from('anonymous_users')
                .insert([
                    {
                        auth_id: session.user.id,
                        name: name,
                        email: email
                    }
                ]);

            if (userError) throw userError;

            if (pendingClick) {
                await handleImageClickUtil(
                    pendingClick.x, 
                    pendingClick.y, 
                    pageId, 
                    pins, 
                    setPins, 
                    setComments, 
                    setEditingPinId, 
                    statusFilter, 
                    setStatusFilter, 
                    setPendingClick, 
                    setShowAuthPopup
                );
                setPendingClick(null);
            }

            setShowAuthPopup(false);

        } catch (error: any) {
            console.error('Erro ao criar usuário anônimo:', error.message);
            throw new Error('Não foi possível criar o usuário. Tente novamente.');
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
        handleAuth,
        loadComments,
    };
};
