import { supabase } from '@/utils/supabaseClient';

export const anonymousAuth = async (
    name: string,
    email: string,
    pageId: string,
    pins: any[],
    setPins: any,
    setComments: any,
    setEditingPinId: any,
    statusFilter: any,
    setStatusFilter: any,
    pendingClick: any,
    setShowAuthPopup: any,
    handleImageClickUtil: any,
    editingPinId: string | null = null
) => {
    try {
        const { data: { session }, error: authError } = await supabase.auth.signInAnonymously();

        if (authError) throw authError;
        if (!session) throw new Error('Falha ao criar sessão anônima');

        const { error: userError } = await supabase
            .from('users')
            .update({
                nome: name,
                email: email
            })
            .eq('user_id', session.user.id);

        if (userError) throw userError;

        if (pendingClick) {
            await handleImageClickUtil(
                pendingClick.x,
                pendingClick.y,
                pageId,
                pins,
                setPins,
                setComments,
                setEditingPinId,
                statusFilter,
                setStatusFilter,
                pendingClick,
                setShowAuthPopup,
                editingPinId
            );
            setShowAuthPopup(false);
        }

        setShowAuthPopup(false);

    } catch (error: any) {
        console.error('Erro ao criar usuário anônimo:', error.message);
        throw new Error('Não foi possível criar o usuário. Tente novamente.');
    }
};
