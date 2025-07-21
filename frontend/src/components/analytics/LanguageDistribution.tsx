import React from 'react'

interface Language {
  name: string
  percentage: number
  color: string
}

interface LanguageDistributionProps {
  languages: Language[]
}

export const LanguageDistribution: React.FC<LanguageDistributionProps> = ({ languages }) => {
  return (
    <div className="space-y-4">
      {languages.map((lang, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-300">{lang.name}</span>
            <span className="text-sm text-gray-400">{lang.percentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${lang.percentage}%`,
                backgroundColor: lang.color
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
