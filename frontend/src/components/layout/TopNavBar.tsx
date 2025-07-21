import { Menu, Folder, ChevronDown, LogOut, GitBranch, Star } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useAnalysisStore } from '../../stores/analysisStore'
import { useNavigate, useParams } from 'react-router-dom'
import { useRepositories } from '../../hooks/useRepositories'
import { Repository } from '../../types'
import { useState, useRef, useEffect } from 'react'

interface TopNavBarProps {
  onMenuClick: () => void
}

const TopNavBar = ({ onMenuClick }: TopNavBarProps) => {
  const { user, logout } = useAuthStore()
  const { selectedRepository } = useAnalysisStore()
  const navigate = useNavigate()
  const { repoId } = useParams<{ repoId: string }>()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Fetch repositories
  const { data: repositories, isLoading } = useRepositories()
  const currentRepo = repositories?.find(repo => repo.id.toString() === repoId)
  
  // Handle repository selection
  const handleSelectRepo = (repo: Repository) => {
    navigate(`/dashboard/${repo.id}`)
    setIsDropdownOpen(false)
  }
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800/50 hover:bg-gray-800 rounded-md transition-colors group"
          >
            <GitBranch className="h-3.5 w-3.5 text-cyan-500" />
            <span className="text-gray-200 font-medium max-w-[200px] truncate">
              {currentRepo ? currentRepo.name : 'Select Repository'}
            </span>
            <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center">Loading...</div>
                ) : repositories && repositories.length > 0 ? (
                  repositories.map((repo) => (
                    <button
                      key={repo.id}
                      onClick={() => handleSelectRepo(repo)}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-800 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-200 group-hover:text-cyan-400 truncate">
                          {repo.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-3 mt-0.5">
                          {repo.language && (
                            <span className="flex items-center gap-1">
                              <span className={`h-2 w-2 rounded-full ${
                                repo.language === 'TypeScript' ? 'bg-blue-500' :
                                repo.language === 'JavaScript' ? 'bg-yellow-500' :
                                repo.language === 'Python' ? 'bg-green-500' :
                                'bg-gray-500'
                              }`} />
                              {repo.language}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {repo.stargazers_count}
                          </span>
                        </div>
                      </div>
                      {currentRepo?.id === repo.id && (
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 ml-2" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center">No repositories found</div>
                )}
              </div>
            </div>
          )}
        </div>
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
