import { Repository } from '../../types';
import { RepositoryCard } from './RepositoryCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { AlertCircle } from 'lucide-react';

interface RepositoryListProps {
  repositories: Repository[];
  loading: boolean;
  error: Error | null;
  onAnalyze: (repo: Repository) => void;
}

export const RepositoryList: React.FC<RepositoryListProps> = ({
  repositories,
  loading,
  error,
  onAnalyze,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading your repositories..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Failed to load repositories
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {error.message}
        </p>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No repositories found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have any repositories yet. Create one on GitHub to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repositories.map((repo) => (
        <RepositoryCard
          key={repo.id}
          repository={repo}
          onAnalyze={onAnalyze}
        />
      ))}
    </div>
  );
};
