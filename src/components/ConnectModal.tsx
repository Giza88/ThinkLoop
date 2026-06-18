import { Loader2, Shield, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { IntegrationProvider } from '../data/integrations'

type ConnectModalProps = {
  provider: IntegrationProvider | null
  open: boolean
  onClose: () => void
  onConnected: (providerId: string) => void
}

export function ConnectModal({ provider, open, onClose, onConnected }: ConnectModalProps) {
  const [phase, setPhase] = useState<'signin' | 'authorizing' | 'done'>('signin')

  useEffect(() => {
    if (open) setPhase('signin')
  }, [open, provider?.id])

  if (!open || !provider) return null

  const handleConnect = () => {
    setPhase('authorizing')
    window.setTimeout(() => {
      setPhase('done')
      window.setTimeout(() => {
        onConnected(provider.id)
        onClose()
      }, 600)
    }, 1400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white ${provider.color}`}
            >
              {provider.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Connect {provider.name}</p>
              <p className="text-xs text-slate-500">Sign in to let ThinkLoop read context</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          {phase === 'signin' && (
            <>
              <p className="text-sm text-slate-600">
                You&apos;ll sign in with {provider.name}. ThinkLoop only accesses what you allow —
                and always asks before acting on your behalf.
              </p>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <div className="flex gap-2">
                  <Shield className="h-4 w-4 shrink-0 text-emerald-600" />
                  <p className="text-xs leading-relaxed text-emerald-800">
                    Human-in-the-loop: connecting a tool lets the agent <strong>propose</strong>{' '}
                    actions using that context. You approve every send, post, or update.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleConnect}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Continue to {provider.name} sign-in
              </button>
            </>
          )}

          {phase === 'authorizing' && (
            <div className="flex flex-col items-center py-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-4 text-sm font-medium text-slate-900">Authorizing access…</p>
              <p className="mt-1 text-xs text-slate-500">Redirecting to {provider.name}</p>
            </div>
          )}

          {phase === 'done' && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Shield className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-900">{provider.name} connected</p>
              <p className="mt-1 text-xs text-slate-500">Agent can now read context — you still approve every action</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
