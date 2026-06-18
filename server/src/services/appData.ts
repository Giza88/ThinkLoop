import { randomUUID } from 'node:crypto'
import { and, desc, eq, like, or } from 'drizzle-orm'
import type {
  IdeaCard,
  StructuredDocument,
  Thought,
  UserSettings,
  WorkspaceSession,
} from '../../../shared/types.js'
import { DEFAULT_USER_ID } from '../config.js'
import { getDb } from '../db/index.js'
import {
  drafts,
  historyEntries,
  ideas,
  integrations,
  userSettings,
  workspaceSessions,
} from '../db/schema.js'
import { upsertDraftFromDocument } from './drafts.js'
import { addHistoryEntry } from './history.js'
import { organizeThoughts } from './organize.js'

export function getSettings(userId = DEFAULT_USER_ID): UserSettings {
  const db = getDb()
  const row = db.select().from(userSettings).where(eq(userSettings.userId, userId)).get()
  if (!row) {
    return {
      autoSaveDrafts: true,
      showPrompts: true,
      requireApproval: true,
      theme: 'dark',
      sidebarCollapsed: false,
    }
  }
  return {
    autoSaveDrafts: row.autoSaveDrafts,
    showPrompts: row.showPrompts,
    requireApproval: row.requireApproval,
    theme: row.theme as UserSettings['theme'],
    sidebarCollapsed: row.sidebarCollapsed,
  }
}

export function patchSettings(
  patch: Partial<UserSettings>,
  userId = DEFAULT_USER_ID,
): UserSettings {
  const db = getDb()
  const current = getSettings(userId)
  const next = { ...current, ...patch }
  db.update(userSettings)
    .set({
      autoSaveDrafts: next.autoSaveDrafts,
      showPrompts: next.showPrompts,
      requireApproval: next.requireApproval,
      theme: next.theme,
      sidebarCollapsed: next.sidebarCollapsed,
    })
    .where(eq(userSettings.userId, userId))
    .run()
  return next
}

export function getWorkspace(userId = DEFAULT_USER_ID): WorkspaceSession {
  const db = getDb()
  const row = db
    .select()
    .from(workspaceSessions)
    .where(eq(workspaceSessions.userId, userId))
    .get()

  if (!row) {
    return { thoughts: [], document: null, updatedAt: new Date().toISOString() }
  }

  return {
    thoughts: JSON.parse(row.thoughtsJson) as Thought[],
    document: row.documentJson
      ? (JSON.parse(row.documentJson) as StructuredDocument)
      : null,
    updatedAt: row.updatedAt,
  }
}

export function saveWorkspace(
  thoughts: Thought[],
  document: StructuredDocument | null,
  userId = DEFAULT_USER_ID,
): WorkspaceSession {
  const db = getDb()
  const now = new Date().toISOString()
  const values = {
    userId,
    thoughtsJson: JSON.stringify(thoughts),
    documentJson: document ? JSON.stringify(document) : null,
    updatedAt: now,
  }

  const existing = db
    .select()
    .from(workspaceSessions)
    .where(eq(workspaceSessions.userId, userId))
    .get()

  if (existing) {
    db.update(workspaceSessions).set(values).where(eq(workspaceSessions.userId, userId)).run()
  } else {
    db.insert(workspaceSessions).values(values).run()
  }

  return { thoughts, document, updatedAt: now }
}

export function addThought(text: string, userId = DEFAULT_USER_ID) {
  const session = getWorkspace(userId)
  const thought: Thought = {
    id: randomUUID(),
    text: text.trim(),
    createdAt: new Date().toISOString(),
  }
  const thoughts = [...session.thoughts, thought]
  return saveWorkspace(thoughts, session.document, userId)
}

export function removeThought(thoughtId: string, userId = DEFAULT_USER_ID) {
  const session = getWorkspace(userId)
  const thoughts = session.thoughts.filter((t) => t.id !== thoughtId)
  return saveWorkspace(thoughts, session.document, userId)
}

export async function organizeWorkspace(userId = DEFAULT_USER_ID) {
  const settings = getSettings(userId)
  const session = getWorkspace(userId)
  if (session.thoughts.length === 0) {
    throw new Error('No thoughts to organize')
  }

  const doc = await organizeThoughts(session.thoughts)
  const proposal: StructuredDocument = {
    ...doc,
    approvalStatus: settings.requireApproval ? 'pending' : 'approved',
  }

  saveWorkspace(session.thoughts, proposal, userId)
  addHistoryEntry(doc.title, 'organized', null, userId)

  if (!settings.requireApproval && settings.autoSaveDrafts) {
    upsertDraftFromDocument(proposal, userId)
    addHistoryEntry(doc.title, 'saved', null, userId)
  }

  return getWorkspace(userId)
}

export function approveWorkspace(userId = DEFAULT_USER_ID) {
  const settings = getSettings(userId)
  const session = getWorkspace(userId)
  if (!session.document) throw new Error('No document to approve')

  const approved: StructuredDocument = {
    ...session.document,
    approvalStatus: 'approved',
  }
  saveWorkspace(session.thoughts, approved, userId)
  addHistoryEntry(approved.title, 'approved', null, userId)

  if (settings.autoSaveDrafts) {
    upsertDraftFromDocument(approved, userId)
    addHistoryEntry(approved.title, 'saved', null, userId)
  }

  return getWorkspace(userId)
}

