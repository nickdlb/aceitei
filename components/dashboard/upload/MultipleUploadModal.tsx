import { Copy, File } from 'lucide-react';
import MultipleUploadModalProps from '@/types/MultipleUploadModalProps';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';

export default function MultipleUploadModal({
  isOpen,
  onClose,
  onSeparate,
  onCombine,
  filesCount,
}: MultipleUploadModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='h-min py-10'>
        <DialogHeader className=''>
          <DialogTitle>Upload de {filesCount} imagens</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={onSeparate}
            className="flex-1 flex-col justify-start h-full items-center gap-4 p-4 border-2 border-accinzafraco rounded-lg hover:border-acazul hover:bg-acazul transition-colors text-acbgpreto group"
          >
            <Copy className="size-4 group-hover:text-acbranco" />
            <span className="text-sm font-medium group-hover:text-acbranco">
              Arquivos Separados
            </span>
            <span className="text-xs group-hover:text-acbranco">
              Criar um card para cada imagem
            </span>
          </Button>
          <Button
            onClick={onCombine}
            className="flex-1 h-full flex-col justify-start items-center gap-4 p-4 border-2 border-accinzafraco rounded-lg text-acpreto hover:border-acazul hover:bg-acazul transition-colors group"
          >
            <File className="w-8 h-8 group-hover:text-acbranco" />
            <span className="text-sm font-medium group-hover:text-acbranco">
              Combinar Imagens
            </span>
            <span className="text-xs group-hover:text-acbranco">
              Criar um único card com todas as imagens
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
