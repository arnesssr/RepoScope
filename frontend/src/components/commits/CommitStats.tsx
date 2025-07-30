import React from 'react'
import { GitCommit, TrendingUp, TrendingDown, Clock, Users, Calendar } from 'lucide-react'

interface Contributor {
  name: string
  contributions: number
  color: string
}

interface CommitTrend {
  date: string
  commits: number
}

interface CommitStatsProps {
  stats: {
    totalCommits: number
    contributors: Contributor[]
    commitTrends: CommitTrend[]
  }
}

export const CommitStats: React.FC<CommitStatsProps> = ({ stats }) => {
  // Calculate stats
  const topContributor = stats.contributors?.[0]
  const avgCommitsPerContributor = stats.totalCommits / (stats.contributors?.length || 1)
  
  // Calculate trend (compare last 7 days to previous 7 days)
  const recentCommits = stats.commitTrends?.slice(-7).reduce((sum, day) => sum + day.commits, 0) || 0
  const previousCommits = stats.commitTrends?.slice(-14, -7).reduce((sum, day) => sum + day.commits, 0) || 0
  const trendPercentage = previousCommits > 0 
    ? ((recentCommits - previousCommits) / previousCommits * 100).toFixed(1)
    : 0
  
  return (
    <div className="space-y-4">
      {/* Total Commits */}
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-gray-400">Total Commits</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-white">
          {stats.totalCommits?.toLocaleString() || 0}
        </p>
      </div>

      {/* Commit Trend */}
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-gray-400">7-Day Trend</span>
          </div>
          <div className="flex items-center gap-1">
            {Number(trendPercentage) > 0 ? (
              <>
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">+{trendPercentage}%</span>
              </>
            ) : Number(trendPercentage) < 0 ? (
              <>
                <TrendingDown className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400">{trendPercentage}%</span>
              </>
            ) : (
              <span className="text-sm text-gray-400">No change</span>
            )}
          </div>
        </div>
        <p className="text-lg font-semibold text-white">
          {recentCommits} commits
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Last 7 days
        </p>
      </div>

      {/* Top Contributor */}
      {topContributor && (
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Top Contributor</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: topContributor.color }}
            >
              {topContributor.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {topContributor.name}
              </p>
              <p className="text-xs text-gray-400">
                {topContributor.contributions} commits
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Average Commits */}
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-indigo-400" />
          <span className="text-sm text-gray-400">Avg per Contributor</span>
        </div>
        <p className="text-lg font-semibold text-white">
          {Math.round(avgCommitsPerContributor).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          commits per person
        </p>
      </div>

      {/* Contributor Breakdown */}
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-blue-400" />
          <span className="text-sm text-gray-400">Contributors</span>
        </div>
        <div className="space-y-2">
          {stats.contributors?.slice(0, 5).map((contributor, index) => {
            const percentage = (contributor.contributions / stats.totalCommits * 100).toFixed(1)
            return (
              <div key={contributor.name} className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: contributor.color }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-300">{contributor.name}</span>
                    <span className="text-xs text-gray-500">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 mt-1">
                    <div 
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: contributor.color 
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
