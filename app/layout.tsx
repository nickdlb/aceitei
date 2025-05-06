'use client'

import './globals.css'
import { ThemeProvider, ThemeInitScript } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/components/common/auth/AuthProvider'
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body>
      <GoogleTagManager gtmId="GTM-KJKW6KNQ" />
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
