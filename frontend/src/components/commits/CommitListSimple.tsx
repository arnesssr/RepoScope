import React from 'react'
import { GitCommit, Calendar, FileText } from 'lucide-react'

interface Contributor {
  name: string
  email?: string
  avatar_url?: string
  contributions: number
  color: string
}

interface Commit {
  sha: string
  message: string
  author?: {
    name: string
    email: string
    date: string
  }
  // Also support flat structure from backend
  author_email?: string
  author_name?: string
  date: string
  additions?: number
  deletions?: number
  files_changed?: number
}

interface CommitListProps {
  contributors: Contributor[]
  commits: Commit[]
  selectedContributor?: string | null
  onMount?: () => void
}

export const CommitList: React.FC<CommitListProps> = ({ 
  contributors, 
  commits, 
  selectedContributor, 
  onMount 
}) => {
  React.useEffect(() => {
    if (onMount) {
      onMount()
    }
  }, [onMount])

  // Debug logging
  React.useEffect(() => {
    console.log('CommitList - Selected Contributor:', selectedContributor)
    console.log('CommitList - Total Commits:', commits.length)
    console.log('CommitList - All Commits:', commits)
  }, [selectedContributor, commits])

  // Filter commits based on selected contributor
  const filteredCommits = React.useMemo(() => {
    if (!selectedContributor) {
      console.log('No contributor selected, showing all commits')
      return commits
    }
    
    const filtered = commits.filter(commit => {
      const authorEmail = commit.author?.email || commit.author_email
      const authorName = commit.author?.name || commit.author_name
      
      // Check both email and name for matching
      const matches = authorEmail === selectedContributor || authorName === selectedContributor
      
      if (matches) {
        console.log('Matched commit:', commit.sha, 'by', authorEmail || authorName)
      }
      
      return matches
    })
    
    console.log(`Filtered commits for ${selectedContributor}:`, filtered.length, 'commits')
    return filtered
  }, [commits, selectedContributor])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateCommitMessage = (message: string, maxLength: number = 80) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + '...'
  }

  if (filteredCommits.length === 0) {
    return (
      <div className="text-center py-8">
        <GitCommit className="h-12 w-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">
          {selectedContributor 
            ? `No commits found for this contributor.`
            : `No commit data available.`
          }
        </p>
      </div>
    )
  }

  // Find the selected contributor's details
  const selectedContributorInfo = selectedContributor 
    ? contributors.find(c => c.email === selectedContributor || c.name === selectedContributor)
    : null

  return (
    <div className="space-y-4">
      {/* Contributor Header */}
      {selectedContributorInfo && (
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 mb-4">
          <div className="flex items-center gap-3">
            {selectedContributorInfo.avatar_url ? (
              <img 
                src={selectedContributorInfo.avatar_url} 
                alt={selectedContributorInfo.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ 
                  backgroundColor: `${selectedContributorInfo.color}33`,
                  color: selectedContributorInfo.color
                }}
              >
                {selectedContributorInfo.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-white font-medium text-lg">{selectedContributorInfo.name}</h3>
              <p className="text-gray-400 text-sm">
                Showing {filteredCommits.length} of {selectedContributorInfo.contributions} total commits
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Commits List */}
      <div className="space-y-3">
        {filteredCommits.map((commit) => (
        <div 
          key={commit.sha} 
          className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <div className="flex items-start gap-3">
            <GitCommit className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-mono mb-2">
                {truncateCommitMessage(commit.message)}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(commit.date)}
                </span>
                {commit.files_changed !== undefined && (
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {commit.files_changed} files
                  </span>
                )}
                {commit.additions !== undefined && (
                  <span className="text-green-400">
                    +{commit.additions}
                  </span>
                )}
                {commit.deletions !== undefined && (
                  <span className="text-red-400">
                    -{commit.deletions}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <code className="text-xs text-gray-500 font-mono bg-gray-800 px-2 py-1 rounded">
                  {commit.sha.substring(0, 7)}
                </code>
              </div>
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}
