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
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 px-4 pt-[15vh] backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search ideas, drafts, summaries…"
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
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
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
            >
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                {item.type}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-700">{item.title}</p>
                <p className="text-xs text-slate-400">{item.section}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
