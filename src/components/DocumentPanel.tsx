import { CheckCircle2, Copy, Download, FileText, Loader2, Shield, Sparkles, XCircle } from 'lucide-react'
import type { StructuredDocument } from '../types'

type DocumentPanelProps = {
  document: StructuredDocument | null
  isOrganizing: boolean
  thoughtCount: number
  onOrganize: () => void
  onCopy: () => void
  onExport: () => void
  onApprove: () => void
  onReject: () => void
}

export function DocumentPanel({
  document,
  isOrganizing,
  thoughtCount,
  onOrganize,
  onCopy,
  onExport,
  onApprove,
  onReject,
}: DocumentPanelProps) {
  const isPending = document?.approvalStatus === 'pending'
  const isApproved = document?.approvalStatus === 'approved'
  const canExport = document && isApproved

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {document ? document.title : 'Your document will appear here'}
          </h3>
          {document && isPending && (
            <p className="mt-0.5 text-[11px] text-amber-600">Awaiting your approval</p>
          )}
          {document && isApproved && (
            <p className="mt-0.5 text-[11px] text-emerald-600">Approved — ready to export or send</p>
          )}
        </div>
        {canExport && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCopy}
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
              aria-label="Copy document"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onExport}
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
              aria-label="Export document"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {document && isPending && (
        <div className="border-b border-amber-100 bg-amber-50 px-5 py-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex gap-2">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="text-xs font-semibold text-amber-900">Agent proposal — you decide</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-amber-800">
                  AI structured this from your thoughts. Review every section, then approve or
                  reject. Nothing is saved or exported until you approve.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={onReject}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </button>
              <button
                type="button"
                onClick={onApprove}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {!document ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">Your document will appear here</p>
            <p className="mt-2 max-w-xs text-xs text-slate-400">
              Add your thoughts on the left, then click &quot;Organize into a document&quot; — the
              agent proposes a structure. You approve before anything is saved or exported.
            </p>
            <button
              type="button"
              onClick={onOrganize}
              disabled={thoughtCount === 0 || isOrganizing}
              className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOrganizing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Organizing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Organize into a document
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 space-y-5 overflow-y-auto pr-1">
              {document.sections.map((section) => (
                <div key={section.title}>
                  <h4 className="mb-2 text-sm font-semibold text-slate-900">{section.title}</h4>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-400">
                Proposed {document.generatedAt.toLocaleTimeString()}
                {isApproved && ' · Approved by you'}
              </p>
              {isApproved && (
                <button
                  type="button"
                  onClick={onOrganize}
                  disabled={isOrganizing}
                  className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50"
                >
                  {isOrganizing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Re-organize
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
