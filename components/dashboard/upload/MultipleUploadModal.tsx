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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload de {filesCount} imagens</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex gap-4">
          <Button
            onClick={onSeparate}
            className="flex-1 flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Copy className="w-8 h-8 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              Arquivos Separados
            </span>
            <span className="text-xs text-gray-500">
              Criar um card para cada imagem
            </span>
          </Button>

          <Button
            onClick={onCombine}
            className="flex-1 flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <File className="w-8 h-8 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              Combinar Imagens
            </span>
            <span className="text-xs text-gray-500">
              Criar um único card com todas as imagens
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
