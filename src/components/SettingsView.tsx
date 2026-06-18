import { Bell, Moon, Shield, Sparkles, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { IntegrationsPanel } from './IntegrationsPanel'
import type { Theme } from '../utils/storage'

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
  const { theme, setTheme, isDark } = useTheme()

  const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Sparkles },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tl-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-tl-gray-500">
          Connect tools, set guardrails — the agent proposes, you approve.
        </p>
      </div>

      <IntegrationsPanel
        connectedIds={connectedIntegrations}
        onConnect={onConnectIntegration}
        onDisconnect={onDisconnectIntegration}
      />

      <section className="tl-card overflow-hidden">
        <div className="border-b border-tl-cyan-100 bg-tl-cyan-50/50 px-5 py-4 dark:border-tl-cyan-200/20">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-tl-cyan-500" />
            <h2 className="text-sm font-semibold text-tl-gray-900">Human-in-the-loop guardrails</h2>
          </div>
          <p className="mt-1 text-xs text-tl-gray-500">
            These settings keep you as the backbone — even when the agent connects to external tools.
          </p>
        </div>
        <div className="divide-y divide-tl-gray-100">
          <label className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-tl-gray-900">Require approval before export</p>
              <p className="text-xs text-tl-gray-500">
                AI proposals stay pending until you explicitly approve. Copy, export, and send are
                blocked until then.
              </p>
            </div>
            <input
              type="checkbox"
              checked={requireApproval}
              onChange={(e) => onRequireApprovalChange(e.target.checked)}
              className="h-4 w-4 rounded border-tl-gray-300 text-tl-cyan-500 focus:ring-tl-cyan-400"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-tl-gray-900">Auto-save drafts</p>
              <p className="text-xs text-tl-gray-500">
                Save organized documents to Drafts automatically after you approve them.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoSaveDrafts}
              onChange={(e) => onAutoSaveChange(e.target.checked)}
              className="h-4 w-4 rounded border-tl-gray-300 text-tl-purple-500 focus:ring-tl-purple-400"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-tl-gray-900">Show writing prompts</p>
              <p className="text-xs text-tl-gray-500">
                Display rotating prompts in the capture panel.
              </p>
            </div>
            <input
              type="checkbox"
              checked={showPrompts}
              onChange={(e) => onShowPromptsChange(e.target.checked)}
              className="h-4 w-4 rounded border-tl-gray-300 text-tl-purple-500 focus:ring-tl-purple-400"
            />
          </label>
        </div>
      </section>

      <section className="tl-card overflow-hidden">
        <div className="border-b border-tl-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-tl-gray-900">Appearance</h2>
          <p className="mt-1 text-xs text-tl-gray-500">Choose how ThinkLoop looks on your device.</p>
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-tl-purple-50 text-tl-purple-500 dark:bg-tl-purple-100/30">
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-tl-gray-900">Theme</p>
              <p className="text-xs text-tl-gray-500">
                {theme === 'system' ? 'Matches your system preference' : `${theme} mode active`}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {themeOptions.map((option) => {
              const Icon = option.icon
              const isActive = theme === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-all ${
                    isActive
                      ? 'border-tl-purple-300 bg-tl-purple-50 text-tl-purple-600 shadow-sm dark:border-tl-purple-400/40 dark:bg-tl-purple-50/30 dark:text-tl-purple-500'
                      : 'border-tl-gray-200 bg-surface-muted text-tl-gray-500 hover:border-tl-gray-300 hover:text-tl-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="tl-card overflow-hidden">
        <div className="border-b border-tl-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-tl-gray-900">Notifications</h2>
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-tl-gray-100 text-tl-gray-500">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-tl-gray-900">Approval reminders</p>
              <p className="text-xs text-tl-gray-500">
                Notify when agent proposals are waiting for your review.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-tl-gray-100 px-2.5 py-1 text-[10px] font-medium text-tl-gray-500">
            Soon
          </span>
        </div>
      </section>

      <div className="flex items-center gap-2 rounded-xl border border-tl-cyan-100 bg-tl-cyan-50 px-4 py-3 text-xs text-tl-cyan-700">
        <Sparkles className="h-4 w-4 shrink-0" />
        ThinkLoop v0.1 — Connect anything via login. You approve everything that leaves.
      </div>
    </div>
  )
}
