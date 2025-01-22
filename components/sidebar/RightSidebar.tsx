import { UploadZone } from '../dashboard/upload/UploadZone';
import { PlusIcon } from '@heroicons/react/24/outline';

interface RightSidebarProps {
    onUploadComplete: (data: any) => void;
}

const RightSidebar = ({ onUploadComplete }: RightSidebarProps) => {
    const handleUploadSuccess = async (data: any) => {
        console.log('Upload success:', data);
        if (data && onUploadComplete) {
            await onUploadComplete(data);
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-white">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Fazer Upload</h2>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <PlusIcon className="w-6 h-6 text-gray-600" />
                </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Adicionar Imagens
                    </h3>
                    <UploadZone onUploadSuccess={handleUploadSuccess} />
                </div>
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">
                        Uploads Recentes
                    </h3>
                    {/* Lista de uploads recentes aqui */}
                </div>
            </div>
        </div>
    );
};

export default RightSidebar; 