'use client'

    import { PlusIcon } from '@heroicons/react/24/outline';

    export const UploadButton = ({text}) => {
      return (
        <button
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 hover:transition cursor-pointer h-10"
        >
          {text}
        </button>
      );
    };
