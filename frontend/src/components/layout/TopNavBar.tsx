import { Menu, Folder, ChevronDown, LogOut } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useAnalysisStore } from '../../stores/analysisStore'
import { useNavigate } from 'react-router-dom'

interface TopNavBarProps {
  onMenuClick: () => void
}

const TopNavBar = ({ onMenuClick }: TopNavBarProps) => {
  const { user, logout } = useAuthStore()
  const { selectedRepository } = useAnalysisStore()
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-400 hover:text-white"
      >
        <Menu className="h-6 w-6" />
      </button>
      
      {/* Repository Selector - Center */}
      <div className="flex-1 flex justify-center">
        <button 
          onClick={() => navigate('/dashboard/repositories')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Folder className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-300">
            {selectedRepository || 'Select Repository'}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* User Menu - Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.username}`}
            alt={user?.username}
            className="h-8 w-8 rounded-full border border-gray-700"
          />
          <span className="hidden sm:block text-sm text-gray-300">{user?.username}</span>
        </div>
        <button
          onClick={logout}
          className="text-gray-400 hover:text-white transition-colors"
          title="Sign out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default TopNavBar
