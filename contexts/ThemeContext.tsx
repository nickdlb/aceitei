'use client'

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  ReactNode,
} from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextProps {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  logo: string
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'ui-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [logo, setLogo] = useState<string>('')

  useEffect(() => {
    // Inicializa tema com preferência do sistema ou localStorage
    try {
      const storedTheme = localStorage.getItem(storageKey)
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialTheme: Theme = storedTheme === 'light' || storedTheme === 'dark'
        ? storedTheme
        : systemPrefersDark ? 'dark' : 'light'

      setThemeState(initialTheme)
    } catch (e) {
      console.error('Error initializing theme', e)
      setThemeState(defaultTheme)
    }
  }, [])

  useEffect(() => {
    // Aplica tema ao <html>
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)

    try {
      localStorage.setItem(storageKey, theme)
    } catch (e) {
      console.error('Error saving theme to localStorage', e)
    }

    // Atualiza logo de acordo com o tema
    setLogo(theme === 'dark' ? '/logo-feedybacky-white.png' : '/logo-feedybacky-dark.png')
  }, [theme, storageKey])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  const value = {
    theme,
    setTheme,
    toggleTheme,
    logo,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeInitScript = ({ storageKey = 'ui-theme' }) => {
  const script = `
    (function() {
      try {
        const storedTheme = localStorage.getItem('${storageKey}');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let theme = storedTheme || (prefersDark ? 'dark' : 'light');
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        console.error('Error applying initial theme', e);
      }
    })();
  `
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
