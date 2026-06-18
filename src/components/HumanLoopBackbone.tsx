import { ArrowDown, CheckCircle2, Link2, Shield, Sparkles, User } from 'lucide-react'
import { HITL_LOOP_STEPS, INTEGRATION_PROVIDERS } from '../data/integrations'

export function HumanLoopBackbone() {
  const connectedPreview = INTEGRATION_PROVIDERS.slice(0, 4)

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-blue-50 px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <Shield className="h-3.5 w-3.5" />
              Human-in-the-loop backbone
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              You stay in control — not on the sidelines
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
              Like Microsoft Copilot, ThinkLoop connects to your work tools through sign-in. Unlike
              autopilot agents, every output passes through you. You are the backbone — the agent
              proposes, you review, you approve.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            <p className="font-semibold">Copilot-style reach</p>
            <p className="mt-0.5 text-amber-700">Connect anything via login</p>
            <p className="mt-2 font-semibold">ThinkLoop difference</p>
            <p className="mt-0.5 text-amber-700">Nothing acts without your approval</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Connected via sign-in
          </p>
          <div className="grid grid-cols-2 gap-2">
            {connectedPreview.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white ${provider.color}`}
                >
                  {provider.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-800">{provider.name}</p>
                  <p className="truncate text-[10px] text-slate-500">{provider.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Link2 className="h-3 w-3" />
            OAuth sign-in — agent reads context, never stores passwords
          </p>
        </div>

        <div className="hidden flex-col items-center justify-center gap-2 lg:flex">
          <div className="h-px w-8 bg-slate-200" />
          <ArrowDown className="h-4 w-4 text-slate-300" />
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-center">
            <Sparkles className="mx-auto h-4 w-4 text-blue-600" />
            <p className="mt-1 text-[10px] font-semibold text-blue-800">Agent</p>
            <p className="text-[10px] text-blue-600">Proposes only</p>
          </div>
          <ArrowDown className="h-4 w-4 text-slate-300" />
          <div className="h-px w-8 bg-slate-200" />
        </div>

        <div className="relative">
          <div className="absolute inset-y-4 left-5 w-0.5 rounded-full bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600" />
          <div className="space-y-4 pl-12">
            {HITL_LOOP_STEPS.map((step, index) => {
              const isHuman = step.actor === 'you'
              return (
                <div key={step.id} className="relative">
                  <div
                    className={`absolute -left-12 flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-white ${
                      isHuman
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                        : 'bg-blue-100 text-blue-700 ring-blue-50'
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
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-blue-100 bg-blue-50/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide ${
                          isHuman ? 'text-emerald-700' : 'text-blue-600'
                        }`}
                      >
                        {isHuman ? 'You' : 'Agent'}
                      </span>
                      <span className="text-[10px] text-slate-400">Step {index + 1}</span>
                    </div>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">{step.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>
            <strong className="text-slate-800">The backbone:</strong> every agent action is a
            proposal until you approve it — send email, post to Slack, update a doc, or export a
            file.
          </span>
        </div>
      </div>
    </section>
  )
}
