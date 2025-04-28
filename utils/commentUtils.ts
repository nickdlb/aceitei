import PinProps from '@/types/PinProps';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { formatISO } from 'date-fns';

export const createComment = async (
    xPercent: number,
    yPercent: number,
    pageId: string,
    documentId: string,
    pins: PinProps[],
    setPins: (pins: PinProps[] | ((prevPins: PinProps[]) => PinProps[])) => void,
    setComments: (comments: { [key: string]: string } | ((prev: { [key: string]: string }) => { [key: string]: string })) => void,
    setEditingPinId: (id: string | null) => void,
    statusFilter: 'ativo' | 'resolvido',
    setStatusFilter: (filter: 'ativo' | 'resolvido') => void,
    session: any
) => {
    if (!session?.user?.id || !pageId) return;

    try {
        if (statusFilter === 'resolvido') {
            setStatusFilter('ativo');
        }

        const pinBeingEdited = pins.find(pin => pin.id === null || pin.isEditing);
        if (pinBeingEdited) {
            console.log('A pin is currently being edited');
            return;
        }

        const { data: pageExists, error: pageError } = await createSupabaseClient
            .from('pages')
            .select('id')
            .eq('id', pageId)
            .single();

        if (pageError || !pageExists) {
            console.error('Página não encontrada:', pageError);
            return;
        }

        const { data: existingComments, error: fetchError } = await createSupabaseClient
            .from('comments')
            .select('pin_number')
            .eq('page_id', pageId)

        if (fetchError) {
            console.error('Error fetching existing comments:', fetchError);
            return;
        }

        // Find the maximum pin_number value
        const maxPinNumber = existingComments.reduce((max, comment) => Math.max(max, comment.pin_number), 0);

        // Increment the maximum value by 1
        const pin_Number = maxPinNumber + 1;

        const { data: newPinData, error } = await createSupabaseClient
            .from('comments')
            .insert([
                {
                    page_id: pageId,
                    document_id: documentId,
                    pos_x: xPercent,
                    pos_y: yPercent,
                    pin_number: pin_Number,
                    content: '',
                    user_id: session.user.id,
                    status: 'ativo'
                }
            ])
            .select();

        if (error) {
            throw error;
        }

        if (newPinData && newPinData[0]) {
            const newPin: PinProps = {
                id: newPinData[0].id,
                x: xPercent,
                y: yPercent,
                num: pin_Number,
                comment: '',
                created_at: new Date().toISOString(),
                status: 'ativo' as const,
                user_id: session.user.id,
                page_id: pageId,
                reactions: []
            };

            setPins(prevPins => [...prevPins, newPin]);
            setComments(prev => ({ ...prev, [newPin.id]: '' }));
            setEditingPinId(newPin.id);
            return newPin;
        }
    } catch (error: any) {
        console.error("Erro ao adicionar pin:", error.message);
        throw error;
    }
};

export const editComment = (
    pinId: string,
    value: string,
    setComments: (comments: { [key: string]: string } | ((prev: { [key: string]: string }) => { [key: string]: string })) => void
) => {
    setComments(prev => ({ ...prev, [pinId]: value }));
};

export interface CommentPermissions {
    canEdit: boolean;
    canDelete: boolean;
    canChangeStatus: boolean;
}

export const checkCommentPermissions = async (pin: PinProps, session: any): Promise<boolean | CommentPermissions> => {

    if (!session?.user?.id) {
        return false;
    }

    try {
        const { data: pageData, error: pageError } = await createSupabaseClient
            .from('pages')
            .select('user_id')
            .eq('id', pin.page_id)
            .single();

        if (pageError) {
            console.error('Error fetching page:', pageError);
            return false;
        }

        const isDocumentOwner = pageData?.user_id === session.user.id;

        if (!pin || !pin.id) {
            return isDocumentOwner;
        }

        const { data: commentData, error: commentError } = await createSupabaseClient
            .from('comments')
            .select('user_id')
            .eq('id', pin.id)
            .single();

        if (commentError) {

            if (commentError.code !== 'PGRST116') {
                console.error('Error fetching comment:', commentError);
            }

            return isDocumentOwner ? {
                canEdit: false,
                canDelete: true,
                canChangeStatus: true
            } : false;
        }

        const isCommentOwner = commentData?.user_id === session.user.id;

        return {
            canEdit: isCommentOwner,
            canDelete: isDocumentOwner || isCommentOwner,
            canChangeStatus: isDocumentOwner || isCommentOwner
        };
    } catch (error) {
        console.error('Unexpected error checking permissions:', error);
        return false;
    }
};

