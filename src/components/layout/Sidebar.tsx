import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, History, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Create Order', path: '/create', icon: PlusCircle },
  { name: 'History', path: '/history', icon: History },
  { name: 'Settings', path: '/settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="w-[250px] bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen fixed left-0 top-0 text-sm">
      <div className="p-6">
        <h1 className="text-white font-bold text-xl tracking-tight">Smart Toolkit</h1>
        <p className="text-slate-500 text-xs mt-1">Orders & Invoices</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md transition-all hover:text-white',
                isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-800/50'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        v0.1.0 • Offline Mode
      </div>
    </aside>
  )
}
