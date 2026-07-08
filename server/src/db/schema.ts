import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  displayName: text('display_name').notNull(),
  email: text('email'),
  createdAt: text('created_at').notNull(),
})

export const userSettings = sqliteTable('user_settings', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id),
  autoSaveDrafts: integer('auto_save_drafts', { mode: 'boolean' }).notNull(),
  showPrompts: integer('show_prompts', { mode: 'boolean' }).notNull(),
  requireApproval: integer('require_approval', { mode: 'boolean' }).notNull(),
  theme: text('theme').notNull(),
  sidebarCollapsed: integer('sidebar_collapsed', { mode: 'boolean' }).notNull(),
})

export const drafts = sqliteTable('drafts', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  title: text('title').notNull(),
  preview: text('preview').notNull(),
  documentJson: text('document_json').notNull(),
  approvalStatus: text('approval_status').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export const historyEntries = sqliteTable(
  'history_entries',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    title: text('title').notNull(),
    action: text('action').notNull(),
    entityId: text('entity_id'),
    timestamp: text('timestamp').notNull(),
  },
  (table) => [index('history_user_timestamp_idx').on(table.userId, table.timestamp)],
)

export const ideas = sqliteTable('ideas', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  tagsJson: text('tags_json').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export const integrations = sqliteTable(
  'integrations',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    providerId: text('provider_id').notNull(),
    connectedAt: text('connected_at').notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.providerId] })],
)

export const workspaceSessions = sqliteTable('workspace_sessions', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id),
  thoughtsJson: text('thoughts_json').notNull(),
  documentJson: text('document_json'),
  updatedAt: text('updated_at').notNull(),
})
