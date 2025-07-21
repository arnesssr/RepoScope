import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '../ui/Skeleton';

interface StatsCardProps {
  name: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'cyan' | 'green' | 'purple' | 'yellow';
  isLoading?: boolean;
}

const colorClasses = {
  cyan: {
    icon: 'bg-cyan-500/20 text-cyan-400',
    glow: 'neon-glow-cyan',
    border: 'hover:border-cyan-400/50'
  },
  green: {
    icon: 'bg-green-500/20 text-green-400',
    glow: 'neon-glow-green',
    border: 'hover:border-green-400/50'
  },
  purple: {
    icon: 'bg-purple-500/20 text-purple-400',
    glow: 'neon-glow-purple',
    border: 'hover:border-purple-400/50'
  },
  yellow: {
    icon: 'bg-yellow-500/20 text-yellow-400',
    glow: 'neon-glow-yellow',
    border: 'hover:border-yellow-400/50'
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  name,
  value,
  icon: Icon,
  description,
  trend,
  color = 'cyan',
  isLoading = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-card neon-border ${colorClasses[color].glow} ${colorClasses[color].border} p-6 transition-all duration-300`}
    >
      {isLoading ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="w-12 h-12 rounded-lg" />
            {trend && <Skeleton className="w-12 h-4" />}
          </div>
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-32 h-8" />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${colorClasses[color].icon} backdrop-blur-sm`}>
              <Icon className="w-6 h-6" />
            </div>
            {trend && (
              <div
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </div>
            )}
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">
            {name}
          </h3>
          <p className="text-2xl font-bold text-white">
            {value}
          </p>
          {description && (
            <p className="text-sm text-gray-500 mt-2">
              {description}
            </p>
          )}
        </>
      )}
    </motion.div>
  );
};
