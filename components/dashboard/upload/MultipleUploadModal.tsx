import { DocumentDuplicateIcon, DocumentIcon } from '@heroicons/react/24/outline';
import MultipleUploadModalProps from '@/types/MultipleUploadModalProps';

export default function MultipleUploadModal({
    isOpen,
    onClose,
    onSeparate,
    onCombine,
    filesCount
}: MultipleUploadModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose} />

            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                        Upload de {filesCount} imagens
                    </h3>

                    <div className="mt-4 flex gap-4">
                        <button
                            onClick={onSeparate}
                            className="flex-1 flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                            <DocumentDuplicateIcon className="w-8 h-8 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">Arquivos Separados</span>
                            <span className="text-xs text-gray-500">Criar um card para cada imagem</span>
                        </button>

                        <button
                            onClick={onCombine}
                            className="flex-1 flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                            <DocumentIcon className="w-8 h-8 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">Combinar Imagens</span>
                            <span className="text-xs text-gray-500">Criar um único card com todas as imagens</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 