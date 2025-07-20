import React from 'react'

interface ProjectOverviewProps {
  [key: string]: any
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = (props) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <p className="text-gray-400">ProjectOverview Component - Coming Soon</p>
    </div>
  )
}
