import React from 'react';
import Link from 'next/link';

const LoginHeader: React.FC = () => {
  return (
    <div className="pb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded"></div>
        <div className="flex items-center justify-between flex-1">
          <Link href="/" className="font-medium hover:text-blue-600">
            Aceitei
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;
