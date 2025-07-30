import React from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { SecurityAnalysis } from '../../types';
import { Card } from '../ui/Card';

interface SecuritySummaryWidgetProps {
  analysis?: SecurityAnalysis;
  onViewDetails?: () => void;
}

export const SecuritySummaryWidget: React.FC<SecuritySummaryWidgetProps> = ({ 
  analysis, 
  onViewDetails 
}) => {
  if (!analysis) {
    return null;
  }

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSecurityScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-500/20';
    if (score >= 70) return 'bg-yellow-500/20';
    if (score >= 50) return 'bg-orange-500/20';
    return 'bg-red-500/20';
  };

  const severityCounts = analysis.vulnerabilities?.reduce((acc, vuln) => {
    acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <Card className="glass-card neon-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          Security Overview
        </h3>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-sm text-green-400 hover:text-green-300 transition-colors"
          >
            View Details →
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Security Score */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Security Score</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className={`text-3xl font-bold ${getSecurityScoreColor(analysis.security_score)}`}>
                {analysis.security_score}
              </p>
              <span className="text-sm text-gray-500">/ 100</span>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${getSecurityScoreBg(analysis.security_score)}`}>
            {analysis.security_score >= 70 ? (
              <CheckCircle className={`w-8 h-8 ${getSecurityScoreColor(analysis.security_score)}`} />
            ) : (
              <AlertTriangle className={`w-8 h-8 ${getSecurityScoreColor(analysis.security_score)}`} />
            )}
          </div>
        </div>

        {/* Vulnerability Summary */}
        <div>
          <p className="text-sm text-gray-400 mb-2">Vulnerability Breakdown</p>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{severityCounts.critical || 0}</p>
              <p className="text-xs text-gray-500">Critical</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">{severityCounts.high || 0}</p>
              <p className="text-xs text-gray-500">High</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{severityCounts.medium || 0}</p>
              <p className="text-xs text-gray-500">Medium</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{severityCounts.low || 0}</p>
              <p className="text-xs text-gray-500">Low</p>
            </div>
          </div>
        </div>

        {/* Critical Vulnerabilities List */}
        {analysis.vulnerabilities && analysis.vulnerabilities.filter(v => v.severity === 'critical').length > 0 && (
          <div>
            <p className="text-sm text-gray-400 mb-2">Critical Issues</p>
            <div className="space-y-1">
              {analysis.vulnerabilities
                .filter(v => v.severity === 'critical')
                .slice(0, 2)
                .map((vuln, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 line-clamp-1">{vuln.title}</p>
                      <p className="text-xs text-gray-500">in {vuln.package_name}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Last Scan Info */}
        <div className="pt-2 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Last scan: {new Date(analysis.last_scan).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Card>
  );
};
