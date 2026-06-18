import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const PORT = Number(process.env.PORT ?? 3001)
export const DB_PATH =
  process.env.DB_PATH ?? path.join(__dirname, '..', 'data', 'thinkloop.db')
export const DEFAULT_USER_ID = 'default'
