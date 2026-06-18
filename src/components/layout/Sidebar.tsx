import { Icon } from '../Icon'
import { navItems, type NavItem } from '../../data/content'

interface SidebarProps {
  active: NavItem
  onNavigate: (item: NavItem) => void
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-tl-gray-200 bg-white">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tl-teal text-white">
          <Icon name="zap" size={18} />
        </div>
        <div className="text-left">
          <div className="text-sm font-bold text-tl-gray-900">ThinkLoop</div>
          <div className="text-[11px] text-tl-gray-500">AI Work Assistant</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {navItems.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                isActive
                  ? 'bg-tl-blue font-medium text-white'
                  : 'text-tl-gray-500 hover:bg-tl-gray-100 hover:text-tl-gray-700'
              }`}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-tl-gray-200 px-3 py-3">
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
            active === 'settings'
              ? 'bg-tl-blue font-medium text-white'
              : 'text-tl-gray-500 hover:bg-tl-gray-100 hover:text-tl-gray-700'
          }`}
        >
          <Icon name="settings" size={18} />
          Settings
        </button>
        <button
          type="button"
          className="mt-1 flex w-full items-center justify-center rounded-lg py-1.5 text-tl-gray-400 hover:text-tl-gray-600"
          aria-label="Collapse sidebar"
        >
          <Icon name="chevronLeft" size={16} />
        </button>
      </div>
    </aside>
  )
}
