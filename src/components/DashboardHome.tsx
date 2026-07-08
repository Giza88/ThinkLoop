import { ArrowRight, Lightbulb, Plug, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useToast } from '../context/ToastContext'
import type { DashboardStats, IdeaCard, UserProfile } from '../types'
import { getErrorMessage } from '../utils/getErrorMessage'
import { HumanLoopBackbone } from './HumanLoopBackbone'
import { IntegrationsPanel } from './IntegrationsPanel'
import { StatsSection } from './StatsSection'

type DashboardHomeProps = {
  user: UserProfile
  connectedIntegrations: string[]
  stats: DashboardStats | null
  onNavigate: (view: string) => void
  onConnectIntegration: (providerId: string, account?: { email?: string }) => void
  onDisconnectIntegration: (providerId: string) => void
}

export function DashboardHome({
  user,
  connectedIntegrations,
  stats,
  onNavigate,
  onConnectIntegration,
  onDisconnectIntegration,
}: DashboardHomeProps) {
  const toast = useToast()
  const [ideas, setIdeas] = useState<IdeaCard[]>([])

  useEffect(() => {
    api
      .getIdeas()
      .then(setIdeas)
      .catch((err) => toast.error(getErrorMessage(err, 'Could not load ideas')))
  }, [toast])
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tl-gray-900">
          {user.firstName ? `Good morning, ${user.firstName}` : 'Good morning'}
        </h1>
        <p className="mt-1 text-sm text-tl-gray-500">
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
          className="group flex items-start gap-4 tl-card p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-tl-brand"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tl-brand bg-tl-brand-hover text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-tl-gray-900">Start a new session</p>
            <p className="mt-1 text-xs leading-relaxed text-tl-gray-500">
              Capture thoughts, get an AI proposal, approve before export — the full human loop.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-tl-purple-500 group-hover:gap-2">
              Open workspace
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className="group flex items-start gap-4 tl-card p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-tl-brand"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tl-purple-500 text-white">
            <Plug className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-tl-gray-900">Connect more tools</p>
            <p className="mt-1 text-xs leading-relaxed text-tl-gray-500">
              Sign in to Microsoft, Slack, GitHub, and more — agent reads context, you approve actions.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-tl-purple-600 group-hover:gap-2">
              Manage integrations
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('brainstorm')}
          className="group flex items-start gap-4 tl-card p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-tl-brand sm:col-span-2 lg:col-span-1"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tl-cyan-400 text-white">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-tl-gray-900">Brainstorm ideas</p>
            <p className="mt-1 text-xs leading-relaxed text-tl-gray-500">
              Collect product ideas, tag them, and pick one to develop in the workspace.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-tl-cyan-600 group-hover:gap-2">
              View board
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </button>
      </div>

      <StatsSection ideas={ideas} stats={stats} />
    </div>
  )
}
