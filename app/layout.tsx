import { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'Aceitei',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className='bg-gray-100 vsc-initialized'>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}