import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  name: string
  value: number | string
  icon: LucideIcon
  color: 'cyan' | 'purple' | 'green' | 'yellow'
  isLoading?: boolean
}

const colorMap = {
  cyan: {
    gradient: 'rgba(6,182,212,0.1), rgba(59,130,246,0.1)',
    iconColor: 'text-cyan-400',
    glowColor: 'rgba(6,182,212,0.5)',
    hoverClass: 'hover:border-cyan-500/50'
  },
  purple: {
    gradient: 'rgba(168,85,247,0.1), rgba(236,72,153,0.1)',
    iconColor: 'text-purple-400',
    glowColor: 'rgba(168,85,247,0.5)',
    hoverClass: 'hover:border-purple-500/50'
  },
  green: {
    gradient: 'rgba(34,197,94,0.1), rgba(16,185,129,0.1)',
    iconColor: 'text-green-400',
    glowColor: 'rgba(34,197,94,0.5)',
    hoverClass: 'hover:border-green-500/50'
  },
  yellow: {
    gradient: 'rgba(250,204,21,0.1), rgba(251,146,60,0.1)',
    iconColor: 'text-yellow-400',
    glowColor: 'rgba(250,204,21,0.5)',
    hoverClass: 'hover:border-yellow-500/50'
  }
}

export const StatsCard: React.FC<StatsCardProps> = ({
  name,
  value,
  icon: Icon,
  color,
  isLoading = false
}) => {
  const { gradient, iconColor, glowColor, hoverClass } = colorMap[color]

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-gray-800 p-6 transition-all duration-300 hover:scale-105 group ${hoverClass}`}
      style={{
        background: `linear-gradient(to bottom right, ${gradient})`
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{name}</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {isLoading ? '...' : typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div 
          className={`p-3 rounded-lg bg-gray-900/50 ${iconColor}`}
          style={{
            boxShadow: `0 0 20px ${glowColor}`
          }}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {/* Decorative gradient orb */}
      <div 
        className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full blur-2xl opacity-50"
        style={{ background: glowColor }}
      />
    </div>
  )
}
