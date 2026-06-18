export type NavItem = {
  id: string
  label: string
  icon: string
  badge?: number
}

export type Thought = {
  id: string
  text: string
  createdAt: Date
}

export type DocumentSection = {
  title: string
  content: string
}

export type DocumentApprovalStatus = 'pending' | 'approved' | 'rejected'

export type StructuredDocument = {
  title: string
  sections: DocumentSection[]
  generatedAt: Date
  approvalStatus?: DocumentApprovalStatus
}

export type IdeaCard = {
  id: string
  title: string
  description: string
  tags: string[]
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
}
