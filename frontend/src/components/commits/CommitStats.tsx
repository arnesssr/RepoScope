import React from 'react'

interface CommitStatsProps {
  [key: string]: any
}

export const CommitStats: React.FC<CommitStatsProps> = (props) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <p className="text-gray-400">CommitStats Component - Coming Soon</p>
    </div>
  )
}
