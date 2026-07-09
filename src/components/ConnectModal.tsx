import { Loader2, Mail, Shield, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EMAIL_INTEGRATION_IDS, type IntegrationProvider } from '../data/integrations'

type ConnectModalProps = {
  provider: IntegrationProvider | null
  open: boolean
  onClose: () => void
  onConnected: (providerId: string, account?: { email?: string }) => void
}

export function ConnectModal({ provider, open, onClose, onConnected }: ConnectModalProps) {
  const [phase, setPhase] = useState<'signin' | 'authorizing' | 'done'>('signin')
  const [email, setEmail] = useState('')

  const needsEmail = provider ? EMAIL_INTEGRATION_IDS.has(provider.id) : false
  const emailValid = !needsEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  useEffect(() => {
    if (open) {
      setPhase('signin')
      setEmail('')
    }
  }, [open, provider?.id])

  if (!open || !provider) return null

  const handleConnect = () => {
    if (!emailValid) return

    setPhase('authorizing')
    window.setTimeout(() => {
      setPhase('done')
      window.setTimeout(() => {
        onConnected(
          provider.id,
          needsEmail ? { email: email.trim() } : undefined,
        )
        onClose()
      }, 600)
    }, 1400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        data-testid="connect-modal-backdrop"
        className="absolute inset-0 bg-black/50 backdrop-blur-md dark:bg-black/70"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="glass-panel relative w-full max-w-md rounded-2xl border shadow-xl" data-testid="connect-modal">
        <div className="flex items-center justify-between border-b border-tl-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white ${provider.color}`}
            >
              {provider.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-tl-gray-900">Connect {provider.name}</p>
              <p className="text-xs text-tl-gray-500">Sign in to let ThinkLoop read context</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-tl-gray-400 hover:bg-tl-gray-100 hover:text-tl-gray-600"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          {phase === 'signin' && (
            <>
              <p className="text-sm text-tl-gray-600">
                You&apos;ll sign in with {provider.name}. ThinkLoop only accesses what you allow —
                and always asks before acting on your behalf.
              </p>

              {needsEmail && (
                <div>
                  <label htmlFor="connect-email" className="text-xs font-medium text-tl-gray-700">
                    Work email
                  </label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tl-gray-400" />
                    <input
                      id="connect-email"
                      data-testid="connect-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="tl-input w-full py-2.5 pl-10 pr-3 text-sm"
                      autoComplete="email"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-tl-gray-500">
                    We&apos;ll use your email address to personalize greetings and draft sign-offs.
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-tl-cyan-100 bg-tl-cyan-50 px-4 py-3">
                <div className="flex gap-2">
                  <Shield className="h-4 w-4 shrink-0 text-tl-cyan-500" />
                  <p className="text-xs leading-relaxed text-tl-cyan-700">
                    Human-in-the-loop: connecting a tool lets the agent <strong>propose</strong>{' '}
                    actions using that context. You approve every send, post, or update.
                  </p>
                </div>
              </div>
              <button
                type="button"
                data-testid="connect-continue"
                onClick={handleConnect}
                disabled={!emailValid}
                className="w-full rounded-xl bg-tl-brand bg-tl-brand-hover py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                Continue to {provider.name} sign-in
              </button>
            </>
          )}

          {phase === 'authorizing' && (
            <div className="flex flex-col items-center py-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-tl-purple-500" />
              <p className="mt-4 text-sm font-medium text-tl-gray-900">Authorizing access…</p>
              <p className="mt-1 text-xs text-tl-gray-500">Redirecting to {provider.name}</p>
            </div>
          )}

          {phase === 'done' && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tl-cyan-100 text-tl-cyan-500">
                <Shield className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-medium text-tl-gray-900">{provider.name} connected</p>
              <p className="mt-1 text-xs text-tl-gray-500">Agent can now read context — you still approve every action</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
