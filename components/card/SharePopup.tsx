import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

interface SharePopupProps {
  id: string;
  copySuccess: boolean;
  handleCopyClick: (id: string) => void;
  handleClosePopup: () => void;
}

export default function SharePopup({
  id,
  copySuccess,
  handleCopyClick,
  handleClosePopup
}: SharePopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow p-6 w-64">
        <h3 className="text-lg font-semibold mb-2">Compartilhar</h3>
        <p>Compartilhe o link da imagem:</p>
        <div className="flex items-center">
          <input 
            type="text" 
            value={`${window.location.origin}/${id}`} 
            className="w-full mt-2 p-2 border rounded mr-2" 
            readOnly 
          />
          <button 
            onClick={() => handleCopyClick(id)} 
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <DocumentDuplicateIcon className="h-5 w-5" />
          </button>
        </div>
        {copySuccess && <p className="text-green-500 text-sm mt-1">Link copiado!</p>}
        <button 
          onClick={handleClosePopup} 
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}