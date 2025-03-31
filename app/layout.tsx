import { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { ThemeProvider, ThemeInitScript } from '@/contexts/ThemeContext'

export const metadata: Metadata = {
  title: 'Aceitei',
  description: "Startup Ag DLB"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className="vsc-initialized">
        <ThemeInitScript />
        <ThemeProvider storageKey="aceitei-theme">
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
