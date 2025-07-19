import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { 
  Home, 
  GitBranch, 
  FileCode2, 
  GitCommit, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Sparkles,
  Activity,
  BarChart3
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Repositories', href: '/dashboard/repositories', icon: GitBranch },
    { name: 'Commits', href: '/dashboard/commits', icon: GitCommit },
    { name: 'Contributors', href: '/dashboard/contributors', icon: Users },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Activity', href: '/dashboard/activity', icon: Activity },
    { name: 'Files', href: '/dashboard/files', icon: FileCode2 },
  ]

  const isActive = (href: string) => {
    return location.pathname === href
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 border-r border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-cyan-400" />
              <span className="text-xl font-bold text-white">RepoScope</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
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
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.username}`}
                alt={user?.username}
                className="h-10 w-10 rounded-full border-2 border-cyan-500/30"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user?.username}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-1">
              <Link
                to="/dashboard/settings"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 rounded-lg hover:text-white hover:bg-gray-800 transition-colors"
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-400 rounded-lg hover:text-white hover:bg-gray-800 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* You can add breadcrumbs or other top bar content here */}
          <div className="flex-1">
            {/* Placeholder for future content */}
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)]">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
