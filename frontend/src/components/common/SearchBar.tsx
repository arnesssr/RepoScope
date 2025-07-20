import React from 'react'

interface SearchBarProps {
  [key: string]: any
}

export const SearchBar: React.FC<SearchBarProps> = (props) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <p className="text-gray-400">SearchBar Component - Coming Soon</p>
    </div>
  )
}
