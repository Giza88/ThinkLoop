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

export async function getSettings(userId = DEFAULT_USER_ID): Promise<UserSettings> {
  const db = getDb()
  const [row] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1)
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

export async function patchSettings(
  patch: Partial<UserSettings>,
  userId = DEFAULT_USER_ID,
): Promise<UserSettings> {
  const db = getDb()
  const current = await getSettings(userId)
  const next = { ...current, ...patch }
  await db
    .update(userSettings)
    .set({
      autoSaveDrafts: next.autoSaveDrafts,
      showPrompts: next.showPrompts,
      requireApproval: next.requireApproval,
      theme: next.theme,
      sidebarCollapsed: next.sidebarCollapsed,
    })
    .where(eq(userSettings.userId, userId))
  return next
}

export async function getWorkspace(userId = DEFAULT_USER_ID): Promise<WorkspaceSession> {
  const db = getDb()
  const [row] = await db
    .select()
    .from(workspaceSessions)
    .where(eq(workspaceSessions.userId, userId))
    .limit(1)

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

export async function saveWorkspace(
  thoughts: Thought[],
  document: StructuredDocument | null,
  userId = DEFAULT_USER_ID,
): Promise<WorkspaceSession> {
  const db = getDb()
  const now = new Date().toISOString()
  const values = {
    userId,
    thoughtsJson: JSON.stringify(thoughts),
    documentJson: document ? JSON.stringify(document) : null,
    updatedAt: now,
  }

  const [existing] = await db
    .select()
    .from(workspaceSessions)
    .where(eq(workspaceSessions.userId, userId))
    .limit(1)

  if (existing) {
    await db.update(workspaceSessions).set(values).where(eq(workspaceSessions.userId, userId))
  } else {
    await db.insert(workspaceSessions).values(values)
  }

  return { thoughts, document, updatedAt: now }
}

export async function addThought(text: string, userId = DEFAULT_USER_ID) {
  const session = await getWorkspace(userId)
  const thought: Thought = {
    id: randomUUID(),
    text: text.trim(),
    createdAt: new Date().toISOString(),
  }
  const thoughts = [...session.thoughts, thought]
  return saveWorkspace(thoughts, session.document, userId)
}

export async function removeThought(thoughtId: string, userId = DEFAULT_USER_ID) {
  const session = await getWorkspace(userId)
  const thoughts = session.thoughts.filter((t) => t.id !== thoughtId)
  return saveWorkspace(thoughts, session.document, userId)
}

export async function organizeWorkspace(userId = DEFAULT_USER_ID) {
  const settings = await getSettings(userId)
  const session = await getWorkspace(userId)
  if (session.thoughts.length === 0) {
    throw new Error('No thoughts to organize')
  }

  const doc = await organizeThoughts(session.thoughts)
  const proposal: StructuredDocument = {
    ...doc,
    approvalStatus: settings.requireApproval ? 'pending' : 'approved',
  }

  await saveWorkspace(session.thoughts, proposal, userId)
  await addHistoryEntry(doc.title, 'organized', null, userId)

  if (!settings.requireApproval && settings.autoSaveDrafts) {
    await upsertDraftFromDocument(proposal, userId)
    await addHistoryEntry(doc.title, 'saved', null, userId)
  }

  return getWorkspace(userId)
}

export async function approveWorkspace(userId = DEFAULT_USER_ID) {
  const settings = await getSettings(userId)
  const session = await getWorkspace(userId)
  if (!session.document) throw new Error('No document to approve')

  const approved: StructuredDocument = {
    ...session.document,
    approvalStatus: 'approved',
  }
  await saveWorkspace(session.thoughts, approved, userId)
  await addHistoryEntry(approved.title, 'approved', null, userId)

  if (settings.autoSaveDrafts) {
    await upsertDraftFromDocument(approved, userId)
    await addHistoryEntry(approved.title, 'saved', null, userId)
  }

  return getWorkspace(userId)
}

export async function rejectWorkspace(userId = DEFAULT_USER_ID) {
  const session = await getWorkspace(userId)
  if (!session.document) throw new Error('No document to reject')

  await addHistoryEntry(session.document.title, 'rejected', null, userId)
  return saveWorkspace(session.thoughts, null, userId)
}

export async function listIdeas(userId = DEFAULT_USER_ID): Promise<IdeaCard[]> {
  const db = getDb()
  const rows = await db
    .select()
    .from(ideas)
    .where(eq(ideas.userId, userId))
    .orderBy(desc(ideas.updatedAt))
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    tags: JSON.parse(row.tagsJson) as string[],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }))
}

