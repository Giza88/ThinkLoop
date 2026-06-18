import { Search, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

type SearchModalProps = {
  open: boolean
  onClose: () => void
}

const SEARCH_ITEMS = [
  { type: 'Idea', title: 'Personalized onboarding flow', section: 'Brainstorm' },
  { type: 'Draft', title: 'Q3 product strategy notes', section: 'Drafts' },
  { type: 'Summary', title: 'Competitor analysis — June', section: 'Summaries' },
  { type: 'Research', title: 'User interview insights', section: 'Research' },
]

export function SearchModal({ open, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-[15vh] backdrop-blur-md dark:bg-black/70">
      <div className="glass-panel w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl">
        <div className="flex items-center gap-3 border-b border-tl-gray-200/60 px-4 py-3">
          <Search className="h-4 w-4 text-tl-gray-400" />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search ideas, drafts, summaries…"
            className="flex-1 bg-transparent text-sm text-tl-gray-800 outline-none placeholder:text-tl-gray-400"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-tl-gray-400 transition-colors hover:bg-tl-gray-100 hover:text-tl-gray-600 dark:hover:bg-tl-gray-200/10"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto p-2">
          {SEARCH_ITEMS.map((item) => (
            <button
              key={item.title}
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-tl-gray-100/80 dark:hover:bg-tl-gray-200/10"
            >
              <span className="rounded-md bg-tl-gray-100 px-2 py-0.5 text-[10px] font-medium text-tl-gray-500">
                {item.type}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-tl-gray-700">{item.title}</p>
                <p className="text-xs text-tl-gray-400">{item.section}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
