import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Activity as ActivityIcon, GitCommit, GitPullRequest, GitMerge, AlertCircle, MessageSquare } from 'lucide-react'
import { ActivityFeed } from '../../components/activity/ActivityFeed'
import { ActivityFilters } from '../../components/activity/ActivityFilters'
import { ActivityTimeline } from '../../components/activity/ActivityTimeline'

interface ActivityItem {
  id: string
  type: 'commit' | 'pull_request' | 'issue' | 'merge' | 'comment'
  title: string
  description: string
  author: {
    name: string
    avatar: string
  }
  timestamp: string
  repository: string
  metadata?: {
    branch?: string
    files?: number
    additions?: number
    deletions?: number
    status?: string
  }
}

const Activity = () => {
  const [filters, setFilters] = useState({
    type: 'all',
    repository: 'all',
    dateRange: '7d'
  })
  const [view, setView] = useState<'feed' | 'timeline'>('feed')

  const { data: activities, isLoading } = useQuery<ActivityItem[]>({
    queryKey: ['activities', filters],
    queryFn: async () => {
      // Mock data for now
      return [
        {
          id: '1',
          type: 'commit',
          title: 'Update authentication flow',
          description: 'Fixed token refresh logic and improved error handling',
          author: {
            name: 'John Doe',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe'
          },
          timestamp: new Date().toISOString(),
          repository: 'RepoScope',
          metadata: {
            branch: 'main',
            files: 3,
            additions: 45,
            deletions: 12
          }
        },
        {
          id: '2',
          type: 'pull_request',
          title: 'Add dark mode support',
          description: 'Implements dark mode toggle and persists user preference',
          author: {
            name: 'Jane Smith',
            avatar: 'https://ui-avatars.com/api/?name=Jane+Smith'
          },
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          repository: 'RepoScope',
          metadata: {
            status: 'open',
            branch: 'feature/dark-mode',
            files: 12,
            additions: 234,
            deletions: 56
          }
        },
        {
          id: '3',
          type: 'issue',
          title: 'Performance optimization needed',
          description: 'Dashboard loading is slow when dealing with large repositories',
          author: {
            name: 'Bob Wilson',
            avatar: 'https://ui-avatars.com/api/?name=Bob+Wilson'
          },
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          repository: 'RepoScope',
          metadata: {
            status: 'open'
          }
        },
        {
          id: '4',
          type: 'merge',
          title: 'Merge pull request #123',
          description: 'feat: Add export functionality for analytics data',
          author: {
            name: 'Alice Johnson',
            avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson'
          },
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          repository: 'RepoScope',
          metadata: {
            branch: 'main',
            files: 8,
            additions: 156,
            deletions: 23
          }
        },
        {
          id: '5',
          type: 'comment',
          title: 'Comment on issue #456',
          description: 'I can reproduce this issue on Chrome but not on Firefox',
          author: {
            name: 'Charlie Brown',
            avatar: 'https://ui-avatars.com/api/?name=Charlie+Brown'
          },
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          repository: 'frontend-pms'
        }
      ]
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'commit':
        return GitCommit
      case 'pull_request':
        return GitPullRequest
      case 'merge':
        return GitMerge
      case 'issue':
        return AlertCircle
      case 'comment':
        return MessageSquare
      default:
        return ActivityIcon
    }
  }

  const filteredActivities = activities?.filter(activity => {
    const matchesType = filters.type === 'all' || activity.type === filters.type
    const matchesRepo = filters.repository === 'all' || activity.repository === filters.repository
    return matchesType && matchesRepo
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Activity Feed
        </h1>
        <p className="text-gray-400">
          Track all repository activities in real-time
        </p>
      </div>

      {/* View Toggle */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setView('feed')}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${view === 'feed'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
              : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }
          `}
        >
          Feed View
        </button>
        <button
          onClick={() => setView('timeline')}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${view === 'timeline'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
              : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }
          `}
        >
          Timeline View
        </button>
      </div>

      {/* Filters */}
      <ActivityFilters
        filters={filters}
        onFiltersChange={setFilters}
        className="mb-8"
      />

      {/* Activity Content */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {view === 'feed' ? (
            <ActivityFeed 
              activities={filteredActivities || []} 
              getActivityIcon={getActivityIcon}
            />
          ) : (
            <ActivityTimeline 
              activities={filteredActivities || []} 
              getActivityIcon={getActivityIcon}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && (!filteredActivities || filteredActivities.length === 0) && (
        <div className="text-center py-12">
          <ActivityIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            No activity found
          </h3>
          <p className="text-gray-400 mb-6">
            {filters.type !== 'all' || filters.repository !== 'all' 
              ? 'Try adjusting your filters to see more activities'
              : 'Activities will appear here as they happen'
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default Activity
