'use client'

import { uploadAndInsertFile } from '@/utils/uploadAndInsertFile';
import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { insertFileSupa } from '@/utils/insertFileSupa';

export const UploadButton = ({text}) => {
  const [FileUpload, setFileUpload] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const handleFileUpload = async (event) => {
    if (event.target.files && event.target.files[0]) {
      await uploadAndInsertFile(event.target.files[0]);
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
        // Handle error appropriately (e.g., display an error message)
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      <label className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 hover:transition cursor-pointer">
        {text}
        <input type="file" className="hidden" onChange={handleFileUpload} />
      </label>
      <form onSubmit={handleUrlSubmit} className="flex items-center">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="URL da imagem"
          className="border rounded px-2 py-1"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
          Enviar
        </button>
      </form>
    </div>
  );
};
