import { eq } from 'drizzle-orm'
import { DEFAULT_USER_ID } from '../config.js'
import { getDb } from './index.js'
import {
  drafts,
  historyEntries,
  ideas,
  integrations,
  userSettings,
  users,
  workspaceSessions,
} from './schema.js'

const SEED_IDEAS = [
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

export function seedDatabase() {
  const db = getDb()
  const existing = db.select().from(users).where(eq(users.id, DEFAULT_USER_ID)).get()

  if (existing) return

  const now = new Date().toISOString()

  db.insert(users)
    .values({
      id: DEFAULT_USER_ID,
      displayName: 'Alex Morgan',
      createdAt: now,
    })
    .run()

  db.insert(userSettings)
    .values({
      userId: DEFAULT_USER_ID,
      autoSaveDrafts: true,
      showPrompts: true,
      requireApproval: true,
      theme: 'dark',
      sidebarCollapsed: false,
    })
    .run()

  db.insert(workspaceSessions)
    .values({
      userId: DEFAULT_USER_ID,
      thoughtsJson: '[]',
      documentJson: null,
      updatedAt: now,
    })
    .run()

  for (const idea of SEED_IDEAS) {
    db.insert(ideas)
      .values({
        id: idea.id,
        userId: DEFAULT_USER_ID,
        title: idea.title,
        description: idea.description,
        tagsJson: JSON.stringify(idea.tags),
        createdAt: now,
        updatedAt: now,
      })
      .run()
  }

  for (const providerId of ['microsoft', 'slack']) {
    db.insert(integrations)
      .values({
        userId: DEFAULT_USER_ID,
        providerId,
        connectedAt: now,
      })
      .run()
  }
}

export function isDatabaseEmpty() {
  const db = getDb()
  const draftCount = db.select().from(drafts).all().length
  const historyCount = db.select().from(historyEntries).all().length
  return draftCount === 0 && historyCount === 0
}
