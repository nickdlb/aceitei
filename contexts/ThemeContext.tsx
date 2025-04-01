'use client' // This component uses client-side features (useState, useEffect, localStorage)

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
  defaultTheme = 'light', // Default to light if nothing else is set
  storageKey = 'ui-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Initialize state on the client only
    if (typeof window !== 'undefined') {
      try {
        const storedTheme = window.localStorage.getItem(storageKey)
        if (storedTheme === 'light' || storedTheme === 'dark') {
          return storedTheme
        }
        // Check system preference if no stored theme
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
        return prefersDark ? 'dark' : 'light'
      } catch (e) {
        console.error('Error reading theme from localStorage', e)
        return defaultTheme
      }
    }
    // Return default during SSR or if window is undefined
    return defaultTheme
  })

  useEffect(() => {
    // Apply theme class to root element and save to localStorage
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    // The theme state is always resolved to 'light' or 'dark' by the useState initializer
    // or the setTheme function, so no need to check for 'system' here.
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

// Optional: Inline script for FOUC mitigation (to be placed in <head>)
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
