'use client'

    import { uploadAndInsertFile } from '@/utils/uploadAndInsertFile';
    import { useState, useRef } from 'react';
    import { PlusIcon } from '@heroicons/react/24/outline';
    import { insertFileSupa } from '@/utils/insertFileSupa';
    import { XMarkIcon } from '@heroicons/react/24/solid';
    import { LinkIcon } from '@heroicons/react/24/solid';

    export const UploadButton = ({text}) => {
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [urlInput, setUrlInput] = useState('');
      const fileInputRef = useRef(null);

      const handleFileUpload = async (event) => {
        if (event.target.files && event.target.files[0]) {
          await uploadAndInsertFile(event.target.files[0]);
          setIsModalOpen(false);
        }
      };

      const handleUrlSubmit = async (event) => {
        event.preventDefault();
        if (urlInput) {
          try {
            const response = await fetch(urlInput);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const file = new File([blob], 'image.jpg', { type: blob.type });
            await insertFileSupa(file);
            setIsModalOpen(false);
          } catch (error) {
            console.error('Error uploading from URL:', error);
          }
        }
      };

      const handleDragOver = (event) => {
        event.preventDefault();
      };

      const handleDrop = async (event) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
          await uploadAndInsertFile(event.dataTransfer.files[0]);
          setIsModalOpen(false);
        }
      };

      const handleBrowseClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      };

      const closeModal = () => {
        setIsModalOpen(false);
      };

      return (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 hover:transition cursor-pointer h-10"
          >
            <PlusIcon className="h-4 w-4" /> Enviar
          </button>
          <span className="text-gray-500">OU</span>
          <form onSubmit={handleUrlSubmit} className="flex items-center h-10">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Insira uma URL"
              className="border rounded px-2 py-1 h-full rounded-r-none"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded h-full flex items-center gap-1 rounded-l-none">
              <LinkIcon className="h-4 w-4" />
              Enviar
            </button>
          </form>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-[600px] relative">
                <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                  <XMarkIcon className="h-6 w-6" />
                </button>
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
                <div className="flex flex-col items-center justify-center mb-4">
                  <span className="text-gray-500 mb-2">OU</span>
                  <button
                    onClick={handleBrowseClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Procurar no dispositivo
                  </button>
                </div>
                <input type="file" className="hidden" onChange={handleFileUpload} ref={fileInputRef} />
              </div>
            </div>
          )}
        </div>
      );
    };
