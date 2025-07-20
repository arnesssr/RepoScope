import React from 'react'
import { Activity } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ActivityItem {
  id: string
  type: string
  description: string
  timestamp: string
  repository: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
  isLoading: boolean
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities, isLoading }) => {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-400" />
          Recent Activity
        </h2>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-gray-400">Loading activity...</p>
        ) : activities.length === 0 ? (
          <p className="text-gray-400">No recent activity</p>
        ) : (
          activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 group">
              <div className="mt-1 p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
                <Activity className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-300">
                  {activity.description}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <span>{activity.repository}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
