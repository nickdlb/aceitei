import React from 'react';
import Link from 'next/link';

const LoginHeader: React.FC = () => {
  return (
    <div className="p-4 border-b bg-white border-b-gray-300">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded"></div>
        <div className="flex items-center justify-between flex-1">
          <Link href="/" className="font-medium hover:text-blue-600">
            Aceitei
          </Link>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">Free</span>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;
