import {
  Brain,
  ChevronLeft,
  FileText,
  History,
  LayoutDashboard,
  Lightbulb,
  Search,
  Settings,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'

type SidebarProps = {
  collapsed: boolean
  activeItem: string
  draftCount?: number
  onToggle: () => void
  onNavigate: (id: string) => void
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'workspace', label: 'AI Workspace', icon: Sparkles },
  { id: 'brainstorm', label: 'Brainstorm', icon: Lightbulb },
  { id: 'drafts', label: 'Drafts', icon: FileText, badgeFromDrafts: true },
  { id: 'summaries', label: 'Summaries', icon: Brain },
  { id: 'research', label: 'Research', icon: Search },
  { id: 'history', label: 'History', icon: History },
  { id: 'team', label: 'Team', icon: Users },
]

export function Sidebar({ collapsed, activeItem, draftCount = 0, onToggle, onNavigate }: SidebarProps) {
  return (
    <aside
      className={`flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-200 ${
        collapsed ? 'w-[72px]' : 'w-60'
      }`}
    >
      <div className={`flex items-center gap-3 p-5 ${collapsed ? 'justify-center px-3' : ''}`}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-sm">
          <Zap className="h-5 w-5 text-white" fill="white" />
        </div>
        {!collapsed && (
          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-bold text-slate-900">ThinkLoop</p>
            <p className="truncate text-xs text-slate-500">AI Work Assistant</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id
          const badge = 'badgeFromDrafts' in item && item.badgeFromDrafts ? draftCount : undefined

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              } ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {badge !== undefined && badge > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            activeItem === 'settings'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          } ${collapsed ? 'justify-center px-2' : ''}`}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>

        <button
          type="button"
          onClick={onToggle}
          className="mt-2 flex w-full items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </aside>
  )
}
