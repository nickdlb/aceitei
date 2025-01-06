import { DeleteFile } from '@/utils/deleteFile';
    import { TrashIcon } from '@heroicons/react/24/outline';
    
    export default function DeleteCardButton({ id, onDelete }) {
      const handleDeleteFile = async () => {
        try {
          await DeleteFile(id);
          onDelete(id);
          console.log('Arquivo Removido');
        } catch (error) {
          console.error("Erro ao deletar card:", error);
        }
      };
    
      return (
        <button className="bg-transparent hover:bg-red-100 p-1 rounded-full" onClick={handleDeleteFile}>
          <TrashIcon className="h-4 w-4 text-black" />
        </button>
      );
    }
