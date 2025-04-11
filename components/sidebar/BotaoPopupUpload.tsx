'use client';

import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import RightSidebar from '@/components/sidebar/PopupUpload';

interface BotaoPopupUploadProps {
    refreshImages?: () => Promise<void>;
}

const BotaoPopupUpload = ({ refreshImages }: BotaoPopupUploadProps) => {
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

    const handleUploadComplete = useCallback(async (data: any) => {
        try {
            if (refreshImages) {
                await refreshImages();
            }
            setIsUploadDialogOpen(false);
        } catch (error) {
            console.error("Error updating images:", error);

        }
    }, [refreshImages]);

    return (
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
                <button className="absolute flex px-3 py-2 right-8 bottom-4 bg-acazul rounded-2xl text-acbrancohover hover:bg-acbrancohover hover:text-acazul">
                    <Plus className="mr-1" /> Adicionar Card
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