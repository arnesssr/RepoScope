import React, { useState, useEffect } from 'react'
import { GitCommit, User, Calendar, FileText, ChevronDown, ChevronUp, GitBranch, Database, Package } from 'lucide-react'

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

export const CommitList: React.FC<CommitListProps> = ({ contributors, commits, selectedContributor: propSelectedContributor, onMount }) => {
  const [expandedContributor, setExpandedContributor] = useState<string | null>(null)
  const [localSelectedContributor, setLocalSelectedContributor] = useState<string | null>(null)
  const [showAllCommits, setShowAllCommits] = useState<Record<string, boolean>>({})
  
  // Use prop if provided, otherwise use local state
  const selectedContributor = propSelectedContributor !== undefined ? propSelectedContributor : localSelectedContributor

  // Debug logging
  useEffect(() => {
    console.log('=== COMMIT LIST DEBUG ===')
    console.log('Contributors received:', contributors)
    console.log('Commits received:', commits)
    console.log('Commits count:', commits?.length || 0)
    console.log('Contributors count:', contributors?.length || 0)
    
    if (onMount) {
      onMount()
    }
  }, [contributors, commits, onMount])

  // Group commits by contributor
  const commitsByContributor = commits.reduce((acc, commit) => {
    // Handle both nested and flat structure
    const authorEmail = commit.author?.email || commit.author_email
    if (!authorEmail) {
      console.warn('Commit missing author email:', commit)
      return acc
    }
    if (!acc[authorEmail]) {
      acc[authorEmail] = []
    }
    acc[authorEmail].push(commit)
    return acc
  }, {} as Record<string, Commit[]>)

  console.log('Commits by contributor:', commitsByContributor)
  console.log('Active contributors before filter:', contributors)

  // Filter contributors who have commits
  const activeContributors = contributors.filter(contributor => {
    const hasCommits = commitsByContributor[contributor.email || contributor.name]
    console.log(`Checking contributor ${contributor.name} (${contributor.email}):`, hasCommits ? 'has commits' : 'no commits')
    return hasCommits
  })
  
  console.log('Active contributors after filter:', activeContributors)

  const toggleContributor = (email: string) => {
    setExpandedContributor(expandedContributor === email ? null : email)
  }

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

  // Filter commits based on selected contributor
  const filteredCommits = selectedContributor 
    ? commits.filter(commit => {
        const authorEmail = commit.author?.email || commit.author_email
        return authorEmail === selectedContributor
      })
    : commits

  return (
    <div className="space-y-4">
      {/* Show all commits or filtered by contributor */}
      {filteredCommits.length === 0 ? (
        <div className="text-center py-8">
          <GitCommit className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            {selectedContributor 
              ? `No commits found for this contributor.`
              : `No commit data available.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCommits.map((commit) => {
          const contributorKey = contributor.email || contributor.name
          const contributorCommits = commitsByContributor[contributorKey] || []
          const isExpanded = expandedContributor === contributorKey
          const showAll = showAllCommits[contributorKey] || false
          
          // Show first 3 commits by default, all if showAll is true
          const visibleCommits = showAll ? contributorCommits : contributorCommits.slice(0, 3)
          const hasMoreCommits = contributorCommits.length > 3

          return (
            <div key={contributorKey} className="border border-gray-700 rounded-lg overflow-hidden">
              <div className="border-b border-gray-700 bg-gray-800/50 flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <h4 className="text-white font-medium">{contributor.name}</h4>
                    <p className="text-gray-400 text-sm">
                      {contributorCommits.length} commits
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContributor(contributorKey)}
                  className="text-cyan-500 hover:text-cyan-400 text-sm"
                >
                  View Profile
                </button>
              </div>

              {/* Contributor Profile */}
              {selectedContributor === contributorKey && (
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-purple-400" />
                    <span className="text-sm text-gray-300">Branches Created</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm text-gray-300">Pull Requests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-gray-300">Contribution Percentage</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Contribution: {((contributor.contributions / commits.length) * 100).toFixed(2)}%
                  </p>
                </div>
              )}

              {/* Commit List */}
              <div className="border-t border-gray-700">
                <div className="max-h-96 overflow-y-auto">
                  {visibleCommits.map((commit) => (
                    <div 
                      key={commit.sha} 
                      className="px-4 py-3 border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <GitCommit className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-mono">
                            {truncateCommitMessage(commit.message)}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
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
                          <div className="mt-1">
                            <code className="text-xs text-gray-500 font-mono">
                              {commit.sha.substring(0, 7)}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View More/Less Button */}
                {hasMoreCommits && (
                  <div className="px-4 py-2 border-t border-gray-700/50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowAllCommits(prev => ({
                          ...prev,
                          [contributorKey]: !showAll
                        }))
                      }}
                      className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                    >
                      {showAll ? (
                        <span>Show less</span>
                      ) : (
                        <span>View {contributorCommits.length - 3} more commits</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {activeContributors.length === 0 && (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            No commit data available for contributors.
          </p>
        </div>
      )}
    </div>
  )
}
