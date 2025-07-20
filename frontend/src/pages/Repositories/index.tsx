import { RepositoryBrowser } from '../../components/repository/RepositoryBrowser'

const Repositories = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Repositories
        </h1>
        <p className="text-gray-400">
          Select a repository from your GitHub account to analyze
        </p>
      </div>

      {/* Repository Browser */}
      <RepositoryBrowser />
    </div>
  )
}

export default Repositories
