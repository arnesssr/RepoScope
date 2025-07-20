import React from 'react'

interface ContributorCardProps {
  [key: string]: any
}

export const ContributorCard: React.FC<ContributorCardProps> = (props) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <p className="text-gray-400">ContributorCard Component - Coming Soon</p>
    </div>
  )
}
