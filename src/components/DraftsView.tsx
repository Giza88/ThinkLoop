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
        <h1 className="text-2xl font-bold text-tl-gray-900">Drafts</h1>
        <p className="mt-1 text-sm text-tl-gray-500">
          Structured documents saved from your workspace sessions.
        </p>
      </div>

      {drafts.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-tl-gray-200 bg-surface">
          <FileText className="mb-3 h-10 w-10 text-tl-gray-300" />
          <p className="text-sm font-medium text-tl-gray-600">No drafts yet</p>
          <p className="mt-1 text-xs text-tl-gray-400">
            Organize thoughts in the workspace to save your first draft.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {drafts.map((draft) => (
            <article
              key={draft.id}
              data-testid={`draft-card-${draft.id}`}
              className="group tl-card p-5 transition-colors hover:border-tl-purple-200"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onOpen(draft)}
                  className="min-w-0 flex-1 text-left"
                >
                  <h3 className="truncate text-sm font-semibold text-tl-gray-900">{draft.title}</h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-tl-gray-500">
                    {draft.preview}
                  </p>
                  <p className="mt-3 text-[11px] text-tl-gray-400">
                    Updated {new Date(draft.updatedAt).toLocaleString()}
                  </p>
                </button>
                <button
                  type="button"
                  data-testid={`delete-draft-${draft.id}`}
                  onClick={() => onDelete(draft.id)}
                  className="rounded-lg p-2 text-tl-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
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
