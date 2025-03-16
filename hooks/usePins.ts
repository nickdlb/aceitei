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
        if (!pageId) return;

        try {
            const { data: commentsData, error: commentsError } = await supabase
                .from('comments')
                .select('*')
                .eq('page_id', pageId);

            if (commentsError) throw commentsError;

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

            setPins(pinsData);

            const commentState: { [key: string]: string } = {};
            commentsData.forEach(comment => {
                commentState[comment.id] = comment.content || '';
            });
            setComments(commentState);
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    const updatePinPosition = async (pinId: string, xPercent: number, yPercent: number) => {
        try {
            // First, find the current pin with all its properties including reactions
            const currentPin = pins.find(pin => pin.id === pinId);
            
            if (!currentPin) {
                console.error('Pin não encontrado:', pinId);
                return;
            }
            
            // Update the pin position in the database
            await supabase
                .from('comments')
                .update({ pos_x: xPercent, pos_y: yPercent })
                .eq('id', pinId);
            
            // Update the pin in the local state to immediately reflect the change
            // while preserving all properties, especially reactions
            setPins(prevPins => prevPins.map(pin => 
                pin.id === pinId 
                    ? { ...pin, x: xPercent, y: yPercent } 
                    : pin
            ));
            
            // Optionally reload all comments to ensure everything is in sync
            // This is a safety measure but might not be necessary with the above state update
            await loadComments();
        } catch (error) {
            console.error('Erro ao atualizar posição do pin:', error);
        }
    };

    const loadRepliesForPin = async (pinId: string) => {
        if (!pinId) return;

        try {
            // Fetch only the reactions for this specific pin
            const { data: reactionsData, error: reactionsError } = await supabase
                .from('comment_reactions')
                .select('*')
                .eq('comment_id', pinId);

            if (reactionsError) throw reactionsError;

            // Update only the reactions for this pin in the pins state
            setPins(prevPins => prevPins.map(pin => {
                if (pin.id === pinId) {
                    return {
                        ...pin,
                        reactions: reactionsData || []
                    };
                }
                return pin;
            }));

        } catch (error) {
            console.error('Error loading replies for pin:', error);
        }
    };

    useEffect(() => {
        if (pageId) {
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
        loadRepliesForPin,
        setShowAuthPopup,
        handleAuth: (name: string, email: string) => handleAuth(name, email, pageId, pins, setPins, setComments, setEditingPinId, statusFilter, setStatusFilter, pendingClick, setShowAuthPopup, handleImageClickUtil, editingPinId),
        loadComments,
    };
};
