import { useState, useEffect } from 'react';
import { Pin } from '@/types/Pin';
import { supabase } from '@/utils/supabaseClient';
import loadPins from '@/utils/loadPins';
import { insertPin } from '@/utils/insertPinSupa';
import { deletePin } from '@/utils/deletePin';
import { Comment } from '@/types/Document';

interface PageWithDocument {
    documents: {
        user_id: string;
    };
}

export const usePins = (pageId: string, session: any) => {
    const [pins, setPins] = useState<Pin[]>([]);
    const [editingPinId, setEditingPinId] = useState<string | null>(null);
    const [comments, setComments] = useState<{ [key: string]: string }>({});
    const [parentComments, setParentComments] = useState<{ [key: string]: Comment[] }>({});
    const [statusFilter, setStatusFilter] = useState<'ativo' | 'resolvido'>('ativo');
    const [refreshKey, setRefreshKey] = useState(0);
    const [draggingPin, setDraggingPin] = useState<Pin | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const [pendingClick, setPendingClick] = useState<{ x: number, y: number } | null>(null);
    // Adicionar o estado loadAttempts
    const [loadAttempts, setLoadAttempts] = useState(0);

    useEffect(() => {
        const fetchPins = async () => {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('page_id', pageId);

            if (error) {
                console.error('Error fetching pins:', error);
                return;
            }

            setPins(data);
        };

        fetchPins();
    }, [pageId]);

    useEffect(() => {
        const loadPins = async () => {
            if (pageId) {
                try {
                    console.log('Loading pins, attempt:', loadAttempts + 1);
                    const query = supabase
                        .from('comments')
                        .select(`
                            id,
                            content,
                            pos_x,
                            pos_y,
                            pin_number,
                            status,
                            created_at,
                            user_id,
                            page_id
                        `)
                        .eq('page_id', pageId)
                        .order('pin_number', { ascending: true });

                    const { data: commentsData, error } = await query;

                    if (error) {
                        console.error('Error loading comments:', error);
                        console.error('Error details:', error.message, error.stack);
                        throw error;
                    }

                    const pinsData = commentsData?.map(comment => ({
                        id: comment.id,
                        x: comment.pos_x,
                        y: comment.pos_y,
                        num: comment.pin_number,
                        comment: comment.content,
                        created_at: comment.created_at,
                        status: comment.status,
                        user_id: comment.user_id,
                        page_id: comment.page_id
                    }));

                    setPins(pinsData || []);
                    
                    // Garantir que o conteúdo dos comentários seja definido corretamente
                    const commentState = commentsData?.reduce((acc, comment) => ({
                        ...acc,
                        [comment.id]: comment.content || ''
                    }), {} as { [key: string]: string });

                    setComments(commentState || {});
                    
                    // Verificar se há comentários sem conteúdo e tentar novamente se necessário
                    const hasEmptyComments = commentsData?.some(comment => 
                        comment.content === undefined || comment.content === null
                    );
                    
                    if (hasEmptyComments && loadAttempts < 3) {
                        setTimeout(() => {
                            setLoadAttempts(prev => prev + 1);
                        }, 1000);
                    }
                } catch (error: any) {
                    console.error('Error loading comments:', error);
                    console.error('Error details:', error.message, error.stack);
                }
            }
        };

        loadPins();
    }, [pageId, refreshKey, loadAttempts]);

    useEffect(() => {
        const fetchUserNames = async () => {
            const names: { [key: string]: string } = {};
            for (const pin of pins) {
                if (pin.user_id) {
                    const { data } = await supabase
                        .from('anonymous_users')
                        .select('name')
                        .eq('auth_id', pin.user_id)
                        .single();
                    if (data && data.name) {
                        names[pin.id] = data.name;
                    }
                }
            }
            setUserNames(names);
        };
        fetchUserNames();
    }, [pins]);

    const handleImageClick = async (xPercent: number, yPercent: number) => {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
            setPendingClick({ x: xPercent, y: yPercent });
            setShowAuthPopup(true);
            return;
        }

        await createPin(xPercent, yPercent);
    };

    const createPin = async (xPercent: number, yPercent: number) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id || !pageId) return;

        try {
            // Se estiver na aba Resolvidos, muda para Ativos
            if (statusFilter === 'resolvido') {
                setStatusFilter('ativo');
            }

            const pinBeingEdited = pins.find(pin => pin.id === editingPinId);
            if (editingPinId && pinBeingEdited) {
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
                const newPin: Pin = {
                    id: newPinData[0].id,
                    x: xPercent,
                    y: yPercent,
                    num: pin_Number,
                    comment: '',
                    created_at: new Date().toISOString(),
                    status: 'ativo' as const,
                    user_id: session.user.id,
                    page_id: pageId
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

    const checkPermissions = async (pin: Pin) => {
        if (!session?.user?.id) {
          // Se não houver usuário na sessão, não tem permissão.
          return { isDocumentOwner: false, isCommentOwner: false, hasPermission: false };
        }
      
        // 1. Busque o documento (página) no Supabase
        const { data: documentData, error: documentError } = await supabase
          .from('pages')
          .select('user_id')
          .eq('id', pin.page_id)  // Certifique-se que "id" é a chave primária da página
          .single();
      
        if (documentError) {
          console.error("Erro ao buscar o documento:", documentError);
          throw documentError;
        }
      
        const isDocumentOwner = documentData?.user_id === session.user.id;
      
        // 2. Busque o pin (comentário) no Supabase
        const { data: pinData, error: pinError } = await supabase
          .from('comments')
          .select('user_id')
          .eq('id', pin.id)
          .single();
      
        if (pinError) {
          console.error("Erro ao buscar o pin:", pinError);
          throw pinError;
        }
      
        const isCommentOwner = pinData?.user_id === session.user.id;
      
        // Se o usuário for dono do documento ou do comentário, ele tem permissão.
        const hasPermission = isDocumentOwner || isCommentOwner;
      
        return { isDocumentOwner, isCommentOwner, hasPermission };
      };
      

    // Ajustar handleStatusChange
    const handleStatusChange = async (pinId: string) => {
        try {
            await checkPermissions(pins.find(p => p.id === pinId) as Pin);

            const pin = pins.find(p => p.id === pinId);
            if (!pin) return;

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

    // Função auxiliar para recarregar comentários - melhorada
    const loadComments = async () => {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select(`
                    *,
                    reactions:comment_reactions(*)
                `)
                .eq('page_id', pageId);

            if (error) throw error;

            if (data) {
                const pinsData = data.map(comment => ({
                    id: comment.id,
                    x: comment.pos_x,
                    y: comment.pos_y,
                    num: comment.pin_number,
                    comment: comment.content || '',
                    created_at: comment.created_at,
                    status: comment.status,
                    user_id: comment.user_id,
                    page_id: comment.page_id,
                    reactions: comment.reactions || []
                }));
                
                setPins(pinsData);
                
                const commentState: { [key: string]: string } = {};
                data.forEach(comment => {
                    commentState[comment.id] = comment.content || '';
                });
                setComments(commentState);
            }
        } catch (error) {
            console.error('Erro ao carregar comentários:', error);
            throw error;
        }
    };

    const handleCommentChange = (pinId: string, value: string) => {
        setComments(prev => ({ ...prev, [pinId]: value }));
    };

    // Ajustar handleCommentSave
    const handleCommentSave = async (pinId: string) => {
        try {
          const pin = pins.find(p => p.id === pinId);
          if (!pin) return;
      
          const { hasPermission } = await checkPermissions(pin);
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
      

    const handleDeletePin = async (pinId: string) => {
        try {
            await deletePin(pinId);
            const pinToDelete = pins.find(p => p.id === pinId);
            const deletedNumber = pinToDelete?.num || 0;

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
                    await supabase
                        .from('comments')
                        .update({ pin_number: pin.num - 1 })
                        .eq('id', pin.id);
                }
            }
        } catch (error) {
            console.error("Erro ao deletar pin:", error);
        }
    };

    const updatePinPosition = async (pinId: string, xPercent: number, yPercent: number) => {
        try {
            await supabase
                .from('comments')
                .update({ pos_x: xPercent, pos_y: yPercent })
                .eq('id', pinId);

            const updatedPins = await loadPins(pageId);
            if (updatedPins) {
                const pinsFormatados = updatedPins.map(pin => ({
                    id: pin.id,
                    x: pin.pos_x,
                    y: pin.pos_y,
                    num: pin.pin_number,
                    comment: pin.comment,
                    created_at: pin.created_at,
                    status: pin.status || 'ativo',
                    user_id: pin.user_id,
                    page_id: pin.page_id
                }));
                setPins(pinsFormatados);
            }
        } catch (error) {
            console.error('Erro ao atualizar posição do pin:', error);
        }
    };

    const handleAuth = async (name: string, email: string) => {
        try {
            // 1. Criar sessão anônima
            const { data: { session }, error: authError } = await supabase.auth.signInAnonymously();

            if (authError) throw authError;
            if (!session) throw new Error('Falha ao criar sessão anônima');

            // 2. Salvar informações do usuário anônimo
            const { error: userError } = await supabase
                .from('anonymous_users')
                .insert([
                    {
                        auth_id: session.user.id,
                        name: name,
                        email: email
                    }
                ]);

            if (userError) throw userError;

            // 3. Se tiver um click pendente, criar o pin
            if (pendingClick) {
                await createPin(pendingClick.x, pendingClick.y);
                setPendingClick(null);
            }

            // 4. Fechar o popup
            setShowAuthPopup(false);

        } catch (error: any) {
            console.error('Erro ao criar usuário anônimo:', error.message);
            throw new Error('Não foi possível criar o usuário. Tente novamente.');
        }
    };

    return {
        pins,
        editingPinId,
        comments,
        parentComments,
        statusFilter,
        draggingPin,
        isDragging,
        userNames,
        showAuthPopup,
        setStatusFilter,
        setEditingPinId,
        setDraggingPin,
        setIsDragging,
        handleImageClick,
        handleStatusChange,
        handleCommentChange,
        handleCommentSave,
        handleDeletePin,
        updatePinPosition,
        setShowAuthPopup,
        handleAuth,
        loadComments
    };
};
