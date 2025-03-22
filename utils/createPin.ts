import { supabase } from '@/utils/supabaseClient';
import PinProps from '@/types/PinProps';

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
        const { data: pageExists, error: pageError } = await supabase
            .from('pages')
            .select('id')
            .eq('id', pageId)
            .single();

        if (pageError || !pageExists) {
            console.error('Página não encontrada:', pageError);
            return;
        }

        const pin_Number = pins.length + 1;

        const newPinData = await insertPin(
            pageId,
            xPercent,
            yPercent,
            pin_Number,
            '', // Conteúdo inicial vazio
            session.user.id
        );

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
    } catch (error) {
        console.error("Erro ao adicionar pin:", error);
        throw error;
    }
};

export const insertPin = async (
    pageId: string,
    xPercent: number,
    yPercent: number,
    pinNumber: number,
    content: string,
    userId: string
) => {
    try {
        // Verificar se a página existe
        const { data: page, error: pageError } = await supabase
            .from('pages')
            .select('id')
            .eq('id', pageId)
            .single();

        if (pageError || !page) {
            throw new Error('Página não encontrada');
        }

        // Inserir o comentário
        const { data, error } = await supabase
            .from('comments')
            .insert([
                {
                    page_id: pageId,
                    pos_x: xPercent,
                    pos_y: yPercent,
                    pin_number: pinNumber,
                    content: content,
                    user_id: userId,
                    status: 'ativo'
                }
            ])
            .select();

        if (error) {
            throw error;
        }

        return data;
    } catch (error: any) {
        console.error("Erro ao inserir pin:", error.message);
        throw error;
    }
};
