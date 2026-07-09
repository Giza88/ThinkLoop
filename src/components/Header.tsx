import { Bell, ChevronDown, Moon, Search, Sun, User } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import type { UserProfile } from '../types'

function initialsFromName(name: string | null): string {
  if (!name?.trim()) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}

type HeaderProps = {
  user: UserProfile
  onSearchFocus: () => void
}

export function Header({ user, onSearchFocus }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="glass-panel sticky top-0 z-20 flex items-center gap-4 border-b px-6 py-3">
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tl-gray-400" />
        <input
          type="search"
          data-testid="header-search"
          placeholder="Search ideas, drafts, summaries…"
          onFocus={onSearchFocus}
          className="tl-input w-full py-2.5 pl-10 pr-16 text-sm"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-tl-gray-200 bg-surface-raised px-1.5 py-0.5 text-[10px] font-medium text-tl-gray-400">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full border border-tl-cyan-200/80 bg-tl-cyan-50/80 px-3 py-1.5 text-xs font-medium text-tl-cyan-600 backdrop-blur-sm sm:flex dark:border-tl-cyan-300/20 dark:bg-tl-cyan-50/40 dark:text-tl-cyan-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tl-cyan-400" />
          You approve · Agent proposes
        </span>

        <button
          type="button"
          data-testid="header-theme-toggle"
          onClick={toggleTheme}
          className="rounded-xl p-2.5 text-tl-gray-500 transition-all hover:bg-tl-gray-100 hover:text-tl-gray-800 dark:hover:bg-tl-gray-200/10"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          type="button"
          data-testid="header-notifications"
          className="relative rounded-xl p-2.5 text-tl-gray-500 transition-all hover:bg-tl-gray-100 hover:text-tl-gray-800 dark:hover:bg-tl-gray-200/10"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-tl-purple-400 ring-2 ring-surface" />
        </button>

        <button
          type="button"
          data-testid="header-user"
          className="flex items-center gap-2 rounded-xl border border-tl-gray-200/80 bg-surface/60 px-2 py-1.5 transition-all hover:border-tl-purple-200/60 hover:bg-surface-raised"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tl-brand shadow-tl-brand text-xs font-semibold text-white">
            {user.displayName ? (
              initialsFromName(user.displayName)
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          <span className="hidden text-sm font-medium text-tl-gray-700 md:block">
            {user.displayName ?? 'Your account'}
          </span>
          <ChevronDown className="hidden h-4 w-4 text-tl-gray-400 md:block" />
        </button>
      </div>
    </header>
  )
}
