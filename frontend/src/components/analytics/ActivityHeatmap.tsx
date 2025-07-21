import React from 'react'

interface ActivityData {
  day: string
  hour: number
  commits: number
}

interface ActivityHeatmapProps {
  data: ActivityData[]
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const hours = Array.from({ length: 24 }, (_, i) => i)

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {
  // Create a map for quick lookup
  const activityMap = new Map()
  data.forEach(item => {
    activityMap.set(`${item.day}-${item.hour}`, item.commits)
  })

  // Find max commits for color scaling
  const maxCommits = Math.max(...data.map(d => d.commits), 1)

  const getColor = (commits: number) => {
    if (commits === 0) return 'bg-gray-800'
    const intensity = commits / maxCommits
    if (intensity < 0.25) return 'bg-cyan-900'
    if (intensity < 0.5) return 'bg-cyan-700'
    if (intensity < 0.75) return 'bg-cyan-500'
    return 'bg-cyan-400'
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        {/* Hour labels */}
        <div className="flex mb-2">
          <div className="w-12" />
          {hours.map(hour => (
            <div key={hour} className="w-8 text-center text-xs text-gray-500">
              {hour % 3 === 0 ? hour : ''}
            </div>
          ))}
        </div>
        
        {/* Heatmap grid */}
        {days.map(day => (
          <div key={day} className="flex items-center mb-1">
            <div className="w-12 text-xs text-gray-400 pr-2 text-right">
              {day}
            </div>
            {hours.map(hour => {
              const commits = activityMap.get(`${day}-${hour}`) || 0
              return (
                <div
                  key={`${day}-${hour}`}
                  className={`w-8 h-8 mx-0.5 rounded-sm ${getColor(commits)} transition-colors duration-200 hover:ring-2 hover:ring-cyan-400`}
                  title={`${day} ${hour}:00 - ${commits} commits`}
                />
              )
            })}
          </div>
        ))}
        
        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
          <span>Less</span>
          <div className="w-4 h-4 bg-gray-800 rounded-sm" />
          <div className="w-4 h-4 bg-cyan-900 rounded-sm" />
          <div className="w-4 h-4 bg-cyan-700 rounded-sm" />
          <div className="w-4 h-4 bg-cyan-500 rounded-sm" />
          <div className="w-4 h-4 bg-cyan-400 rounded-sm" />
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
