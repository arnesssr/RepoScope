import React from 'react'
import { Calendar } from 'lucide-react'

interface AnalyticsFiltersProps {
  timeRange: '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void
  className?: string
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({ 
  timeRange, 
  onTimeRangeChange,
  className = ''
}) => {
  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ] as const

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2 text-gray-400">
        <Calendar className="w-4 h-4" />
        <span className="text-sm">Time Range:</span>
      </div>
      <div className="flex gap-2">
        {timeRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => onTimeRangeChange(range.value)}
            className={`
              px-3 py-1.5 text-sm rounded-md transition-colors
              ${timeRange === range.value
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-white'
              }
            `}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  )
}
