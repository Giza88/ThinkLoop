import { useState } from 'react'
import { metrics, weeklyActivity } from '../../data/content'
import { Icon } from '../Icon'

const metricColors = {
  blue: { text: 'text-blue-600', bg: 'bg-blue-50' },
  green: { text: 'text-green-600', bg: 'bg-green-50' },
  purple: { text: 'text-purple-600', bg: 'bg-purple-50' },
  orange: { text: 'text-orange-600', bg: 'bg-orange-50' },
}

export function InsightsPanel() {
  const [tab, setTab] = useState<'stats' | 'feedback'>('stats')
  const maxValue = Math.max(...weeklyActivity.map((d) => d.value))

  return (
    <aside className="flex w-80 shrink-0 flex-col overflow-hidden rounded-2xl border border-tl-gray-200 bg-white">
      <div className="border-b border-tl-gray-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-tl-blue">
            <Icon name="barChart" size={16} />
          </div>
          <h2 className="text-base font-semibold text-tl-gray-900">
            Insights & Feedback
          </h2>
        </div>

        <div className="mt-3 flex rounded-lg bg-tl-gray-100 p-1">
          <button
            type="button"
            onClick={() => setTab('stats')}
            className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
              tab === 'stats'
                ? 'bg-white text-tl-blue shadow-sm'
                : 'text-tl-gray-500'
            }`}
          >
            Stats
          </button>
          <button
            type="button"
            onClick={() => setTab('feedback')}
            className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
              tab === 'feedback'
                ? 'bg-white text-tl-blue shadow-sm'
                : 'text-tl-gray-500'
            }`}
          >
            Feedback
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {tab === 'stats' ? (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              {metrics.map((metric) => {
                const colors = metricColors[metric.color]
                return (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-tl-gray-100 bg-tl-gray-50 p-3"
                  >
                    <div className="text-xl font-bold text-tl-gray-900">
                      {metric.value}
                    </div>
                    <div className="mt-0.5 text-[11px] font-medium text-tl-gray-500">
                      {metric.label}
                    </div>
                    <div
                      className={`mt-1.5 flex items-center gap-1 text-[10px] font-medium ${colors.text}`}
                    >
                      {metric.trend === 'up' && (
                        <Icon name="trendingUp" size={10} />
                      )}
                      {metric.subtext}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-5">
              <p className="mb-3 text-[10px] font-semibold tracking-wider text-tl-gray-400">
                AI OUTPUTS THIS WEEK
              </p>
              <div className="flex items-end justify-between gap-1.5" style={{ height: 120 }}>
                {weeklyActivity.map((day) => {
                  const height = (day.value / maxValue) * 100
                  const isPeak = day.value === maxValue
                  return (
                    <div
                      key={day.day}
                      className="flex flex-1 flex-col items-center gap-1"
                    >
                      <div className="flex w-full flex-1 items-end">
                        <div
                          className={`w-full rounded-t-md transition-all ${
                            isPeak ? 'bg-tl-blue' : 'bg-blue-200'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-tl-gray-400">{day.day}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium text-tl-gray-700">No feedback yet</p>
            <p className="mt-1 text-xs text-tl-gray-400">
              Feedback from your team will appear here.
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
