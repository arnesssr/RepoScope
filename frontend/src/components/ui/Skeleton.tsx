import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
}) => {
  const baseClasses = 'animate-pulse bg-gray-800'
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  }

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%')
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-gray-950 border border-gray-800 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      <Skeleton variant="text" width="40%" height={32} className="mb-2" />
      <Skeleton variant="text" width="80%" height={16} />
    </div>
  )
}
