import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '../api/client'
import { useToast } from './ToastContext'
import { loadTheme, saveTheme, type Theme } from '../utils/storage'
import { getErrorMessage } from '../utils/getErrorMessage'

type ResolvedTheme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const toast = useToast()
  const [theme, setThemeState] = useState<Theme>(() => loadTheme())
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(loadTheme()))

  const applyTheme = useCallback((next: Theme) => {
    const resolved = resolveTheme(next)
    document.documentElement.classList.toggle('dark', resolved === 'dark')
    setResolvedTheme(resolved)
  }, [])

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next)
      saveTheme(next)
      applyTheme(next)
      api.patchSettings({ theme: next }).catch((err) => {
        toast.error(getErrorMessage(err, 'Could not save theme'))
      })
    },
    [applyTheme, toast],
  )

  const toggleTheme = useCallback(() => {
    const next: Theme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }, [resolvedTheme, setTheme])

  useEffect(() => {
    applyTheme(theme)
  }, [applyTheme, theme])

  useEffect(() => {
    if (theme !== 'system') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [applyTheme, theme])

  useEffect(() => {
    api
      .getSettings()
      .then((settings) => {
        if (settings.theme !== theme) {
          setThemeState(settings.theme)
          saveTheme(settings.theme)
          applyTheme(settings.theme)
        }
      })
      .catch(() => {
        // API not ready yet — localStorage / inline script applies theme
      })
  }, [applyTheme, theme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      isDark: resolvedTheme === 'dark',
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
