import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  GitBranch, 
  Users, 
  FileCode, 
  AlertTriangle,
  Calendar,
  Play,
  Settings
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

interface QuickActionsProps {
  repoId?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ repoId }) => {
  const actions: QuickAction[] = [
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'View detailed repository analytics',
      icon: BarChart3,
      path: repoId ? `/dashboard/analytics?repo=${repoId}` : '/dashboard/analytics',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      id: 'commits',
      title: 'Commits',
      description: 'Browse commit history',
      icon: GitBranch,
      path: repoId ? `/dashboard/commits?repo=${repoId}` : '/dashboard/commits',
      color: 'bg-green-500/10 text-green-600 dark:text-green-400',
    },
    {
      id: 'contributors',
      title: 'Contributors',
      description: 'View contributor insights',
      icon: Users,
      path: repoId ? `/dashboard/contributors?repo=${repoId}` : '/dashboard/contributors',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
    {
      id: 'files',
      title: 'Files',
      description: 'Explore repository structure',
      icon: FileCode,
      path: repoId ? `/dashboard/files?repo=${repoId}` : '/dashboard/files',
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    },
    {
      id: 'threats',
      title: 'Threats',
      description: 'Security threat analysis',
      icon: AlertTriangle,
      path: repoId ? `/dashboard/threats?repo=${repoId}` : '/dashboard/threats',
      color: 'bg-red-500/10 text-red-600 dark:text-red-400',
    },
    {
      id: 'timeline',
      title: 'Timeline',
      description: 'Project timeline view',
      icon: Calendar,
      path: repoId ? `/dashboard/timeline?repo=${repoId}` : '/dashboard/timeline',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'analyze',
      title: 'Run Analysis',
      description: 'Start a new repository analysis',
      icon: Play,
      path: repoId ? `/dashboard/analysis/${repoId}` : '/dashboard/repositories',
      color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure repository settings',
      icon: Settings,
      path: '/dashboard/settings',
      color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Link
                to={action.path}
                className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:shadow-md group"
              >
                <div className={`p-3 rounded-lg ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
