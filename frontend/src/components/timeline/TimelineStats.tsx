import React from 'react'
import { CheckCircle, Clock, Target, TrendingUp } from 'lucide-react'

interface TimelineStatsProps {
  stats: {
    totalTasks: number
    completedTasks: number
    totalMilestones: number
    upcomingMilestones: number
    overallProgress: number
  }
  isLoading: boolean
  className?: string
}

export const TimelineStats: React.FC<TimelineStatsProps> = ({ stats, isLoading, className = '' }) => {
  const statsCards = [
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      icon: Clock,
      color: 'text-blue-400'
    },
    {
      label: 'Completed',
      value: stats.completedTasks,
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      label: 'Milestones',
      value: stats.totalMilestones,
      icon: Target,
      color: 'text-purple-400'
    },
    {
      label: 'Progress',
      value: `${Math.round(stats.overallProgress)}%`,
      icon: TrendingUp,
      color: 'text-cyan-400'
    }
  ]

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {statsCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {isLoading ? '-' : stat.value}
                </p>
              </div>
              <Icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
