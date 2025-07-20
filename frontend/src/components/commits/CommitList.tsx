import React from 'react'

interface CommitListProps {
  [key: string]: any
}

export const CommitList: React.FC<CommitListProps> = (props) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <p className="text-gray-400">CommitList Component - Coming Soon</p>
    </div>
  )
}
