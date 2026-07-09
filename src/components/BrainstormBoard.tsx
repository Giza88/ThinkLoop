import { Plus, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import { useToast } from '../context/ToastContext'
import { TAG_COLORS } from '../data/mockData'
import type { IdeaCard } from '../types'
import { getErrorMessage } from '../utils/getErrorMessage'

const TAG_OPTIONS = ['Product', 'UX', 'Marketing', 'Automation', 'PM', 'Engineering', 'Strategy', 'Research']

export function BrainstormBoard() {
  const toast = useToast()
  const [ideas, setIdeas] = useState<IdeaCard[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const loadIdeas = useCallback(async () => {
    try {
      setIdeas(await api.getIdeas())
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not load ideas'))
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadIdeas()
  }, [loadIdeas])

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

  async function handleAddIdea() {
    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()
    if (!trimmedTitle || !trimmedDescription) return

    try {
      const idea = await api.createIdea({
        title: trimmedTitle,
        description: trimmedDescription,
        tags: selectedTags.length > 0 ? selectedTags : ['Product'],
      })
      setIdeas((prev) => [idea, ...prev])
      resetForm()
      toast.success('Idea saved')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not save idea'))
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-sm text-tl-gray-500">Loading ideas…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tl-gray-900">Brainstorm Board</h1>
        <p className="mt-1 text-sm text-tl-gray-500">
          Capture and organize ideas before you develop them in the workspace.
        </p>
      </div>

      <div className="tl-card p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-tl-gray-900">Your ideas</h3>
            <p className="text-xs text-tl-gray-500">{ideas.length} ideas</p>
          </div>
          <button
            type="button"
            data-testid="add-idea-toggle"
            onClick={() => setShowForm((open) => !open)}
            className="flex items-center gap-1.5 rounded-xl bg-tl-brand bg-tl-brand-hover px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Cancel' : 'Add Idea'}
          </button>
        </div>

        {showForm && (
          <div className="mb-5 rounded-xl border border-tl-purple-100 bg-tl-purple-50/50 p-4">
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Idea title"
                className="tl-input w-full px-4 py-2.5 text-sm"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the idea..."
                rows={3}
                className="tl-input w-full resize-none px-4 py-2.5 text-sm"
              />
              <div className="flex flex-wrap gap-1.5">
                {TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    data-testid={`tag-${tag}`}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'border-tl-cyan-300 bg-tl-purple-100 text-tl-purple-600'
                        : 'border-tl-gray-200 bg-surface text-tl-gray-600 hover:border-tl-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <button
                type="button"
                data-testid="save-idea"
                onClick={handleAddIdea}
                disabled={!title.trim() || !description.trim()}
                className="rounded-xl bg-tl-brand bg-tl-brand-hover px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
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
              className="rounded-xl border border-tl-gray-100 bg-tl-gray-50/50 p-4 transition-colors hover:border-tl-purple-200 hover:bg-surface-raised"
            >
              <h4 className="text-sm font-semibold text-tl-gray-900">{idea.title}</h4>
              <p className="mt-2 text-xs leading-relaxed text-tl-gray-500">{idea.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                      TAG_COLORS[tag] ?? 'bg-tl-gray-100 text-tl-gray-600 border-tl-gray-200'
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
