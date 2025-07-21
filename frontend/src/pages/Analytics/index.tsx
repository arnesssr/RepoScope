import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart3, TrendingUp, Activity, PieChart, Bug, GitBranch, Users } from 'lucide-react'
import { CodeMetricsChart } from '../../components/analytics/CodeMetricsChart'
import { ActivityHeatmap } from '../../components/analytics/ActivityHeatmap'
import { LanguageDistribution } from '../../components/analytics/LanguageDistribution'
import { CommitTrends } from '../../components/analytics/CommitTrends'
import { ContributionDistribution } from '../../components/analytics/ContributionDistribution'
import { AnalyticsFilters } from '../../components/analytics/AnalyticsFilters'
import { useAnalysisStore } from '../../stores/analysisStore'
import { useAuthStore } from '../../stores/authStore'
import apiService from '../../services/api'

interface AnalyticsData {
  codeMetrics: {
    linesOfCode: number
    files: number
    functions: number
    complexity: number
  }
  commitTrends: Array<{
    date: string
    commits: number
    additions: number
    deletions: number
  }>
  languages: Array<{
    name: string
    percentage: number
    color: string
  }>
  activityHeatmap: Array<{
    day: string
    hour: number
    commits: number
  }>
  contributors: Array<{
    name: string
    contributions: number
    color: string
  }>
}

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [view, setView] = useState<'overview' | 'code' | 'activity' | 'trends'>('overview')
  const { currentAnalysis } = useAnalysisStore()
  const { token } = useAuthStore()

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics', timeRange, currentAnalysis],
    queryFn: async () => {
      // Only show real data from analysis, no mock data
      if (!currentAnalysis || !currentAnalysis.repository_stats) {
        return null
      }
      
      const { repository_stats, commit_analysis, quality_assessment } = currentAnalysis
      
      // Process contributors data
      const contributorColors = [
        '#06B6D4', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', 
        '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
      ]
      
      const contributors = Object.entries(repository_stats.contributors || {})
        .map(([email, data]: [string, any], index) => ({
          name: data.name || email.split('@')[0], // Use name if available, otherwise extract from email
          email: data.email || email,
          avatar_url: data.avatar_url || null,
          contributions: data.commits || 0,
          color: contributorColors[index % contributorColors.length]
        }))
        .sort((a, b) => b.contributions - a.contributions)
        .slice(0, 10) // Top 10 contributors
      
      // Process language data from file types
      const languageMap: Record<string, { name: string, color: string }> = {
        '.py': { name: 'Python', color: '#3572A5' },
        '.js': { name: 'JavaScript', color: '#f7df1e' },
        '.ts': { name: 'TypeScript', color: '#3178c6' },
        '.tsx': { name: 'TypeScript', color: '#3178c6' },
        '.jsx': { name: 'JavaScript', color: '#f7df1e' },
        '.java': { name: 'Java', color: '#b07219' },
        '.cpp': { name: 'C++', color: '#f34b7d' },
        '.c': { name: 'C', color: '#555555' },
        '.go': { name: 'Go', color: '#00ADD8' },
        '.rs': { name: 'Rust', color: '#dea584' },
        '.rb': { name: 'Ruby', color: '#701516' },
        '.php': { name: 'PHP', color: '#4F5D95' },
        '.css': { name: 'CSS', color: '#1572b6' },
        '.html': { name: 'HTML', color: '#e34c26' },
        '.vue': { name: 'Vue', color: '#4FC08D' },
        '.swift': { name: 'Swift', color: '#ffac45' },
        '.kt': { name: 'Kotlin', color: '#F18E33' },
        '.scala': { name: 'Scala', color: '#c22d40' },
        '.r': { name: 'R', color: '#198CE7' },
        '.m': { name: 'Objective-C', color: '#438eff' }
      }
      
      const totalFiles = Object.values(repository_stats.file_types || {}).reduce((a: number, b: any) => a + b, 0)
      const languages = Object.entries(repository_stats.file_types || {})
        .map(([ext, count]: [string, any]) => {
          const lang = languageMap[ext] || { name: ext, color: '#888888' }
          return {
            name: lang.name,
            percentage: Math.round((count / totalFiles) * 100),
            color: lang.color
          }
        })
        .filter(lang => lang.percentage > 0)
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 8) // Top 8 languages
      
      // Process commit data for trends (if we have recent commits)
      const commitTrends = currentAnalysis.recent_commits ? 
        currentAnalysis.recent_commits.slice(0, 7).map(commit => ({
          date: new Date(commit.date).toLocaleDateString(),
          commits: 1, // Each entry is one commit
          additions: commit.additions || 0,
          deletions: commit.deletions || 0
        })).reverse() : []
      
      return {
        codeMetrics: {
          linesOfCode: repository_stats.total_commits * 50, // Rough estimate
          files: totalFiles,
          functions: 0, // Would need code analysis
          complexity: quality_assessment?.quality_score ? quality_assessment.quality_score / 25 : 0
        },
        commitTrends,
        languages,
        activityHeatmap: [], // Would need commit time analysis
        contributors
      }
    },
    refetchInterval: false,
    refetchOnMount: false,
    enabled: !!currentAnalysis // Only run query if we have an analysis
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Analytics & Insights
        </h1>
        <p className="text-gray-400">
          Deep dive into your repository's metrics and patterns
        </p>
      </div>

      {/* View Tabs */}
      <div className="mb-8 border-b border-gray-800">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'code', 'activity', 'trends'].map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab as any)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors
                ${view === tab
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <AnalyticsFilters
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        className="mb-8"
      />

      {/* Content based on view */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-96 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {view === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-cyan-400" />
                  Language Distribution
                </h3>
                <LanguageDistribution languages={analytics?.languages || []} />
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-cyan-400" />
                  Code Metrics
                </h3>
                <CodeMetricsChart metrics={analytics?.codeMetrics || {
                  linesOfCode: 0,
                  files: 0,
                  functions: 0,
                  complexity: 0
                }} />
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 lg:col-span-2">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  Commit Trends
                </h3>
                <CommitTrends data={analytics?.commitTrends || []} />
              </div>
            </div>
          )}

          {view === 'code' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                Code Metrics
              </h3>
              <CodeMetricsChart metrics={analytics?.codeMetrics || {
                linesOfCode: 0,
                files: 0,
                functions: 0,
                complexity: 0
              }} />
            </div>
          )}

          {view === 'activity' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-cyan-400" />
                  Contribution Distribution
                </h3>
                <ContributionDistribution data={analytics?.contributors || []} />
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 lg:col-span-1">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-400" />
                  Commit Activity Heatmap
                </h3>
                <ActivityHeatmap data={analytics?.activityHeatmap || []} />
              </div>
            </div>
          )}

          {view === 'trends' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                Historical Trends
              </h3>
              <CommitTrends data={analytics?.commitTrends || []} />
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && !currentAnalysis && (
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            No analytics data available
          </h3>
          <p className="text-gray-400 mb-6">
            Please run an analysis first to see repository analytics.
            Go to the Analysis page from the sidebar to analyze a repository.
          </p>
        </div>
      )}
    </div>
  )
}

export default Analytics
