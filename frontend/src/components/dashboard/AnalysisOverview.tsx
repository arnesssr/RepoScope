import React from 'react';
import { 
  TrendingUp, 
  GitBranch, 
  Code2, 
  Users, 
  CheckCircle2,
  AlertCircle,
  Calendar,
  Lightbulb,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnalysisResult } from '../../types';
import { Card } from '../ui/Card';
import { DependencySummaryWidget } from './DependencySummaryWidget';
import { SecuritySummaryWidget } from './SecuritySummaryWidget';

interface AnalysisOverviewProps {
  analysis: AnalysisResult;
  repositoryId: string;
}

export const AnalysisOverview: React.FC<AnalysisOverviewProps> = ({ analysis, repositoryId }) => {
  const navigate = useNavigate();
  
  const handleViewFullAnalysis = () => {
    navigate(`/dashboard/analysis/${repositoryId}`);
  };

  if (!analysis || analysis.status === 'failed') {
    return null;
  }

  const { summary, commit_analysis, project_plan, quality_assessment } = analysis;

  return (
    <div className="space-y-6">
      {/* Header with View Full Analysis Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          Analysis Overview
        </h2>
        <button
          onClick={handleViewFullAnalysis}
          className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 
                     hover:from-cyan-500/30 hover:to-purple-500/30 rounded-lg border border-cyan-500/30 
                     hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm"
        >
          <span className="text-cyan-400 group-hover:text-cyan-300">View Full Analysis</span>
          <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card neon-border neon-glow-cyan p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Quality Score</p>
              <p className="text-3xl font-bold text-white mt-1">{summary?.quality_score || 0}</p>
              <p className="text-xs text-gray-500 mt-1">out of 100</p>
            </div>
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </Card>

        <Card className="glass-card neon-border neon-glow-purple p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Project Phase</p>
              <p className="text-lg font-bold text-white mt-1">{summary?.project_phase || 'Unknown'}</p>
              <p className="text-xs text-gray-500 mt-1">current status</p>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="glass-card neon-border neon-glow-green p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Contributors</p>
              <p className="text-3xl font-bold text-white mt-1">{summary?.contributors || 0}</p>
              <p className="text-xs text-gray-500 mt-1">team members</p>
            </div>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Users className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="glass-card neon-border neon-glow-yellow p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Code Language</p>
              <p className="text-lg font-bold text-white mt-1">{summary?.primary_language || 'Mixed'}</p>
              <p className="text-xs text-gray-500 mt-1">primary</p>
            </div>
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Code2 className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity & Focus */}
        {commit_analysis && (
          <Card className="glass-card neon-border p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-cyan-400" />
              Development Focus
            </h3>
            <div className="space-y-3">
              {Array.isArray(commit_analysis.development_focus) && commit_analysis.development_focus.length > 0 ? (
                <ul className="space-y-2">
                  {commit_analysis.development_focus.slice(0, 3).map((focus, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2" />
                      <span className="text-sm text-gray-300">{focus}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No specific focus areas identified</p>
              )}
              {commit_analysis.development_focus.length > 3 && (
                <p className="text-xs text-gray-500 mt-2">+{commit_analysis.development_focus.length - 3} more areas</p>
              )}
            </div>
          </Card>
        )}

        {/* Project Planning Snapshot */}
        {project_plan?.project_plan && (
          <Card className="glass-card neon-border p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Upcoming Milestones
            </h3>
            <div className="space-y-3">
              {project_plan.project_plan.milestones.slice(0, 2).map((milestone, index) => (
                <div key={index} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">{milestone.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{milestone.description}</p>
                  </div>
                  <span className="text-xs text-purple-400 font-medium whitespace-nowrap">
                    {milestone.estimated_weeks}w
                  </span>
                </div>
              ))}
              {project_plan.project_plan.milestones.length > 2 && (
                <p className="text-xs text-gray-500">+{project_plan.project_plan.milestones.length - 2} more milestones</p>
              )}
            </div>
          </Card>
        )}
      </div>

{/* Dependency Summary */}
      {analysis.dependency_analysis && (
        <DependencySummaryWidget analysis={analysis.dependency_analysis} />
      )}

      {/* Security Summary */}
      {analysis.security_analysis && (
        <SecuritySummaryWidget analysis={analysis.security_analysis} />
      )}

      {/* Quality Highlights */}
      {quality_assessment && (
        <Card className="glass-card neon-border p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Quality Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Strengths */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Key Strengths</h4>
              <ul className="space-y-1">
                {quality_assessment.strengths.slice(0, 3).map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                    <span className="text-sm text-gray-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Priority Concerns */}
            {quality_assessment.concerns.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Priority Areas</h4>
                <ul className="space-y-1">
                  {quality_assessment.concerns.slice(0, 2).map((concern, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                      <span className="text-sm text-gray-300">{concern}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
