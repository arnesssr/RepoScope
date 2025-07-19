import { Github, ArrowRight, BarChart3, GitBranch, Sparkles } from 'lucide-react'

const LandingPage = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/github`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            RepoScope
          </h1>
          <p className="text-2xl mb-8 text-gray-300">
            Intelligent Repository Analytics & Project Planning
          </p>
          <p className="text-lg mb-12 text-gray-400 max-w-2xl mx-auto">
            Transform your GitHub repositories into actionable insights. Analyze code, track progress, 
            and let AI help you plan your next moves.
          </p>
          
          <button
            onClick={handleLogin}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                     text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center gap-3 mx-auto
                     transform transition hover:scale-105 shadow-xl"
          >
            <Github size={24} />
            Sign in with GitHub
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="glass rounded-xl p-8 text-white">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Deep Analytics</h3>
            <p className="text-gray-300">
              Comprehensive insights into your repository's health, activity patterns, and team productivity.
            </p>
          </div>

          <div className="glass rounded-xl p-8 text-white">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <Sparkles size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3">AI-Powered Planning</h3>
            <p className="text-gray-300">
              Let AI analyze your git history and automatically generate project plans, tasks, and milestones.
            </p>
          </div>

          <div className="glass rounded-xl p-8 text-white">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <GitBranch size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Production Ready</h3>
            <p className="text-gray-300">
              Assess your code's stability, test coverage, and get recommendations for production readiness.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
