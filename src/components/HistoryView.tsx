import { CheckCircle2, Clock, Download, Sparkles, XCircle } from 'lucide-react'
import type { HistoryEntry } from '../types'

type HistoryViewProps = {
  entries: HistoryEntry[]
}

const actionLabels: Record<HistoryEntry['action'], string> = {
  organized: 'Agent proposed document',
  exported: 'Exported document',
  saved: 'Saved draft',
  approved: 'You approved proposal',
  rejected: 'You rejected proposal',
}

const actionIcons: Record<HistoryEntry['action'], typeof Sparkles> = {
  organized: Sparkles,
  exported: Download,
  saved: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
}

export function HistoryView({ entries }: HistoryViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">History</h1>
        <p className="mt-1 text-sm text-slate-500">
          A timeline of your recent workspace activity.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
          <Clock className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">No activity yet</p>
          <p className="mt-1 text-xs text-slate-400">
            Your workspace actions will show up here.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ul className="divide-y divide-slate-100">
            {entries.map((entry) => {
              const Icon = actionIcons[entry.action]
              return (
                <li key={entry.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{entry.title}</p>
                    <p className="text-xs text-slate-500">{actionLabels[entry.action]}</p>
                  </div>
                  <time className="shrink-0 text-xs text-slate-400">
                    {new Date(entry.timestamp).toLocaleString()}
                  </time>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
