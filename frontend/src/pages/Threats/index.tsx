import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Shield, AlertTriangle, CheckCircle, XCircle, Info, Scan } from 'lucide-react'
import { ThreatOverview } from '../../components/threats/ThreatOverview'
import { VulnerabilityList } from '../../components/threats/VulnerabilityList'
import { SecurityMetrics } from '../../components/threats/SecurityMetrics'
import { ThreatFilters } from '../../components/threats/ThreatFilters'

interface Vulnerability {
  id: string
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'resolved' | 'ignored'
  file: string
  line: number
  type: 'dependency' | 'code' | 'config' | 'secret'
  discoveredAt: string
  resolvedAt?: string
}

interface SecurityScan {
  id: string
  repository: string
  lastScanDate: string
  vulnerabilities: Vulnerability[]
  metrics: {
    critical: number
    high: number
    medium: number
    low: number
    resolved: number
    ignored: number
  }
  score: number
}

const Threats = () => {
  const [filters, setFilters] = useState({
    severity: 'all',
    status: 'open',
    type: 'all'
  })
  const [view, setView] = useState<'overview' | 'vulnerabilities' | 'metrics'>('overview')

  const { data: securityScan, isLoading } = useQuery<SecurityScan>({
    queryKey: ['security-scan'],
    queryFn: async () => {
      // Mock data for now
      return {
        id: '1',
        repository: 'RepoScope',
        lastScanDate: new Date().toISOString(),
        score: 85,
        metrics: {
          critical: 0,
          high: 2,
          medium: 5,
          low: 8,
          resolved: 12,
          ignored: 3
        },
        vulnerabilities: [
          {
            id: '1',
            title: 'Outdated dependency: lodash',
            description: 'The lodash library version 4.17.20 has known security vulnerabilities',
            severity: 'high',
            status: 'open',
            file: 'package.json',
            line: 45,
            type: 'dependency',
            discoveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            title: 'SQL Injection vulnerability',
            description: 'Potential SQL injection in user input handling',
            severity: 'critical',
            status: 'resolved',
            file: 'src/api/users.ts',
            line: 123,
            type: 'code',
            discoveredAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            title: 'Exposed API key',
            description: 'API key found in configuration file',
            severity: 'high',
            status: 'open',
            file: 'config/api.js',
            line: 15,
            type: 'secret',
            discoveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '4',
            title: 'Missing HTTPS enforcement',
            description: 'Application does not enforce HTTPS connections',
            severity: 'medium',
            status: 'open',
            file: 'server.js',
            line: 78,
            type: 'config',
            discoveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '5',
            title: 'Weak password requirements',
            description: 'Password policy allows weak passwords',
            severity: 'medium',
            status: 'ignored',
            file: 'src/auth/validation.ts',
            line: 34,
            type: 'code',
            discoveredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    },
    refetchInterval: false,
    refetchOnMount: false,
  })

  const scanMutation = useMutation({
    mutationFn: async () => {
      // Mock security scan
      return new Promise(resolve => setTimeout(resolve, 3000))
    },
    onSuccess: () => {
      console.log('Security scan completed')
    }
  })

  const filteredVulnerabilities = securityScan?.vulnerabilities.filter(vuln => {
    const matchesSeverity = filters.severity === 'all' || vuln.severity === filters.severity
    const matchesStatus = filters.status === 'all' || vuln.status === filters.status
    const matchesType = filters.type === 'all' || vuln.type === filters.type
    return matchesSeverity && matchesStatus && matchesType
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400'
      case 'high': return 'text-orange-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Security Threats
            </h1>
            <p className="text-gray-400">
              Monitor and manage security vulnerabilities in your repository
            </p>
          </div>
          <button
            onClick={() => scanMutation.mutate()}
            disabled={scanMutation.isPending}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Scan size={20} />
            {scanMutation.isPending ? 'Scanning...' : 'Run Security Scan'}
          </button>
        </div>
      </div>

      {/* Security Score */}
      {securityScan && (
        <div className="mb-8 bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white mb-1">Security Score</h3>
              <p className="text-gray-400 text-sm">
                Last scanned: {new Date(securityScan.lastScanDate).toLocaleDateString()}
              </p>
            </div>
            <div className="text-center">
              <div className={`text-5xl font-bold ${
                securityScan.score >= 90 ? 'text-green-400' :
                securityScan.score >= 70 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {securityScan.score}
              </div>
              <div className="text-gray-400 text-sm">out of 100</div>
            </div>
          </div>
        </div>
      )}

      {/* View Tabs */}
      <div className="mb-8 border-b border-gray-800">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'vulnerabilities', 'metrics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab as any)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors
                ${view === tab
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <ThreatFilters
        filters={filters}
        onFiltersChange={setFilters}
        className="mb-8"
      />

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {view === 'overview' && (
            <ThreatOverview
              scan={securityScan}
              vulnerabilities={filteredVulnerabilities || []}
            />
          )}

          {view === 'vulnerabilities' && (
            <VulnerabilityList
              vulnerabilities={filteredVulnerabilities || []}
              onVulnerabilityUpdate={(id, updates) => {
                console.log('Update vulnerability:', id, updates)
              }}
            />
          )}

          {view === 'metrics' && (
            <SecurityMetrics
              metrics={securityScan?.metrics}
              vulnerabilities={securityScan?.vulnerabilities || []}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && !securityScan && (
        <div className="text-center py-12">
          <Shield className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            No security scan data
          </h3>
          <p className="text-gray-400 mb-6">
            Run a security scan to identify vulnerabilities in your repository
          </p>
          <button
            onClick={() => scanMutation.mutate()}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
          >
            <Scan size={20} />
            Run Security Scan
          </button>
        </div>
      )}
    </div>
  )
}

export default Threats
