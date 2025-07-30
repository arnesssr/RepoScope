import React from 'react'
import { Filter } from 'lucide-react'

interface ThreatFiltersProps {
  filters: {
    severity: string
    status: string
    type: string
  }
  onFiltersChange: (filters: any) => void
  className?: string
}

export const ThreatFilters: React.FC<ThreatFiltersProps> = ({ filters, onFiltersChange, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {/* Severity Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <label className="text-sm text-gray-400">Severity:</label>
        <select
          value={filters.severity}
          onChange={(e) => onFiltersChange({ ...filters, severity: e.target.value })}
          className="bg-gray-800 text-white text-sm rounded-lg px-3 py-1.5 border border-gray-700 focus:border-cyan-400 focus:outline-none"
        >
          <option value="all">All</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-400">Status:</label>
        <select
          value={filters.status}
          onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
          className="bg-gray-800 text-white text-sm rounded-lg px-3 py-1.5 border border-gray-700 focus:border-cyan-400 focus:outline-none"
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
          <option value="ignored">Ignored</option>
        </select>
      </div>

      {/* Type Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-400">Type:</label>
        <select
          value={filters.type}
          onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })}
          className="bg-gray-800 text-white text-sm rounded-lg px-3 py-1.5 border border-gray-700 focus:border-cyan-400 focus:outline-none"
        >
          <option value="all">All</option>
          <option value="dependency">Dependency</option>
          <option value="code">Code</option>
          <option value="config">Configuration</option>
          <option value="secret">Secret</option>
        </select>
      </div>
    </div>
  )
}
