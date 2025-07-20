import React from 'react'

interface ActivityFeedProps {
  [key: string]: any
}

export const ActivityFeed: React.FC<ActivityFeedProps> = (props) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <p className="text-gray-400">ActivityFeed Component - Coming Soon</p>
    </div>
  )
}
