import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';

interface ContributionDistributionProps {
  data: Array<{ 
    name: string, 
    contributions: number, 
    color: string,
    avatar_url?: string | null,
    email?: string 
  }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 shadow-lg">
        <p className="text-white font-medium">{label}</p>
        <p className="text-cyan-400">
          {payload[0].value} commits ({((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

export const ContributionDistribution: React.FC<ContributionDistributionProps> = ({ data }) => {
  // Calculate total contributions
  const totalContributions = data.reduce((sum, item) => sum + item.contributions, 0);
  
  // Sort and add percentage
  const sortedData = [...data]
    .sort((a, b) => b.contributions - a.contributions)
    .map(item => ({
      ...item,
      percentage: (item.contributions / totalContributions) * 100
    }));
  
  // Group contributors
  const coreContributors = sortedData.filter(c => c.percentage >= 20);
  const activeContributors = sortedData.filter(c => c.percentage >= 5 && c.percentage < 20);
  const contributors = sortedData.filter(c => c.percentage < 5);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const renderContributor = (contributor: any, index: number) => {
    const isTopContributor = contributor === sortedData[0];
    const barWidth = Math.max((contributor.contributions / sortedData[0].contributions) * 100, 5);
    
    return (
      <div 
        key={contributor.name} 
        className="group hover:bg-gray-800/50 p-2 rounded-lg transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {contributor.avatar_url ? (
            <img 
              src={contributor.avatar_url}
              alt={contributor.name}
              className="w-10 h-10 rounded-full shrink-0 ring-2 ring-gray-700 group-hover:ring-gray-600 object-cover"
              onError={(e) => {
                // Fallback to initials if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ring-2 ring-gray-700 group-hover:ring-gray-600 ${contributor.avatar_url ? 'hidden' : ''}`}
            style={{ backgroundColor: `${contributor.color}33`, color: contributor.color }}
          >
            {getInitials(contributor.name)}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                  {contributor.name.split('@')[0]}
                </span>
                {isTopContributor && (
                  <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded">
                    👑 Top
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500">
                  {contributor.percentage.toFixed(1)}%
                </span>
                <span className="text-gray-300 font-medium">
                  {contributor.contributions.toLocaleString()}
                </span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="relative">
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-700 ease-out relative group-hover:shadow-lg"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: contributor.color,
                    boxShadow: `0 0 10px ${contributor.color}44`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderGroup = (title: string, contributors: any[], icon: string) => {
    if (contributors.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>{icon}</span>
          <span>{title}</span>
          <span className="text-gray-600">({contributors.length})</span>
        </h4>
        <div className="space-y-2">
          {contributors.map((contributor, index) => renderContributor(contributor, index))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full">
      <div>
        {renderGroup('Core Contributors', coreContributors, '⭐')}
        {renderGroup('Active Contributors', activeContributors, '🔥')}
        {renderGroup('Contributors', contributors, '💫')}
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{sortedData.length}</p>
          <p className="text-sm text-gray-400">Contributors</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-cyan-400">{totalContributions.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Total Commits</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">
            {Math.round(totalContributions / sortedData.length).toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">Avg per Person</p>
        </div>
      </div>
    </div>
  );
};
