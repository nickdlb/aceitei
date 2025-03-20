import { supabase } from '@/utils/supabaseClient';
import PinProps from '@/types/PinProps';
import { Dispatch, SetStateAction } from 'react';

export const updatePinPosition = async (pinId: string, xPercent: number, yPercent: number, pins: PinProps[], setPins: Dispatch<SetStateAction<PinProps[]>>, loadComments: () => Promise<void>) => {
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
