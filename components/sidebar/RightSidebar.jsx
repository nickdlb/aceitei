'use client'
    import React, { useState, useRef } from 'react';
    import { insertFileSupa } from '@/utils/insertFileSupa';
    import { LinkIcon } from '@heroicons/react/24/solid';
    import { supabase } from '@/utils/supabaseClient';
    import { uploadAndInsertFile } from '@/utils/uploadAndInsertFile';

    const RightSidebar = ({ onUploadComplete }) => {
      const [urlInput, setUrlInput] = useState('');
      const fileInputRef = useRef(null);
      const [uploading, setUploading] = useState(false);
      const [progress, setProgress] = useState(0);
      const [totalProgress, setTotalProgress] = useState(0);
      const [fileCount, setFileCount] = useState({ current: 0, total: 0 });
      const [fetchError, setFetchError] = useState(null);

      const isValidUrl = (url) => {
        try {
          new URL(url);
          return true;
        } catch (e) {
          return false;
        }
      };

      const handleFileUpload = async (event) => {
        if (event.target.files) {
          setUploading(true);
          setProgress(0);
          setTotalProgress(0);
          setFetchError(null);
          const files = Array.from(event.target.files);
          setFileCount({ current: 1, total: files.length });

          let uploadedBytes = 0;
          let totalBytes = 0;
          for (const file of files) {
            totalBytes += file.size;
          }

          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            await new Promise((resolve, reject) => {
              const fileNameOriginal = file.name;
              const fileExtension = fileNameOriginal.split('.').pop();
              const fileNameFinal = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${Math.floor(Math.random() * 10000)}.${fileExtension}`;

              const xhr = new XMLHttpRequest();
              xhr.open('POST', `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/images/${fileNameFinal}`, true);
              xhr.setRequestHeader('Authorization', `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);
              xhr.setRequestHeader('Content-Type', file.type);

              xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                  const uploaded = uploadedBytes + event.loaded;
                  const percentCompleted = Math.round((uploaded * 100) / totalBytes);
                  setTotalProgress(percentCompleted);
                  setProgress(Math.round((event.loaded * 100) / event.total));
                }
              };

              xhr.onload = async () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                  const urlFile = `https://nokrffogsfxouxzrrkdp.supabase.co/storage/v1/object/public/images/${fileNameFinal}`;
                  try {
                    const { data } = await supabase.from('images').insert([
                      {
                        imageTitle: fileNameOriginal,
                        image_url: urlFile,
                        user_id: 'a08255eb-5731-422e-80e6-80c317d4fcb1',
                      },
                    ]).select().single();
                    uploadedBytes += file.size;
                    setFileCount(prev => ({ ...prev, current: i + 2 }));
                    resolve(true);
                    onUploadComplete(data);
                  } catch (error) {
                    console.error("Error inserting file metadata:", error);
                    reject(error);
                  }
                } else {
                  console.error("Upload failed with status:", xhr.status);
                  reject(new Error(`Upload failed with status: ${xhr.status}`));
                }
              };

              xhr.onerror = () => {
                console.error("Upload failed");
                reject(new Error("Upload failed"));
              };

              xhr.send(file);
            });
          }

          setUploading(false);
          setProgress(0);
          setTotalProgress(0);
        }
      };


      const handleUrlSubmit = async (event) => {
        event.preventDefault();
        if (urlInput) {
          if (!isValidUrl(urlInput)) {
            console.error("Invalid URL provided");
            setFetchError("Invalid URL provided");
            return;
          }
          setUploading(true);
          setProgress(0);
          setTotalProgress(0);
          setFileCount({ current: 1, total: 1 });
          setFetchError(null);
          try {
            const response = await fetch(urlInput);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const file = new File([blob], 'image.jpg', { type: blob.type });
            
            await new Promise(async (resolve, reject) => {
              const fileNameOriginal = file.name;
              const fileExtension = fileNameOriginal.split('.').pop();
              const fileNameFinal = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${Math.floor(Math.random() * 10000)}.${fileExtension}`;

              const xhr = new XMLHttpRequest();
              xhr.open('POST', `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/images/${fileNameFinal}`, true);
              xhr.setRequestHeader('Authorization', `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);
              xhr.setRequestHeader('Content-Type', file.type);

              xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                  const percentCompleted = Math.round((event.loaded * 100) / event.total);
                  setTotalProgress(percentCompleted);
                  setProgress(Math.round((event.loaded * 100) / event.total));
                }
              };

              xhr.onload = async () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                  const urlFile = `https://nokrffogsfxouxzrrkdp.supabase.co/storage/v1/object/public/images/${fileNameFinal}`;
                  try {
                    const { data } = await supabase.from('images').insert([
                      {
                        imageTitle: fileNameOriginal,
                        image_url: urlFile,
                        user_id: 'a08255eb-5731-422e-80e6-80c317d4fcb1',
                      },
                    ]).select().single();
                    setFileCount(prev => ({ ...prev, current: 2 }));
                    resolve(true);
                    onUploadComplete(data);
                  } catch (error) {
                    console.error("Error inserting file metadata:", error);
                    reject(error);
                  }
                } else {
                  console.error("Upload failed with status:", xhr.status);
                  reject(new Error(`Upload failed with status: ${xhr.status}`));
                }
              };

              xhr.onerror = () => {
                console.error("Upload failed");
                reject(new Error("Upload failed"));
              };

              xhr.send(file);
            });
          } catch (error) {
            console.error('Error uploading from URL:', error);
            setFetchError(error.message || "Failed to fetch from URL");
          } finally {
            setUploading(false);
            setProgress(0);
            setTotalProgress(0);
            setFileCount({ current: 0, total: 0 });
          }
        }
      };

      const handleDragOver = (event) =>
        event.preventDefault();

      const handleDrop = async (event) => {
        event.preventDefault();
        if (event.dataTransfer.files) {
          setUploading(true);
          setProgress(0);
          setTotalProgress(0);
          setFetchError(null);
          const files = Array.from(event.dataTransfer.files);
          setFileCount({ current: 1, total: files.length });

          let uploadedBytes = 0;
          let totalBytes = 0;
          for (const file of files) {
            totalBytes += file.size;
          }

          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            await new Promise((resolve, reject) => {
              const fileNameOriginal = file.name;
              const fileExtension = fileNameOriginal.split('.').pop();
              const fileNameFinal = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${Math.floor(Math.random() * 10000)}.${fileExtension}`;

              const xhr = new XMLHttpRequest();
              xhr.open('POST', `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/images/${fileNameFinal}`, true);
              xhr.setRequestHeader('Authorization', `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);
              xhr.setRequestHeader('Content-Type', file.type);

              xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                  const uploaded = uploadedBytes + event.loaded;
                  const percentCompleted = Math.round((uploaded * 100) / totalBytes);
                  setTotalProgress(percentCompleted);
                  setProgress(Math.round((event.loaded * 100) / event.total));
                }
              };

              xhr.onload = async () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                  const urlFile = `https://nokrffogsfxouxzrrkdp.supabase.co/storage/v1/object/public/images/${fileNameFinal}`;
                  try {
                    const { data } = await supabase.from('images').insert([
                      {
                        imageTitle: fileNameOriginal,
                        image_url: urlFile,
                        user_id: 'a08255eb-5731-422e-80e6-80c317d4fcb1',
                      },
                    ]).select().single();
                    uploadedBytes += file.size;
                    setFileCount(prev => ({ ...prev, current: i + 2 }));
                    resolve(true);
                    onUploadComplete(data);
                  } catch (error) {
                    console.error("Error inserting file metadata:", error);
                    reject(error);
                  }
                } else {
                  console.error("Upload failed with status:", xhr.status);
                  reject(new Error(`Upload failed with status: ${xhr.status}`));
                }
              };

              xhr.onerror = () => {
                console.error("Upload failed");
                reject(new Error("Upload failed"));
              };

              xhr.send(file);
            });
          }

          setUploading(false);
          setProgress(0);
          setTotalProgress(0);
        }
      };

      const handleBrowseClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      };

      return (
        <div className="w-[356px] h-screen bg-white p-4 flex flex-col items-center justify-center">

          <h2 className="text-xl font-semibold mb-4 text-center">Arraste e solte imagens, vídeos, PDFs e mais</h2>
          <div
            className="border-2 border-dashed border-gray-400 rounded-md p-10 flex flex-col items-center justify-center mb-4 cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848 3.75 3.75 0 01-1.5 5.064m-3-3.75l-3 3m1.5-1.5h.008" />
            </svg>
            <p className="text-gray-500 mt-2 text-center">
              Suporta: JPG, JPEG, PNG, SVG, BMP, GIF, PDF, PSD, AI, EPS, TIFF, RTF, TXT, DOCX, PAGES, ODT, PPTX, ODP, KEY, MP4, WMV, AVI, MOV
            </p>
          </div>
          <div className="flex flex-col items-center justify-center mb-4 w-full">
            <span className="text-gray-500 mb-2 text-center">OU</span>
            <button
              onClick={handleBrowseClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mb-4 h-10 w-full"
            >
              Procurar no dispositivo
            </button>
            <form onSubmit={handleUrlSubmit} className="flex items-center w-full">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Insira uma URL"
                className="border rounded px-2 py-1 h-10 rounded-r-none w-full"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded h-10 flex items-center gap-1 rounded-l-none">
                <LinkIcon className="h-4 w-4" />
                Enviar
              </button>
            </form>
          </div>
          <input type="file" className="hidden" onChange={handleFileUpload} ref={fileInputRef} multiple />
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 relative">
              <div
                className="bg-blue-600 h-2.5 rounded-full absolute top-0 left-0"
                style={{ width: `${totalProgress}%` }}
              >
              </div>
              <span
                className="absolute text-xs text-gray-700 bottom-[-20px] left-0"
              >
                {fileCount.current} de {fileCount.total}
              </span>
            </div>
          )}
          {fetchError && <p className="text-red-500 mt-2">{fetchError}</p>}
        </div>
      );
    };

    export default RightSidebar;
