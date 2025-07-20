import React from 'react'
import { Milestone } from 'lucide-react'

interface MilestoneCardsProps {
  milestones: any[]
  allTasks: any[]
}

export const MilestoneCards: React.FC<MilestoneCardsProps> = ({ milestones, allTasks }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {milestones.map((milestone) => (
        <div key={milestone.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Milestone className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-medium text-white">{milestone.name}</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Due: {new Date(milestone.startDate).toLocaleDateString()}
          </p>
        </div>
      ))}
      {milestones.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-400">
          No milestones found
        </div>
      )}
    </div>
  )
}
