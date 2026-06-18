import { ApiError } from '../api/client'

export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (err instanceof ApiError) return err.message
  if (err instanceof Error && err.message) return err.message
  return fallback
}
