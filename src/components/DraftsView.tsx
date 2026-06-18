import { FileText, Trash2 } from 'lucide-react'
import type { Draft } from '../types'

type DraftsViewProps = {
  drafts: Draft[]
  onOpen: (draft: Draft) => void
  onDelete: (id: string) => void
}

export function DraftsView({ drafts, onOpen, onDelete }: DraftsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Drafts</h1>
        <p className="mt-1 text-sm text-slate-500">
          Structured documents saved from your workspace sessions.
        </p>
      </div>

      {drafts.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
          <FileText className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">No drafts yet</p>
          <p className="mt-1 text-xs text-slate-400">
            Organize thoughts in the workspace to save your first draft.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {drafts.map((draft) => (
            <article
              key={draft.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-200"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onOpen(draft)}
                  className="min-w-0 flex-1 text-left"
                >
                  <h3 className="truncate text-sm font-semibold text-slate-900">{draft.title}</h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500">
                    {draft.preview}
                  </p>
                  <p className="mt-3 text-[11px] text-slate-400">
                    Updated {new Date(draft.updatedAt).toLocaleString()}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(draft.id)}
                  className="rounded-lg p-2 text-slate-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                  aria-label={`Delete ${draft.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
