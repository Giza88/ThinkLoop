import { randomUUID } from 'node:crypto'
import { desc, eq } from 'drizzle-orm'
import type { HistoryEntry } from '../../../shared/types.js'
import { DEFAULT_USER_ID } from '../config.js'
import { getDb } from '../db/index.js'
import { historyEntries } from '../db/schema.js'

const MAX_HISTORY = 50

function rowToEntry(row: typeof historyEntries.$inferSelect): HistoryEntry {
  return {
    id: row.id,
    title: row.title,
    action: row.action as HistoryEntry['action'],
    timestamp: row.timestamp,
    entityId: row.entityId,
  }
}

export function listHistory(limit = MAX_HISTORY, userId = DEFAULT_USER_ID): HistoryEntry[] {
  const db = getDb()
  return db
    .select()
    .from(historyEntries)
    .where(eq(historyEntries.userId, userId))
    .orderBy(desc(historyEntries.timestamp))
    .limit(limit)
    .all()
    .map(rowToEntry)
}

export function addHistoryEntry(
  title: string,
  action: HistoryEntry['action'],
  entityId?: string | null,
  userId = DEFAULT_USER_ID,
): HistoryEntry {
  const db = getDb()
  const entry = {
    id: randomUUID(),
    userId,
    title,
    action,
    entityId: entityId ?? null,
    timestamp: new Date().toISOString(),
  }
  db.insert(historyEntries).values(entry).run()

  const all = db
    .select({ id: historyEntries.id })
    .from(historyEntries)
    .where(eq(historyEntries.userId, userId))
    .orderBy(desc(historyEntries.timestamp))
    .all()

  if (all.length > MAX_HISTORY) {
    const toDelete = all.slice(MAX_HISTORY)
    for (const row of toDelete) {
      db.delete(historyEntries).where(eq(historyEntries.id, row.id)).run()
    }
  }

  return rowToEntry(entry)
}

export function bulkImportHistory(items: HistoryEntry[], userId = DEFAULT_USER_ID) {
  const db = getDb()
  for (const item of items) {
    const existing = db.select().from(historyEntries).where(eq(historyEntries.id, item.id)).get()
    if (existing) continue
    db.insert(historyEntries)
      .values({
        id: item.id,
        userId,
        title: item.title,
        action: item.action,
        entityId: item.entityId ?? null,
        timestamp: item.timestamp,
      })
      .run()
  }
}

export function getDashboardStats(userId = DEFAULT_USER_ID) {
  const db = getDb()
  const entries = db
    .select()
    .from(historyEntries)
    .where(eq(historyEntries.userId, userId))
    .orderBy(desc(historyEntries.timestamp))
    .all()

  const organized = entries.filter((e) => e.action === 'organized').length
  const approved = entries.filter((e) => e.action === 'approved').length
  const exported = entries.filter((e) => e.action === 'exported').length
  const saved = entries.filter((e) => e.action === 'saved').length
  const rejected = entries.filter((e) => e.action === 'rejected').length

  const approvalRate =
    approved + rejected > 0 ? Math.round((approved / (approved + rejected)) * 100) : 100

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recentOrganized = entries.filter(
    (e) => e.action === 'organized' && new Date(e.timestamp).getTime() >= weekAgo,
  ).length

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weeklyActivity = dayNames.map((day) => ({ day, value: 0 }))

  for (const entry of entries) {
    if (entry.action !== 'organized') continue
    const d = new Date(entry.timestamp)
    if (Date.now() - d.getTime() > 7 * 24 * 60 * 60 * 1000) continue
    const idx = dayNames.indexOf(dayNames[d.getDay()])
    if (idx >= 0) weeklyActivity[idx].value += 1
  }

  return {
    metrics: [
      {
        label: 'Outputs Generated',
        value: String(organized),
        trend: recentOrganized > 0 ? `+${recentOrganized}` : undefined,
        trendLabel: 'this week',
      },
      {
        label: 'Approval Rate',
        value: `${approvalRate}%`,
        trend: approvalRate >= 80 ? 'Healthy' : 'Review',
        trendLabel: 'approved vs rejected',
      },
      {
        label: 'Drafts Saved',
        value: String(saved),
        trendLabel: 'total saves',
      },
      {
        label: 'Exports',
        value: String(exported),
        trendLabel: 'approved exports',
      },
    ],
    weeklyActivity,
  }
}
