import { Lightbulb, Mic, Plus, RefreshCw } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Thought } from '../types'

type CapturePanelProps = {
  prompt: string
  input: string
  thoughts: Thought[]
  onInputChange: (value: string) => void
  onAddThought: () => void
  onNextPrompt: () => void
}

export function CapturePanel({
  prompt,
  input,
  thoughts,
  onInputChange,
  onAddThought,
  onNextPrompt,
}: CapturePanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        onAddThought()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onAddThought])

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-slate-900">Capture Your Thoughts</h3>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Raw, messy, incomplete — that&apos;s fine. Just get it out.
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50/50 px-4 py-3">
          {prompt ? (
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Prompt:</span> {prompt}
              </p>
              <button
                type="button"
                onClick={onNextPrompt}
                className="flex shrink-0 items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Next <RefreshCw className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <p className="text-sm text-blue-900">
              Start typing — prompts are turned off in Settings.
            </p>
          )}
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type anything — fragments, questions, half-formed ideas, frustrations…"
          className="min-h-[120px] flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Mic className="h-3.5 w-3.5" />
              Voice
            </button>
            <span className="text-xs text-slate-400">⌘↵ to add</span>
          </div>
          <button
            type="button"
            onClick={onAddThought}
            disabled={!input.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Thought
          </button>
        </div>

        <div className="mt-5 flex-1 overflow-y-auto">
          {thoughts.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">Your thoughts will appear here</p>
          ) : (
            <ul className="space-y-2">
              {thoughts.map((thought) => (
                <li
                  key={thought.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  {thought.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
