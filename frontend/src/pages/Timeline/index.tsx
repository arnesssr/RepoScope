import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Clock, Milestone, ZoomIn, ZoomOut, Filter } from 'lucide-react'
import { GanttChart } from '../../components/timeline/GanttChart'
import { TimelineFilters } from '../../components/timeline/TimelineFilters'
import { MilestoneCards } from '../../components/timeline/MilestoneCards'
import { TimelineStats } from '../../components/timeline/TimelineStats'

interface TimelineTask {
  id: string
  name: string
  startDate: string
  endDate: string
  progress: number
  assignee?: string
  dependencies?: string[]
  type: 'task' | 'milestone' | 'phase'
  status: 'planned' | 'in-progress' | 'completed' | 'delayed'
}

interface TimelineData {
  id: string
  projectName: string
  startDate: string
  endDate: string
  tasks: TimelineTask[]
  currentDate: string
}

const Timeline = () => {
  const [view, setView] = useState<'gantt' | 'milestones' | 'calendar'>('gantt')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [filters, setFilters] = useState({
    status: 'all',
    assignee: 'all',
    type: 'all'
  })

  const { data: timelineData, isLoading } = useQuery<TimelineData>({
    queryKey: ['timeline', timeRange],
    queryFn: async () => {
      // Mock data for now
      const now = new Date()
      const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
      const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      const twoMonthsFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)

      return {
        id: '1',
        projectName: 'RepoScope v2.0',
        startDate: now.toISOString(),
        endDate: twoMonthsFromNow.toISOString(),
        currentDate: now.toISOString(),
        tasks: [
          {
            id: '1',
            name: 'Phase 1: Core Features',
            startDate: now.toISOString(),
            endDate: oneMonthFromNow.toISOString(),
            progress: 65,
            type: 'phase',
            status: 'in-progress'
          },
          {
            id: '2',
            name: 'Implement Authentication',
            startDate: now.toISOString(),
            endDate: oneWeekFromNow.toISOString(),
            progress: 90,
            assignee: 'John Doe',
            type: 'task',
            status: 'in-progress'
          },
          {
            id: '3',
            name: 'Build Dashboard Components',
            startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: twoWeeksFromNow.toISOString(),
            progress: 45,
            assignee: 'Jane Smith',
            dependencies: ['2'],
            type: 'task',
            status: 'in-progress'
          },
          {
            id: '4',
            name: 'Beta Release',
            startDate: oneMonthFromNow.toISOString(),
            endDate: oneMonthFromNow.toISOString(),
            progress: 0,
            type: 'milestone',
            status: 'planned'
          },
          {
            id: '5',
            name: 'Phase 2: Advanced Features',
            startDate: oneMonthFromNow.toISOString(),
            endDate: twoMonthsFromNow.toISOString(),
            progress: 0,
            type: 'phase',
            status: 'planned'
          },
          {
            id: '6',
            name: 'AI Integration',
            startDate: oneMonthFromNow.toISOString(),
            endDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 0,
            assignee: 'Bob Wilson',
            dependencies: ['4'],
            type: 'task',
            status: 'planned'
          },
          {
            id: '7',
            name: 'Performance Optimization',
            startDate: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(now.getTime() + 55 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 0,
            assignee: 'Alice Johnson',
            type: 'task',
            status: 'planned'
          },
          {
            id: '8',
            name: 'Production Release',
            startDate: twoMonthsFromNow.toISOString(),
            endDate: twoMonthsFromNow.toISOString(),
            progress: 0,
            type: 'milestone',
            status: 'planned'
          }
        ]
      }
    },
    refetchInterval: false,
    refetchOnMount: false,
  })

  const filteredTasks = timelineData?.tasks.filter(task => {
    const matchesStatus = filters.status === 'all' || task.status === filters.status
    const matchesAssignee = filters.assignee === 'all' || task.assignee === filters.assignee
    const matchesType = filters.type === 'all' || task.type === filters.type
    return matchesStatus && matchesAssignee && matchesType
  })

  const stats = {
    totalTasks: timelineData?.tasks.filter(t => t.type === 'task').length || 0,
    completedTasks: timelineData?.tasks.filter(t => t.type === 'task' && t.status === 'completed').length || 0,
    totalMilestones: timelineData?.tasks.filter(t => t.type === 'milestone').length || 0,
    upcomingMilestones: timelineData?.tasks.filter(t => 
      t.type === 'milestone' && 
      new Date(t.startDate) > new Date()
    ).length || 0,
    overallProgress: timelineData?.tasks
      .filter(t => t.type === 'task')
      .reduce((sum, t) => sum + t.progress, 0) / 
      (timelineData?.tasks.filter(t => t.type === 'task').length || 1) || 0
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Project Timeline
            </h1>
            <p className="text-gray-400">
              Visualize project progress with interactive Gantt charts
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('gantt')}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${view === 'gantt'
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }
              `}
            >
              Gantt Chart
            </button>
            <button
              onClick={() => setView('milestones')}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${view === 'milestones'
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }
              `}
            >
              Milestones
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${view === 'calendar'
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }
              `}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <TimelineStats stats={stats} isLoading={isLoading} className="mb-8" />

      {/* Time Range Selector */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`
                px-3 py-1 rounded text-sm font-medium transition-all duration-200
                ${timeRange === range
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
                }
              `}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors">
            <ZoomOut size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors">
            <ZoomIn size={20} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <TimelineFilters
        filters={filters}
        onFiltersChange={setFilters}
        className="mb-8"
      />

      {/* Content */}
      {isLoading ? (
        <div className="h-96 bg-gray-800 rounded-lg animate-pulse" />
      ) : (
        <>
          {view === 'gantt' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <GanttChart
                tasks={filteredTasks || []}
                startDate={timelineData?.startDate || ''}
                endDate={timelineData?.endDate || ''}
                currentDate={timelineData?.currentDate || ''}
                timeRange={timeRange}
              />
            </div>
          )}

          {view === 'milestones' && (
            <MilestoneCards
              milestones={filteredTasks?.filter(t => t.type === 'milestone') || []}
              allTasks={timelineData?.tasks || []}
            />
          )}

          {view === 'calendar' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  Calendar View
                </h3>
                <p className="text-gray-400">
                  Calendar view coming soon...
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && (!timelineData || timelineData.tasks.length === 0) && (
        <div className="text-center py-12">
          <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            No timeline data available
          </h3>
          <p className="text-gray-400 mb-6">
            Create a project plan to see your timeline
          </p>
        </div>
      )}
    </div>
  )
}

export default Timeline