export async function createIdea(
  title: string,
  description: string,
  tags: string[],
  userId = DEFAULT_USER_ID,
): Promise<IdeaCard> {
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
  await db.insert(ideas).values(row)
  return {
    id: row.id,
    title,
    description,
    tags,
    createdAt: now,
    updatedAt: now,
  }
}

export async function updateIdea(
  id: string,
  data: Partial<Pick<IdeaCard, 'title' | 'description' | 'tags'>>,
  userId = DEFAULT_USER_ID,
): Promise<IdeaCard | null> {
  const db = getDb()
  const [existing] = await db
    .select()
    .from(ideas)
    .where(and(eq(ideas.id, id), eq(ideas.userId, userId)))
    .limit(1)
  if (!existing) return null

  const now = new Date().toISOString()
  const title = data.title ?? existing.title
  const description = data.description ?? existing.description
  const tagsJson = JSON.stringify(data.tags ?? JSON.parse(existing.tagsJson))

  await db
    .update(ideas)
    .set({ title, description, tagsJson, updatedAt: now })
    .where(eq(ideas.id, id))

  return {
    id,
    title,
    description,
    tags: JSON.parse(tagsJson) as string[],
    createdAt: existing.createdAt,
    updatedAt: now,
  }
}

export async function deleteIdea(id: string, userId = DEFAULT_USER_ID): Promise<boolean> {
  const db = getDb()
  const deleted = await db
    .delete(ideas)
    .where(and(eq(ideas.id, id), eq(ideas.userId, userId)))
    .returning({ id: ideas.id })
  return deleted.length > 0
}

export async function listIntegrations(userId = DEFAULT_USER_ID): Promise<string[]> {
  const db = getDb()
  const rows = await db
    .select()
    .from(integrations)
    .where(eq(integrations.userId, userId))
  return rows.map((row) => row.providerId)
}

export async function setIntegrations(
  providerIds: string[],
  userId = DEFAULT_USER_ID,
): Promise<string[]> {
  const db = getDb()
  const now = new Date().toISOString()
  await db.delete(integrations).where(eq(integrations.userId, userId))
  for (const providerId of providerIds) {
    await db.insert(integrations).values({ userId, providerId, connectedAt: now })
  }
  return providerIds
}

export async function connectIntegration(
  providerId: string,
  userId = DEFAULT_USER_ID,
): Promise<string[]> {
  const current = await listIntegrations(userId)
  if (current.includes(providerId)) return current
  const db = getDb()
  await db.insert(integrations).values({
    userId,
    providerId,
    connectedAt: new Date().toISOString(),
  })
  return [...current, providerId]
}

export async function disconnectIntegration(
  providerId: string,
  userId = DEFAULT_USER_ID,
): Promise<string[]> {
  const db = getDb()
  await db
    .delete(integrations)
    .where(and(eq(integrations.userId, userId), eq(integrations.providerId, providerId)))
  return listIntegrations(userId)
}

export async function bulkImportIntegrations(providerIds: string[], userId = DEFAULT_USER_ID) {
  const current = new Set(await listIntegrations(userId))
  for (const id of providerIds) {
    if (!current.has(id)) await connectIntegration(id, userId)
  }
}

export async function searchAll(query: string, userId = DEFAULT_USER_ID) {
  const db = getDb()
  const q = `%${query.trim()}%`
  if (!query.trim()) return []

  const draftRows = await db
    .select()
    .from(drafts)
    .where(and(eq(drafts.userId, userId), or(like(drafts.title, q), like(drafts.preview, q))))
    .limit(10)

  const ideaRows = await db
    .select()
    .from(ideas)
    .where(
      and(eq(ideas.userId, userId), or(like(ideas.title, q), like(ideas.description, q))),
    )
    .limit(10)

  const historyRows = await db
    .select()
    .from(historyEntries)
    .where(and(eq(historyEntries.userId, userId), like(historyEntries.title, q)))
    .limit(10)

  return [
    ...draftRows.map((row) => ({
      type: 'draft' as const,
      id: row.id,
      title: row.title,
      section: 'Drafts',
    })),
    ...ideaRows.map((row) => ({
      type: 'idea' as const,
      id: row.id,
      title: row.title,
      section: 'Brainstorm',
    })),
    ...historyRows.map((row) => ({
      type: 'history' as const,
      id: row.id,
      title: row.title,
      section: 'History',
    })),
  ]
}

export async function recordExport(userId = DEFAULT_USER_ID) {
  const session = await getWorkspace(userId)
  if (!session.document) return
  await addHistoryEntry(session.document.title, 'exported', null, userId)
}