export function rejectWorkspace(userId = DEFAULT_USER_ID) {
  const session = getWorkspace(userId)
  if (!session.document) throw new Error('No document to reject')

  addHistoryEntry(session.document.title, 'rejected', null, userId)
  return saveWorkspace(session.thoughts, null, userId)
}

export function listIdeas(userId = DEFAULT_USER_ID): IdeaCard[] {
  const db = getDb()
  return db
    .select()
    .from(ideas)
    .where(eq(ideas.userId, userId))
    .orderBy(desc(ideas.updatedAt))
    .all()
    .map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      tags: JSON.parse(row.tagsJson) as string[],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }))
}

export function createIdea(
  title: string,
  description: string,
  tags: string[],
  userId = DEFAULT_USER_ID,
): IdeaCard {
  const db = getDb()
  const now = new Date().toISOString()
  const row = {
    id: randomUUID(),
    userId,
    title,
    description,
    tagsJson: JSON.stringify(tags),
    createdAt: now,
    updatedAt: now,
  }
  db.insert(ideas).values(row).run()
  return {
    id: row.id,
    title,
    description,
    tags,
    createdAt: now,
    updatedAt: now,
  }
}

export function updateIdea(
  id: string,
  data: Partial<Pick<IdeaCard, 'title' | 'description' | 'tags'>>,
  userId = DEFAULT_USER_ID,
): IdeaCard | null {
  const db = getDb()
  const existing = db
    .select()
    .from(ideas)
    .where(and(eq(ideas.id, id), eq(ideas.userId, userId)))
    .get()
  if (!existing) return null

  const now = new Date().toISOString()
  const title = data.title ?? existing.title
  const description = data.description ?? existing.description
  const tagsJson = JSON.stringify(data.tags ?? JSON.parse(existing.tagsJson))

  db.update(ideas)
    .set({ title, description, tagsJson, updatedAt: now })
    .where(eq(ideas.id, id))
    .run()

  return {
    id,
    title,
    description,
    tags: JSON.parse(tagsJson) as string[],
    createdAt: existing.createdAt,
    updatedAt: now,
  }
}

export function deleteIdea(id: string, userId = DEFAULT_USER_ID): boolean {
  const db = getDb()
  const result = db
    .delete(ideas)
    .where(and(eq(ideas.id, id), eq(ideas.userId, userId)))
    .run()
  return result.changes > 0
}

export function listIntegrations(userId = DEFAULT_USER_ID): string[] {
  const db = getDb()
  return db
    .select()
    .from(integrations)
    .where(eq(integrations.userId, userId))
    .all()
    .map((row) => row.providerId)
}

export function setIntegrations(providerIds: string[], userId = DEFAULT_USER_ID): string[] {
  const db = getDb()
  const now = new Date().toISOString()
  db.delete(integrations).where(eq(integrations.userId, userId)).run()
  for (const providerId of providerIds) {
    db.insert(integrations)
      .values({ userId, providerId, connectedAt: now })
      .run()
  }
  return providerIds
}

export function connectIntegration(providerId: string, userId = DEFAULT_USER_ID): string[] {
  const current = listIntegrations(userId)
  if (current.includes(providerId)) return current
  const db = getDb()
  db.insert(integrations)
    .values({
      userId,
      providerId,
      connectedAt: new Date().toISOString(),
    })
    .run()
  return [...current, providerId]
}

export function disconnectIntegration(providerId: string, userId = DEFAULT_USER_ID): string[] {
  const db = getDb()
  db.delete(integrations)
    .where(and(eq(integrations.userId, userId), eq(integrations.providerId, providerId)))
    .run()
  return listIntegrations(userId)
}

export function bulkImportIntegrations(providerIds: string[], userId = DEFAULT_USER_ID) {
  const current = new Set(listIntegrations(userId))
  for (const id of providerIds) {
    if (!current.has(id)) connectIntegration(id, userId)
  }
}

export function searchAll(query: string, userId = DEFAULT_USER_ID) {
  const db = getDb()
  const q = `%${query.trim()}%`
  if (!query.trim()) return []

  const draftResults = db
    .select()
    .from(drafts)
    .where(and(eq(drafts.userId, userId), or(like(drafts.title, q), like(drafts.preview, q))))
    .limit(10)
    .all()
    .map((row) => ({
      type: 'draft' as const,
      id: row.id,
      title: row.title,
      section: 'Drafts',
    }))

  const ideaResults = db
    .select()
    .from(ideas)
    .where(
      and(
        eq(ideas.userId, userId),
        or(like(ideas.title, q), like(ideas.description, q)),
      ),
    )
    .limit(10)
    .all()
    .map((row) => ({
      type: 'idea' as const,
      id: row.id,
      title: row.title,
      section: 'Brainstorm',
    }))

  const historyResults = db
    .select()
    .from(historyEntries)
    .where(and(eq(historyEntries.userId, userId), like(historyEntries.title, q)))
    .limit(10)
    .all()
    .map((row) => ({
      type: 'history' as const,
      id: row.id,
      title: row.title,
      section: 'History',
    }))

  return [...draftResults, ...ideaResults, ...historyResults]
}

export function recordExport(userId = DEFAULT_USER_ID) {
  const session = getWorkspace(userId)
  if (!session.document) return
  addHistoryEntry(session.document.title, 'exported', null, userId)
}
