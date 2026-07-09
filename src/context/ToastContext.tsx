import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type ToastType = 'success' | 'error' | 'info'

type Toast = {
  id: string
  type: ToastType
  message: string
}

type ToastInput = {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const DISMISS_MS: Record<ToastType, number> = {
  success: 4000,
  error: 6000,
  info: 4000,
}

const MAX_TOASTS = 4

const ToastContext = createContext<ToastInput | null>(null)

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
} as const

const STYLES = {
  success:
    'border-tl-cyan-200/80 bg-tl-cyan-50/95 text-tl-gray-900 dark:border-tl-cyan-500/30 dark:bg-tl-cyan-50/40',
  error:
    'border-red-200/80 bg-red-50/95 text-red-800 dark:border-red-500/30 dark:bg-red-950/90 dark:text-red-100',
  info:
    'border-tl-purple-200/80 bg-tl-purple-50/95 text-tl-gray-900 dark:border-tl-purple-500/30 dark:bg-tl-purple-50/30',
} as const

const ICON_STYLES = {
  success: 'text-tl-cyan-500',
  error: 'text-red-500',
  info: 'text-tl-purple-500',
} as const

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const Icon = ICONS[toast.type]

  return (
    <div
      role="status"
      data-testid={`toast-${toast.type}`}
      aria-live="polite"
      className={`toast-enter glass-panel flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${STYLES[toast.type]}`}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${ICON_STYLES[toast.type]}`} aria-hidden />
      <p className="min-w-0 flex-1 text-sm leading-snug text-inherit">{toast.message}</p>
      <button
        type="button"
        data-testid="toast-dismiss"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (type: ToastType, message: string) => {
      const id = crypto.randomUUID()
      setToasts((prev) => [...prev.slice(-(MAX_TOASTS - 1)), { id, type, message }])

      const timer = setTimeout(() => dismiss(id), DISMISS_MS[type])
      timers.current.set(id, timer)
    },
    [dismiss],
  )

  const toast = useMemo<ToastInput>(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
      info: (message) => push('info', message),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
