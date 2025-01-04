'use client'
    import React, { useState, useRef } from 'react';
    import { uploadAndInsertFile } from '@/utils/uploadAndInsertFile';
    import { insertFileSupa } from '@/utils/insertFileSupa';
    import { LinkIcon } from '@heroicons/react/24/solid';

    const RightSidebar = () => {
      const [urlInput, setUrlInput] = useState('');
      const fileInputRef = useRef(null);

      const handleFileUpload = async (event) => {
        if (event.target.files) {
          const files = Array.from(event.target.files).slice(0, 10);
          for (const file of files) {
            await uploadAndInsertFile(file);
          }
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
        if (event.dataTransfer.files) {
          const files = Array.from(event.dataTransfer.files).slice(0, 10);
          for (const file of files) {
            await uploadAndInsertFile(file);
          }
        }
      };

      const handleBrowseClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      };

      return (
        <div className="w-[356px] h-screen bg-white border-l p-4 flex flex-col items-center justify-center">
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
        </div>
      );
    };

    export default RightSidebar;
