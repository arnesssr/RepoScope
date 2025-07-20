import React from 'react'

interface AccountSettingsProps {
  [key: string]: any
}

export const AccountSettings: React.FC<AccountSettingsProps> = (props) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <p className="text-gray-400">AccountSettings Component - Coming Soon</p>
    </div>
  )
}
