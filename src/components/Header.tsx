import { Bell, ChevronDown, Moon, Search, User } from 'lucide-react'

type HeaderProps = {
  onSearchFocus: () => void
}

export function Header({ onSearchFocus }: HeaderProps) {
  return (
    <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-3">
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search ideas, drafts, summaries…"
          onFocus={onSearchFocus}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-16 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          You approve · Agent proposes
        </span>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Toggle dark mode"
        >
          <Moon className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-500" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5 transition-colors hover:bg-slate-50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="hidden text-sm font-medium text-slate-700 md:block">Alex Morgan</span>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
        </button>
      </div>
    </header>
  )
}
