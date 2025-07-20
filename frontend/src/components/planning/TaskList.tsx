import React from 'react'

interface TaskListProps {
  [key: string]: any
}

export const TaskList: React.FC<TaskListProps> = (props) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <p className="text-gray-400">TaskList Component - Coming Soon</p>
    </div>
  )
}
