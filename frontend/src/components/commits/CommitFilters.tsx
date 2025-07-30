import React, { useState } from 'react'
import { Users } from 'lucide-react'

interface Contributor {
  name: string
  email?: string
  avatar_url?: string
  contributions: number
  color: string
}

interface CommitFiltersProps {
  contributors?: Contributor[]
  onFilterChange?: (filters: any) => void
  selectedContributor?: string | null
  onContributorSelect?: (contributor: string | null) => void
}

export const CommitFilters: React.FC<CommitFiltersProps> = ({ 
  contributors = [], 
  onFilterChange,
  selectedContributor,
  onContributorSelect 
}) => {
  const [localSelectedContributor, setLocalSelectedContributor] = useState<string | null>(null)
  
  const activeContributor = selectedContributor !== undefined ? selectedContributor : localSelectedContributor

  const handleContributorSelect = (contributorKey: string | null) => {
    if (onContributorSelect) {
      onContributorSelect(contributorKey)
    } else {
      setLocalSelectedContributor(contributorKey)
    }
    
    if (onFilterChange) {
      onFilterChange({ contributor: contributorKey })
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-cyan-400" />
        Contributors
      </h3>
      
      {/* Contributor Selection Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleContributorSelect(null)}
          className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
            activeContributor === null
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All Contributors
        </button>
      </div>
      
      {/* Contributor Profiles - Social Media Style */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {contributors.map((contributor) => {
          const contributorKey = contributor.email || contributor.name
          const isActive = activeContributor === contributorKey
          
          return (
            <button
              key={contributorKey}
              onClick={() => handleContributorSelect(contributorKey)}
              className="flex-shrink-0 text-center group"
            >
              <div className="relative mb-2">
                {contributor.avatar_url ? (
                  <img 
                    src={contributor.avatar_url} 
                    alt={contributor.name}
                    className={`w-16 h-16 rounded-full border-3 transition-all duration-200 ${
                      isActive 
                        ? 'border-cyan-500 shadow-lg shadow-cyan-500/25' 
                        : 'border-gray-700 group-hover:border-gray-600'
                    }`}
                  />
                ) : (
                  <div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-3 transition-all duration-200 ${
                      isActive 
                        ? 'border-cyan-500 shadow-lg shadow-cyan-500/25' 
                        : 'border-gray-700 group-hover:border-gray-600'
                    }`}
                    style={{ 
                      backgroundColor: `${contributor.color}33`,
                      color: contributor.color
                    }}
                  >
                    {contributor.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {isActive && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full border-2 border-gray-800"></div>
                )}
              </div>
              <div className="max-w-[80px]">
                <p className={`text-xs font-medium truncate ${
                  isActive ? 'text-cyan-400' : 'text-gray-300'
                }`}>
                  {contributor.name.split(' ')[0]}
                </p>
                <p className="text-xs text-gray-500">
                  {contributor.contributions} commits
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
