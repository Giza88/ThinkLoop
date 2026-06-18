import type { Draft, HistoryEntry } from '../types'

const DRAFTS_KEY = 'thinkloop:drafts'
const HISTORY_KEY = 'thinkloop:history'
const INTEGRATIONS_KEY = 'thinkloop:integrations'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadDrafts(): Draft[] {
  return readJson<Draft[]>(DRAFTS_KEY, [])
}

export function saveDrafts(drafts: Draft[]) {
  writeJson(DRAFTS_KEY, drafts)
}

export function loadHistory(): HistoryEntry[] {
  return readJson<HistoryEntry[]>(HISTORY_KEY, [])
}

export function saveHistory(entries: HistoryEntry[]) {
  writeJson(HISTORY_KEY, entries)
}

export function loadConnectedIntegrations(): string[] {
  return readJson<string[]>(INTEGRATIONS_KEY, ['microsoft', 'slack'])
}

export function saveConnectedIntegrations(ids: string[]) {
  writeJson(INTEGRATIONS_KEY, ids)
}
