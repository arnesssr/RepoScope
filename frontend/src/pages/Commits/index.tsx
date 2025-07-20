import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { GitCommit, Calendar, GitBranch, Filter } from 'lucide-react'
import { CommitList } from '../../components/commits/CommitList'
import { CommitFilters } from '../../components/commits/CommitFilters'
import { CommitStats } from '../../components/commits/CommitStats'

interface Commit {
  id: string
  sha: string
  message: string
  author: {
    name: string
    email: string
    avatar?: string
  }
  date: string
  branch: string
  filesChanged: number
  additions: number
  deletions: number
}

const Commits = () => {
  const [filters, setFilters] = useState({
    branch: 'all',
    author: 'all',
    dateRange: '7d'
  })

  const { data: commits, isLoading } = useQuery<Commit[]>({
    queryKey: ['commits', filters],
    queryFn: async () => {
      // Mock data for now
      return [
        {
          id: '1',
          sha: 'abc123def456',
          message: 'feat: Add authentication flow to dashboard',
          author: {
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe'
          },
          date: new Date().toISOString(),
          branch: 'main',
          filesChanged: 5,
          additions: 127,
          deletions: 23
        },
        {
          id: '2',
          sha: 'def789ghi012',
          message: 'fix: Resolve memory leak in repository parser',
          author: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Jane+Smith'
          },
          date: new Date(Date.now() - 3600000).toISOString(),
          branch: 'main',
          filesChanged: 2,
          additions: 15,
          deletions: 8
        },
        {
          id: '3',
          sha: 'ghi345jkl678',
          message: 'docs: Update API documentation with new endpoints',
          author: {
            name: 'Bob Wilson',
            email: 'bob@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Bob+Wilson'
          },
          date: new Date(Date.now() - 86400000).toISOString(),
          branch: 'develop',
          filesChanged: 8,
          additions: 245,
          deletions: 12
        }
      ]
    },
    refetchInterval: false,
    refetchOnMount: false,
  })

  const stats = {
    totalCommits: commits?.length || 0,
    totalAuthors: new Set(commits?.map(c => c.author.email)).size || 0,
    totalAdditions: commits?.reduce((sum, c) => sum + c.additions, 0) || 0,
    totalDeletions: commits?.reduce((sum, c) => sum + c.deletions, 0) || 0
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Commit History
        </h1>
        <p className="text-gray-400">
          View and analyze repository commit history and patterns
        </p>
      </div>

      {/* Stats Cards */}
      <CommitStats stats={stats} isLoading={isLoading} className="mb-8" />

      {/* Filters */}
      <CommitFilters
        filters={filters}
        onFiltersChange={setFilters}
        className="mb-8"
      />

      {/* Commit List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <CommitList commits={commits || []} />
      )}

      {/* Empty State */}
      {!isLoading && (!commits || commits.length === 0) && (
        <div className="text-center py-12">
          <GitCommit className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            No commits found
          </h3>
          <p className="text-gray-400 mb-6">
            Try adjusting your filters or check your repository selection
          </p>
        </div>
      )}
    </div>
  )
}

export default Commits

