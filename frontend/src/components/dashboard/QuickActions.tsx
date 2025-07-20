import React from 'react'
import { TrendingUp, Rocket, BarChart3, Shield, Calendar, Zap, LucideIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

interface QuickAction {
  id: string
  label: string
  description: string
  icon: LucideIcon
  color: 'cyan' | 'purple' | 'green' | 'yellow'
  path?: string
}

interface QuickActionsProps {
  actions?: QuickAction[]
}

const defaultActions: QuickAction[] = [
  {
    id: '1',
    label: 'Create Plan',
    description: 'Start a new project plan',
    icon: Rocket,
    color: 'cyan',
    path: '/dashboard/planning'
  },
  {
    id: '2',
    label: 'View Metrics',
    description: 'Analyze repository statistics',
    icon: BarChart3,
    color: 'purple',
    path: '/dashboard/analytics'
  },
  {
    id: '3',
    label: 'Security Scan',
    description: 'Check for threats and vulnerabilities',
    icon: Shield,
    color: 'green',
    path: '/dashboard/threats'
  },
  {
    id: '4',
    label: 'Timeline View',
    description: 'Project milestones and deadlines',
    icon: Calendar,
    color: 'yellow',
    path: '/dashboard/timeline'
  }
]

const colorMap = {
  cyan: {
    gradient: 'from-cyan-500/10 to-blue-500/10',
    hover: 'hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    iconColor: 'text-cyan-400',
    iconHover: 'group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
  },
  purple: {
    gradient: 'from-purple-500/10 to-pink-500/10',
    hover: 'hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    iconColor: 'text-purple-400',
    iconHover: 'group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'
  },
  green: {
    gradient: 'from-green-500/10 to-emerald-500/10',
    hover: 'hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    iconColor: 'text-green-400',
    iconHover: 'group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]'
  },
  yellow: {
    gradient: 'from-yellow-500/10 to-orange-500/10',
    hover: 'hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]',
    iconColor: 'text-yellow-400',
    iconHover: 'group-hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'
  }
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions = defaultActions }) => {
  const navigate = useNavigate()
  const { repoId } = useParams<{ repoId: string }>()
  
  // Add analysis action if repository is selected
  const enhancedActions = React.useMemo(() => {
    if (repoId) {
      return [
        {
          id: '0',
          label: 'Analyze Repository',
          description: 'Run AI-powered analysis',
          icon: Zap,
          color: 'purple' as const,
          path: `/dashboard/analysis/${repoId}`
        },
        ...actions
      ]
    }
    return actions
  }, [actions, repoId])
  
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-purple-400" />
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {enhancedActions.map((action) => {
          const Icon = action.icon
          const { gradient, hover, iconColor, iconHover } = colorMap[action.color]
          
          return (
            <button 
              key={action.id}
              onClick={() => action.path && navigate(action.path)}
              className={`p-6 rounded-lg bg-gradient-to-br ${gradient} border border-gray-800 ${hover} transition-all duration-200 group text-left`}
            >
              <Icon className={`h-10 w-10 ${iconColor} mb-3 ${iconHover}`} />
              <p className="text-base font-medium text-white mb-1">{action.label}</p>
              <p className="text-xs text-gray-400">{action.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

