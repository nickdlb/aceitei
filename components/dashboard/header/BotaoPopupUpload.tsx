'use client';

import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/common/ui/dialog';
import RightSidebar from '@/components/dashboard/sidebar/PopupUpload';
import { useGalleryContext } from '@/contexts/GalleryContext';

const BotaoPopupUpload = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { refreshImages } = useGalleryContext(); // ✅ agora vindo do contexto

  const handleUploadComplete = useCallback(async (data: any) => {
    try {
      await refreshImages(); // ✅ direto do contexto
      setIsUploadDialogOpen(false);
    } catch (error) {
      console.error("Error updating images:", error);
    }
  }, [refreshImages]);

  return (
    <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center px-2 py-1 text-sm bg-acazul rounded-2xl text-acbrancohover hover:bg-acbrancohover hover:text-acazul">
          <Plus className="size-5" /> Adicionar Card
        </button>
      </DialogTrigger>
      <DialogContent className='!bg-acbgpreto border-none'>
        <DialogTitle className='sr-only'>Popup Upload Card</DialogTitle>
        <RightSidebar onUploadComplete={handleUploadComplete} />
      </DialogContent>
    </Dialog>
  );
};

export default BotaoPopupUpload;
