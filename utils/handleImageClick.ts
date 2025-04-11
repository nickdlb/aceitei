import { createSupabaseClient } from '@/utils/supabaseClient';
import { createComment } from '@/utils/commentUtils';
import PinProps from '@/types/PinProps';

export const handleImageClick = async (
    xPercent: number,
    yPercent: number,
    pageId: string,
    pins: PinProps[],
    setPins: (pins: PinProps[] | ((prevPins: PinProps[]) => PinProps[])) => void,
    setComments: (comments: { [key: string]: string } | ((prev: { [key: string]: string }) => { [key: string]: string })) => void,
    setEditingPinId: (id: string | null) => void,
    statusFilter: 'ativo' | 'resolvido',
    setStatusFilter: (filter: 'ativo' | 'resolvido') => void,
    setPendingClick: (click: { x: number, y: number } | null) => void,
    setShowAuthPopup: (show: boolean) => void,
    editingPinId: string | null
) => {
    const { data: { session } } = await createSupabaseClient.auth.getSession();

    if (!session?.user) {
        setPendingClick({ x: xPercent, y: yPercent });
        setShowAuthPopup(true);
        return;
    }

    const editingPin = pins.find(pin => pin.id === editingPinId);
    const emptyCommentPin = editingPin && (!editingPin.comment || editingPin.comment.trim() === '');

    const getDocumentId = async (pageId: string) => {
        const { data, error } = await createSupabaseClient
            .from('pages')
            .select('document_id')
            .eq('id', pageId)

        if (error) {
            console.error("Error fetching document id:", error);
            return null;
        }

        return data ? data[0]?.document_id : null;
    };

    if (emptyCommentPin) {

        await updatePinPosition(editingPin.id, xPercent, yPercent, pageId, pins, setPins);

        setEditingPinId(editingPin.id);
    } else {

        const documentId = await getDocumentId(pageId);
        if (documentId) {
            await createComment(
                xPercent,
                yPercent,
                pageId,
                documentId,
                pins,
                setPins,
                setComments,
                setEditingPinId,
                statusFilter,
                setStatusFilter,
                session
            );
        } else {
            console.error("Could not retrieve document ID for page:", pageId);
        }
    }
};

const updatePinPosition = async (
    pinId: string,
    xPercent: number,
    yPercent: number,
    pageId: string,
    pins: PinProps[],
    setPins: (pins: PinProps[] | ((prevPins: PinProps[]) => PinProps[])) => void
) => {
    try {

        await createSupabaseClient
            .from('comments')
            .update({ pos_x: xPercent, pos_y: yPercent })
            .eq('id', pinId);

        const pinToUpdate = pins.find(pin => pin.id === pinId);

        if (pinToUpdate) {

            setPins(prevPins => prevPins.map(pin =>
                pin.id === pinId
                    ? { ...pin, x: xPercent, y: yPercent }
                    : pin
            ));
        }
    } catch (error) {
        console.error("Error updating pin position:", error);
    }
};
