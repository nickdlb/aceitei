import { supabase } from '@/utils/supabaseClient';
import PinProps from '@/types/PinProps';
import { Dispatch, SetStateAction } from 'react';

export const loadRepliesForPin = async (pinId: string, setPins: Dispatch<SetStateAction<PinProps[]>>) => {
    if (!pinId) return;

    try {
        // Fetch only the reactions for this specific pin
        const { data: reactionsData, error: reactionsError } = await supabase
            .from('comment_reactions')
            .select('*')
            .eq('comment_id', pinId);

        if (reactionsError) throw reactionsError;

        // Update only the reactions for this pin in the pins state
        setPins(prevPins => prevPins.map(pin => {
            if (pin.id === pinId) {
                return {
                    ...pin,
                    reactions: reactionsData || []
                };
            }
            return pin;
        }));

    } catch (error) {
        console.error('Error loading replies for pin:', error);
    }
};
