import React from 'react';
import Link from 'next/link';

const LoginHeader: React.FC = () => {
  return (
    <div className="pb-4">
      <div className="flex items-center gap-2">
        <div className="">
          <img src="logo2.png" alt="Logo Aceitei" className='w-14 h-14'/>
        </div>
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
