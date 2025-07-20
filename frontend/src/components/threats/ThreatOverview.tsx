import React from 'react'

interface ThreatOverviewProps {
  [key: string]: any
}

export const ThreatOverview: React.FC<ThreatOverviewProps> = (props) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <p className="text-gray-400">ThreatOverview Component - Coming Soon</p>
    </div>
  )
}
