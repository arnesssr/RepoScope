import React from 'react'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbNavProps {
  path: string
  onNavigate: (path: string) => void
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ path, onNavigate }) => {
  const segments = path.split('/').filter(Boolean)
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={() => onNavigate('/')}
        className="text-gray-400 hover:text-white transition-colors"
      >
        Root
      </button>
      {segments.map((segment, index) => {
        const segmentPath = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1
        
        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-4 w-4 text-gray-600" />
            <button
              onClick={() => !isLast && onNavigate(segmentPath)}
              className={`${
                isLast 
                  ? 'text-white font-medium' 
                  : 'text-gray-400 hover:text-white transition-colors'
              }`}
              disabled={isLast}
            >
              {segment}
            </button>
          </React.Fragment>
        )
      })}
    </div>
  )
}
