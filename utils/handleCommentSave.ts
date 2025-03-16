import { Pin } from '@/types/Pin';
import { supabase } from '@/utils/supabaseClient';
import { checkPermissions } from '@/utils/checkPermissions';

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
export const handleCommentSave = async (
    pinId: string,
    pins: Pin[],
    comments: { [key: string]: string },
    setPins: (pins: Pin[] | ((prevPins: Pin[]) => Pin[])) => void,
    setEditingPinId: (id: string | null) => void,
    loadComments: () => Promise<void>,
    setRefreshKey: (refreshKeyOrUpdater: number | ((prev: number) => number)) => void,
    session: any
) => {
    try {
        const pin = pins.find(p => p.id === pinId);
        if (!pin) return;

        const { hasPermission } = await checkPermissions(pin, session);
        if (!hasPermission) {
            alert('Você não tem permissão para editar este comentário.');
            return;
        }

        const comment = comments[pinId];
        if (!comment) return;

        const { error } = await supabase
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
