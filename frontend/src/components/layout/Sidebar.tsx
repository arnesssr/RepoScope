import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  FileText, 
  Shield, 
  Calendar,
  Settings,
  X,
  Sparkles,
  Activity,
  FolderOpen,
  LogOut,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved ? JSON.parse(saved) : false
  })

  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState))
    // Dispatch custom event for same-window updates
    window.dispatchEvent(new Event('sidebar-collapsed-changed'))
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Timeline', href: '/dashboard/timeline', icon: Calendar },
    { name: 'Planning', href: '/dashboard/planning', icon: FileText },
    { name: 'Security', href: '/dashboard/threats', icon: Shield },
    { name: 'Dependencies', href: '/dashboard/dependencies', icon: FolderOpen },
    { name: 'Code Quality', href: '/dashboard/code-quality', icon: FileText },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === href || location.pathname.match(/^\/dashboard\/\d+$/)
    }
    return location.pathname.startsWith(href)
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
      <motion.div 
        className={`
          fixed top-16 bottom-0 left-0 z-40 bg-gray-950 border-r border-gray-800
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
        animate={{ width: isCollapsed ? 80 : 256 }}
      >
        <div className="flex h-full flex-col">
          {/* Logo and Collapse Button */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-cyan-400 flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-xl font-bold text-white overflow-hidden whitespace-nowrap"
                  >
                    RepoScope
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            {/* Desktop Collapse Button */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-hide">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg
                      transition-all duration-200
                      ${active 
                        ? 'bg-gray-800/50 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                      }
                    `}
                  >
                    {/* Active indicator */}
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-r-full"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    )}
                    
                    <Icon className={`
                      ${isCollapsed ? '' : 'mr-3'} h-5 w-5 transition-all duration-200 flex-shrink-0
                      ${active 
                        ? 'text-cyan-400' 
                        : 'text-gray-500 group-hover:text-gray-300'
                      }
                    `} />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span 
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="flex-1 overflow-hidden whitespace-nowrap"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                    
                    {/* Hover effect */}
                    <div className={`
                      absolute inset-0 rounded-lg transition-opacity duration-200
                      ${active ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}
                    `}>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-lg" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 space-y-3 border-t border-gray-800/50">
            {/* User Profile Section */}
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800/30 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                JD
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 min-w-0 overflow-hidden"
                  >
                    <p className="text-sm font-medium text-white truncate">John Doe</p>
                    <p className="text-xs text-gray-400 truncate">john@example.com</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-1">
              <Link
                to="/dashboard/settings"
                className={`
                  group relative flex items-center px-3 py-2 text-sm font-medium rounded-lg
                  transition-all duration-200
                  ${isActive('/dashboard/settings')
                    ? 'bg-gray-800/50 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <Settings className={`${isCollapsed ? '' : 'mr-3'} h-4 w-4 flex-shrink-0`} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      Settings
                    </motion.span>
                  )}
                </AnimatePresence>
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    Settings
                  </div>
                )}
              </Link>

              <button className={`w-full group relative flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/30 transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}>
                <LogOut className={`${isCollapsed ? '' : 'mr-3'} h-4 w-4 flex-shrink-0`} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      Sign out
                    </motion.span>
                  )}
                </AnimatePresence>
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    Sign out
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar
