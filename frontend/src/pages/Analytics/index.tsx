import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart3, TrendingUp, Activity, PieChart } from 'lucide-react'
import { CodeMetricsChart } from '../../components/analytics/CodeMetricsChart'
import { ActivityHeatmap } from '../../components/analytics/ActivityHeatmap'
import { LanguageDistribution } from '../../components/analytics/LanguageDistribution'
import { CommitTrends } from '../../components/analytics/CommitTrends'
import { AnalyticsFilters } from '../../components/analytics/AnalyticsFilters'

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
}

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [view, setView] = useState<'overview' | 'code' | 'activity' | 'trends'>('overview')

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      // Mock data for now
      return {
        codeMetrics: {
          linesOfCode: 45678,
          files: 234,
          functions: 1234,
          complexity: 3.2
        },
        commitTrends: [
          { date: '2024-01-01', commits: 12, additions: 234, deletions: 56 },
          { date: '2024-01-02', commits: 8, additions: 123, deletions: 45 },
          { date: '2024-01-03', commits: 15, additions: 345, deletions: 89 },
          { date: '2024-01-04', commits: 10, additions: 234, deletions: 67 },
          { date: '2024-01-05', commits: 18, additions: 456, deletions: 123 },
          { date: '2024-01-06', commits: 5, additions: 89, deletions: 23 },
          { date: '2024-01-07', commits: 9, additions: 178, deletions: 45 }
        ],
        languages: [
          { name: 'TypeScript', percentage: 45, color: '#3178c6' },
          { name: 'JavaScript', percentage: 25, color: '#f7df1e' },
          { name: 'CSS', percentage: 15, color: '#1572b6' },
          { name: 'HTML', percentage: 10, color: '#e34c26' },
          { name: 'Other', percentage: 5, color: '#888888' }
        ],
        activityHeatmap: [
          { day: 'Mon', hour: 9, commits: 25 },
          { day: 'Mon', hour: 10, commits: 30 },
          { day: 'Mon', hour: 11, commits: 35 },
          { day: 'Mon', hour: 14, commits: 40 },
          { day: 'Mon', hour: 15, commits: 45 },
          { day: 'Tue', hour: 9, commits: 20 },
          { day: 'Tue', hour: 10, commits: 28 },
          { day: 'Tue', hour: 11, commits: 32 },
          { day: 'Wed', hour: 10, commits: 35 },
          { day: 'Wed', hour: 14, commits: 38 },
          { day: 'Thu', hour: 9, commits: 22 },
          { day: 'Thu', hour: 15, commits: 42 },
          { day: 'Fri', hour: 10, commits: 30 },
          { day: 'Fri', hour: 11, commits: 25 },
          { day: 'Fri', hour: 14, commits: 20 }
        ]
      }
    },
    refetchInterval: false,
    refetchOnMount: false,
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
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  Commit Trends
                </h3>
                <CommitTrends data={analytics?.commitTrends || []} />
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 lg:col-span-2">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-400" />
                  Activity Heatmap
                </h3>
                <ActivityHeatmap data={analytics?.activityHeatmap || []} />
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
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" />
                Development Activity
              </h3>
              <ActivityHeatmap data={analytics?.activityHeatmap || []} />
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
      {!isLoading && !analytics && (
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            No analytics data available
          </h3>
          <p className="text-gray-400 mb-6">
            Analytics will appear once your repository has been analyzed
          </p>
        </div>
      )}
    </div>
  )
}

export default Analytics
