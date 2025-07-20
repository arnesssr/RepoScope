import React from 'react'

interface RepositoryCardProps {
  [key: string]: any
}

export const RepositoryCard: React.FC<RepositoryCardProps> = (props) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <p className="text-gray-400">RepositoryCard Component - Coming Soon</p>
    </div>
  )
}
