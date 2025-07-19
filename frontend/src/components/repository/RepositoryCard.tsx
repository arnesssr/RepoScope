import { Repository } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Star, GitFork, Circle, BarChart3 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RepositoryCardProps {
  repository: Repository;
  onAnalyze: (repo: Repository) => void;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({ 
  repository, 
  onAnalyze 
}) => {
  const languageColors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    'C++': '#f34b7d',
    C: '#555555',
  };

  return (
    <Card hover className="h-full flex flex-col">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {repository.name}
            </h3>
            {repository.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {repository.description}
              </p>
            )}
          </div>
          {repository.private && (
            <span className="ml-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
              Private
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
          {repository.language && (
            <div className="flex items-center gap-1">
              <Circle
                className="w-3 h-3"
                fill={languageColors[repository.language] || '#8b949e'}
                style={{ color: languageColors[repository.language] || '#8b949e' }}
              />
              <span>{repository.language}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span>{repository.stargazers_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-4 h-4" />
            <span>{repository.forks_count}</span>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
          Updated {formatDistanceToNow(new Date(repository.updated_at), { addSuffix: true })}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="primary"
          size="sm"
          icon={<BarChart3 className="w-4 h-4" />}
          onClick={() => onAnalyze(repository)}
          className="w-full"
        >
          Analyze Repository
        </Button>
      </div>
    </Card>
  );
};
