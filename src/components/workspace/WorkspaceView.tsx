import { useState } from 'react'
import { workspacePrompts } from '../../data/content'
import { Icon } from '../Icon'

export function WorkspaceView() {
  const [promptIndex, setPromptIndex] = useState(0)
  const [thoughts, setThoughts] = useState('')

  function nextPrompt() {
    setPromptIndex((i) => (i + 1) % workspacePrompts.length)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-tl-gray-900">ThinkLoop Workspace</h1>
        <p className="mt-1 text-sm text-tl-gray-500">
          Your ideas drive everything. Capture your thoughts — AI organizes them into
          a document you can use.
        </p>
      </div>

      <div className="mb-6 flex gap-3 rounded-xl border border-tl-gray-200 bg-tl-gray-50 p-4">
        <ProcessStep
          number={1}
          color="yellow"
          title="You think it"
          subtitle="Capture raw, messy thoughts."
        />
        <ProcessStep
          number={2}
          color="blue"
          title="AI structures it"
          subtitle="Organizes into clear sections."
        />
        <ProcessStep
          number={3}
          color="green"
          title="You own it"
          subtitle="Edit, annotate, export."
        />
      </div>

      <div className="flex flex-1 gap-5 overflow-hidden">
        <section className="flex min-w-0 flex-1 flex-col rounded-2xl border border-tl-gray-200 bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-tl-cyan-100 text-tl-purple-600">
              <Icon name="lightbulb" size={14} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-tl-gray-900">
                Capture Your Thoughts
              </h2>
              <p className="text-xs text-tl-gray-500">
                Raw, messy, incomplete — that's fine. Just get it out.
              </p>
            </div>
          </div>

          <div className="mb-4 rounded-xl border-l-4 border-tl-blue bg-tl-blue-light p-4">
            <p className="text-xs font-medium text-tl-blue">Prompt</p>
            <p className="mt-1 text-sm text-tl-gray-800">
              {workspacePrompts[promptIndex]}
            </p>
            <button
              type="button"
              onClick={nextPrompt}
              className="mt-3 flex items-center gap-1.5 rounded-lg border border-tl-gray-200 bg-surface px-3 py-1.5 text-xs font-medium text-tl-gray-600 hover:bg-tl-gray-50"
            >
              Next
              <Icon name="refresh" size={12} />
            </button>
          </div>

          <textarea
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            placeholder="Start typing your thoughts here..."
            className="min-h-[160px] flex-1 resize-none rounded-xl border border-tl-gray-200 p-4 text-sm text-tl-gray-700 outline-none placeholder:text-tl-gray-400 focus:border-tl-blue focus:ring-1 focus:ring-tl-blue"
          />
        </section>

        <section className="flex w-[42%] shrink-0 flex-col rounded-2xl border border-tl-gray-200 bg-surface">
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-tl-gray-100 text-tl-gray-400">
              <Icon name="fileText" size={32} />
            </div>
            <p className="text-sm font-medium text-tl-gray-700">
              Your document will appear here
            </p>
            <p className="mt-1 max-w-[220px] text-xs text-tl-gray-400">
              Add your thoughts on the left, then click Generate to see your structured
              document.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

interface ProcessStepProps {
  number: number
  color: 'yellow' | 'blue' | 'green'
  title: string
  subtitle: string
}

const stepColors = {
  yellow: 'bg-tl-cyan-100 text-tl-cyan-600',
  blue: 'bg-tl-purple-100 text-tl-blue',
  green: 'bg-tl-cyan-100 text-tl-cyan-500',
}

function ProcessStep({ number, color, title, subtitle }: ProcessStepProps) {
  return (
    <div className="flex flex-1 items-center gap-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${stepColors[color]}`}
      >
        {number}
      </div>
      <div>
        <div className="text-sm font-semibold text-tl-gray-900">{title}</div>
        <div className="text-xs text-tl-gray-500">{subtitle}</div>
      </div>
    </div>
  )
}
