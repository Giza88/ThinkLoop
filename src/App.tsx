import { useCallback, useEffect, useState } from 'react'
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
import type { Draft, HistoryEntry, StructuredDocument, Thought } from './types'
import { organizeThoughts } from './utils/organizeThoughts'
import {
  loadConnectedIntegrations,
  loadDrafts,
  loadHistory,
  saveConnectedIntegrations,
  saveDrafts,
  saveHistory,
} from './utils/storage'

function documentToMarkdown(doc: StructuredDocument): string {
  const sections = doc.sections
    .map((section) => `## ${section.title}\n\n${section.content}`)
    .join('\n\n')
  return `# ${doc.title}\n\n${sections}`
}

function documentPreview(doc: StructuredDocument): string {
  const firstSection = doc.sections[0]
  if (!firstSection) return doc.title
  return firstSection.content.replace(/^•\s*/gm, '').slice(0, 140)
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [searchOpen, setSearchOpen] = useState(false)
  const [promptIndex, setPromptIndex] = useState(0)
  const [input, setInput] = useState('')
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [structuredDoc, setStructuredDoc] = useState<StructuredDocument | null>(null)
  const [isOrganizing, setIsOrganizing] = useState(false)
  const [drafts, setDrafts] = useState<Draft[]>(() => loadDrafts())
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>(() =>
    loadConnectedIntegrations(),
  )
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(true)
  const [showPrompts, setShowPrompts] = useState(true)
  const [requireApproval, setRequireApproval] = useState(true)

  useEffect(() => {
    saveDrafts(drafts)
  }, [drafts])

  useEffect(() => {
    saveHistory(history)
  }, [history])

  useEffect(() => {
    saveConnectedIntegrations(connectedIntegrations)
  }, [connectedIntegrations])

  const addHistoryEntry = useCallback(
    (title: string, action: HistoryEntry['action']) => {
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          title,
          action,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 50))
    },
    [],
  )

  const handleConnectIntegration = useCallback((providerId: string) => {
    setConnectedIntegrations((prev) =>
      prev.includes(providerId) ? prev : [...prev, providerId],
    )
  }, [])

  const handleDisconnectIntegration = useCallback((providerId: string) => {
    setConnectedIntegrations((prev) => prev.filter((id) => id !== providerId))
  }, [])

  const saveDraft = useCallback((doc: StructuredDocument) => {
    const preview = documentPreview(doc)
    setDrafts((prev) => {
      const existing = prev.find((draft) => draft.title === doc.title)
      if (existing) {
        return prev.map((draft) =>
          draft.id === existing.id
            ? {
                ...draft,
                preview,
                updatedAt: new Date().toISOString(),
                document: {
                  ...doc,
                  generatedAt: doc.generatedAt,
                },
              }
            : draft,
        )
      }

      return [
        {
          id: crypto.randomUUID(),
          title: doc.title,
          preview,
          updatedAt: new Date().toISOString(),
          document: doc,
        },
        ...prev,
      ]
    })
  }, [])

  const handleAddThought = useCallback(() => {
    const text = input.trim()
    if (!text) return

    setThoughts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, createdAt: new Date() },
    ])
    setInput('')
  }, [input])

  const handleOrganize = useCallback(async () => {
    if (thoughts.length === 0) return

    setIsOrganizing(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    const doc = organizeThoughts(thoughts)
    const proposal: StructuredDocument = {
      ...doc,
      approvalStatus: requireApproval ? 'pending' : 'approved',
    }
    setStructuredDoc(proposal)
    setIsOrganizing(false)

    addHistoryEntry(doc.title, 'organized')

    if (!requireApproval && autoSaveDrafts) {
      saveDraft(proposal)
      addHistoryEntry(doc.title, 'saved')
    }
  }, [thoughts, requireApproval, autoSaveDrafts, addHistoryEntry, saveDraft])

  const handleApprove = useCallback(() => {
    if (!structuredDoc) return

    const approved: StructuredDocument = {
      ...structuredDoc,
      approvalStatus: 'approved',
    }
    setStructuredDoc(approved)
    addHistoryEntry(structuredDoc.title, 'approved')

    if (autoSaveDrafts) {
      saveDraft(approved)
      addHistoryEntry(structuredDoc.title, 'saved')
    }
  }, [structuredDoc, autoSaveDrafts, addHistoryEntry, saveDraft])

  const handleReject = useCallback(() => {
    if (!structuredDoc) return
    addHistoryEntry(structuredDoc.title, 'rejected')
    setStructuredDoc(null)
  }, [structuredDoc, addHistoryEntry])

  const handleCopy = useCallback(async () => {
    if (!structuredDoc || structuredDoc.approvalStatus !== 'approved') return
    await navigator.clipboard.writeText(documentToMarkdown(structuredDoc))
  }, [structuredDoc])

  const handleExport = useCallback(() => {
    if (!structuredDoc || structuredDoc.approvalStatus !== 'approved') return
    const blob = new Blob([documentToMarkdown(structuredDoc)], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const anchor = window.document.createElement('a')
    anchor.href = url
    anchor.download = `${structuredDoc.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`
    anchor.click()
    URL.revokeObjectURL(url)
    addHistoryEntry(structuredDoc.title, 'exported')
  }, [structuredDoc, addHistoryEntry])

  const handleOpenDraft = useCallback((draft: Draft) => {
    setStructuredDoc({
      ...draft.document,
      generatedAt: new Date(draft.document.generatedAt),
      approvalStatus: draft.document.approvalStatus ?? 'approved',
    })
    setThoughts([])
    setActiveNav('workspace')
  }, [])

  const handleDeleteDraft = useCallback((id: string) => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== id))
  }, [])

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

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <DashboardHome
            connectedIntegrations={connectedIntegrations}
            onNavigate={setActiveNav}
            onConnectIntegration={handleConnectIntegration}
            onDisconnectIntegration={handleDisconnectIntegration}
          />
        )

      case 'workspace':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">ThinkLoop Workspace</h1>
              <p className="mt-1 text-sm text-slate-500">
                Your ideas drive everything. The agent proposes — you review and approve before
                anything is saved or exported.
              </p>
              {connectedIntegrations.length > 0 && (
                <p className="mt-2 text-xs text-emerald-700">
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
            onAutoSaveChange={setAutoSaveDrafts}
            onShowPromptsChange={setShowPrompts}
            onRequireApprovalChange={setRequireApproval}
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
    <div className="flex h-full bg-slate-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        activeItem={activeNav}
        draftCount={drafts.length}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        onNavigate={setActiveNav}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onSearchFocus={() => setSearchOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}

export default App
