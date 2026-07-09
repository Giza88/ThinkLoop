import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  Shield,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import { useToast } from '../context/ToastContext'
import { DEMO_EMAILS } from '../data/demoEmails'
import type { DemoEmail, EmailAnalyzeResult, EmailDraft, EmailQuestion, UserProfile } from '../types'
import { getErrorMessage } from '../utils/getErrorMessage'
import { personalizeDemoEmails } from '../utils/personalizeDemoEmails'

type Step = 'inbox' | 'analyzing' | 'questions' | 'drafting' | 'review' | 'approved'

type EmailReplyViewProps = {
  outlookConnected: boolean
  user: UserProfile
}

const STEPS: { id: Step; label: string }[] = [
  { id: 'inbox', label: 'Read email' },
  { id: 'questions', label: 'Answer questions' },
  { id: 'review', label: 'Approve reply' },
]

function stepIndex(step: Step): number {
  if (step === 'inbox' || step === 'analyzing') return 0
  if (step === 'questions' || step === 'drafting') return 1
  return 2
}

function formatReceived(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function EmailCard({
  email,
  selected,
  onSelect,
}: {
  email: DemoEmail
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      data-testid={`email-card-${email.id}`}
      onClick={onSelect}
      className={`w-full rounded-xl border p-4 text-left transition-all ${
        selected
          ? 'border-tl-purple-300 bg-tl-purple-50/60 ring-2 ring-tl-purple-200'
          : 'border-tl-gray-100 bg-tl-gray-50/50 hover:border-tl-purple-200 hover:bg-surface-raised'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-tl-gray-900">{email.from}</p>
          <p className="mt-0.5 truncate text-sm text-tl-gray-700">{email.subject}</p>
          <p className="mt-2 line-clamp-2 text-xs text-tl-gray-500">{email.body}</p>
        </div>
        <span className="shrink-0 rounded-md bg-tl-gray-100 px-2 py-0.5 text-[10px] font-medium text-tl-gray-500">
          Outlook
        </span>
      </div>
      <p className="mt-2 text-[10px] text-tl-gray-400">{formatReceived(email.receivedAt)}</p>
    </button>
  )
}

export function EmailReplyView({ outlookConnected, user }: EmailReplyViewProps) {
  const toast = useToast()
  const demoEmails = useMemo(
    () => personalizeDemoEmails(DEMO_EMAILS, user.firstName),
    [user.firstName],
  )
  const [step, setStep] = useState<Step>('inbox')
  const [selectedEmail, setSelectedEmail] = useState<DemoEmail | null>(demoEmails[0] ?? null)
  const [analysis, setAnalysis] = useState<EmailAnalyzeResult | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [draft, setDraft] = useState<EmailDraft | null>(null)

  useEffect(() => {
    setSelectedEmail((current) => {
      if (!current) return demoEmails[0] ?? null
      return demoEmails.find((email) => email.id === current.id) ?? demoEmails[0] ?? null
    })
  }, [demoEmails])

  const reset = useCallback(() => {
    setStep('inbox')
    setAnalysis(null)
    setAnswers({})
    setDraft(null)
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!selectedEmail) return
    setStep('analyzing')
    try {
      const result = await api.analyzeEmail(selectedEmail)
      setAnalysis(result)
      setAnswers(Object.fromEntries(result.questions.map((q) => [q.id, ''])))
      setStep('questions')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not analyze email'))
      setStep('inbox')
    }
  }, [selectedEmail, toast])

  const handleDraft = useCallback(async () => {
    if (!selectedEmail || !analysis) return

    const unanswered = analysis.questions.filter((q) => !answers[q.id]?.trim())
    if (unanswered.length > 0) {
      toast.error('Please answer all questions before drafting')
      return
    }

    setStep('drafting')
    try {
      const reply = await api.draftEmailReply(selectedEmail, {
        answers: analysis.questions.map((q) => ({
          questionId: q.id,
          question: q.question,
          answer: answers[q.id].trim(),
        })),
      })
      setDraft(reply)
      setStep('review')
      toast.success('Reply drafted — review and approve before sending')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not draft reply'))
      setStep('questions')
    }
  }, [selectedEmail, analysis, answers, toast])

  const handleApprove = useCallback(() => {
    if (!draft) return
    setDraft({ ...draft, approvalStatus: 'approved' })
    setStep('approved')
    toast.success('Reply approved — ready to send via Outlook')
  }, [draft, toast])

  const handleReject = useCallback(() => {
    setDraft(null)
    setStep('questions')
    toast.info('Draft discarded — adjust your answers and try again')
  }, [toast])

  const handleCopy = useCallback(async () => {
    if (!draft) return
    const text = `Subject: ${draft.subject}\n\n${draft.body}`
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard')
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }, [draft, toast])

  const handleMockSend = useCallback(() => {
    toast.success('Demo: reply queued to send via Outlook (not actually sent)')
  }, [toast])

  const currentStep = stepIndex(step)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tl-gray-900">Email Reply</h1>
        <p className="mt-1 text-sm text-tl-gray-500">
          Demo: agent reads an Outlook email, asks clarifying questions, then drafts a reply for
          your approval before anything is sent.
        </p>
        {outlookConnected && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-tl-cyan-50 px-3 py-1 text-xs text-tl-cyan-700">
            <Mail className="h-3.5 w-3.5" />
            Reading from Microsoft Outlook
          </p>
        )}
      </div>

      <div className="tl-card p-4">
        <div className="flex items-center justify-between gap-4">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  i < currentStep
                    ? 'bg-tl-cyan-500 text-white'
                    : i === currentStep
                      ? 'bg-tl-brand text-white'
                      : 'bg-tl-gray-100 text-tl-gray-400'
                }`}
              >
                {i < currentStep ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`hidden text-xs font-medium sm:inline ${
                  i <= currentStep ? 'text-tl-gray-800' : 'text-tl-gray-400'
                }`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-1 hidden h-px flex-1 sm:block ${
                    i < currentStep ? 'bg-tl-cyan-300' : 'bg-tl-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {(step === 'inbox' || step === 'analyzing') && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-tl-gray-900">Inbox (demo)</h2>
            <div className="space-y-3">
              {demoEmails.map((email) => (
                <EmailCard
                  key={email.id}
                  email={email}
                  selected={selectedEmail?.id === email.id}
                  onSelect={() => setSelectedEmail(email)}
                />
              ))}
            </div>
          </div>

          <div className="tl-card flex flex-col p-5">
            {selectedEmail ? (
              <>
                <div className="border-b border-tl-gray-100 pb-4">
                  <p className="text-xs font-medium text-tl-gray-400">Selected email</p>
                  <h3 className="mt-1 text-base font-semibold text-tl-gray-900">
                    {selectedEmail.subject}
                  </h3>
                  <p className="mt-1 text-sm text-tl-gray-600">
                    {selectedEmail.from} &lt;{selectedEmail.fromEmail}&gt;
                  </p>
                  <p className="mt-1 text-xs text-tl-gray-400">
                    {formatReceived(selectedEmail.receivedAt)}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-tl-gray-700">
                    {selectedEmail.body}
                  </p>
                </div>
                <button
                  type="button"
                  data-testid="analyze-btn"
                  onClick={handleAnalyze}
                  disabled={step === 'analyzing'}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-tl-brand bg-tl-brand-hover px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {step === 'analyzing' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Reading & analyzing…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Read & analyze with agent
                    </>
                  )}
                </button>
              </>
            ) : (
              <p className="text-sm text-tl-gray-500">Select an email to begin</p>
            )}
          </div>
        </div>
      )}

      {(step === 'questions' || step === 'drafting') && selectedEmail && analysis && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="tl-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-tl-gray-400">
              Email summary
            </p>
            <p className="mt-3 text-sm leading-relaxed text-tl-gray-700">{analysis.summary}</p>
            <div className="mt-4 rounded-xl border border-tl-gray-100 bg-tl-gray-50/50 p-4">
              <p className="text-xs font-medium text-tl-gray-500">Original from {selectedEmail.from}</p>
              <p className="mt-2 line-clamp-6 whitespace-pre-line text-xs text-tl-gray-600">
                {selectedEmail.body}
              </p>
            </div>
            <button
              type="button"
              data-testid="reset-flow"
              onClick={reset}
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-tl-gray-500 hover:text-tl-gray-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Choose a different email
            </button>
          </div>

          <div className="tl-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-tl-purple-500" />
              <h2 className="text-sm font-semibold text-tl-gray-900">
                Agent questions — answer before drafting
              </h2>
            </div>
            <p className="mb-5 text-xs text-tl-gray-500">
              The agent read the email but needs your input on decisions only you can make.
            </p>

            <div className="space-y-5">
              {analysis.questions.map((q: EmailQuestion) => (
                <div key={q.id}>
                  <label htmlFor={q.id} className="text-sm font-medium text-tl-gray-800">
                    {q.question}
                  </label>
                  {q.hint && (
                    <p className="mt-0.5 text-[11px] text-tl-gray-400">e.g. {q.hint}</p>
                  )}
                  <textarea
                    id={q.id}
                    value={answers[q.id] ?? ''}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    rows={2}
                    disabled={step === 'drafting'}
                    className="tl-input mt-2 w-full resize-none px-3 py-2 text-sm"
                    placeholder="Your answer…"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              data-testid="draft-btn"
              onClick={handleDraft}
              disabled={step === 'drafting'}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-tl-brand bg-tl-brand-hover px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {step === 'drafting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Drafting reply…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Draft reply
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {(step === 'review' || step === 'approved') && draft && selectedEmail && (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2 tl-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-tl-gray-400">
              Replying to
            </p>
            <p className="mt-2 text-sm font-medium text-tl-gray-900">{selectedEmail.from}</p>
            <p className="text-xs text-tl-gray-500">{selectedEmail.fromEmail}</p>
            <p className="mt-3 text-xs text-tl-gray-400">Re: {selectedEmail.subject}</p>
          </div>

          <div className="lg:col-span-3 tl-card flex flex-col">
            {draft.approvalStatus === 'pending' && (
              <div className="border-b border-tl-purple-100 bg-tl-purple-50 px-5 py-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-2">
                    <Shield className="mt-0.5 h-4 w-4 shrink-0 text-tl-purple-600" />
                    <div>
                      <p className="text-xs font-semibold text-tl-purple-800">
                        Agent draft — you approve before sending
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-tl-purple-700">
                        Edit the reply below, then approve. Nothing is sent to Outlook until you
                        confirm.
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      data-testid="reject-draft"
                      onClick={handleReject}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-tl-gray-200 bg-surface px-3 py-1.5 text-xs font-medium text-tl-gray-600 hover:bg-tl-gray-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </button>
                    <button
                      type="button"
                      data-testid="approve-draft"
                      onClick={handleApprove}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-tl-cyan-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-tl-cyan-600"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            )}

            {draft.approvalStatus === 'approved' && (
              <div className="border-b border-tl-cyan-100 bg-tl-cyan-50 px-5 py-3">
                <p className="text-xs font-semibold text-tl-cyan-800">
                  Approved — ready to send via Outlook
                </p>
              </div>
            )}

            <div className="flex flex-1 flex-col p-5">
              <label className="text-xs font-medium text-tl-gray-500">Subject</label>
              <input
                type="text"
                value={draft.subject}
                onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                disabled={step === 'approved'}
                className="tl-input mt-1 mb-4 px-3 py-2 text-sm font-medium"
              />

              <label className="text-xs font-medium text-tl-gray-500">Body</label>
              <textarea
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                disabled={step === 'approved'}
                rows={12}
                className="tl-input mt-1 flex-1 resize-none px-3 py-2 text-sm leading-relaxed"
              />

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-tl-gray-100 pt-4">
                <button
                  type="button"
                  data-testid="reset-flow"
                  onClick={reset}
                  className="text-xs text-tl-gray-500 hover:text-tl-gray-700"
                >
                  Start over
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-testid="copy-draft"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-tl-gray-200 px-3 py-2 text-xs font-medium text-tl-gray-600 hover:bg-tl-gray-50"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </button>
                  {step === 'approved' && (
                    <button
                      type="button"
                      data-testid="send-outlook"
                      onClick={handleMockSend}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-tl-brand px-4 py-2 text-xs font-medium text-white"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Send via Outlook
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
