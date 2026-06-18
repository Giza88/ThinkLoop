export type IntegrationProvider = {
  id: string
  name: string
  description: string
  category: 'productivity' | 'communication' | 'development' | 'storage'
  color: string
  initials: string
}

export const INTEGRATION_PROVIDERS: IntegrationProvider[] = [
  {
    id: 'microsoft',
    name: 'Microsoft 365',
    description: 'Outlook, Teams, SharePoint, OneDrive',
    category: 'productivity',
    color: 'bg-blue-600',
    initials: 'MS',
  },
  {
    id: 'google',
    name: 'Google Workspace',
    description: 'Gmail, Calendar, Drive, Docs',
    category: 'productivity',
    color: 'bg-red-500',
    initials: 'G',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Channels, threads, and team context',
    category: 'communication',
    color: 'bg-purple-600',
    initials: 'Sl',
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Repos, PRs, issues, and commits',
    category: 'development',
    color: 'bg-slate-800',
    initials: 'GH',
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'Issues, cycles, and project updates',
    category: 'development',
    color: 'bg-indigo-600',
    initials: 'Li',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Pages, databases, and wikis',
    category: 'storage',
    color: 'bg-slate-900',
    initials: 'N',
  },
]

export const HITL_LOOP_STEPS = [
  {
    id: 'connect',
    title: 'Connect your tools',
    description: 'Sign in once — the agent reads context from Outlook, Slack, GitHub, and more.',
    actor: 'you',
  },
  {
    id: 'direct',
    title: 'You set the goal',
    description: 'Tell the agent what you want. Your intent drives every action.',
    actor: 'you',
  },
  {
    id: 'propose',
    title: 'Agent proposes',
    description: 'AI drafts summaries, replies, and documents — never sends them alone.',
    actor: 'agent',
  },
  {
    id: 'review',
    title: 'You review & edit',
    description: 'Change anything. The agent waits. Nothing moves until you say so.',
    actor: 'you',
  },
  {
    id: 'approve',
    title: 'You approve to act',
    description: 'Only approved output reaches your tools, teammates, or customers.',
    actor: 'you',
  },
] as const
