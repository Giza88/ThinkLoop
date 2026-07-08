export type {
  DocumentApprovalStatus,
  DocumentSection,
  Draft,
  DemoEmail,
  EmailAnalyzeResult,
  EmailDraft,
  EmailInput,
  EmailQuestion,
  EmailQuestionAnswer,
  HistoryEntry,
  IdeaCard,
  StatMetric,
  StructuredDocument,
  Thought,
  Theme,
  UserProfile,
  UserSettings,
  WeeklyActivity,
  WorkspaceSession,
  DashboardStats,
  SearchResult,
} from '../../shared/types'

export type NavItem = {
  id: string
  label: string
  icon: string
  badge?: number
}
