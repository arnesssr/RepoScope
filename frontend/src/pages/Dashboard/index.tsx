import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { GitBranch, GitCommit, Users, Star, ChevronDown, Loader2 } from 'lucide-react'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { RecentActivity } from '../../components/dashboard/RecentActivity'
import { QuickActions } from '../../components/dashboard/QuickActions'
import { EmptyDashboard } from '../../components/dashboard/EmptyDashboard'
import { RepositorySelector } from '../../components/repository/RepositorySelector'
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
      navigate(`/dashboard/analysis/${currentRepo.id}`)
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
      <div className="text-center mt-8">
        <h2 className="text-xl font-bold text-white">No repository selected</h2>
        <p className="text-gray-400 mt-2">Please select a repository to get started.</p>
        <div className="mt-4">
          <RepositorySelector 
            repositories={repositories || []} 
            selectedRepo={null} 
            onSelectRepo={handleSelectRepo} 
            isLoading={reposLoading}
          />
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
          
{/* Repository Selector */}
          <div className="flex items-center">
            <RepositorySelector 
              repositories={repositories || []} 
              selectedRepo={currentRepo || null} 
              onSelectRepo={handleSelectRepo} 
              isLoading={reposLoading}
            />
            {isAnalyzing ? (
              <Loader2 className="ml-4 animate-spin" />
            ) : (
              <button 
                onClick={handleAnalyze} 
                className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-200"
              >
                Analyze
              </button>
            )}
          </div>
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
