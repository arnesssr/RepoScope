import React from 'react'
import { AlertTriangle, Shield, CheckCircle, XCircle } from 'lucide-react'

interface SecurityMetricsProps {
  metrics?: {
    critical: number
    high: number
    medium: number
    low: number
    resolved: number
    ignored: number
  }
  vulnerabilities: Array<any>
}

export const SecurityMetrics: React.FC<SecurityMetricsProps> = ({ metrics, vulnerabilities = [] }) => {
  const defaultMetrics = metrics || {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    resolved: 0,
    ignored: 0
  }

  const totalVulnerabilities = defaultMetrics.critical + defaultMetrics.high + defaultMetrics.medium + defaultMetrics.low
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Vulnerabilities */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Vulnerabilities</p>
            <p className="text-3xl font-bold text-white mt-1">{totalVulnerabilities}</p>
          </div>
          <AlertTriangle className="h-8 w-8 text-yellow-400" />
        </div>
      </div>

      {/* Critical & High */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Critical & High</p>
            <p className="text-3xl font-bold text-red-400 mt-1">
              {defaultMetrics.critical + defaultMetrics.high}
            </p>
          </div>
          <XCircle className="h-8 w-8 text-red-400" />
        </div>
      </div>

      {/* Resolved */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Resolved</p>
            <p className="text-3xl font-bold text-green-400 mt-1">{defaultMetrics.resolved}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>
      </div>

      {/* Security Score */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Security Health</p>
            <p className="text-3xl font-bold text-cyan-400 mt-1">
              {totalVulnerabilities === 0 ? '100%' : 
                Math.round((defaultMetrics.resolved / (totalVulnerabilities + defaultMetrics.resolved)) * 100) + '%'
              }
            </p>
          </div>
          <Shield className="h-8 w-8 text-cyan-400" />
        </div>
      </div>

      {/* Breakdown by Severity */}
      <div className="bg-gray-800 p-6 rounded-lg col-span-full">
        <h3 className="text-lg font-medium text-white mb-4">Vulnerability Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-red-400">Critical</span>
            <span className="text-white font-bold">{defaultMetrics.critical}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-orange-400">High</span>
            <span className="text-white font-bold">{defaultMetrics.high}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-yellow-400">Medium</span>
            <span className="text-white font-bold">{defaultMetrics.medium}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-400">Low</span>
            <span className="text-white font-bold">{defaultMetrics.low}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
