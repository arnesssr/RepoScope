import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  GitBranch, 
  GitCommit, 
  Users, 
  Star,
  TrendingUp,
  Clock,
  FileCode2,
  Activity
} from 'lucide-react'
import { apiClient } from '../../services/api'
import { formatDistanceToNow } from 'date-fns'

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

  // Temporarily comment out API call until backend is ready
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', timeRange],
    queryFn: async () => {
      // Mock data for now
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
    // Disable refetching for mock data
    refetchInterval: false,
    refetchOnMount: false,
  })

  const statCards = [
    {
      name: 'Total Repositories',
      value: stats?.totalRepositories || 0,
      icon: GitBranch,
      color: 'cyan',
      bgGradient: 'from-cyan-500/10 to-blue-500/10',
      iconColor: 'text-cyan-400',
      glowColor: 'rgba(6,182,212,0.5)'
    },
    {
      name: 'Total Commits',
      value: stats?.totalCommits || 0,
      icon: GitCommit,
      color: 'purple',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      iconColor: 'text-purple-400',
      glowColor: 'rgba(168,85,247,0.5)'
    },
    {
      name: 'Contributors',
      value: stats?.totalContributors || 0,
      icon: Users,
      color: 'green',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      iconColor: 'text-green-400',
      glowColor: 'rgba(34,197,94,0.5)'
    },
    {
      name: 'Total Stars',
      value: stats?.totalStars || 0,
      icon: Star,
      color: 'yellow',
      bgGradient: 'from-yellow-500/10 to-orange-500/10',
      iconColor: 'text-yellow-400',
      glowColor: 'rgba(250,204,21,0.5)'
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-400">
          Monitor your repository metrics and activity
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-8 flex gap-2">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-xl border border-gray-800 p-6 transition-all duration-300 hover:scale-105 group"
              style={{
                background: `linear-gradient(to bottom right, ${stat.color === 'cyan' ? 'rgba(6,182,212,0.1)' : stat.color === 'purple' ? 'rgba(168,85,247,0.1)' : stat.color === 'green' ? 'rgba(34,197,94,0.1)' : 'rgba(250,204,21,0.1)'}, ${stat.color === 'cyan' ? 'rgba(59,130,246,0.1)' : stat.color === 'purple' ? 'rgba(236,72,153,0.1)' : stat.color === 'green' ? 'rgba(16,185,129,0.1)' : 'rgba(251,146,60,0.1)'})`
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {isLoading ? '...' : stat.value.toLocaleString()}
                  </p>
                </div>
                <div 
                  className={`p-3 rounded-lg bg-gray-900/50 ${stat.iconColor}`}
                  style={{
                    boxShadow: `0 0 20px ${stat.glowColor}`
                  }}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              
              {/* Decorative gradient orb */}
              <div 
                className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full blur-2xl"
                style={{ background: stat.glowColor }}
              />
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-400" />
              Recent Activity
            </h2>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-gray-400">Loading activity...</p>
            ) : stats?.recentActivity?.length === 0 ? (
              <p className="text-gray-400">No recent activity</p>
            ) : (
              stats?.recentActivity?.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 group">
                  <div className="mt-1 p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">
                      {activity.description}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span>{activity.repository}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-gray-800 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-200 group">
              <GitBranch className="h-8 w-8 text-cyan-400 mx-auto mb-2 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <p className="text-sm text-gray-300">Add Repository</p>
            </button>
            
            <button className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-gray-800 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-200 group">
              <FileCode2 className="h-8 w-8 text-purple-400 mx-auto mb-2 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              <p className="text-sm text-gray-300">View Files</p>
            </button>
            
            <button className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-gray-800 hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-200 group">
              <Users className="h-8 w-8 text-green-400 mx-auto mb-2 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              <p className="text-sm text-gray-300">Invite Team</p>
            </button>
            
            <button className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-gray-800 hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all duration-200 group">
              <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2 group-hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
              <p className="text-sm text-gray-300">View Timeline</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
