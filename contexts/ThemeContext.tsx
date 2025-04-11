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
  const [theme, setThemeState] = useState<Theme>(() => {

    if (typeof window !== 'undefined') {
      try {
        const storedTheme = window.localStorage.getItem(storageKey)
        if (storedTheme === 'light' || storedTheme === 'dark') {
          return storedTheme
        }

        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
        return prefersDark ? 'dark' : 'light'
      } catch (e) {
        console.error('Error reading theme from localStorage', e)
        return defaultTheme
      }
    }

    return defaultTheme
  })

  useEffect(() => {

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    root.classList.add(theme)
    try {
      localStorage.setItem(storageKey, theme)
    } catch (e) {
      console.error('Error saving theme to localStorage', e)
    }
  }, [theme, storageKey])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }, [])

  const value = {
    theme,
    setTheme,
    toggleTheme,
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
