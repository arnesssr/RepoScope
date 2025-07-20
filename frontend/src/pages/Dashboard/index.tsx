import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { GitBranch, GitCommit, Users, Star, ChevronDown } from 'lucide-react'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { RecentActivity } from '../../components/dashboard/RecentActivity'
import { QuickActions } from '../../components/dashboard/QuickActions'
import { EmptyDashboard } from '../../components/dashboard/EmptyDashboard'

interface DashboardStats {
  totalRepositories: number
  totalCommits: number
  totalContributors: number
  totalStars: number
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    repository: string
  }>
}

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d')
  const { repoId } = useParams<{ repoId: string }>()
  const navigate = useNavigate()

  const handleAddRepo = () => {
    // Implement the logic to add a new repository
    alert('Add New Repository functionality goes here')
  }

  // Mock query for demonstration purposes
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', timeRange, repoId],
    queryFn: async () => {
      if (!repoId) return null
      // Mock data for the selected repository
      return {
        totalRepositories: 12,
        totalCommits: 342,
        totalContributors: 8,
        totalStars: 156,
        recentActivity: [
          {
            id: '1',
            type: 'commit',
            description: 'Fixed authentication flow in dashboard',
            timestamp: new Date().toISOString(),
            repository: 'RepoScope'
          },
          {
            id: '2',
            type: 'commit',
            description: 'Added neon-styled UI components',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            repository: 'RepoScope'
          },
          {
            id: '3',
            type: 'pr',
            description: 'Merged PR #42: Update dashboard layout',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            repository: 'frontend-pms'
          }
        ]
      }
    },
    enabled: !!repoId,
    refetchInterval: false,
    refetchOnMount: false,
  })

  const statCards = !stats
    ? []
    : [
        {
          name: 'Total Repositories',
          value: stats.totalRepositories,
          icon: GitBranch,
          color: 'cyan' as const
        },
        {
          name: 'Total Commits',
          value: stats.totalCommits,
          icon: GitCommit,
          color: 'purple' as const
        },
        {
          name: 'Contributors',
          value: stats.totalContributors,
          icon: Users,
          color: 'green' as const
        },
        {
          name: 'Total Stars',
          value: stats.totalStars,
          icon: Star,
          color: 'yellow' as const
        }
      ]

  // Show empty state if no repository is selected
  if (!repoId) {
    return <EmptyDashboard onSelectRepo={handleAddRepo} />
  }

  return (
    <div>
      {/* Header with Repository Info */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-400">
              Monitor your repository metrics and activity
            </p>
          </div>
          
          {/* Repository Selector */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 border border-gray-700">
            <GitBranch className="w-4 h-4" />
            <span className="font-medium">{repoId || 'Select Repository'}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${timeRange === range
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }
              `}
            >
              {range === '24h' ? 'Last 24 hours' : range === '7d' ? 'Last 7 days' : 'Last 30 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <StatsCard
            key={stat.name}
            name={stat.name}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity 
          activities={stats?.recentActivity || []} 
          isLoading={isLoading} 
        />
        <QuickActions />
      </div>
    </div>
  )
}

export default Dashboard
