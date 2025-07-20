import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Calendar, Target, CheckCircle, Plus, Sparkles } from 'lucide-react'
import { ProjectOverview } from '../../components/planning/ProjectOverview'
import { TaskList } from '../../components/planning/TaskList'
import { MilestoneTracker } from '../../components/planning/MilestoneTracker'
import { PlanningFilters } from '../../components/planning/PlanningFilters'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignee?: string
  dueDate?: string
  labels: string[]
}

interface Milestone {
  id: string
  name: string
  description: string
  dueDate: string
  progress: number
  tasks: string[]
}

interface ProjectPlan {
  id: string
  name: string
  description: string
  repository: string
  createdAt: string
  updatedAt: string
  tasks: Task[]
  milestones: Milestone[]
  aiGenerated: boolean
}

const Planning = () => {
  const [view, setView] = useState<'overview' | 'tasks' | 'milestones'>('overview')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { data: projectPlan, isLoading } = useQuery<ProjectPlan>({
    queryKey: ['project-plan'],
    queryFn: async () => {
      // Mock data for now
      return {
        id: '1',
        name: 'RepoScope v2.0 Release',
        description: 'Major release with AI-powered features and improved analytics',
        repository: 'RepoScope',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        aiGenerated: true,
        tasks: [
          {
            id: '1',
            title: 'Implement AI-powered code analysis',
            description: 'Integrate Gemini API for intelligent code insights',
            status: 'in-progress',
            priority: 'high',
            assignee: 'John Doe',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            labels: ['feature', 'ai']
          },
          {
            id: '2',
            title: 'Add real-time collaboration features',
            description: 'WebSocket integration for live updates',
            status: 'todo',
            priority: 'medium',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            labels: ['feature', 'backend']
          },
          {
            id: '3',
            title: 'Optimize dashboard performance',
            description: 'Improve loading times for large repositories',
            status: 'done',
            priority: 'high',
            assignee: 'Jane Smith',
            labels: ['performance', 'frontend']
          },
          {
            id: '4',
            title: 'Write comprehensive documentation',
            description: 'Update API docs and user guides',
            status: 'todo',
            priority: 'medium',
            dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
            labels: ['documentation']
          }
        ],
        milestones: [
          {
            id: '1',
            name: 'Beta Release',
            description: 'Feature-complete beta version',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 65,
            tasks: ['1', '2', '3']
          },
          {
            id: '2',
            name: 'Production Release',
            description: 'Stable release with all features',
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 30,
            tasks: ['1', '2', '3', '4']
          }
        ]
      }
    },
    refetchInterval: false,
    refetchOnMount: false,
  })

  const generatePlanMutation = useMutation({
    mutationFn: async () => {
      // Mock AI plan generation
      return new Promise(resolve => setTimeout(resolve, 2000))
    },
    onSuccess: () => {
      console.log('Plan generated successfully')
    }
  })

  const stats = {
    totalTasks: projectPlan?.tasks.length || 0,
    completedTasks: projectPlan?.tasks.filter(t => t.status === 'done').length || 0,
    activeMilestones: projectPlan?.milestones.length || 0,
    overallProgress: projectPlan?.milestones.reduce((sum, m) => sum + m.progress, 0) / (projectPlan?.milestones.length || 1) || 0
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Project Planning
            </h1>
            <p className="text-gray-400">
              AI-powered project planning and task management
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => generatePlanMutation.mutate()}
              disabled={generatePlanMutation.isPending}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles size={20} />
              {generatePlanMutation.isPending ? 'Generating...' : 'Generate with AI'}
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Create Plan
            </button>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="mb-8 border-b border-gray-800">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'tasks', 'milestones'].map((tab) => (
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
            <ProjectOverview
              plan={projectPlan}
              stats={stats}
            />
          )}

          {view === 'tasks' && (
            <TaskList
              tasks={projectPlan?.tasks || []}
              onTaskUpdate={(taskId, updates) => {
                console.log('Update task:', taskId, updates)
              }}
            />
          )}

          {view === 'milestones' && (
            <MilestoneTracker
              milestones={projectPlan?.milestones || []}
              tasks={projectPlan?.tasks || []}
              onMilestoneUpdate={(milestoneId, updates) => {
                console.log('Update milestone:', milestoneId, updates)
              }}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && !projectPlan && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            No project plan yet
          </h3>
          <p className="text-gray-400 mb-6">
            Create a project plan or let AI generate one based on your repository
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => generatePlanMutation.mutate()}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <Sparkles size={20} />
              Generate with AI
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Create Manually
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Planning
