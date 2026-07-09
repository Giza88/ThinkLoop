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
    <div className="flex h-full flex-col tl-card">
      <div className="border-b border-tl-gray-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-tl-cyan-400" />
          <h3 className="text-sm font-semibold text-tl-gray-900">Capture Your Thoughts</h3>
        </div>
        <p className="mt-1 text-xs text-tl-gray-500">
          Raw, messy, incomplete — that&apos;s fine. Just get it out.
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 rounded-xl border border-tl-purple-200 bg-tl-purple-50/50 px-4 py-3">
          {prompt ? (
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-tl-purple-800">
                <span className="font-semibold">Prompt:</span> {prompt}
              </p>
              <button
                type="button"
                data-testid="next-prompt"
                onClick={onNextPrompt}
                className="flex shrink-0 items-center gap-1 text-xs font-medium text-tl-purple-500 hover:text-tl-purple-600"
              >
                Next <RefreshCw className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <p className="text-sm text-tl-purple-800">
              Start typing — prompts are turned off in Settings.
            </p>
          )}
        </div>

        <textarea
          ref={textareaRef}
          data-testid="thought-input"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type anything — fragments, questions, half-formed ideas, frustrations…"
          className="tl-input min-h-[120px] flex-1 resize-none px-4 py-3 text-sm"
        />

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="voice-btn"
              className="flex items-center gap-1.5 rounded-lg border border-tl-gray-200 px-3 py-2 text-xs font-medium text-tl-gray-600 transition-colors hover:bg-tl-gray-50"
            >
              <Mic className="h-3.5 w-3.5" />
              Voice
            </button>
            <span className="text-xs text-tl-gray-400">⌘↵ to add</span>
          </div>
          <button
            type="button"
            data-testid="add-thought"
            onClick={onAddThought}
            disabled={!input.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-tl-brand bg-tl-brand-hover px-4 py-2 text-sm font-medium text-white transition-colors  disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Thought
          </button>
        </div>

        <div className="mt-5 flex-1 overflow-y-auto">
          {thoughts.length === 0 ? (
            <p className="py-8 text-center text-sm text-tl-gray-400">Your thoughts will appear here</p>
          ) : (
            <ul className="space-y-2">
              {thoughts.map((thought) => (
                <li
                  key={thought.id}
                  className="rounded-xl border border-tl-gray-100 bg-tl-gray-50 px-4 py-3 text-sm text-tl-gray-700"
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
