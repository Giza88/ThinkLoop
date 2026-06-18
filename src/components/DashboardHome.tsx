import { ArrowRight, Lightbulb, Plug, Sparkles } from 'lucide-react'
import { HumanLoopBackbone } from './HumanLoopBackbone'
import { IntegrationsPanel } from './IntegrationsPanel'
import { StatsSection } from './StatsSection'

type DashboardHomeProps = {
  connectedIntegrations: string[]
  onNavigate: (view: string) => void
  onConnectIntegration: (providerId: string) => void
  onDisconnectIntegration: (providerId: string) => void
}

export function DashboardHome({
  connectedIntegrations,
  onNavigate,
  onConnectIntegration,
  onDisconnectIntegration,
}: DashboardHomeProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Good morning, Alex</h1>
        <p className="mt-1 text-sm text-slate-500">
          Connect your tools, let the agent propose — you stay the backbone of every decision.
        </p>
      </div>

      <HumanLoopBackbone />

      <IntegrationsPanel
        connectedIds={connectedIntegrations}
        onConnect={onConnectIntegration}
        onDisconnect={onDisconnectIntegration}
        compact
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => onNavigate('workspace')}
          className="group flex items-start gap-4 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">Start a new session</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Capture thoughts, get an AI proposal, approve before export — the full human loop.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:gap-2">
              Open workspace
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className="group flex items-start gap-4 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 text-left shadow-sm transition-all hover:border-violet-300 hover:shadow-md"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
            <Plug className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">Connect more tools</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Sign in to Microsoft, Slack, GitHub, and more — agent reads context, you approve actions.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-violet-700 group-hover:gap-2">
              Manage integrations
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('brainstorm')}
          className="group flex items-start gap-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 text-left shadow-sm transition-all hover:border-amber-300 hover:shadow-md sm:col-span-2 lg:col-span-1"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">Brainstorm ideas</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Collect product ideas, tag them, and pick one to develop in the workspace.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-700 group-hover:gap-2">
              View board
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </button>
      </div>

      <StatsSection />
    </div>
  )
}
