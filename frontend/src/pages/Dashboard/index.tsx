import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { GitBranch, GitCommit, Users, Star, ChevronDown, Loader2, BarChart3, Eye } from 'lucide-react'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { RecentActivity } from '../../components/dashboard/RecentActivity'
import { QuickActions } from '../../components/dashboard/QuickActions'
import { EmptyDashboard } from '../../components/dashboard/EmptyDashboard'
import { RepositorySelector } from '../../components/repository/RepositorySelector'
import { AnalysisOverview } from '../../components/dashboard/AnalysisOverview'
import { useRepositories } from '../../hooks/useRepositories'
import { useAnalysisStore } from '../../stores/analysisStore'
import { useAuthStore } from '../../stores/authStore'
import { Repository } from '../../types'
import toast from 'react-hot-toast'

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
  const [showRepoSelector, setShowRepoSelector] = useState(false)
  const [viewMode, setViewMode] = useState<'overview' | 'analysis'>('overview')
  const { repoId } = useParams<{ repoId: string }>()
  const navigate = useNavigate()
  
  // Store hooks
  const token = useAuthStore((state) => state.token)
  const { 
    currentAnalysis, 
    isAnalyzing, 
    analyzeRepository,
    setSelectedRepository 
  } = useAnalysisStore()
  
  // Fetch repositories
  const { data: repositories, isLoading: reposLoading } = useRepositories()
  
  // Find current repository
  const currentRepo = repositories?.find(repo => repo.id.toString() === repoId)
  
  // Set selected repository in store when repoId changes
  useEffect(() => {
    if (repoId) {
      setSelectedRepository(repoId)
    }
  }, [repoId, setSelectedRepository])
  
  // Handle repository selection
  const handleSelectRepo = (repo: Repository) => {
    navigate(`/dashboard/${repo.id}`)
    setShowRepoSelector(false)
  }
  
  // Handle analyze repository
  const handleAnalyze = async () => {
    if (!currentRepo || !token) return
    
    try {
      toast.loading('Analyzing repository...', { id: 'analyze' })
      await analyzeRepository(currentRepo.full_name, token)
      toast.success('Analysis complete!', { id: 'analyze' })
      // Switch to analysis view instead of navigating away
      setViewMode('analysis')
    } catch (error) {
      toast.error('Analysis failed. Please try again.', { id: 'analyze' })
    }
  }
  
  // Calculate stats from analysis or use defaults
  const stats: DashboardStats | null = currentAnalysis ? {
    totalRepositories: 1,
    totalCommits: currentAnalysis.summary?.total_commits || 0,
    totalContributors: currentAnalysis.summary?.contributors || 0,
    totalStars: currentRepo?.stargazers_count || 0,
    recentActivity: currentAnalysis.recent_commits?.slice(0, 5).map((commit, index) => ({
      id: commit.sha,
      type: 'commit',
      description: commit.message.split('\n')[0],
      timestamp: commit.date,
      repository: currentRepo?.name || ''
    })) || []
  } : null
  
  const isLoading = reposLoading

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
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="relative">
            <GitBranch className="w-20 h-20 text-gray-700 mx-auto mb-6" />
            <div className="absolute inset-0 blur-3xl bg-cyan-500/20 rounded-full" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Welcome to RepoScope</h2>
          <p className="text-gray-400 text-lg mb-2">Start by selecting a repository from the dropdown above</p>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <ChevronDown className="w-4 h-4 animate-bounce" />
            <span className="text-sm">Use the repository selector in the header</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </div>
    )
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
          
{/* Current Repository Info */}
          {currentRepo && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
                <GitBranch className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-gray-300">{currentRepo.full_name}</span>
                <Star className="h-4 w-4 text-yellow-400 ml-2" />
                <span className="text-sm text-gray-300">{currentRepo.stargazers_count}</span>
              </div>
              {isAnalyzing ? (
                <div className="flex items-center gap-2 text-cyan-400">
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span className="text-sm">Analyzing...</span>
                </div>
              ) : (
                <button 
                  onClick={handleAnalyze} 
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                >
                  Run Analysis
                </button>
              )}
            </div>
          )}
        </div>

        {/* View Mode Toggle and Time Range Selector */}
        <div className="flex items-center justify-between">
          {/* View Mode Toggle */}
          {currentAnalysis && (
            <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-lg p-1">
              <button
                onClick={() => setViewMode('overview')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${viewMode === 'overview'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                    : 'text-gray-400 hover:text-white'
                  }
                `}
              >
                <BarChart3 className="w-4 h-4" />
                Overview
              </button>
              <button
                onClick={() => setViewMode('analysis')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${viewMode === 'analysis'
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                    : 'text-gray-400 hover:text-white'
                  }
                `}
              >
                <Eye className="w-4 h-4" />
                Analysis Insights
              </button>
            </div>
          )}
          
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
      </div>

      {/* Conditional Content Based on View Mode */}
      {viewMode === 'overview' ? (
        <>
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
        </>
      ) : (
        /* Analysis Overview Mode */
        currentAnalysis && repoId ? (
          <AnalysisOverview 
            analysis={currentAnalysis} 
            repositoryId={repoId}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No analysis data available. Run an analysis to see insights.</p>
          </div>
        )
      )}
    </div>
  )
}

export default Dashboard
