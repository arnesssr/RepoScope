import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'neon' | 'glass'
  neonColor?: 'cyan' | 'purple' | 'green' | 'yellow'
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  neonColor = 'cyan',
  onClick
}) => {
  const baseClasses = 'rounded-xl border transition-all duration-300'
  
  const variantClasses = {
    default: 'bg-gray-950 border-gray-800',
    neon: `bg-gray-950 border-gray-800 neon-card hover:scale-105 hover:neon-glow-${neonColor}`,
    glass: 'glass-card'
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  )
}

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  )
}
