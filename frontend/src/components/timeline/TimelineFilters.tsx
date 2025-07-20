import React from 'react'

interface TimelineFiltersProps {
  filters: any
  onFiltersChange: (filters: any) => void
  className?: string
}

export const TimelineFilters: React.FC<TimelineFiltersProps> = ({ 
  filters, 
  onFiltersChange,
  className = ''
}) => {
  return (
    <div className={`flex gap-4 ${className}`}>
      <div className="flex gap-2">
        <select 
          className="bg-gray-800 text-gray-300 px-3 py-2 rounded-lg border border-gray-700"
          value={filters.status}
          onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
        >
          <option value="all">All Status</option>
          <option value="planned">Planned</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  )
}

