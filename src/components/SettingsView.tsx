import { Bell, Moon, Shield, Sparkles } from 'lucide-react'
import { IntegrationsPanel } from './IntegrationsPanel'

type SettingsViewProps = {
  autoSaveDrafts: boolean
  showPrompts: boolean
  requireApproval: boolean
  connectedIntegrations: string[]
  onAutoSaveChange: (value: boolean) => void
  onShowPromptsChange: (value: boolean) => void
  onRequireApprovalChange: (value: boolean) => void
  onConnectIntegration: (providerId: string) => void
  onDisconnectIntegration: (providerId: string) => void
}

export function SettingsView({
  autoSaveDrafts,
  showPrompts,
  requireApproval,
  connectedIntegrations,
  onAutoSaveChange,
  onShowPromptsChange,
  onRequireApprovalChange,
  onConnectIntegration,
  onDisconnectIntegration,
}: SettingsViewProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Connect tools, set guardrails — the agent proposes, you approve.
        </p>
      </div>

      <IntegrationsPanel
        connectedIds={connectedIntegrations}
        onConnect={onConnectIntegration}
        onDisconnect={onDisconnectIntegration}
      />

      <section className="rounded-2xl border border-emerald-200 bg-white shadow-sm">
        <div className="border-b border-emerald-100 bg-emerald-50/50 px-5 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-semibold text-slate-900">Human-in-the-loop guardrails</h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            These settings keep you as the backbone — even when the agent connects to external tools.
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          <label className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Require approval before export</p>
              <p className="text-xs text-slate-500">
                AI proposals stay pending until you explicitly approve. Copy, export, and send are
                blocked until then.
              </p>
            </div>
            <input
              type="checkbox"
              checked={requireApproval}
              onChange={(e) => onRequireApprovalChange(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Auto-save drafts</p>
              <p className="text-xs text-slate-500">
                Save organized documents to Drafts automatically after you approve them.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoSaveDrafts}
              onChange={(e) => onAutoSaveChange(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Show writing prompts</p>
              <p className="text-xs text-slate-500">
                Display rotating prompts in the capture panel.
              </p>
            </div>
            <input
              type="checkbox"
              checked={showPrompts}
              onChange={(e) => onShowPromptsChange(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Appearance</h2>
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Moon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Dark mode</p>
              <p className="text-xs text-slate-500">Coming in a future update.</p>
            </div>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500">
            Soon
          </span>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Approval reminders</p>
              <p className="text-xs text-slate-500">
                Notify when agent proposals are waiting for your review.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500">
            Soon
          </span>
        </div>
      </section>

      <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
        <Sparkles className="h-4 w-4 shrink-0" />
        ThinkLoop v0.1 — Connect anything via login. You approve everything that leaves.
      </div>
    </div>
  )
}
