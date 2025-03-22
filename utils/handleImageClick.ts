import { supabase } from '@/utils/supabaseClient';
import { createComment } from '@/utils/createPin';
import PinProps from '@/types/PinProps';

/**
 * Handles a click on an image to create a new pin
 * @param xPercent X coordinate as percentage of image width
 * @param yPercent Y coordinate as percentage of image height
 * @param pageId ID of the current page
 * @param pins Current pins on the page
 * @param setPins Function to update pins state
 * @param setComments Function to update comments state
 * @param setEditingPinId Function to set the currently editing pin ID
 * @param statusFilter Current status filter
 * @param setStatusFilter Function to update status filter
 * @param setPendingClick Function to set pending click coordinates
 * @param setShowAuthPopup Function to show authentication popup
 * @param editingPinId ID of the pin being edited
 */
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
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
        setPendingClick({ x: xPercent, y: yPercent });
        setShowAuthPopup(true);
        return;
    }

    // Check if there's already a pin being edited (with no comment)
    const editingPin = pins.find(pin => pin.id === editingPinId);
    const emptyCommentPin = editingPin && (!editingPin.comment || editingPin.comment.trim() === '');

    if (emptyCommentPin) {
        // If there's a pin being edited with no comment, move it instead of creating a new one
        await updatePinPosition(editingPin.id, xPercent, yPercent, pageId, pins, setPins);
        // Keep the pin in editing state to preserve comment text
        setEditingPinId(editingPin.id);
    } else {
        // Create a new pin
        await createComment(
            xPercent,
            yPercent,
            pageId,
            pins,
            setPins,
            setComments,
            setEditingPinId,
            statusFilter,
            setStatusFilter,
            session
        );
    }
};

/**
 * Updates the position of an existing pin
 */
const updatePinPosition = async (
    pinId: string,
    xPercent: number,
    yPercent: number,
    pageId: string,
    pins: PinProps[],
    setPins: (pins: PinProps[] | ((prevPins: PinProps[]) => PinProps[])) => void
) => {
    try {
        // Update the pin position in the database
        await supabase
            .from('comments')
            .update({ pos_x: xPercent, pos_y: yPercent })
            .eq('id', pinId);

        // Find the pin to update
        const pinToUpdate = pins.find(pin => pin.id === pinId);

        if (pinToUpdate) {
            // Update the pin position in the state while preserving all other properties including reactions
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
