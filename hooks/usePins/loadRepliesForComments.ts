import { createSupabaseClient } from '@/utils/supabaseClient';
import { PinProps } from '@/types';
import { Dispatch, SetStateAction } from 'react';

export const loadRepliesForComments = async (pinId: string, setPins: Dispatch<SetStateAction<PinProps[]>>) => {
    if (!pinId) return;

    try {
        const { data: reactionsData, error: reactionsError } = await createSupabaseClient
            .from('comment_reactions')
            .select('*')
            .eq('comment_id', pinId);

        if (reactionsError) throw reactionsError;

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
