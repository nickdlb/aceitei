import { Pin } from '@/types/Pin';
import { supabase } from '@/utils/supabaseClient';
import { deletePin as deletePinUtil } from '@/utils/deletePin';

/**
 * Handles deleting a pin and updating pin numbers
 * @param pinId ID of the pin to delete
 * @param pins Array of pins
 * @param setPins Function to update pins state
 * @param setComments Function to update comments state
 * @param setEditingPinId Function to set the currently editing pin ID
 * @param setRefreshKey Function to update refresh key
 */
export const handleDeletePin = async (
    pinId: string,
    pins: Pin[],
    setPins: (pins: Pin[] | ((prevPins: Pin[]) => Pin[])) => void,
    setComments: (comments: { [key: string]: string } | ((prev: { [key: string]: string }) => { [key: string]: string })) => void,
    setEditingPinId: (id: string | null) => void,
    setRefreshKey: (refreshKeyOrUpdater: number | ((prev: number) => number)) => void
) => {
    try {
        // Chamar a função deletePinUtil e verificar o status de sucesso
        const result = await deletePinUtil(pinId);
        
        if (!result.success) {
            console.error("Falha ao deletar pin:", result.error);
            return; // Sair da função se a exclusão falhar
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
                    const { error } = await supabase
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
