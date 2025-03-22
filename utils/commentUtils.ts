import PinProps from '@/types/PinProps';
import { createSupabaseClient } from '@/utils/supabaseClient';

export const createComment = async (
    xPercent: number,
    yPercent: number,
    pageId: string,
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
        // Se estiver na aba Resolvidos, muda para Ativos
        if (statusFilter === 'resolvido') {
            setStatusFilter('ativo');
        }

        // Check for any pin being edited or created
        const pinBeingEdited = pins.find(pin => pin.id === null || pin.isEditing);
        if (pinBeingEdited) {
            console.log('A pin is currently being edited');
            return;
        }

        // Verificar se a página existe
        const { data: pageExists, error: pageError } = await createSupabaseClient
            .from('pages')
            .select('id')
            .eq('id', pageId)
            .single();

        if (pageError || !pageExists) {
            console.error('Página não encontrada:', pageError);
            return;
        }

        const pin_Number = pins.length + 1;

        // Inserir o comentário
        const { data: newPinData, error } = await createSupabaseClient
            .from('comments')
            .insert([
                {
                    page_id: pageId,
                    pos_x: xPercent,
                    pos_y: yPercent,
                    pin_number: pin_Number,
                    content: '', // Conteúdo inicial vazio
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
                reactions: [] // Initialize with empty reactions array
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

/**
 * Handles changing the content of a comment
 * @param pinId ID of the pin to change comment
 * @param value New comment value
 * @param setComments Function to update comments state
 */
export const editComment = (
    pinId: string,
    value: string,
    setComments: (comments: { [key: string]: string } | ((prev: { [key: string]: string }) => { [key: string]: string })) => void
) => {
    setComments(prev => ({ ...prev, [pinId]: value }));
};

export const checkEditCommentPermissions = async (pin: PinProps, session: any) => {
    if (!session?.user?.id) {
        return { isDocumentOwner: false, isCommentOwner: false, hasPermission: false };
    }

    try {
        const { data: pageData, error: pageError } = await createSupabaseClient
            .from('pages')
            .select('user_id')
            .eq('id', pin.page_id)
            .single();

        if (pageError) {
            console.error('Error fetching page:', pageError);
            return { isDocumentOwner: false, isCommentOwner: false, hasPermission: false };
        }

        const isDocumentOwner = pageData?.user_id === session.user.id;

        if (!pin || !pin.id) {
            return { isDocumentOwner, isCommentOwner: false, hasPermission: isDocumentOwner };
        }

        const { data: commentData, error: commentError } = await createSupabaseClient
            .from('comments')
            .select('user_id')
            .eq('id', pin.id)
            .single();

        if (commentError) {
            if (commentError.code === 'PGRST116') {
                return { isDocumentOwner, isCommentOwner: false, hasPermission: isDocumentOwner };
            }
            console.error('Error fetching comment:', commentError);
            return { isDocumentOwner, isCommentOwner: false, hasPermission: isDocumentOwner };
        }

        const isCommentOwner = commentData?.user_id === session.user.id;
        const hasPermission = isDocumentOwner || isCommentOwner;

        return { isDocumentOwner, isCommentOwner, hasPermission };
    } catch (error) {
        console.error('Unexpected error checking permissions:', error);
        return { isDocumentOwner: false, isCommentOwner: false, hasPermission: false };
    }
};

/**
 * Handles changing the status of a pin between 'ativo' and 'resolvido'
 * @param pinId ID of the pin to change status
 * @param pins Array of pins
 * @param setPins Function to update pins state
 * @param session Current user session
 * @param loadComments Function to reload comments
 */

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

        await checkEditCommentPermissions(pin, session);

        const newStatus = pin.status === 'ativo' ? 'resolvido' : 'ativo';

        const { error } = await createSupabaseClient
            .from('comments')
            .update({ status: newStatus })
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

/**
 * Handles saving a comment after editing
 * @param pinId ID of the pin to save comment for
 * @param pins Array of pins
 * @param comments Object containing comments by pin ID
 * @param setPins Function to update pins state
 * @param setEditingPinId Function to set the currently editing pin ID
 * @param loadComments Function to reload comments
 * @param setRefreshKey Function to update refresh key
 * @param session Current user session
 */
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

        const { hasPermission } = await checkEditCommentPermissions(pin, session);
        if (!hasPermission) {
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

        // Atualizar o pin localmente também
        setPins(prevPins => prevPins.map(p =>
            p.id === pinId ? { ...p, comment: comment } : p
        ));

        setEditingPinId(null);

        // Forçar recarregamento completo
        await loadComments();
        setRefreshKey(prev => prev + 1);

    } catch (error: any) {
        console.error("Erro ao salvar comentário:", error.message);
        alert(error.message || 'Erro ao salvar comentário');
    }
};

/**
 * Handles deleting a pin and updating pin numbers
 * @param pinId ID of the pin to delete
 * @param pins Array of pins
 * @param setPins Function to update pins state
 * @param setComments Function to update comments state
 * @param setEditingPinId Function to set the currently editing pin ID
 * @param setRefreshKey Function to update refresh key
 */
export const deleteComment = async (
    pinId: string,
    pins: PinProps[],
    setPins: (pins: PinProps[] | ((prevPins: PinProps[]) => PinProps[])) => void,
    setComments: (comments: { [key: string]: string } | ((prev: { [key: string]: string }) => { [key: string]: string })) => void,
    setEditingPinId: (id: string | null) => void,
    setRefreshKey: (refreshKeyOrUpdater: number | ((prev: number) => number)) => void
) => {
    try {
        // First, delete related records from comment_reactions
        const { error: reactionsError } = await createSupabaseClient
            .from('comment_reactions')
            .delete()
            .eq('comment_id', pinId);

        if (reactionsError) {
            console.error('Erro ao deletar reações do comentário:', reactionsError);
            return;
        }

        // Then, delete the comment itself
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

        // Remove o pin excluído e reordena os números
        setPins(prevPins => {
            return prevPins
                .filter(pin => pin.id !== pinId)
                .map(pin => ({
                    ...pin,
                    num: pin.num > deletedNumber ? pin.num - 1 : pin.num
                }));
        });

        setComments(prev => {
            const newComments = { ...prev };
            delete newComments[pinId];
            return newComments;
        });

        setEditingPinId(null);
        setRefreshKey(prev => prev + 1);

        // Atualiza os números no banco de dados
        const updatedPins = pins.filter(pin => pin.id !== pinId);
        for (const pin of updatedPins) {
            if (pin.num > deletedNumber) {
                try {
                    const { error } = await createSupabaseClient
                        .from('comments')
                        .update({ pin_number: pin.num - 1 })
                        .eq('id', pin.id);

                    if (error) {
                        console.error("Erro ao atualizar número do pin:", error);
                    }
                } catch (updateError) {
                    console.error("Erro inesperado ao atualizar número do pin:", updateError);
                }
            }
        }
    } catch (error) {
        console.error("Erro ao processar exclusão do pin:", error);
    }
};
