import { useState } from 'react'
import { ideas } from '../../data/content'
import { Icon } from '../Icon'
import { IdeaCard } from './IdeaCard'
import { InsightsPanel } from './InsightsPanel'

export function DashboardView() {
  const [ideaList] = useState(ideas)

  return (
    <div className="flex flex-1 gap-6 overflow-hidden p-6">
      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tl-cyan-100 text-tl-purple-600">
              <Icon name="lightbulb" size={16} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-tl-gray-900">
                Brainstorm Board
              </h2>
              <p className="text-xs text-tl-gray-500">{ideaList.length} ideas</p>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-tl-brand bg-tl-brand-hover px-3.5 py-2 text-sm font-medium text-white"
          >
            <Icon name="plus" size={16} />
            Add Idea
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {ideaList.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </section>

      <InsightsPanel />
    </div>
  )
}
