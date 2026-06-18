import { Plus } from 'lucide-react'
import { IDEA_CARDS, STAT_METRICS, TAG_COLORS, WEEKLY_ACTIVITY } from '../data/mockData'
import type { IdeaCard } from '../types'

type StatsSectionProps = {
  ideas?: IdeaCard[]
}

export function StatsSection({ ideas = IDEA_CARDS }: StatsSectionProps) {
  const maxActivity = Math.max(...WEEKLY_ACTIVITY.map((d) => d.value))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_METRICS.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
            <p className="mt-1 text-sm text-slate-500">{metric.label}</p>
            {(metric.trend || metric.trendLabel) && (
              <p className="mt-2 text-xs text-emerald-600">
                {metric.trend && <span className="font-medium">{metric.trend} </span>}
                {metric.trendLabel}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">AI Outputs This Week</h3>
                <p className="text-xs text-slate-500">Recent structured documents</p>
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Idea
              </button>
            </div>

            <div className="space-y-3">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:border-slate-200 hover:bg-white"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-900">{idea.title}</h4>
                    <div className="flex flex-wrap gap-1.5">
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
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{idea.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Weekly Activity</h3>
          <p className="mb-5 text-xs text-slate-500">AI outputs by day</p>

          <div className="flex h-32 items-end justify-between gap-2">
            {WEEKLY_ACTIVITY.map((day) => (
              <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-blue-500 transition-all"
                  style={{
                    height: `${(day.value / maxActivity) * 100}%`,
                    minHeight: day.value > 0 ? '8px' : '4px',
                    opacity: day.value / maxActivity < 0.5 ? 0.5 : 1,
                  }}
                />
                <span className="text-[10px] font-medium text-slate-400">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
