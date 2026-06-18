import { ArrowDown, CheckCircle2, Link2, Shield, Sparkles, User } from 'lucide-react'
import { HITL_LOOP_STEPS, INTEGRATION_PROVIDERS } from '../data/integrations'

export function HumanLoopBackbone() {
  const connectedPreview = INTEGRATION_PROVIDERS.slice(0, 4)

  return (
    <section className="overflow-hidden tl-card">
      <div className="border-b border-tl-gray-100 bg-gradient-to-r from-tl-cyan-50 via-surface to-tl-purple-50 px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-tl-cyan-200 bg-tl-cyan-50 px-3 py-1 text-xs font-medium text-tl-cyan-600">
              <Shield className="h-3.5 w-3.5" />
              Human-in-the-loop backbone
            </div>
            <h2 className="text-lg font-bold text-tl-gray-900">
              You stay in control — not on the sidelines
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-tl-gray-600">
              Like Microsoft Copilot, ThinkLoop connects to your work tools through sign-in. Unlike
              autopilot agents, every output passes through you. You are the backbone — the agent
              proposes, you review, you approve.
            </p>
          </div>
          <div className="rounded-xl border border-tl-cyan-200 bg-tl-purple-50 px-4 py-3 text-xs text-tl-purple-700">
            <p className="font-semibold">Copilot-style reach</p>
            <p className="mt-0.5 text-tl-cyan-600">Connect anything via login</p>
            <p className="mt-2 font-semibold">ThinkLoop difference</p>
            <p className="mt-0.5 text-tl-cyan-600">Nothing acts without your approval</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-tl-gray-400">
            Connected via sign-in
          </p>
          <div className="grid grid-cols-2 gap-2">
            {connectedPreview.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center gap-2.5 rounded-xl border border-tl-gray-100 bg-tl-gray-50/80 px-3 py-2.5"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white ${provider.color}`}
                >
                  {provider.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-tl-gray-800">{provider.name}</p>
                  <p className="truncate text-[10px] text-tl-gray-500">{provider.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="flex items-center gap-1.5 text-[11px] text-tl-gray-500">
            <Link2 className="h-3 w-3" />
            OAuth sign-in — agent reads context, never stores passwords
          </p>
        </div>

        <div className="hidden flex-col items-center justify-center gap-2 lg:flex">
          <div className="h-px w-8 bg-tl-gray-200" />
          <ArrowDown className="h-4 w-4 text-tl-gray-300" />
          <div className="rounded-xl border border-tl-purple-200 bg-tl-purple-50 px-3 py-2 text-center">
            <Sparkles className="mx-auto h-4 w-4 text-tl-purple-500" />
            <p className="mt-1 text-[10px] font-semibold text-tl-purple-700">Agent</p>
            <p className="text-[10px] text-tl-purple-500">Proposes only</p>
          </div>
          <ArrowDown className="h-4 w-4 text-tl-gray-300" />
          <div className="h-px w-8 bg-tl-gray-200" />
        </div>

        <div className="relative">
          <div className="absolute inset-y-4 left-5 w-0.5 rounded-full bg-gradient-to-b from-tl-cyan-400 via-tl-purple-400 to-tl-purple-600" />
          <div className="space-y-4 pl-12">
            {HITL_LOOP_STEPS.map((step, index) => {
              const isHuman = step.actor === 'you'
              return (
                <div key={step.id} className="relative">
                  <div
                    className={`absolute -left-12 flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-surface ${
                      isHuman
                        ? 'bg-tl-cyan-500 text-white shadow-md shadow-tl-cyan-200'
                        : 'bg-tl-purple-100 text-tl-purple-600 ring-tl-purple-50'
                    }`}
                  >
                    {isHuman ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-xl border px-4 py-3 ${
                      isHuman
                        ? 'border-tl-cyan-200 bg-tl-cyan-50/50'
                        : 'border-tl-purple-100 bg-tl-purple-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide ${
                          isHuman ? 'text-tl-cyan-600' : 'text-tl-purple-500'
                        }`}
                      >
                        {isHuman ? 'You' : 'Agent'}
                      </span>
                      <span className="text-[10px] text-tl-gray-400">Step {index + 1}</span>
                    </div>
                    <p className="mt-0.5 text-sm font-semibold text-tl-gray-900">{step.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-tl-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-tl-gray-100 bg-tl-gray-50/80 px-6 py-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-tl-gray-600">
          <CheckCircle2 className="h-4 w-4 text-tl-cyan-500" />
          <span>
            <strong className="text-tl-gray-800">The backbone:</strong> every agent action is a
            proposal until you approve it — send email, post to Slack, update a doc, or export a
            file.
          </span>
        </div>
      </div>
    </section>
  )
}
