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
} from 'lucide-react'
import { Logo } from './Logo'

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
      className={`glass-panel flex h-full flex-col border-r transition-all duration-300 ease-out ${
        collapsed ? 'w-[72px]' : 'w-60'
      }`}
    >
      <div className={`p-5 ${collapsed ? 'flex justify-center px-3' : ''}`}>
        {collapsed ? (
          <Logo variant="icon" />
        ) : (
          <div className="min-w-0">
            <Logo variant="full" />
            <p className="mt-2 truncate text-xs tracking-wide text-tl-gray-500">AI Work Assistant</p>
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
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-tl-brand text-white shadow-tl-brand'
                  : 'nav-item-idle'
              } ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {badge !== undefined && badge > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        isActive ? 'bg-surface/20 text-white' : 'bg-tl-gray-100 text-tl-gray-600'
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

      <div className="border-t border-tl-gray-200/60 p-3">
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
            activeItem === 'settings'
              ? 'bg-tl-brand text-white shadow-tl-brand'
              : 'nav-item-idle'
          } ${collapsed ? 'justify-center px-2' : ''}`}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>

        <button
          type="button"
          onClick={onToggle}
          className="mt-2 flex w-full items-center justify-center rounded-xl p-2 text-tl-gray-400 transition-all hover:bg-tl-gray-100 hover:text-tl-gray-600 dark:hover:bg-tl-gray-200/10"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </aside>
  )
}
