import React from 'react'
import { Search } from 'lucide-react'

interface FileSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const FileSearch: React.FC<FileSearchProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
      />
    </div>
  )
}
