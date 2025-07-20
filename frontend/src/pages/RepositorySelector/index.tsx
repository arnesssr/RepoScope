import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GitFork, Star, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import api from '../../api/axios';

interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: string;
  private: boolean;
}

const RepositorySelector: React.FC = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepositories();
  }, []);

  useEffect(() => {
    const filtered = repositories.filter(repo =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredRepos(filtered);
  }, [searchQuery, repositories]);

  const fetchRepositories = async () => {
    try {
      const response = await api.get('/repositories');
      setRepositories(response.data);
      setFilteredRepos(response.data);
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectRepository = (repoId: string) => {
    // Store selected repository in localStorage or context
    localStorage.setItem('selectedRepositoryId', repoId);
    navigate('/dashboard');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Select a Repository</h1>
          <p className="text-gray-400">Choose a repository to analyze and manage</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos.map((repo) => (
              <Card
                key={repo.id}
                className="p-6 hover:border-blue-500 transition-all cursor-pointer"
                onClick={() => selectRepository(repo.id)}
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-1">{repo.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {repo.description || 'No description available'}
                    </p>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        {repo.forks}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
                      <Calendar className="w-3 h-3" />
                      Updated {formatDate(repo.updatedAt)}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredRepos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No repositories found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositorySelector;
