import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  GitBranch, 
  Star, 
  GitFork, 
  Lock, 
  Unlock,
  Loader2,
  AlertCircle 
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAnalysisStore } from '../../stores/analysisStore';
import apiService from '../../services/api';
import { Card } from '../ui/Card';
import { Button } from '../common/Button';

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
  private: boolean;
  size: number;
  default_branch: string;
}

export const RepositoryBrowser: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { setSelectedRepository } = useAnalysisStore();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['repositories', token],
    queryFn: async () => {
      if (!token) throw new Error('No authentication token');
      const response = await apiService.getRepositories(token);
      return response as GitHubRepository[];
    },
    enabled: !!token,
  });

  const filteredRepos = data?.filter(repo => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      repo.name.toLowerCase().includes(search) ||
      repo.description?.toLowerCase().includes(search) ||
      repo.language?.toLowerCase().includes(search)
    );
  });

  const handleSelectRepository = (repo: GitHubRepository) => {
    setSelectedRepository(repo.full_name);
    navigate(`/dashboard/${repo.full_name}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Updated today';
    if (diffInDays === 1) return 'Updated yesterday';
    if (diffInDays < 7) return `Updated ${diffInDays} days ago`;
    if (diffInDays < 30) return `Updated ${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `Updated ${Math.floor(diffInDays / 30)} months ago`;
    return `Updated ${Math.floor(diffInDays / 365)} years ago`;
  };

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      JavaScript: 'bg-yellow-400',
      TypeScript: 'bg-blue-400',
      Python: 'bg-green-400',
      Java: 'bg-orange-400',
      Go: 'bg-cyan-400',
      Rust: 'bg-orange-600',
      Ruby: 'bg-red-400',
      PHP: 'bg-purple-400',
      'C++': 'bg-pink-400',
      C: 'bg-gray-400',
    };
    return colors[language || ''] || 'bg-gray-400';
  };

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Repositories</h3>
          <p className="text-gray-400 mb-4">{(error as Error).message}</p>
          <Button onClick={() => refetch()} variant="secondary">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
      </div>

      {/* Repository List */}
      {isLoading ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
            <p className="text-gray-400">Loading repositories...</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos?.map((repo) => (
            <Card 
              key={repo.id}
              className="p-6 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-200 cursor-pointer"
              onClick={() => handleSelectRepository(repo)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-semibold text-white">{repo.name}</h3>
                  {repo.private ? (
                    <Lock className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Unlock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {repo.description && (
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {repo.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm">
                {repo.language && (
                  <div className="flex items-center gap-1">
                    <span className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`} />
                    <span className="text-gray-300">{repo.language}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">{repo.stargazers_count}</span>
                </div>

                <div className="flex items-center gap-1">
                  <GitFork className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{repo.forks_count}</span>
                </div>

                <span className="text-gray-500 ml-auto text-xs">
                  {formatDate(repo.updated_at)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredRepos?.length === 0 && !isLoading && (
        <Card className="p-8">
          <div className="text-center">
            <p className="text-gray-400">No repositories found matching "{searchTerm}"</p>
          </div>
        </Card>
      )}
    </div>
  );
};
