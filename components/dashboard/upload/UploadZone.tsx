import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '@/utils/uploadImage';
import { useAuth } from '../../AuthProvider';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import MultipleUploadModal from './MultipleUploadModal';
import { supabase } from '@/utils/supabaseClient';
import UploadZoneProps from '@/types/UploadZoneProps';

export const UploadZone = ({ onUploadSuccess }: UploadZoneProps) => {
    const { session } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);

    const handleUpload = async (files: File[], combine: boolean = false) => {
        if (!session?.user?.id) return;

        try {
            if (combine) {
                // Criar um único documento para todas as imagens
                const { data: document, error: documentError } = await supabase
                    .from('documents')
                    .insert({
                        title: 'Documento Combinado',
                        user_id: session.user.id
                    })
                    .select()
                    .single();

                if (documentError) throw documentError;

                // Upload de todas as imagens em sequência
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Math.random()}.${fileExt}`;

                    // Upload da imagem para o storage
                    const { error: storageError } = await supabase.storage
                        .from('images')
                        .upload(fileName, file);

                    if (storageError) {
                        console.error('Erro no upload da imagem:', storageError);
                        continue;
                    }

                    // Criar página vinculada ao documento
                    const { error: pageError } = await supabase
                        .from('pages')
                        .insert({
                            image_url: fileName,
                            imageTitle: file.name,
                            document_id: document.id,
                            page_number: i + 1,
                            user_id: session.user.id
                        });

                    if (pageError) {
                        console.error('Erro ao criar página:', pageError);
                        await supabase.storage.from('images').remove([fileName]);
                    }
                }

                // Notificar sucesso apenas uma vez para o documento combinado
                const { data: firstPage } = await supabase
                    .from('pages')
                    .select('*')
                    .eq('document_id', document.id)
                    .order('page_number')
                    .limit(1)
                    .single();

                if (firstPage) {
                    onUploadSuccess(firstPage);
                }
            } else {
                // Upload separado de cada imagem
                for (const file of files) {
                    const data = await uploadImage(file, session.user.id, file.name);
                    if (data) {
                        onUploadSuccess(data);
                    }
                }
            }
        } catch (err: unknown) {
            const error = err as Error;
            console.error('Erro no upload:', error.message);
        }
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 1) {
            setPendingFiles(acceptedFiles);
            setShowModal(true);
        } else {
            handleUpload(acceptedFiles);
        }
    }, [session?.user?.id]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg']
        }
    });

    return (
        <>
            <div
                {...getRootProps()}
                className={`
                    relative group
                    flex flex-col items-center justify-center
                    min-h-[200px] w-full
                    border-2 border-dashed rounded-lg
                    ${isDragActive
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-blue-300 hover:border-blue-500'
                    }
                    transition-all duration-200 ease-in-out
                    cursor-pointer
                    overflow-hidden
                `}
            >
                <input {...getInputProps()} />
                <div className={`
                    absolute inset-0
                    flex flex-col items-center justify-center
                    bg-white bg-opacity-90
                    transition-opacity duration-200
                    ${isDragActive ? 'opacity-0' : 'group-hover:opacity-0'}
                `}>
                    <CloudArrowUpIcon className="w-10 h-10 text-blue-500 mb-3" />
                    <p className="text-sm font-medium text-blue-700">
                        Clique para fazer upload
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                        ou arraste e solte aqui
                    </p>
                </div>
                <div className={`
                    absolute inset-0
                    flex flex-col items-center justify-center
                    bg-blue-50
                    transition-opacity duration-200
                    ${isDragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}>
                    <CloudArrowUpIcon className="w-10 h-10 text-blue-600 mb-3" />
                    <p className="text-sm font-medium text-blue-700">
                        Solte para fazer upload
                    </p>
                </div>
            </div>

            <MultipleUploadModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSeparate={() => {
                    handleUpload(pendingFiles, false);
                    setShowModal(false);
                    setPendingFiles([]);
                }}
                onCombine={() => {
                    handleUpload(pendingFiles, true);
                    setShowModal(false);
                    setPendingFiles([]);
                }}
                filesCount={pendingFiles.length}
            />
        </>
    );
}; 