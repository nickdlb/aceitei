'use client';

import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import PopupUpload from '@/components/dashboard/header/PopupUpload';
import { useDashboardContext } from '@/contexts/DashboardContext';

const BotaoPopupUpload = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { refreshImages } = useDashboardContext();
  const handleUploadComplete = useCallback(async (data: any) => {
    try {
      await refreshImages();
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
        <PopupUpload onUploadComplete={handleUploadComplete} />
      </DialogContent>
    </Dialog>
  );
};

export default BotaoPopupUpload;
