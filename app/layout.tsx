import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aceitei',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className='bg-gray-100 vsc-initialized'>{children}</body>
    </html>
  );
}
