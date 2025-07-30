import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Shield, AlertTriangle, CheckCircle, XCircle, Info, Scan } from 'lucide-react'
import { ThreatOverview } from '../../components/threats/ThreatOverview'
import { VulnerabilityList } from '../../components/threats/VulnerabilityList'
import { SecurityMetrics } from '../../components/threats/SecurityMetrics'
import { ThreatFilters } from '../../components/threats/ThreatFilters'
import apiService from '../../services/api'
import { useAuthStore } from '../../stores/authStore'
import { RepositorySelector } from '../../components/repository/RepositorySelector'
import { Repository } from '../../types'

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
  const [view, setView] = useState<'overview' | 'vulnerabilities' | 'metrics' | 'analysis'>('overview')
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)

  // Fetch repositories
  const { data: repositoriesData } = useQuery({
    queryKey: ['repositories'],
    queryFn: async () => {
      const { token } = useAuthStore.getState()
      return apiService.getRepositories(token)
    }
  })

  // Update repositories when data is fetched
  useEffect(() => {
    if (repositoriesData) {
      setRepositories(repositoriesData)
    }
  }, [repositoriesData])

  const { data: securityScan, isLoading, refetch } = useQuery<SecurityScan>({
    queryKey: ['security-scan', selectedRepo?.name],
    enabled: !!selectedRepo,
queryFn: async () => {
      const { token } = useAuthStore.getState();
      if (!selectedRepo) return null;
      
      // Get vulnerabilities from API response
      const vulnerabilitiesResponse = await apiService.getVulnerabilities(selectedRepo.full_name, undefined, token);
      const vulnerabilities = vulnerabilitiesResponse.data?.vulnerabilities || [];
      
      // Get metrics from API response
      const metricsResponse = await apiService.getSecurityMetrics(selectedRepo.full_name, token);
      const metricsData = metricsResponse.data?.metrics || {};
      
      // Calculate score from vulnerabilities count
      const score = Math.max(0, 100 - (vulnerabilities.length * 10));
      
      // Transform metrics to expected format
      const metrics = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        resolved: 0,
        ignored: 0,
        ...metricsData
      };
      
      // Count vulnerabilities by severity
      vulnerabilities.forEach((vuln: any) => {
        if (vuln.severity) {
          metrics[vuln.severity] = (metrics[vuln.severity] || 0) + 1;
        }
      });
      
      return {
        id: '1',
        repository: selectedRepo.name,
        lastScanDate: new Date().toISOString(),
        score,
        metrics,
        vulnerabilities,
      };
    },
    refetchInterval: false,
    refetchOnMount: false,
  })

  const scanMutation = useMutation({
mutationFn: async () => {
      const { token } = useAuthStore.getState();
      if (!selectedRepo) {
        throw new Error('No repository selected');
      }
      await apiService.analyzeSecurity(selectedRepo.full_name, token);
    },
    onSuccess: () => {
      console.log('Security scan completed')
      // Refetch security data after successful scan
      refetch()
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
          <div className="flex items-center gap-4">
            <RepositorySelector
              repositories={repositories}
              selectedRepo={selectedRepo}
              onSelectRepo={setSelectedRepo}
            />
            <button
              onClick={() => scanMutation.mutate()}
              disabled={scanMutation.isPending || !selectedRepo}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Scan size={20} />
              {scanMutation.isPending ? 'Scanning...' : 'Run Security Scan'}
            </button>
          </div>
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
          {['overview', 'vulnerabilities', 'metrics', 'analysis'].map((tab) => (
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
