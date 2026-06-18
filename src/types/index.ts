export type {
  DocumentApprovalStatus,
  DocumentSection,
  Draft,
  HistoryEntry,
  IdeaCard,
  StatMetric,
  StructuredDocument,
  Thought,
  Theme,
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
