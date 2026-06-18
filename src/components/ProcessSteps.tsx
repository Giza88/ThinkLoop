import { CheckCircle2, Link2, Pencil, Sparkles, User } from 'lucide-react'

const STEPS = [
  {
    number: 1,
    title: 'Connect tools',
    description: 'Sign in to Microsoft, Slack, GitHub…',
    color: 'bg-tl-purple-100 text-tl-purple-600 ring-tl-purple-200',
    icon: Link2,
    actor: 'you' as const,
  },
  {
    number: 2,
    title: 'You think it',
    description: 'Capture raw thoughts and goals',
    color: 'bg-tl-cyan-100 text-tl-cyan-600 ring-tl-cyan-200',
    icon: User,
    actor: 'you' as const,
  },
  {
    number: 3,
    title: 'AI proposes',
    description: 'Structures drafts from your input + connected context',
    color: 'bg-tl-purple-100 text-tl-purple-600 ring-tl-purple-200',
    icon: Sparkles,
    actor: 'agent' as const,
  },
  {
    number: 4,
    title: 'You review it',
    description: 'Edit every section before anything moves',
    color: 'bg-tl-cyan-100 text-tl-cyan-600 ring-tl-cyan-200',
    icon: Pencil,
    actor: 'you' as const,
  },
  {
    number: 5,
    title: 'You approve it',
    description: 'Export, send, or post — only after you say yes',
    color: 'bg-tl-cyan-100 text-tl-cyan-600 ring-tl-cyan-200',
    icon: CheckCircle2,
    actor: 'you' as const,
  },
]

export function ProcessSteps() {
  return (
    <div className="tl-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-tl-gray-400">
          The human-in-the-loop loop
        </p>
        <span className="rounded-full border border-tl-cyan-200 bg-tl-cyan-50 px-2.5 py-0.5 text-[10px] font-medium text-tl-cyan-600">
          4 of 5 steps need you
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        {STEPS.map((step) => {
          const Icon = step.icon
          return (
            <div key={step.number} className="flex items-start gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ${step.color}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-tl-gray-400">
                  {step.actor === 'you' ? 'You' : 'Agent'}
                </p>
                <p className="text-sm font-semibold text-tl-gray-900">{step.title}</p>
                <p className="text-xs text-tl-gray-500">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
