import type { Draft, HistoryEntry } from '../../shared/types'
import { api } from './client'

const DRAFTS_KEY = 'thinkloop:drafts'
const HISTORY_KEY = 'thinkloop:history'
const INTEGRATIONS_KEY = 'thinkloop:integrations'
const MIGRATED_KEY = 'thinkloop:migrated'

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export async function migrateLocalStorageIfNeeded() {
  if (localStorage.getItem(MIGRATED_KEY)) return

  const drafts = readLocal<Draft[]>(DRAFTS_KEY, [])
  const history = readLocal<HistoryEntry[]>(HISTORY_KEY, [])
  const integrations = readLocal<string[]>(INTEGRATIONS_KEY, [])

  const hasData =
    drafts.length > 0 || history.length > 0 || integrations.length > 0

  if (!hasData) {
    localStorage.setItem(MIGRATED_KEY, '1')
    return
  }

  try {
    await api.migrateLocal({ drafts, history, integrations })
    localStorage.removeItem(DRAFTS_KEY)
    localStorage.removeItem(HISTORY_KEY)
    localStorage.removeItem(INTEGRATIONS_KEY)
    localStorage.setItem(MIGRATED_KEY, '1')
  } catch {
    // Keep localStorage if API unavailable
  }
}
