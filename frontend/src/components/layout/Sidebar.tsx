import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Search, 
  FileText, 
  Shield, 
  Calendar,
  Settings,
  X,
  Sparkles,
  GitBranch,
  GitCommit,
  Users,
  Activity,
  FolderOpen,
  Bell,
  LogOut,
  ChevronDown,
  BarChart3
} from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation()
  const [notificationCount] = useState(3) // Mock notification count

  const navigationGroups = [
    {
      title: 'Main',
      items: [
        { name: 'Overview', href: '/dashboard', icon: Home },
      ]
    },
    {
      title: 'Repository',
      items: [
        { name: 'Repositories', href: '/dashboard/repositories', icon: GitBranch },
        { name: 'Commits', href: '/dashboard/commits', icon: GitCommit },
        { name: 'Contributors', href: '/dashboard/contributors', icon: Users },
        { name: 'Files', href: '/dashboard/files', icon: FolderOpen },
      ]
    },
    {
      title: 'Analytics',
      items: [
        { name: 'Analysis', href: '/dashboard/analytics', icon: BarChart3 },
        { name: 'Activity', href: '/dashboard/activity', icon: Activity },
        { name: 'Timeline', href: '/dashboard/timeline', icon: Calendar },
      ]
    },
    {
      title: 'Management',
      items: [
        { name: 'Planning', href: '/dashboard/planning', icon: FileText },
        { name: 'Threats', href: '/dashboard/threats', icon: Shield },
      ]
    },
  ]

  const isActive = (href: string) => {
    return location.pathname === href
  }

  const renderNavItem = (item: { name: string; href: string; icon: any }) => {
    const Icon = item.icon
    const active = isActive(item.href)
    
    return (
      <Link
        key={item.name}
        to={item.href}
        className={`
          group flex items-center px-3 py-2 text-sm font-medium rounded-lg
          transition-all duration-200
          ${active 
            ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }
        `}
      >
        <Icon className={`
          mr-3 h-5 w-5 transition-all duration-200
          ${active 
            ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' 
            : 'text-gray-500 group-hover:text-gray-300'
          }
        `} />
        {item.name}
        {active && (
          <div className="ml-auto h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 border-r border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-cyan-400" />
              <span className="text-xl font-bold text-white">RepoScope</span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
            {navigationGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-3">
                  {group.title}
                </h2>
                <div className="space-y-1">
                  {group.items.map((item) => renderNavItem(item))}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 p-4 space-y-2">
            {/* Settings */}
            <Link
              to="/dashboard/settings"
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-lg
                transition-all duration-200
                ${isActive('/dashboard/settings')
                  ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>

            {/* Notifications */}
            <button className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200">
              <Bell className="mr-3 h-5 w-5" />
              Notifications
              {notificationCount > 0 && (
                <span className="ml-auto bg-cyan-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Logout */}
            <button className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/20 transition-all duration-200">
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
