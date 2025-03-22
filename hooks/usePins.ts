import { useState, useEffect } from 'react';
import PinProps from '@/types/PinProps';
import { supabase } from '@/utils/supabaseClient';
import { handleImageClick as handleImageClickUtil } from '@/utils/handleImageClick';
import { anonymousAuth } from '@/utils/anonymousAuth';
import { loadPins } from './usePins/loadPins';
import { loadComments } from './usePins/loadComments';
import { updatePinPosition } from './usePins/updatePinPosition';
import { loadRepliesForPin } from './usePins/loadRepliesForPin';

interface PageWithDocument {
    documents: {
        user_id: string;
    };
}

export const usePins = (pageId: string, session: any) => {
    const [pins, setPins] = useState<PinProps[]>([]);
    const [editingPinId, setEditingPinId] = useState<string | null>(null);
    const [comments, setComments] = useState<{ [key: string]: string }>({});
    const [parentComments, setParentComments] = useState<{ [key: string]: Comment[] }>({});
    const [statusFilter, setStatusFilter] = useState<'ativo' | 'resolvido'>('ativo');
    const [refreshKey, setRefreshKey] = useState(0);
    const [draggingPin, setDraggingPin] = useState<PinProps | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const [pendingClick, setPendingClick] = useState<{ x: number, y: number } | null>(null);
    const [loadAttempts, setLoadAttempts] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            const data = await loadPins(pageId);
            if (data && isMounted) {
                setPins(data);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [pageId, refreshKey, loadAttempts]);

    useEffect(() => {
        let isMounted = true;

        const fetchUserNames = async () => {
            const names: { [key: string]: string } = {};
            for (const pin of pins) {
                if (!isMounted) break;
                if (pin.user_id) {
                    const { data } = await supabase
                        .from('anonymous_users')
                        .select('name')
                        .eq('auth_id', pin.user_id)
                        .single();
                    if (data && data.name && isMounted) {
                        names[pin.id] = data.name;
                    }
                }
            }
            if (isMounted) {
                setUserNames(names);
            }
        };

        fetchUserNames();

        return () => {
            isMounted = false;
        };
    }, [pins]);

    useEffect(() => {
        let isMounted = true;

        if (pageId) {
            const loadInitialComments = async () => {
                if (isMounted) {
                    await loadComments(pageId, setPins, setComments);
                }
            };
            loadInitialComments();
        }

        return () => {
            isMounted = false;
        };
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
        updatePinPosition: (pinId: string, xPercent: number, yPercent: number) => updatePinPosition(pinId, xPercent, yPercent, pins, setPins, () => loadComments(pageId, setPins, setComments)),
        loadRepliesForPin: (pinId: string) => loadRepliesForPin(pinId, setPins),
        setShowAuthPopup,
        handleAuth: (name: string, email: string) => anonymousAuth(name, email, pageId, pins, setPins, setComments, setEditingPinId, statusFilter, setStatusFilter, pendingClick, setShowAuthPopup, handleImageClickUtil, editingPinId),
        loadComments: () => loadComments(pageId, setPins, setComments),
    };
};
