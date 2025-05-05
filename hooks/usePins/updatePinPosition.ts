import { supabase } from '@/utils/supabaseClient';
import { PinProps } from '@/types';
import { Dispatch, SetStateAction } from 'react';

export const updatePinPosition = async (pinId: string, xPercent: number, yPercent: number, pins: PinProps[], setPins: Dispatch<SetStateAction<PinProps[]>>, loadComments: () => Promise<void>) => {
    try {
        const currentPin = pins.find(pin => pin.id === pinId);
        if (!currentPin) {
            console.error('Pin não encontrado:', pinId);
            return;
        }
        await supabase
            .from('comments')
            .update({ pos_x: xPercent, pos_y: yPercent })
            .eq('id', pinId);
        setPins(prevPins => prevPins.map(pin =>
            pin.id === pinId
                ? { ...pin, x: xPercent, y: yPercent }
                : pin
        ));
        await loadComments();
    } catch (error) {
        console.error('Erro ao atualizar posição do pin:', error);
    }
};
