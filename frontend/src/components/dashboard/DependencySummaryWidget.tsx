import React from 'react';
import { Package, AlertTriangle, Shield, TrendingUp } from 'lucide-react';
import { DependencyAnalysis } from '../../types';
import { Card } from '../ui/Card';

interface DependencySummaryWidgetProps {
  analysis?: DependencyAnalysis;
  onViewDetails?: () => void;
}

export const DependencySummaryWidget: React.FC<DependencySummaryWidgetProps> = ({ 
  analysis, 
  onViewDetails 
}) => {
  if (!analysis) {
    return null;
  }

  const outdatedPercentage = analysis.total_dependencies > 0 
    ? Math.round((analysis.outdated_dependencies / analysis.total_dependencies) * 100)
    : 0;

  const getVulnerabilitySeverityColor = (count: number) => {
    if (count === 0) return 'text-green-400';
    if (count <= 2) return 'text-yellow-400';
    if (count <= 5) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <Card className="glass-card neon-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-400" />
          Dependencies Overview
        </h3>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View Details →
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Total Dependencies */}
        <div>
          <p className="text-sm text-gray-400">Total Packages</p>
          <p className="text-2xl font-bold text-white mt-1">{analysis.total_dependencies}</p>
        </div>

        {/* Outdated Dependencies */}
        <div>
          <p className="text-sm text-gray-400">Outdated</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-orange-400">{analysis.outdated_dependencies}</p>
            <span className="text-sm text-gray-500">({outdatedPercentage}%)</span>
          </div>
        </div>

        {/* Vulnerabilities */}
        <div className="col-span-2">
          <p className="text-sm text-gray-400 mb-2">Security Vulnerabilities</p>
          <div className="flex items-center gap-3">
            <AlertTriangle className={`w-5 h-5 ${getVulnerabilitySeverityColor(analysis.vulnerabilities_count)}`} />
            <span className={`text-xl font-bold ${getVulnerabilitySeverityColor(analysis.vulnerabilities_count)}`}>
              {analysis.vulnerabilities_count}
            </span>
            <span className="text-sm text-gray-500">
              {analysis.vulnerabilities_count === 0 ? 'No vulnerabilities found' : 'vulnerabilities detected'}
            </span>
          </div>
        </div>

        {/* Critical Updates */}
        {analysis.critical_updates && analysis.critical_updates.length > 0 && (
          <div className="col-span-2 mt-2">
            <p className="text-sm text-gray-400 mb-2">Critical Updates Required</p>
            <div className="space-y-1">
              {analysis.critical_updates.slice(0, 3).map((update, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{update.name}</span>
                  <span className="text-red-400 text-xs">
                    {update.current_version} → {update.latest_version}
                  </span>
                </div>
              ))}
              {analysis.critical_updates.length > 3 && (
                <p className="text-xs text-gray-500 mt-1">
                  +{analysis.critical_updates.length - 3} more updates
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
