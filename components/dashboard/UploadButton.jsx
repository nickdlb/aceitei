'use client'

import { uploadAndInsertFile } from '@/utils/uploadAndInsertFile';
import { useState } from 'react';

export const UploadButton = ({text, icon}) => {
  const [FileUpload, setFileUpload] = useState('');
  
  const handleFileUpload = async (event) => {
  uploadAndInsertFile(event.target.files[0])
  }

  return (
    <div>
      <form>
      <input id= "fileUploadButton"className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" type="file" value={FileUpload} onChange={handleFileUpload}/>
      </form>
    </div>
  )

    // return (
  //   <div className="flex items-center gap-4">
  //     <label className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-800 hover:transition cursor-pointer">
  //       <UploadIcon/>
  //       {text}
  //     </label>
  //   </div>
  // );

};
