import React from 'react'

interface GanttChartProps {
  tasks: any[]
  startDate: string
  endDate: string
  currentDate: string
  timeRange: 'week' | 'month' | 'quarter' | 'year'
}

export const GanttChart: React.FC<GanttChartProps> = ({ 
  tasks, 
  startDate, 
  endDate, 
  currentDate, 
  timeRange 
}) => {
  return (
    <div className="w-full">
      <div className="text-center py-8">
        <p className="text-gray-400">Gantt Chart Component - Coming Soon</p>
        <p className="text-sm text-gray-500 mt-2">
          Showing {tasks.length} tasks for {timeRange} view
        </p>
      </div>
    </div>
  )
}
