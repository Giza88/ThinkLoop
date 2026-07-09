import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client'
import { useToast } from '../context/ToastContext'
import type { SearchResult } from '../types'
import { getErrorMessage } from '../utils/getErrorMessage'

type SearchModalProps = {
  open: boolean
  onClose: () => void
  onNavigate?: (section: string) => void
}

const TYPE_LABELS: Record<SearchResult['type'], string> = {
  draft: 'Draft',
  idea: 'Idea',
  history: 'History',
}

export function SearchModal({ open, onClose, onNavigate }: SearchModalProps) {
  const toast = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const searchErrorShown = useRef(false)

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      setQuery('')
      setResults([])
      searchErrorShown.current = false
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return

    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        setResults(await api.search(query))
      } catch (err) {
        setResults([])
        if (!searchErrorShown.current) {
          searchErrorShown.current = true
          toast.error(getErrorMessage(err, 'Search is unavailable'))
        }
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query, open, toast])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-[15vh] backdrop-blur-md dark:bg-black/70">
      <div className="glass-panel w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl">
        <div className="flex items-center gap-3 border-b border-tl-gray-200/60 px-4 py-3">
          <Search className="h-4 w-4 text-tl-gray-400" />
          <input
            ref={inputRef}
            data-testid="search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
          {loading && (
            <p className="px-3 py-4 text-center text-xs text-tl-gray-400">Searching…</p>
          )}
          {!loading && query.trim() && results.length === 0 && (
            <p className="px-3 py-4 text-center text-xs text-tl-gray-400">No results found</p>
          )}
          {!loading && !query.trim() && (
            <p className="px-3 py-4 text-center text-xs text-tl-gray-400">
              Type to search drafts, ideas, and history
            </p>
          )}
          {results.map((item) => (
            <button
              key={`${item.type}-${item.id}`}
              type="button"
              data-testid={`search-result-${item.type}`}
              onClick={() => onNavigate?.(item.section)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-tl-gray-100/80 dark:hover:bg-tl-gray-200/10"
            >
              <span className="rounded-md bg-tl-gray-100 px-2 py-0.5 text-[10px] font-medium text-tl-gray-500">
                {TYPE_LABELS[item.type]}
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
