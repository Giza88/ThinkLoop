export type IdeaColor = 'blue' | 'green' | 'yellow' | 'purple'

export interface Idea {
  id: string
  title: string
  description: string
  tags: string[]
  color: IdeaColor
}

export const ideas: Idea[] = [
  {
    id: '1',
    title: 'Personalized onboarding flow',
    description:
      'Use AI to analyze user role on sign-up and serve tailored next steps — reduce time-to-value by ~40%.',
    tags: ['Product', 'UX'],
    color: 'blue',
  },
  {
    id: '2',
    title: 'Weekly digest newsletter',
    description:
      'Auto-summarize team activity from Slack, Linear, and GitHub into a readable Friday newsletter.',
    tags: ['Marketing', 'Automation'],
    color: 'green',
  },
  {
    id: '3',
    title: 'AI feedback on PRDs',
    description:
      'Let AI flag gaps in product requirement docs before they go to engineering — catch ambiguities early.',
    tags: ['PM', 'Engineering'],
    color: 'yellow',
  },
  {
    id: '4',
    title: 'Competitor monitoring bot',
    description:
      'Monitor competitor release notes, pricing pages, and job boards weekly. Surface signals to strategy team.',
    tags: ['Strategy', 'Research'],
    color: 'purple',
  },
]

export const weeklyActivity = [
  { day: 'Mon', value: 3 },
  { day: 'Tue', value: 5 },
  { day: 'Wed', value: 4 },
  { day: 'Thu', value: 8 },
  { day: 'Fri', value: 6 },
  { day: 'Sat', value: 2 },
  { day: 'Sun', value: 1 },
]

export const metrics = [
  {
    label: 'Outputs Generated',
    value: '34',
    subtext: '+12 this week',
    trend: 'up' as const,
    color: 'blue' as const,
  },
  {
    label: 'Approval Rate',
    value: '71%',
    subtext: '+4% vs last week',
    trend: 'up' as const,
    color: 'green' as const,
  },
  {
    label: 'Avg Revisions',
    value: '1.3',
    subtext: 'before approval',
    trend: 'neutral' as const,
    color: 'purple' as const,
  },
  {
    label: 'Time Saved',
    value: '~4h',
    subtext: 'estimated this week',
    trend: 'neutral' as const,
    color: 'orange' as const,
  },
]

export type NavItem =
  | 'dashboard'
  | 'workspace'
  | 'brainstorm'
  | 'drafts'
  | 'summaries'
  | 'research'
  | 'history'
  | 'team'
  | 'settings'

export const navItems: { id: NavItem; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'workspace', label: 'AI Workspace', icon: 'brain' },
  { id: 'brainstorm', label: 'Brainstorm', icon: 'lightbulb' },
  { id: 'drafts', label: 'Drafts', icon: 'document' },
  { id: 'summaries', label: 'Summaries', icon: 'chat' },
  { id: 'research', label: 'Research', icon: 'book' },
  { id: 'history', label: 'History', icon: 'clock' },
  { id: 'team', label: 'Team', icon: 'users' },
]

export const workspacePrompts = [
  "What's the problem you're actually trying to solve?",
  'Who is this for, and what do they need?',
  'What does success look like in 30 days?',
  'What constraints or assumptions should we note?',
]
