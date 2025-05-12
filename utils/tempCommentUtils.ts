import { SupabaseClient, Session } from '@supabase/supabase-js';
import { PinProps } from '@/types';

interface TempPinData {
    x: number;
    y: number;
    pageId: string;
}

interface DocumentData {
    id?: string;
}

export const SaveTempComment = async (
    tempPinData: TempPinData | null,
    tempCommentText: string,
    session: Session | null,
    pageId: string,
    pins: PinProps[],
    documentData: DocumentData | null,
    supabase: SupabaseClient,
    setShowTempCommentBox: (show: boolean) => void,
    setTempPinData: (data: TempPinData | null) => void,
    setTempCommentText: (text: string) => void,
    loadComments: () => Promise<void>
) => {
    if (!tempPinData || !tempCommentText.trim() || !session?.user?.id || !pageId) {
        console.error('Save validation failed: Missing data for saving temporary comment.');
        return;
    }

    const nextPinNumber = pins.length > 0 ? Math.max(...pins.map(p => p.num)) + 1 : 1;
    const currentDocumentId = documentData?.id;

    if (!currentDocumentId) {
        console.error('Error: document_id is missing from PageContext/documentData for saving comment.');
        return;
    }

    try {
        const commentToInsert = {
            pos_x: tempPinData.x,
            pos_y: tempPinData.y,
            page_id: tempPinData.pageId,
            document_id: currentDocumentId,
            user_id: session.user.id,
            pin_number: nextPinNumber, // Assuming 'pin_number' is the column name
            status: 'ativo',
            content: tempCommentText.trim(), // Assuming 'content' is the column name for comment text
        };

        const { data: newComment, error: commentError } = await supabase
            .from('comments')
            .insert(commentToInsert)
            .select()
            .single();

        if (commentError || !newComment) {
            console.error('Error creating comment in utils:', JSON.stringify(commentError, null, 2), 'Comment data attempted:', commentToInsert);
            return;
        }

        // Success
        setShowTempCommentBox(false);
        setTempPinData(null);
        setTempCommentText('');
        if (loadComments) {
            await loadComments();
        }
    } catch (error) {
        console.error('Error saving pin and comment in utils:', error);
    }
};

export const CancelTempComment = (
    setShowTempCommentBox: (show: boolean) => void,
    setTempPinData: (data: TempPinData | null) => void,
    setTempCommentText: (text: string) => void
) => {
    setShowTempCommentBox(false);
    setTempPinData(null);
    setTempCommentText('');
};
