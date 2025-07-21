import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopNavBar from './TopNavBar'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved ? JSON.parse(saved) : false
  })

  // Listen for sidebar collapse changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('sidebar-collapsed')
      setSidebarCollapsed(saved ? JSON.parse(saved) : false)
    }

    window.addEventListener('storage', handleStorageChange)
    // Also listen for custom event for same-window updates
    window.addEventListener('sidebar-collapsed-changed', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('sidebar-collapsed-changed', handleStorageChange)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation Bar - Full Width */}
      <TopNavBar onMenuClick={() => setSidebarOpen(true)} />
      
      {/* Content Below Header */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
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
