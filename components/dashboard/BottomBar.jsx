import React from 'react';
    import { UploadButton } from './UploadButton';
    import { PlusIcon } from '@heroicons/react/24/outline';

    const BottomBar = () => {
      return (
        <div className="flex items-center bg-white px-4 py-2 w-full pt-4 pb-4 border-t border-[#E5E7EB]">
          <UploadButton text={<PlusIcon className="h-6 w-6" />} />
        </div>
      );
    };

    export default BottomBar;
