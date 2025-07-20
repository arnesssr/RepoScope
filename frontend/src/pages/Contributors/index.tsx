import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Users, TrendingUp, GitCommit, Code } from 'lucide-react'
import { ContributorCard } from '../../components/contributors/ContributorCard'
import { ContributorStats } from '../../components/contributors/ContributorStats'
import { ContributorFilters } from '../../components/contributors/ContributorFilters'

interface Contributor {
  id: string
  username: string
  name: string
  email: string
  avatar: string
  commits: number
  additions: number
  deletions: number
  pullRequests: number
  issues: number
  lastActive: string
  joinedDate: string
}

const Contributors = () => {
  const [sortBy, setSortBy] = useState<'commits' | 'recent' | 'additions'>('commits')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  const { data: contributors, isLoading } = useQuery<Contributor[]>({
    queryKey: ['contributors', sortBy, timeRange],
    queryFn: async () => {
      // Mock data for now
      return [
        {
          id: '1',
          username: 'johndoe',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://ui-avatars.com/api/?name=John+Doe',
          commits: 342,
          additions: 12543,
          deletions: 3421,
          pullRequests: 45,
          issues: 23,
          lastActive: new Date().toISOString(),
          joinedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          username: 'janesmith',
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
          commits: 256,
          additions: 8934,
          deletions: 2156,
          pullRequests: 34,
          issues: 15,
          lastActive: new Date(Date.now() - 86400000).toISOString(),
          joinedDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          username: 'bobwilson',
          name: 'Bob Wilson',
          email: 'bob@example.com',
          avatar: 'https://ui-avatars.com/api/?name=Bob+Wilson',
          commits: 128,
          additions: 4532,
          deletions: 987,
          pullRequests: 18,
          issues: 8,
          lastActive: new Date(Date.now() - 2 * 86400000).toISOString(),
          joinedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    refetchInterval: false,
    refetchOnMount: false,
  })

  const sortedContributors = contributors?.sort((a, b) => {
    switch (sortBy) {
      case 'commits':
        return b.commits - a.commits
      case 'recent':
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
      case 'additions':
        return b.additions - a.additions
      default:
        return 0
    }
  })

  const stats = {
    totalContributors: contributors?.length || 0,
    totalCommits: contributors?.reduce((sum, c) => sum + c.commits, 0) || 0,
    totalAdditions: contributors?.reduce((sum, c) => sum + c.additions, 0) || 0,
    activeThisWeek: contributors?.filter(c => {
      const lastActive = new Date(c.lastActive)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return lastActive > weekAgo
    }).length || 0
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Contributors
        </h1>
        <p className="text-gray-400">
          View team members and their contributions to the repository
        </p>
      </div>

      {/* Stats Overview */}
      <ContributorStats stats={stats} isLoading={isLoading} className="mb-8" />

      {/* Filters */}
      <ContributorFilters
        sortBy={sortBy}
        timeRange={timeRange}
        onSortChange={setSortBy}
        onTimeRangeChange={setTimeRange}
        className="mb-8"
      />

      {/* Contributors Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedContributors?.map(contributor => (
            <ContributorCard
              key={contributor.id}
              contributor={contributor}
              onClick={() => {
                // Navigate to contributor details
                console.log('View contributor:', contributor.username)
              }}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!contributors || contributors.length === 0) && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            No contributors found
          </h3>
          <p className="text-gray-400 mb-6">
            This repository doesn't have any contributors yet
          </p>
        </div>
      )}
    </div>
  )
}

export default Contributors
