import type { IdeaCard, StatMetric, WeeklyActivity } from '../types'

export const PROMPTS = [
  "What's the problem you're actually trying to solve?",
  'What would success look like in 30 days?',
  "What's blocking you right now?",
  'Who benefits most if this works?',
  'What assumptions are you making?',
]

export const IDEA_CARDS: IdeaCard[] = [
  {
    id: '1',
    title: 'Personalized onboarding flow',
    description:
      'Use AI to analyze user role on sign-up and serve tailored next steps — reduce time-to-value by ~40%.',
    tags: ['Product', 'UX'],
  },
  {
    id: '2',
    title: 'Weekly digest newsletter',
    description:
      'Auto-summarize team activity from Slack, Linear, and GitHub into a readable Friday newsletter.',
    tags: ['Marketing', 'Automation'],
  },
  {
    id: '3',
    title: 'AI feedback on PRDs',
    description:
      'Let AI flag gaps in product requirement docs before they go to engineering — catch ambiguities early.',
    tags: ['PM', 'Engineering'],
  },
  {
    id: '4',
    title: 'Competitor monitoring bot',
    description:
      'Monitor competitor release notes, pricing pages, and job boards weekly. Surface signals to strategy team.',
    tags: ['Strategy', 'Research'],
  },
]

export const STAT_METRICS: StatMetric[] = [
  {
    label: 'Outputs Generated',
    value: '34',
    trend: '+4%',
    trendLabel: 'vs last week',
  },
  {
    label: 'Approval Rate',
    value: '71%',
    trend: '+12',
    trendLabel: 'this week',
  },
  {
    label: 'Avg Revisions',
    value: '1.3',
    trendLabel: 'before approval',
  },
  {
    label: 'Time Saved',
    value: '~4h',
    trendLabel: 'estimated this week',
  },
]

export const WEEKLY_ACTIVITY: WeeklyActivity[] = [
  { day: 'Mon', value: 4 },
  { day: 'Tue', value: 6 },
  { day: 'Wed', value: 3 },
  { day: 'Thu', value: 8 },
  { day: 'Fri', value: 5 },
  { day: 'Sat', value: 2 },
  { day: 'Sun', value: 1 },
]

export const TAG_COLORS: Record<string, string> = {
  Product: 'bg-blue-50 text-blue-700 border-blue-100',
  UX: 'bg-violet-50 text-violet-700 border-violet-100',
  Marketing: 'bg-amber-50 text-amber-700 border-amber-100',
  Automation: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  PM: 'bg-rose-50 text-rose-700 border-rose-100',
  Engineering: 'bg-slate-100 text-slate-700 border-slate-200',
  Strategy: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  Research: 'bg-cyan-50 text-cyan-700 border-cyan-100',
}
