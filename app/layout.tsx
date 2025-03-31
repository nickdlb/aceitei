import { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ImagesProvider } from '@/contexts/ImagesContext';

export const metadata: Metadata = {
  title: 'Aceitei',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className='bg-acbg vsc-initialized'>
        <AuthProvider>
          <ImagesProvider>
            {children}
          </ImagesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}