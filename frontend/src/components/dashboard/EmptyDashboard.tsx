import React from 'react'
import { GitBranch, Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

interface EmptyDashboardProps {
  onSelectRepo?: () => void
}

export const EmptyDashboard: React.FC<EmptyDashboardProps> = ({ onSelectRepo }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {/* Animated background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        {/* Icon */}
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-900/50 border border-gray-800">
          <GitBranch className="w-12 h-12 text-cyan-400" />
        </div>

        {/* Title */}
        <h2 className="text-4xl font-bold text-white mb-4">
          Select a Repository to Get Started
        </h2>
        
        {/* Description */}
        <p className="text-lg text-gray-400 mb-8">
          Choose a repository from your GitHub account or add a new one to start tracking metrics, 
          analyzing code, and monitoring your project's health.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard/repositories"
            className="group px-6 py-3 bg-cyan-500/20 text-cyan-400 rounded-lg font-medium 
                     hover:bg-cyan-500/30 transition-all duration-200 flex items-center justify-center gap-2
                     shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
          >
            <Search className="w-5 h-5" />
            Browse Repositories
          </Link>
          
          <button
            onClick={onSelectRepo}
            className="group px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-medium 
                     hover:bg-gray-700 hover:text-white transition-all duration-200 flex items-center justify-center gap-2
                     border border-gray-700 hover:border-gray-600"
          >
            <Plus className="w-5 h-5" />
            Add New Repository
          </button>
        </div>

        {/* Quick tip */}
        <div className="mt-12 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
          <p className="text-sm text-gray-500">
            <span className="text-cyan-400 font-medium">Pro tip:</span> You can quickly switch between repositories 
            using the repository selector in the top navigation bar.
          </p>
        </div>
      </div>
    </div>
  )
}
