import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { CodeQualityIssue } from '../../types';
import { Card } from '../ui/Card';

interface CodeQualitySummaryWidgetProps {
  issues?: CodeQualityIssue[];
  qualityScore?: number;
  onViewDetails?: () => void;
}

export const CodeQualitySummaryWidget: React.FC<CodeQualitySummaryWidgetProps> = ({
  issues = [],
  qualityScore,
  onViewDetails
}) => {
  const issueCounts = issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getQualityScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const topIssues = issues
    .sort((a, b) => {
      const severityOrder = { error: 0, warning: 1, info: 2 };
      return (severityOrder[a.severity as keyof typeof severityOrder] || 3) - 
             (severityOrder[b.severity as keyof typeof severityOrder] || 3);
    })
    .slice(0, 3);

  return (
    <Card className="glass-card neon-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          Code Quality
        </h3>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            View Details →
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Quality Score if available */}
        {qualityScore !== undefined && (
          <div className="flex items-center justify-between pb-4 border-b border-gray-700">
            <span className="text-sm text-gray-400">Quality Score</span>
            <span className={`text-2xl font-bold ${getQualityScoreColor(qualityScore)}`}>
              {qualityScore}/100
            </span>
          </div>
        )}

        {/* Issue Summary */}
        <div>
          <p className="text-sm text-gray-400 mb-3">Issue Summary</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{issueCounts.error || 0}</p>
              <p className="text-xs text-gray-500">Errors</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{issueCounts.warning || 0}</p>
              <p className="text-xs text-gray-500">Warnings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{issueCounts.info || 0}</p>
              <p className="text-xs text-gray-500">Info</p>
            </div>
          </div>
        </div>

        {/* Top Issues */}
        {topIssues.length > 0 && (
          <div>
            <p className="text-sm text-gray-400 mb-2">Recent Issues</p>
            <div className="space-y-2">
              {topIssues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2">
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">{issue.message}</p>
                    <p className="text-xs text-gray-500">
                      {issue.file}:{issue.line}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {issues.length === 0 && (
          <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No quality issues detected</p>
          </div>
        )}
      </div>
    </Card>
  );
};
