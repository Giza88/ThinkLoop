import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from './api/client'
import { migrateLocalStorageIfNeeded } from './api/migrate'
import { BrainstormBoard } from './components/BrainstormBoard'
import { CapturePanel } from './components/CapturePanel'
import { DashboardHome } from './components/DashboardHome'
import { DocumentPanel } from './components/DocumentPanel'
import { DraftsView } from './components/DraftsView'
import { EmailReplyView } from './components/EmailReplyView'
import { Header } from './components/Header'
import { HistoryView } from './components/HistoryView'
import { ProcessSteps } from './components/ProcessSteps'
import { SearchModal } from './components/SearchModal'
import { SectionPlaceholder } from './components/SectionPlaceholder'
import { SettingsView } from './components/SettingsView'
import { Sidebar } from './components/Sidebar'
import { useToast } from './context/ToastContext'
import { PROMPTS } from './data/mockData'
import { getErrorMessage } from './utils/getErrorMessage'
import type {
  DashboardStats,
  Draft,
  HistoryEntry,
  StructuredDocument,
  Thought,
} from './types'

function documentToMarkdown(doc: StructuredDocument): string {
  const sections = doc.sections
    .map((section) => `## ${section.title}\n\n${section.content}`)
    .join('\n\n')
  return `# ${doc.title}\n\n${sections}`
}

