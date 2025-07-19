import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { GitBranch, Star, GitFork, Calendar, Search, Filter } from 'lucide-react'
import { apiClient } from '../../services/api'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardHeader, CardContent } from '../../components/ui/Card'
import { Skeleton } from '../../components/ui/Skeleton'
import { useAuthStore } from '../../stores/authStore'
import { Repository } from '../../types'

const RepositoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLanguage, setFilterLanguage] = useState<string>('all')
  const { token } = useAuthStore()

  const { data: repositories, isLoading } = useQuery<Repository[]>({
    queryKey: ['repositories', token],
    queryFn: async () => {
      const response = await apiClient.get('/api/repositories', {
        params: { token }
      })
      return response.data.repositories
    },
    enabled: !!token,
  })

  const filteredRepos = repositories?.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLanguage = filterLanguage === 'all' || repo.language === filterLanguage
    return matchesSearch && matchesLanguage
  })

  const languages = Array.from(new Set(repositories?.map(r => r.language).filter(Boolean)))

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Repositories
        </h1>
        <p className="text-gray-400">
          Manage and analyze your GitHub repositories
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className="pl-10 pr-8 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 appearance-none cursor-pointer"
          >
            <option value="all">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Repository Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <Skeleton variant="text" width="60%" height={24} className="mb-2" />
                <Skeleton variant="text" width="100%" height={16} />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Skeleton variant="rectangular" width={60} height={20} />
                  <Skeleton variant="rectangular" width={40} height={20} />
                  <Skeleton variant="rectangular" width={40} height={20} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredRepos?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <GitBranch className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No repositories found</p>
          </div>
        ) : (
          filteredRepos?.map((repo) => (
            <Card 
              key={repo.id} 
              variant="neon" 
              neonColor="cyan"
              className="hover:scale-105 cursor-pointer"
              onClick={() => window.open(repo.html_url, '_blank')}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1 flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-cyan-400" />
                      {repo.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {repo.description || 'No description provided'}
                    </p>
                  </div>
                  {repo.private && (
                    <span className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded">
                      Private
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  {repo.language && (
                    <div className="flex items-center gap-1">
                      <div className={`h-3 w-3 rounded-full ${
                        repo.language === 'TypeScript' ? 'bg-blue-500' :
                        repo.language === 'JavaScript' ? 'bg-yellow-500' :
                        repo.language === 'Python' ? 'bg-green-500' :
                        repo.language === 'Go' ? 'bg-cyan-500' :
                        'bg-gray-500'
                      }`} />
                      <span>{repo.language}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="h-4 w-4" />
                    <span>{repo.forks_count}</span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default RepositoriesPage
