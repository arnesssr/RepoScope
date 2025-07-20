import React, { useState } from 'react'
import { ChevronDown, GitBranch, Search } from 'lucide-react'
import { Repository } from '../../types'

interface RepositorySelectorProps {
  repositories: Repository[]
  selectedRepo: Repository | null
  onSelectRepo: (repo: Repository) => void
  isLoading?: boolean
}

export const RepositorySelector: React.FC<RepositorySelectorProps> = ({
  repositories,
  selectedRepo,
  onSelectRepo,
  isLoading = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative w-full max-w-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg hover:border-cyan-500/50 transition-all group"
        disabled={isLoading}
      >
        <div className="flex items-center gap-3">
          <GitBranch className="h-5 w-5 text-cyan-400" />
          {selectedRepo ? (
            <div className="text-left">
              <p className="text-white font-medium">{selectedRepo.name}</p>
              <p className="text-xs text-gray-400">{selectedRepo.description || 'No description'}</p>
            </div>
          ) : (
            <p className="text-gray-400">Select a repository to analyze</p>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-950 border border-gray-800 rounded-lg shadow-2xl z-50 max-h-96 overflow-hidden">
          <div className="p-3 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-4 text-center text-gray-400">Loading repositories...</div>
            ) : filteredRepos.length === 0 ? (
              <div className="p-4 text-center text-gray-400">No repositories found</div>
            ) : (
              filteredRepos.map((repo) => (
                <button
                  key={repo.id}
                  onClick={() => {
                    onSelectRepo(repo)
                    setIsOpen(false)
                    setSearchQuery('')
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-900 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                        {repo.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {repo.language && (
                          <span className="inline-flex items-center gap-1 mr-3">
                            <span className={`h-2 w-2 rounded-full ${
                              repo.language === 'TypeScript' ? 'bg-blue-500' :
                              repo.language === 'JavaScript' ? 'bg-yellow-500' :
                              repo.language === 'Python' ? 'bg-green-500' :
                              'bg-gray-500'
                            }`} />
                            {repo.language}
                          </span>
                        )}
                        <span>{repo.stargazers_count} stars</span>
                      </p>
                    </div>
                    {selectedRepo?.id === repo.id && (
                      <div className="h-2 w-2 rounded-full bg-cyan-400" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