export default function App() {
  const toast = useToast()
  const [ready, setReady] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [searchOpen, setSearchOpen] = useState(false)
  const [promptIndex, setPromptIndex] = useState(0)
  const [input, setInput] = useState('')
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [structuredDoc, setStructuredDoc] = useState<StructuredDocument | null>(null)
  const [isOrganizing, setIsOrganizing] = useState(false)
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([])
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(true)
  const [showPrompts, setShowPrompts] = useState(true)
  const [requireApproval, setRequireApproval] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  const saveWorkspaceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveErrorShown = useRef(false)

  const refreshDrafts = useCallback(async () => {
    setDrafts(await api.getDrafts())
  }, [])

  const refreshHistory = useCallback(async () => {
    setHistory(await api.getHistory())
  }, [])

  const refreshStats = useCallback(async () => {
    setStats(await api.getStats())
  }, [])

  const scheduleWorkspaceSave = useCallback(
    (nextThoughts: Thought[], nextDoc: StructuredDocument | null) => {
      if (saveWorkspaceTimer.current) clearTimeout(saveWorkspaceTimer.current)
      saveWorkspaceTimer.current = setTimeout(() => {
        api.saveWorkspace(nextThoughts, nextDoc).catch((err) => {
          if (!saveErrorShown.current) {
            saveErrorShown.current = true
            toast.error(getErrorMessage(err, 'Could not save workspace'))
            setTimeout(() => {
              saveErrorShown.current = false
            }, 5000)
          }
        })
      }, 500)
    },
    [toast],
  )

  useEffect(() => {
    async function bootstrap() {
      try {
        await migrateLocalStorageIfNeeded()
        const [settings, workspace, draftsData, historyData, integrationsData, statsData] =
          await Promise.all([
            api.getSettings(),
            api.getWorkspace(),
            api.getDrafts(),
            api.getHistory(),
            api.getIntegrations(),
            api.getStats(),
          ])

        setAutoSaveDrafts(settings.autoSaveDrafts)
        setShowPrompts(settings.showPrompts)
        setRequireApproval(settings.requireApproval)
        setSidebarCollapsed(settings.sidebarCollapsed)
        setThoughts(workspace.thoughts)
        setStructuredDoc(workspace.document)
        setDrafts(draftsData)
        setHistory(historyData)
        setConnectedIntegrations(integrationsData.connected)
        setStats(statsData)
      } catch (err) {
        toast.error(
          getErrorMessage(err, 'Could not connect to the API. Run npm run dev to start the server.'),
        )
      } finally {
        setReady(true)
      }
    }
    bootstrap()
  }, [])

  const handleConnectIntegration = useCallback(
    async (providerId: string) => {
      try {
        const { connected } = await api.connectIntegration(providerId)
        setConnectedIntegrations(connected)
        toast.success('Integration connected')
      } catch (err) {
        toast.error(getErrorMessage(err, 'Could not connect integration'))
      }
    },
    [toast],
  )

  const handleDisconnectIntegration = useCallback(
    async (providerId: string) => {
      try {
        const { connected } = await api.disconnectIntegration(providerId)
        setConnectedIntegrations(connected)
        toast.success('Integration disconnected')
      } catch (err) {
        toast.error(getErrorMessage(err, 'Could not disconnect integration'))
      }
    },
    [toast],
  )

  const handleAddThought = useCallback(async () => {
    const text = input.trim()
    if (!text) return

    try {
      const session = await api.addThought(text)
      setThoughts(session.thoughts)
      setStructuredDoc(session.document)
      setInput('')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not add thought'))
    }
  }, [input, toast])

  const handleOrganize = useCallback(async () => {
    if (thoughts.length === 0) return

    setIsOrganizing(true)
    try {
      const session = await api.organizeWorkspace()
      setThoughts(session.thoughts)
      setStructuredDoc(session.document)
      await Promise.all([refreshHistory(), refreshDrafts(), refreshStats()])
      toast.success('Thoughts organized — review the proposal')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not organize thoughts'))
    } finally {
      setIsOrganizing(false)
    }
  }, [thoughts.length, refreshHistory, refreshDrafts, refreshStats, toast])

  const handleApprove = useCallback(async () => {
    if (!structuredDoc) return
    try {
      const session = await api.approveWorkspace()
      setThoughts(session.thoughts)
      setStructuredDoc(session.document)
      await Promise.all([refreshHistory(), refreshDrafts(), refreshStats()])
      toast.success('Document approved and saved')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not approve document'))
    }
  }, [structuredDoc, refreshHistory, refreshDrafts, refreshStats, toast])

  const handleReject = useCallback(async () => {
    if (!structuredDoc) return
    try {
      const session = await api.rejectWorkspace()
      setThoughts(session.thoughts)
      setStructuredDoc(null)
      await refreshHistory()
      toast.info('Proposal rejected')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not reject proposal'))
    }
  }, [structuredDoc, refreshHistory, toast])

  const handleCopy = useCallback(async () => {
    if (!structuredDoc || structuredDoc.approvalStatus !== 'approved') return
    try {
      await navigator.clipboard.writeText(documentToMarkdown(structuredDoc))
      toast.success('Copied to clipboard')
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }, [structuredDoc, toast])

  const handleExport = useCallback(async () => {
    if (!structuredDoc || structuredDoc.approvalStatus !== 'approved') return
    const blob = new Blob([documentToMarkdown(structuredDoc)], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const anchor = window.document.createElement('a')
    anchor.href = url
    anchor.download = `${structuredDoc.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`
    anchor.click()
    URL.revokeObjectURL(url)
    try {
      await api.recordExport()
      await Promise.all([refreshHistory(), refreshStats()])
      toast.success('Document exported')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Export saved locally but could not update history'))
    }
  }, [structuredDoc, refreshHistory, refreshStats, toast])

  const handleOpenDraft = useCallback((draft: Draft) => {
    setStructuredDoc({
      ...draft.document,
      approvalStatus: draft.document.approvalStatus ?? 'approved',
    })
    setThoughts([])
    setActiveNav('workspace')
    scheduleWorkspaceSave([], draft.document)
  }, [scheduleWorkspaceSave])

  const handleDeleteDraft = useCallback(
    async (id: string) => {
      try {
        await api.deleteDraft(id)
        await refreshDrafts()
        toast.success('Draft deleted')
      } catch (err) {
        toast.error(getErrorMessage(err, 'Could not delete draft'))
      }
    },
    [refreshDrafts, toast],
  )

  const handleSettingsChange = useCallback(
    async (patch: {
      autoSaveDrafts?: boolean
      showPrompts?: boolean
      requireApproval?: boolean
    }) => {
      try {
        const next = await api.patchSettings(patch)
        setAutoSaveDrafts(next.autoSaveDrafts)
        setShowPrompts(next.showPrompts)
        setRequireApproval(next.requireApproval)
      } catch (err) {
        toast.error(getErrorMessage(err, 'Could not save settings'))
      }
    },
    [toast],
  )

  const handleSidebarToggle = useCallback(async () => {
    const next = !sidebarCollapsed
    setSidebarCollapsed(next)
    try {
      await api.patchSettings({ sidebarCollapsed: next })
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not save sidebar preference'))
    }
  }, [sidebarCollapsed, toast])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center bg-tl-mesh">
        <p className="text-sm text-tl-gray-500">Loading ThinkLoop…</p>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <DashboardHome
            connectedIntegrations={connectedIntegrations}
            stats={stats}
            onNavigate={setActiveNav}
            onConnectIntegration={handleConnectIntegration}
            onDisconnectIntegration={handleDisconnectIntegration}
          />
        )

      case 'workspace':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-tl-gray-900">ThinkLoop Workspace</h1>
              <p className="mt-1 text-sm text-tl-gray-500">
                Your ideas drive everything. The agent proposes — you review and approve before
                anything is saved or exported.
              </p>
              {connectedIntegrations.length > 0 && (
                <p className="mt-2 text-xs text-tl-cyan-600">
                  Reading context from {connectedIntegrations.length} connected tool
                  {connectedIntegrations.length !== 1 ? 's' : ''}. Outbound actions still need
                  your approval.
                </p>
              )}
            </div>

            <ProcessSteps />

            <div className="grid min-h-[480px] gap-6 lg:grid-cols-2">
              <CapturePanel
                prompt={showPrompts ? PROMPTS[promptIndex] : ''}
                input={input}
                thoughts={thoughts}
                onInputChange={setInput}
                onAddThought={handleAddThought}
                onNextPrompt={() => setPromptIndex((i) => (i + 1) % PROMPTS.length)}
              />
              <DocumentPanel
                document={structuredDoc}
                isOrganizing={isOrganizing}
                thoughtCount={thoughts.length}
                onOrganize={handleOrganize}
                onCopy={handleCopy}
                onExport={handleExport}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </div>
          </div>
        )

      case 'email-reply':
        return <EmailReplyView outlookConnected={connectedIntegrations.includes('microsoft')} />

      case 'brainstorm':
        return <BrainstormBoard />

      case 'drafts':
        return (
          <DraftsView
            drafts={drafts}
            onOpen={handleOpenDraft}
            onDelete={handleDeleteDraft}
          />
        )

      case 'history':
        return <HistoryView entries={history} />

      case 'settings':
        return (
          <SettingsView
            autoSaveDrafts={autoSaveDrafts}
            showPrompts={showPrompts}
            requireApproval={requireApproval}
            connectedIntegrations={connectedIntegrations}
            onAutoSaveChange={(v) => handleSettingsChange({ autoSaveDrafts: v })}
            onShowPromptsChange={(v) => handleSettingsChange({ showPrompts: v })}
            onRequireApprovalChange={(v) => handleSettingsChange({ requireApproval: v })}
            onConnectIntegration={handleConnectIntegration}
            onDisconnectIntegration={handleDisconnectIntegration}
          />
        )

      case 'summaries':
        return (
          <SectionPlaceholder
            title="Summaries"
            description="AI-generated summaries from connected tools — every summary waits for your approval before sharing."
          />
        )

      case 'research':
        return (
          <SectionPlaceholder
            title="Research"
            description="Synthesize notes from connected apps. The agent proposes; you approve what gets published."
          />
        )

      case 'team':
        return (
          <SectionPlaceholder
            title="Team"
            description="Collaborate with teammates — shared proposals still require human approval before they go out."
          />
        )

      default:
        return (
          <SectionPlaceholder
            title="Coming soon"
            description="This section is under development."
          />
        )
    }
  }

  return (
    <div className="flex h-full bg-tl-mesh">
      <Sidebar
        collapsed={sidebarCollapsed}
        activeItem={activeNav}
        draftCount={drafts.length}
        onToggle={handleSidebarToggle}
        onNavigate={setActiveNav}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onSearchFocus={() => setSearchOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{renderContent()}</main>
      </div>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={(section) => {
          const map: Record<string, string> = {
            Drafts: 'drafts',
            Brainstorm: 'brainstorm',
            History: 'history',
          }
          const nav = map[section]
          if (nav) setActiveNav(nav)
          setSearchOpen(false)
        }}
      />
    </div>
  )
}