export const changeCommentStatus = async (
    pinId: string,
    pins: PinProps[],
    setPins: (pins: PinProps[] | ((prevPins: PinProps[]) => PinProps[])) => void,
    session: any,
    loadComments: () => Promise<void>
) => {
    try {
        const pin = pins.find(p => p.id === pinId);
        if (!pin) return;

        const permissions = await checkCommentPermissions(pin, session);

        if (typeof permissions === 'object' && !Array.isArray(permissions)) {
            if (!permissions.canChangeStatus) {
                alert('Você não tem permissão para alterar o status deste comentário.');
                return;
            }
        } else if (!permissions) {
            alert('Você não tem permissão para alterar o status deste comentário.');
            return;
        }

        const newStatus = pin.status === 'ativo' ? 'resolvido' : 'ativo';
        const updateData: any = { status: newStatus };

        const { error } = await createSupabaseClient
            .from('comments')
            .update(updateData)
            .eq('id', pinId);

        if (error) throw error;

        setPins(prevPins => prevPins.map(p =>
            p.id === pinId ? { ...p, status: newStatus } : p
        ));

        await loadComments();

    } catch (error: any) {
        console.error("Erro ao atualizar status:", error.message);
        alert(error.message || 'Erro ao atualizar status do comentário');
    }
};

export const saveComment = async (
    pinId: string,
    pins: PinProps[],
    comments: { [key: string]: string },
    setPins: (pins: PinProps[] | ((prevPins: PinProps[]) => PinProps[])) => void,
    setEditingPinId: (id: string | null) => void,
    loadComments: () => Promise<void>,
    setRefreshKey: (refreshKeyOrUpdater: number | ((prev: number) => number)) => void,
    session: any
) => {
    try {
        const pin = pins.find(p => p.id === pinId);
        if (!pin) return;

        const permissions = await checkCommentPermissions(pin, session);

        if (typeof permissions === 'object' && !Array.isArray(permissions)) {
            if (!permissions.canEdit) {
                alert('Você não tem permissão para editar este comentário. Apenas o autor do comentário pode editá-lo.');
                return;
            }
        } else if (!permissions) {
            alert('Você não tem permissão para editar este comentário.');
            return;
        }

        const comment = comments[pinId];
        if (!comment) return;

        const { error } = await createSupabaseClient
            .from('comments')
            .update({ content: comment })
            .eq('id', pinId);

        if (error) throw error;

        setPins(prevPins => prevPins.map(p =>
            p.id === pinId ? { ...p, comment: comment } : p
        ));

        setEditingPinId(null);

        await loadComments();
        setRefreshKey(prev => prev + 1);

    } catch (error: any) {
        console.error("Erro ao salvar comentário:", error.message);
        alert(error.message || 'Erro ao salvar comentário');
    }
};

export const deleteComment = async (
    pinId: string,
    pins: PinProps[],
    setPins: (pins: PinProps[] | ((prevPins: PinProps[]) => PinProps[])) => void,
    setComments: (comments: { [key: string]: string } | ((prev: { [key: string]: string }) => { [key: string]: string })) => void,
    setEditingPinId: (id: string | null) => void,
    setRefreshKey: (refreshKeyOrUpdater: number | ((prev: number) => number)) => void,
    session: any
) => {
    try {
        const pin = pins.find(p => p.id === pinId);
        if (!pin) return;

        const permissions = await checkCommentPermissions(pin, session);

        if (typeof permissions === 'object' && !Array.isArray(permissions)) {
            if (!permissions.canDelete) {
                alert('Você não tem permissão para excluir este comentário.');
                return;
            }
        } else if (!permissions) {
            alert('Você não tem permissão para excluir este comentário.');
            return;
        }

        const { error: reactionsError } = await createSupabaseClient
            .from('comment_reactions')
            .delete()
            .eq('comment_id', pinId);

        if (reactionsError) {
            console.error('Erro ao deletar reações do comentário:', reactionsError);
            return;
        }

        const { error } = await createSupabaseClient
            .from('comments')
            .delete()
            .eq('id', pinId);

        if (error) {
            console.error('Erro ao deletar pin:', error);
            return;
        }
        const pinToDelete = pins.find(p => p.id === pinId);
        if (!pinToDelete) {
            console.warn("Pin não encontrado para exclusão:", pinId);
            return;
        }

        const deletedNumber = pinToDelete.num || 0;

        setPins(prevPins => {
            return prevPins
                .filter(pin => pin.id !== pinId)
        });

        setComments(prev => {
            const newComments = { ...prev };
            delete newComments[pinId];
            return newComments;
        });

        setEditingPinId(null);
        setRefreshKey(prev => prev + 1);

        if (pins.length === 1) {
            setPins([]);
        }
    } catch (error) {
        console.error("Erro ao processar exclusão do pin:", error);
    }
};
