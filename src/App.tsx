import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from './api/client'
import { migrateLocalStorageIfNeeded } from './api/migrate'
import { BrainstormBoard } from './components/BrainstormBoard'
import { CapturePanel } from './components/CapturePanel'
import { DashboardHome } from './components/DashboardHome'
import { DocumentPanel } from './components/DocumentPanel'
import { DraftsView } from './components/DraftsView'
import { Header } from './components/Header'
import { HistoryView } from './components/HistoryView'
import { ProcessSteps } from './components/ProcessSteps'
import { SearchModal } from './components/SearchModal'
import { SectionPlaceholder } from './components/SectionPlaceholder'
import { SettingsView } from './components/SettingsView'
import { Sidebar } from './components/Sidebar'
import { PROMPTS } from './data/mockData'
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
        api.saveWorkspace(nextThoughts, nextDoc).catch(console.error)
      }, 500)
    },
    [],
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
        console.error('Failed to load from API', err)
      } finally {
        setReady(true)
      }
    }
    bootstrap()
  }, [])

  const handleConnectIntegration = useCallback(
    async (providerId: string) => {
      const { connected } = await api.connectIntegration(providerId)
      setConnectedIntegrations(connected)
    },
    [],
  )

  const handleDisconnectIntegration = useCallback(
    async (providerId: string) => {
      const { connected } = await api.disconnectIntegration(providerId)
      setConnectedIntegrations(connected)
    },
    [],
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
      console.error(err)
    }
  }, [input])

  const handleOrganize = useCallback(async () => {
    if (thoughts.length === 0) return

    setIsOrganizing(true)
    try {
      const session = await api.organizeWorkspace()
      setThoughts(session.thoughts)
      setStructuredDoc(session.document)
      await Promise.all([refreshHistory(), refreshDrafts(), refreshStats()])
    } catch (err) {
      console.error(err)
    } finally {
      setIsOrganizing(false)
    }
  }, [thoughts.length, refreshHistory, refreshDrafts, refreshStats])

  const handleApprove = useCallback(async () => {
    if (!structuredDoc) return
    try {
      const session = await api.approveWorkspace()
      setThoughts(session.thoughts)
      setStructuredDoc(session.document)
      await Promise.all([refreshHistory(), refreshDrafts(), refreshStats()])
    } catch (err) {
      console.error(err)
    }
  }, [structuredDoc, refreshHistory, refreshDrafts, refreshStats])

  const handleReject = useCallback(async () => {
    if (!structuredDoc) return
    try {
      const session = await api.rejectWorkspace()
      setThoughts(session.thoughts)
      setStructuredDoc(null)
      await refreshHistory()
    } catch (err) {
      console.error(err)
    }
  }, [structuredDoc, refreshHistory])

  const handleCopy = useCallback(async () => {
    if (!structuredDoc || structuredDoc.approvalStatus !== 'approved') return
    await navigator.clipboard.writeText(documentToMarkdown(structuredDoc))
  }, [structuredDoc])

  const handleExport = useCallback(async () => {
    if (!structuredDoc || structuredDoc.approvalStatus !== 'approved') return
    const blob = new Blob([documentToMarkdown(structuredDoc)], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const anchor = window.document.createElement('a')
    anchor.href = url
    anchor.download = `${structuredDoc.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`
    anchor.click()
    URL.revokeObjectURL(url)
    await api.recordExport()
    await Promise.all([refreshHistory(), refreshStats()])
  }, [structuredDoc, refreshHistory, refreshStats])

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
      await api.deleteDraft(id)
      await refreshDrafts()
    },
    [refreshDrafts],
  )

  const handleSettingsChange = useCallback(
    async (patch: {
      autoSaveDrafts?: boolean
      showPrompts?: boolean
      requireApproval?: boolean
    }) => {
      const next = await api.patchSettings(patch)
      setAutoSaveDrafts(next.autoSaveDrafts)
      setShowPrompts(next.showPrompts)
      setRequireApproval(next.requireApproval)
    },
    [],
  )

  const handleSidebarToggle = useCallback(async () => {
    const next = !sidebarCollapsed
    setSidebarCollapsed(next)
    await api.patchSettings({ sidebarCollapsed: next })
  }, [sidebarCollapsed])

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
