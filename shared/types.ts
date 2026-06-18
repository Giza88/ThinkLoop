export type DocumentSection = {
  title: string
  content: string
}

export type DocumentApprovalStatus = 'pending' | 'approved' | 'rejected'

export type StructuredDocument = {
  title: string
  sections: DocumentSection[]
  generatedAt: string
  approvalStatus?: DocumentApprovalStatus
}

export type Thought = {
  id: string
  text: string
  createdAt: string
}

export type Draft = {
  id: string
  title: string
  preview: string
  updatedAt: string
  document: StructuredDocument
}

export type HistoryEntry = {
  id: string
  title: string
  action: 'organized' | 'exported' | 'saved' | 'approved' | 'rejected'
  timestamp: string
  entityId?: string | null
}

export type IdeaCard = {
  id: string
  title: string
  description: string
  tags: string[]
  createdAt?: string
  updatedAt?: string
}

export type Theme = 'light' | 'dark' | 'system'

export type UserSettings = {
  autoSaveDrafts: boolean
  showPrompts: boolean
  requireApproval: boolean
  theme: Theme
  sidebarCollapsed: boolean
}

export type WorkspaceSession = {
  thoughts: Thought[]
  document: StructuredDocument | null
  updatedAt: string
}

export type StatMetric = {
  label: string
  value: string
  trend?: string
  trendLabel?: string
}

export type WeeklyActivity = {
  day: string
  value: number
}

export type DashboardStats = {
  metrics: StatMetric[]
  weeklyActivity: WeeklyActivity[]
}

export type SearchResult = {
  type: 'draft' | 'idea' | 'history'
  id: string
  title: string
  section: string
}

export type DemoEmail = {
  id: string
  from: string
  fromEmail: string
  subject: string
  body: string
  receivedAt: string
  source: 'outlook' | 'gmail'
}

export type EmailInput = DemoEmail

export type EmailQuestion = {
  id: string
  question: string
  hint?: string
}

export type EmailAnalyzeResult = {
  summary: string
  questions: EmailQuestion[]
}

export type EmailQuestionAnswer = {
  questionId: string
  question: string
  answer: string
}

export type EmailDraft = {
  subject: string
  body: string
  generatedAt: string
  approvalStatus?: DocumentApprovalStatus
}
