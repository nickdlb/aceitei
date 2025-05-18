import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '@/utils/uploadImage';
import { useAuth } from '../../common/auth/AuthProvider';
import MultipleUploadModal from './MultipleUploadModal';
import { UploadCloud } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';

const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9-.]/g, '-').replace(/ /g, '-');
};

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
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const data = await uploadImage(files, session.user.id, files[0].name, true);
      if (data) {
        onUploadSuccess(data);
        await refreshImages();
      }
    } catch (err) {
      const error = err as Error;
      console.error('Erro no combineImages:', error.message);
    } finally {
      setLoading(false); 
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
          // Optimistic UI update for non-PDF files
          if (!session?.user?.id) continue;

          // 1. Create document optimistically
          const { data: docData, error: docError } = await supabase
            .from('documents')
            .insert({ title: file.name, user_id: session.user.id, type: file.type.startsWith('image/') ? 'image' : 'file' })
            .select()
            .single();

          if (docError || !docData) {
            console.error('Error creating document optimistically for:', file.name, docError);
            continue; // Skip to next file on error
          }

          // 2. Create page with placeholder optimistically
          const placeholderImageUrl = '/feedybacky-bg-card.jpg'; // Generic placeholder
          const { data: initialPage, error: initialPageError } = await supabase
            .from('pages')
            .insert({
              document_id: docData.id,
              user_id: session.user.id,
              page_number: 1,
              imageTitle: file.name,
              image_url: placeholderImageUrl,
            })
            .select()
            .single();

          if (initialPageError || !initialPage) {
            console.error('Error creating initial page with placeholder for:', file.name, initialPageError);
            await supabase.from('documents').delete().eq('id', docData.id); // Rollback document
            continue; // Skip to next file
          }

          // 3. Call onUploadSuccess for instant card
          const optimisticPageData = [{
            ...initialPage,
            documents: { id: docData.id, title: docData.title, created_at: docData.created_at, user_id: docData.user_id, url: docData.url, type: docData.type }
          }];
          onUploadSuccess(optimisticPageData);
          await refreshImages();

          // 4. Upload actual file to storage and update page (async, don't block UI thread more than necessary)
          (async () => {
            try {
              const fileExt = file.name.split('.').pop();
              // Using a more robust naming to avoid collisions, e.g., based on page ID or a UUID
              const sanitizedFilename = sanitizeFilename(file.name);
              const storageFileName = `${session.user.id}/${docData.id}/${initialPage.id}-${sanitizedFilename}`;

              const { error: storageError } = await supabase.storage
                .from('files')
                .upload(storageFileName, file);

              if (storageError) {
                console.error('Error uploading actual file to storage:', file.name, storageError);
                // Placeholder remains, refreshImages might eventually show an error or broken link if not handled by card component
                return;
              }

              const { data: publicUrlData } = supabase.storage
                .from('files')
                .getPublicUrl(storageFileName);

              if (!publicUrlData || !publicUrlData.publicUrl) {
                console.error('Error getting public URL for:', storageFileName);
                return;
              }
              const actualImageUrl = publicUrlData.publicUrl;

              // 5. Update the page record with the actual image_url
              const { error: updatePageError } = await supabase
                .from('pages')
                .update({ image_url: actualImageUrl })
                .eq('id', initialPage.id);

              if (updatePageError) {
                console.error('Error updating page with actual image URL for:', file.name, updatePageError);
              } else {
                // 6. Refresh again to show the real image
                await refreshImages();
              }
            } catch (uploadAndUpdateError) {
              console.error('Error in background upload and update for:', file.name, uploadAndUpdateError);
            }
          })();
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
          acceptedFilesState.forEach((file) => handleUpload([file]));
          setIsModalOpen(false);
        }}
        onCombine={() => {
          combineImages(acceptedFilesState);
          setIsModalOpen(false);
        }}
        filesCount={acceptedFilesState.length}
      />
    </>
  );
};
