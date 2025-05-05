import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '@/utils/uploadImage';
import { useAuth } from '../../common/auth/AuthProvider';
import { UploadCloud } from 'lucide-react';
import MultipleUploadModal from './MultipleUploadModal';
import { supabase } from '@/utils/supabaseClient';

export interface UploadZoneProps {
  onUploadSuccess: (data: any) => void;
}

export const UploadZone = ({ onUploadSuccess }: UploadZoneProps) => {
  const { session } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const handleUpload = async (files: File[], combine: boolean = false) => {
    if (!session?.user?.id) return;

    try {
      if (combine) {
        const { data: document, error: documentError } = await supabase
          .from('documents')
          .insert({ title: 'Documento Combinado', user_id: session.user.id })
          .select()
          .single();

        if (documentError) throw documentError;

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;

          const { error: storageError } = await supabase.storage
            .from('images')
            .upload(fileName, file);

          if (storageError) {
            console.error('Erro no upload da imagem:', storageError);
            continue;
          }

          const { error: pageError } = await supabase
            .from('pages')
            .insert({
              image_url: fileName,
              imageTitle: file.name,
              document_id: document.id,
              page_number: i + 1,
              user_id: session.user.id,
            });

          if (pageError) {
            console.error('Erro ao criar página:', pageError);
            await supabase.storage.from('images').remove([fileName]);
          }
        }

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

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 1) {
        setPendingFiles(acceptedFiles);
        setShowModal(true);
      } else {
        handleUpload(acceptedFiles);
      }
    },
    [session?.user?.id]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`relative group flex flex-col items-center justify-cenwter min-h-[200px] w-full border-2 border-dashed rounded-lg ${isDragActive ? 'border-acazul bg-acazul' : 'border-acazul hover:border-acazul'} transition-all duration-200 ease-in-out cursor-pointer overflow-hidden`}>
        <input {...getInputProps()} />
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-acbgbranco bg-opacity-90 transition-opacity duration-200 ${isDragActive ? 'opacity-0' : 'group-hover:opacity-0'}`}
        >
          <UploadCloud className="w-10 h-10 text-acazul mb-3" />
          <p className="text-sm font-medium text-acazul">Clique para fazer upload</p>
          <p className="text-xs text-acazul mt-1">ou arraste e solte aqui</p>
        </div>
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center  bg-acazul transition-opacity duration-200 ${isDragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <UploadCloud className="w-10 h-10 mb-3 text-acbrancohover" />
          <p className="text-sm font-medium text-acbrancohover">Solte para fazer upload</p>
          <p className="text-xs text-acbranco mt-1">ou arraste e solte aqui</p>
        </div>
      </div>
      <MultipleUploadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSeparate={async () => {
          await handleUpload(pendingFiles, false);
          setShowModal(false);
          setPendingFiles([]);
        }}
        onCombine={async () => {
          await handleUpload(pendingFiles, true);
          setShowModal(false);
          setPendingFiles([]);
        }}
        filesCount={pendingFiles.length}
      />
    </>
  );
};
