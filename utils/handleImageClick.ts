import { supabase } from '@/utils/supabaseClient';
import { insertPin } from '@/utils/insertPinSupa';
import { Pin } from '@/types/Pin';

/**
 * Handles a click on an image to create a new pin
 * @param xPercent X coordinate as percentage of image width
 * @param yPercent Y coordinate as percentage of image height
 * @param pageId ID of the current page
 * @param pins Current pins on the page
 * @param setPins Function to update pins state
 * @param setComments Function to update comments state
 * @param setEditingPinId Function to set the currently editing pin ID
 * @param statusFilter Current status filter
 * @param setStatusFilter Function to update status filter
 * @param setPendingClick Function to set pending click coordinates
 * @param setShowAuthPopup Function to show authentication popup
 */
export const handleImageClick = async (
  xPercent: number, 
  yPercent: number,
  pageId: string,
  pins: Pin[],
  setPins: (pins: Pin[] | ((prevPins: Pin[]) => Pin[])) => void,
  setComments: (comments: { [key: string]: string } | ((prev: { [key: string]: string }) => { [key: string]: string })) => void,
  setEditingPinId: (id: string | null) => void,
  statusFilter: 'ativo' | 'resolvido',
  setStatusFilter: (filter: 'ativo' | 'resolvido') => void,
  setPendingClick: (click: { x: number, y: number } | null) => void,
  setShowAuthPopup: (show: boolean) => void
) => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    setPendingClick({ x: xPercent, y: yPercent });
    setShowAuthPopup(true);
    return;
  }

  await createPin(
    xPercent, 
    yPercent, 
    pageId, 
    pins, 
    setPins, 
    setComments, 
    setEditingPinId, 
    statusFilter, 
    setStatusFilter, 
    session
  );
};

/**
 * Creates a new pin at the specified coordinates
 */
const createPin = async (
  xPercent: number, 
  yPercent: number,
  pageId: string,
  pins: Pin[],
  setPins: (pins: Pin[] | ((prevPins: Pin[]) => Pin[])) => void,
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

    const pinBeingEdited = pins.find(pin => pin.id === null);
    if (pinBeingEdited) {
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
