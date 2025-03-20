import PinProps from '@/types/PinProps';
import { supabase } from '@/utils/supabaseClient';
import { checkPermissions } from '@/utils/checkPermissions';

/**
 * Handles changing the status of a pin between 'ativo' and 'resolvido'
 * @param pinId ID of the pin to change status
 * @param pins Array of pins
 * @param setPins Function to update pins state
 * @param session Current user session
 * @param loadComments Function to reload comments
 */
export const handleStatusChange = async (
    pinId: string,
    pins: PinProps[],
    setPins: (pins: PinProps[] | ((prevPins: PinProps[]) => PinProps[])) => void,
    session: any,
    loadComments: () => Promise<void>
) => {
    try {
        const pin = pins.find(p => p.id === pinId);
        if (!pin) return;

        await checkPermissions(pin, session);

        const newStatus = pin.status === 'ativo' ? 'resolvido' : 'ativo';

        const { error } = await supabase
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
