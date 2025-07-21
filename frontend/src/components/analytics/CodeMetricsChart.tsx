import React from 'react'
import { Code, FileText, GitBranch, Activity } from 'lucide-react'

interface CodeMetrics {
  linesOfCode: number
  files: number
  functions: number
  complexity: number
}

interface CodeMetricsChartProps {
  metrics: CodeMetrics
}

export const CodeMetricsChart: React.FC<CodeMetricsChartProps> = ({ metrics }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const metricItems = [
    {
      icon: Code,
      label: 'Lines of Code',
      value: formatNumber(metrics.linesOfCode),
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10'
    },
    {
      icon: FileText,
      label: 'Files',
      value: formatNumber(metrics.files),
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      icon: GitBranch,
      label: 'Functions',
      value: formatNumber(metrics.functions),
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      icon: Activity,
      label: 'Avg Complexity',
      value: metrics.complexity.toFixed(1),
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {metricItems.map((item, index) => {
        const Icon = item.icon
        return (
          <div key={index} className="bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <span className="text-sm text-gray-400">{item.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{item.value}</p>
          </div>
        )
      })}
    </div>
  )
}
