import React from 'react';
import { UploadButton } from './UploadButton';
import { PlusIcon } from '@heroicons/react/24/outline';

const BottomBar = () => {
  return (
    <div className="flex items-center justify-center bg-white px-4 py-2 w-full">
      <UploadButton text={<PlusIcon className="h-6 w-6" />} />
    </div>
  );
};

export default BottomBar;
