import { Icon } from '../Icon'

export function Header() {
  return (
    <header className="flex items-center gap-4 border-b border-tl-gray-200 bg-white px-6 py-3">
      <div className="relative flex-1">
        <Icon
          name="search"
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tl-gray-400"
        />
        <input
          type="search"
          placeholder="Search ideas, drafts, summaries"
          className="w-full rounded-xl border border-tl-gray-200 bg-tl-gray-50 py-2.5 pl-10 pr-16 text-sm text-tl-gray-700 outline-none placeholder:text-tl-gray-400 focus:border-tl-blue focus:ring-1 focus:ring-tl-blue"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-tl-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-tl-gray-400">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Human-led · AI-assisted
      </div>

      <button
        type="button"
        className="rounded-lg p-2 text-tl-gray-500 hover:bg-tl-gray-100"
        aria-label="Toggle dark mode"
      >
        <Icon name="moon" size={18} />
      </button>

      <button
        type="button"
        className="relative rounded-lg p-2 text-tl-gray-500 hover:bg-tl-gray-100"
        aria-label="Notifications"
      >
        <Icon name="bell" size={18} />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-green-500" />
      </button>

      <button
        type="button"
        className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-tl-gray-100"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tl-blue text-xs font-semibold text-white">
          AM
        </div>
        <span className="text-sm font-medium text-tl-gray-700">Alex Morgan</span>
        <Icon name="chevronDown" size={14} className="text-tl-gray-400" />
      </button>
    </header>
  )
}
