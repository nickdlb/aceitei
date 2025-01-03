import { DeleteFile } from '@/utils/deleteFile';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function DeleteCardButton({ id }) {
  const handleDeleteFile = async () => {
    await DeleteFile(id);
    console.log('Arquivo Removido');
  };

  return (
    <button className="bg-transparent hover:bg-red-100 p-1 rounded-full" onClick={handleDeleteFile}>
      <TrashIcon className="h-4 w-4 text-black" /> {/* Added text-black */}
    </button>
  );
}
