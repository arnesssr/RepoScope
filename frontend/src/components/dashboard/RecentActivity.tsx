import React from 'react';
import { motion } from 'framer-motion';
import { GitCommit, GitBranch, GitPullRequest, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'commit' | 'branch' | 'pr';
  title: string;
  description?: string;
  author: string;
  timestamp: Date;
  url?: string;
}

interface RecentActivityProps {
  activities?: Activity[];
  loading?: boolean;
}

const activityIcons = {
  commit: GitCommit,
  branch: GitBranch,
  pr: GitPullRequest,
};

const activityColors = {
  commit: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
  branch: 'text-green-600 bg-green-100 dark:bg-green-900/20',
  pr: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
};

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = [],
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h3>
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity, index) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start space-x-3"
              >
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.title}
                  </p>
                  {activity.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {activity.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    by {activity.author} • {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
