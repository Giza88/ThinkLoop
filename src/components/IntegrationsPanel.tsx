import { Link2, Plug, Unplug } from 'lucide-react'
import { useState } from 'react'
import { INTEGRATION_PROVIDERS, type IntegrationProvider } from '../data/integrations'
import { ConnectModal } from './ConnectModal'

type IntegrationsPanelProps = {
  connectedIds: string[]
  onConnect: (providerId: string) => void
  onDisconnect: (providerId: string) => void
  compact?: boolean
}

export function IntegrationsPanel({
  connectedIds,
  onConnect,
  onDisconnect,
  compact = false,
}: IntegrationsPanelProps) {
  const [modalProvider, setModalProvider] = useState<IntegrationProvider | null>(null)

  const handleConnectClick = (provider: IntegrationProvider) => {
    if (connectedIds.includes(provider.id)) {
      onDisconnect(provider.id)
      return
    }
    setModalProvider(provider)
  }

  return (
    <>
      <section
        className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${
          compact ? '' : 'overflow-hidden'
        }`}
      >
        <div className={`border-b border-slate-100 px-5 py-4 ${compact ? '' : 'bg-slate-50/50'}`}>
          <div className="flex items-center gap-2">
            <Plug className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-900">Connect your stack</h3>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Sign in to any tool — Microsoft 365, Google, Slack, GitHub, and more. The agent uses
            connected context to propose drafts; you approve before anything goes out.
          </p>
        </div>

        <div className={`grid gap-3 p-5 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
          {INTEGRATION_PROVIDERS.map((provider) => {
            const connected = connectedIds.includes(provider.id)
            return (
              <div
                key={provider.id}
                className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${
                  connected
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-100 bg-slate-50/30 hover:border-slate-200'
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white ${provider.color}`}
                >
                  {provider.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{provider.name}</p>
                    {connected && (
                      <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                    {provider.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleConnectClick(provider)}
                    className={`mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      connected
                        ? 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {connected ? (
                      <>
                        <Unplug className="h-3 w-3" />
                        Disconnect
                      </>
                    ) : (
                      <>
                        <Link2 className="h-3 w-3" />
                        Sign in to connect
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {connectedIds.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-3 text-[11px] text-slate-500">
            {connectedIds.length} tool{connectedIds.length !== 1 ? 's' : ''} connected — agent can
            read context from {connectedIds.length === 1 ? 'this source' : 'these sources'}. All
            outbound actions still require your approval.
          </div>
        )}
      </section>

      <ConnectModal
        provider={modalProvider}
        open={modalProvider !== null}
        onClose={() => setModalProvider(null)}
        onConnected={onConnect}
      />
    </>
  )
}
