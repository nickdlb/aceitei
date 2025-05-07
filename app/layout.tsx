'use client'

import './globals.css'
import { ThemeProvider, ThemeInitScript } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/components/common/auth/AuthProvider'
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head> 
        <link rel="icon" href="/favfeedybacky.ico" sizes="any"/>
        <title>Feedybacky | Colete Feedback de Projetos Facilmente</title>
        <meta name="description" content="Colete e gerencie feedback dos seus projetos de design, desenvolvimento e conteúdo de forma fácil e eficiente Feedybacky." key="desc"/>      
        <meta name="robots" content="index, follow" />
      </head>
      <body>
      <GoogleTagManager gtmId="GTM-KJKW6KNQ" />
        <ThemeInitScript storageKey="feedybacky-theme" />
        <ThemeProvider storageKey="feedybacky-theme">
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
