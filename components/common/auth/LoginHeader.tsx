import React from 'react';
import Link from 'next/link';

const LoginHeader: React.FC = () => {
  return (
    <div className="pb-4">
      <div className="flex items-center gap-2">
        <div className="">
          <img src="logo2.png" alt="Logo Feedybacky" className='w-14 h-14' />
        </div>
        <div className="flex items-center justify-between flex-1">
          <Link href="/" className="font-medium hover:text-acazul">
            Feedybacky
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;
