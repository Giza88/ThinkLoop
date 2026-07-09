import { Plus } from 'lucide-react'
import { TAG_COLORS } from '../data/mockData'
import type { DashboardStats, IdeaCard } from '../types'

type StatsSectionProps = {
  ideas?: IdeaCard[]
  stats?: DashboardStats | null
}

export function StatsSection({ ideas = [], stats }: StatsSectionProps) {
  const metrics = stats?.metrics ?? []
  const weeklyActivity = stats?.weeklyActivity ?? []
  const maxActivity = Math.max(...weeklyActivity.map((d) => d.value), 1)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="tl-card p-5">
            <p className="text-2xl font-bold text-tl-gray-900">{metric.value}</p>
            <p className="mt-1 text-sm text-tl-gray-500">{metric.label}</p>
            {(metric.trend || metric.trendLabel) && (
              <p className="mt-2 text-xs text-tl-cyan-500">
                {metric.trend && <span className="font-medium">{metric.trend} </span>}
                {metric.trendLabel}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="tl-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-tl-gray-900">AI Outputs This Week</h3>
                <p className="text-xs text-tl-gray-500">Recent structured documents</p>
              </div>
              <button
                type="button"
                data-testid="add-idea-btn"
                className="flex items-center gap-1.5 rounded-lg border border-tl-gray-200 px-3 py-1.5 text-xs font-medium text-tl-gray-600 transition-colors hover:bg-tl-gray-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Idea
              </button>
            </div>

            <div className="space-y-3">
              {ideas.length === 0 ? (
                <p className="py-6 text-center text-xs text-tl-gray-400">
                  No brainstorm ideas yet — add one from the board
                </p>
              ) : (
                ideas.slice(0, 4).map((idea) => (
                  <div
                    key={idea.id}
                    className="rounded-xl border border-tl-gray-100 bg-tl-gray-50/50 p-4 transition-colors hover:border-tl-gray-200 hover:bg-surface-raised"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-tl-gray-900">{idea.title}</h4>
                      <div className="flex flex-wrap gap-1.5">
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
                    <p className="mt-2 text-xs leading-relaxed text-tl-gray-500">
                      {idea.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="tl-card p-5">
          <h3 className="text-sm font-semibold text-tl-gray-900">Weekly Activity</h3>
          <p className="mb-5 text-xs text-tl-gray-500">AI outputs by day</p>

          <div className="flex h-32 items-end justify-between gap-2">
            {weeklyActivity.map((day) => (
              <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t-md transition-all ${
                    day.value === maxActivity && day.value > 0
                      ? 'bg-tl-brand'
                      : 'bg-tl-purple-300'
                  }`}
                  style={{
                    height: `${(day.value / maxActivity) * 100}%`,
                    minHeight: day.value > 0 ? '8px' : '4px',
                    opacity: day.value / maxActivity < 0.5 ? 0.5 : 1,
                  }}
                />
                <span className="text-[10px] font-medium text-tl-gray-400">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
