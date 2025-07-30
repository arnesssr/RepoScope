import React from 'react'

interface ThreatOverviewProps {
  vulnerabilities: Array<{
    id: string
    title: string
    description: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    status: 'open' | 'resolved' | 'ignored'
    discoveredAt: string
  }>
}

export const ThreatOverview: React.FC<ThreatOverviewProps> = ({ vulnerabilities }) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-lg font-medium text-white">Threat Overview</h2>
      {vulnerabilities.length === 0 && (
        <p className="text-gray-400">No vulnerabilities found</p>
      )}
      <ul className="text-gray-400 list-disc pl-4">
        {vulnerabilities.map(vuln => (
          <li key={vuln.id} className="mb-2">
            <strong className={
              vuln.severity === 'critical' ? 'text-red-500' :
              vuln.severity === 'high' ? 'text-orange-400' :
              vuln.severity === 'medium' ? 'text-yellow-400' :
              'text-blue-400'
            }>[{vuln.severity.toUpperCase()}]</strong> {vuln.title} - {vuln.status}
            <p className="text-xs">Discovered: {new Date(vuln.discoveredAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
