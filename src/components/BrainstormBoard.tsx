import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { IDEA_CARDS, TAG_COLORS } from '../data/mockData'
import type { IdeaCard } from '../types'

const TAG_OPTIONS = ['Product', 'UX', 'Marketing', 'Automation', 'PM', 'Engineering', 'Strategy', 'Research']

export function BrainstormBoard() {
  const [ideas, setIdeas] = useState<IdeaCard[]>(IDEA_CARDS)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  function resetForm() {
    setTitle('')
    setDescription('')
    setSelectedTags([])
    setShowForm(false)
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  function handleAddIdea() {
    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()
    if (!trimmedTitle || !trimmedDescription) return

    setIdeas((prev) => [
      {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        description: trimmedDescription,
        tags: selectedTags.length > 0 ? selectedTags : ['Product'],
      },
      ...prev,
    ])
    resetForm()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Brainstorm Board</h1>
        <p className="mt-1 text-sm text-slate-500">
          Capture and organize ideas before you develop them in the workspace.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Your ideas</h3>
            <p className="text-xs text-slate-500">{ideas.length} ideas</p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((open) => !open)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Cancel' : 'Add Idea'}
          </button>
        </div>

        {showForm && (
          <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Idea title"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the idea..."
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
              <div className="flex flex-wrap gap-1.5">
                {TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'border-blue-300 bg-blue-100 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddIdea}
                disabled={!title.trim() || !description.trim()}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save idea
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:border-blue-200 hover:bg-white"
            >
              <h4 className="text-sm font-semibold text-slate-900">{idea.title}</h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{idea.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                      TAG_COLORS[tag] ?? 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
