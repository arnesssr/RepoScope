import React from 'react'

interface GeneralSettingsProps {
  [key: string]: any
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = (props) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <p className="text-gray-400">GeneralSettings Component - Coming Soon</p>
    </div>
  )
}
