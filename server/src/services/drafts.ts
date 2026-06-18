import { randomUUID } from 'node:crypto'
import { and, desc, eq } from 'drizzle-orm'
import type { Draft, StructuredDocument } from '../../../shared/types.js'
import { DEFAULT_USER_ID } from '../config.js'
import { getDb } from '../db/index.js'
import { drafts } from '../db/schema.js'
import { documentPreview } from './organize.js'

function parseDocument(json: string): StructuredDocument {
  return JSON.parse(json) as StructuredDocument
}

export function rowToDraft(row: typeof drafts.$inferSelect): Draft {
  return {
    id: row.id,
    title: row.title,
    preview: row.preview,
    updatedAt: row.updatedAt,
    document: parseDocument(row.documentJson),
  }
}

export async function listDrafts(userId = DEFAULT_USER_ID): Promise<Draft[]> {
  const db = getDb()
  const rows = await db
    .select()
    .from(drafts)
    .where(eq(drafts.userId, userId))
    .orderBy(desc(drafts.updatedAt))
  return rows.map(rowToDraft)
}

export async function getDraft(id: string, userId = DEFAULT_USER_ID): Promise<Draft | null> {
  const db = getDb()
  const [row] = await db
    .select()
    .from(drafts)
    .where(and(eq(drafts.id, id), eq(drafts.userId, userId)))
    .limit(1)
  return row ? rowToDraft(row) : null
}

export async function upsertDraftFromDocument(
  doc: StructuredDocument,
  userId = DEFAULT_USER_ID,
): Promise<Draft> {
  const db = getDb()
  const now = new Date().toISOString()
  const preview = documentPreview(doc)
  const approvalStatus = doc.approvalStatus ?? 'approved'
  const documentJson = JSON.stringify(doc)

  const [existing] = await db
    .select()
    .from(drafts)
    .where(and(eq(drafts.userId, userId), eq(drafts.title, doc.title)))
    .limit(1)

  if (existing) {
    await db
      .update(drafts)
      .set({
        preview,
        documentJson,
        approvalStatus,
        updatedAt: now,
      })
      .where(eq(drafts.id, existing.id))
    return rowToDraft({ ...existing, preview, documentJson, approvalStatus, updatedAt: now })
  }

  const id = randomUUID()
  const row = {
    id,
    userId,
    title: doc.title,
    preview,
    documentJson,
    approvalStatus,
    createdAt: now,
    updatedAt: now,
  }
  await db.insert(drafts).values(row)
  return rowToDraft(row)
}

export async function createDraft(
  doc: StructuredDocument,
  userId = DEFAULT_USER_ID,
): Promise<Draft> {
  const db = getDb()
  const now = new Date().toISOString()
  const row = {
    id: randomUUID(),
    userId,
    title: doc.title,
    preview: documentPreview(doc),
    documentJson: JSON.stringify(doc),
    approvalStatus: doc.approvalStatus ?? 'approved',
    createdAt: now,
    updatedAt: now,
  }
  await db.insert(drafts).values(row)
  return rowToDraft(row)
}

export async function updateDraft(
  id: string,
  doc: StructuredDocument,
  userId = DEFAULT_USER_ID,
): Promise<Draft | null> {
  const db = getDb()
  const [existing] = await db
    .select()
    .from(drafts)
    .where(and(eq(drafts.id, id), eq(drafts.userId, userId)))
    .limit(1)
  if (!existing) return null

  const now = new Date().toISOString()
  const preview = documentPreview(doc)
  const documentJson = JSON.stringify(doc)
  await db
    .update(drafts)
    .set({
      title: doc.title,
      preview,
      documentJson,
      approvalStatus: doc.approvalStatus ?? existing.approvalStatus,
      updatedAt: now,
    })
    .where(eq(drafts.id, id))

  return rowToDraft({
    ...existing,
    title: doc.title,
    preview,
    documentJson,
    approvalStatus: doc.approvalStatus ?? existing.approvalStatus,
    updatedAt: now,
  })
}

export async function deleteDraft(id: string, userId = DEFAULT_USER_ID): Promise<boolean> {
  const db = getDb()
  const deleted = await db
    .delete(drafts)
    .where(and(eq(drafts.id, id), eq(drafts.userId, userId)))
    .returning({ id: drafts.id })
  return deleted.length > 0
}

export async function bulkImportDrafts(items: Draft[], userId = DEFAULT_USER_ID) {
  const db = getDb()
  for (const item of items) {
    const [existing] = await db.select().from(drafts).where(eq(drafts.id, item.id)).limit(1)
    if (existing) continue
    await db.insert(drafts).values({
      id: item.id,
      userId,
      title: item.title,
      preview: item.preview,
      documentJson: JSON.stringify({
        ...item.document,
        generatedAt:
          typeof item.document.generatedAt === 'string'
            ? item.document.generatedAt
            : new Date(item.document.generatedAt).toISOString(),
      }),
      approvalStatus: item.document.approvalStatus ?? 'approved',
      createdAt: item.updatedAt,
      updatedAt: item.updatedAt,
    })
  }
}
