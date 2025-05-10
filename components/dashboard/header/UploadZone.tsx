import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '@/utils/uploadImage';
import { useAuth } from '../../common/auth/AuthProvider';
import MultipleUploadModal from './MultipleUploadModal';
import { UploadCloud } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';

export interface UploadZoneProps {
  onUploadSuccess: (data: any) => void;
  refreshImages: () => Promise<void>;
}

export const UploadZone = ({ onUploadSuccess, refreshImages }: UploadZoneProps) => {
  const { session } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [acceptedFilesState, setAcceptedFilesState] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const combineImages = async (files: File[]) => {
    console.log('Combining images:', files);
    if (!session?.user?.id) return;
    const data = await uploadImage(files, session.user.id, files[0].name, true);
    if (data) {
      onUploadSuccess(data);
    }
  };

  const handleUpload = async (files: File[]) => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      for (const file of files) {
        if (file.type === 'application/pdf') {
          const { data: document, error: documentError } = await supabase
            .from('documents')
            .insert({ title: file.name, user_id: session.user.id, type: 'pdf' })
            .select()
            .single();

          if (documentError) throw documentError;

          const fileExt = file.name.split('.').pop();
          const fileName = `${document.id}.${fileExt}`;
          const { data: storageData, error: storageError } = await supabase.storage
            .from('files')
            .upload(fileName, file, {
              contentType: 'application/pdf',
            });

          if (storageError) throw storageError;

          const pdfUrl = `https://nokrffogsfxouxzrrkdp.supabase.co/storage/v1/object/public/files/${fileName}`;

          const response = await fetch(`/api/pdfconverter?user_id=${session.user.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pdfUrl: pdfUrl, documentId: document.id }),
          });

          if (!response.ok) {
            throw new Error(`Failed to call /api/pdfconverter: ${response.status} ${response.statusText}`);
          }

          const responseData = await response.json();
          onUploadSuccess(responseData);
          await refreshImages();
        } else {
          const data = await uploadImage(file, session.user.id, file.name);
          if (data) {
            onUploadSuccess(data);
            await refreshImages();
          }
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Erro no upload:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 1) {
        setAcceptedFilesState(acceptedFiles);
        setIsModalOpen(true);
      } else {
        handleUpload(acceptedFiles);
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg' , '.webp'],
      'application/pdf': ['.pdf'],
    },
    multiple: true,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`relative group flex flex-col items-center justify-cenwter min-h-[200px] w-full border-2 border-dashed rounded-lg ${isDragActive ? 'border-acazul bg-acazul' : 'border-acazul hover:border-acazul'} transition-all duration-200 ease-in-out cursor-pointer overflow-hidden`}>
        <input {...getInputProps()} />
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-acbgbranco bg-opacity-90">
            <p className="text-sm font-medium text-acazul">Carregando arquivo...</p>
          </div>
        ) : (
          <>
            <div className={`absolute inset-0 flex flex-col items-center justify-center bg-acbgbranco bg-opacity-90 transition-opacity duration-200 ${isDragActive ? 'opacity-0' : 'group-hover:opacity-0'}`}>
              <UploadCloud className="w-10 h-10 text-acazul mb-3" />
              <p className="text-sm font-medium text-acazul">Clique para fazer upload</p>
              <p className="text-xs text-acazul mt-1">ou arraste e solte aqui</p>
            </div>
            <div className={`absolute inset-0 flex flex-col items-center justify-center  bg-acazul transition-opacity duration-200 ${isDragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <UploadCloud className="w-10 h-10 mb-3 text-acbrancohover" />
              <p className="text-sm font-medium text-acbrancohover">Solte para fazer upload</p>
              <p className="text-xs text-acazul mt-1">ou arraste e solte aqui</p>
            </div>
          </>
        )}
      </div>
      <MultipleUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSeparate={() => {
          console.log('Separate files');
          acceptedFilesState.forEach((file) => handleUpload([file]));
          setIsModalOpen(false);
        }}
        onCombine={() => {
          console.log('Combine files');
          combineImages(acceptedFilesState);
          setIsModalOpen(false);
        }}
        filesCount={acceptedFilesState.length}
      />
    </>
  );
};
