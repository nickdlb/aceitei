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
        <title>Feedybacky</title>
        <meta
          name="Feedybacky"
          content="Colete Feedback dos seus projetos de maneira fácil e rápida."
          key="desc"
        />
      </head>
      <body>
      <GoogleTagManager gtmId="GTM-KJKW6KNQ" />
        <ThemeInitScript />
        <ThemeProvider storageKey="feedybacky-theme">
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
