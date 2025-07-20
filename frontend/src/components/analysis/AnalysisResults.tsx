import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  GitBranch,
  Code2,
  Calendar,
  Lightbulb
} from 'lucide-react';
import { AnalysisResult } from '../../types';
import { Card } from '../ui/Card';

interface AnalysisResultsProps {
  analysis: AnalysisResult;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  if (analysis.status === 'failed') {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="text-lg font-semibold">Analysis Failed</h3>
            <p className="text-sm text-gray-400 mt-1">{analysis.error}</p>
          </div>
        </div>
      </Card>
    );
  }

  const { summary, repository_stats, commit_analysis, project_plan, quality_assessment } = analysis;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-cyan-400" />
            <div>
              <p className="text-sm text-gray-400">Total Commits</p>
              <p className="text-2xl font-bold text-white">{summary?.total_commits || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">Contributors</p>
              <p className="text-2xl font-bold text-white">{summary?.contributors || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Code2 className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Primary Language</p>
              <p className="text-lg font-bold text-white">{summary?.primary_language || 'Unknown'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400">Project Phase</p>
              <p className="text-lg font-bold text-white">{summary?.project_phase || 'Unknown'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-sm text-gray-400">Quality Score</p>
              <p className="text-2xl font-bold text-white">{summary?.quality_score || 0}/100</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Commit Analysis */}
      {commit_analysis && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            Commit Analysis
          </h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-400">Development Focus</h4>
              {Array.isArray(commit_analysis.development_focus) ? (
                <ul className="mt-2 space-y-1">
                  {commit_analysis.development_focus.map((focus, index) => (
                    <li key={index} className="text-white text-sm">• {focus}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-white mt-1">{commit_analysis.development_focus}</p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Commit Patterns</h4>
              {Array.isArray(commit_analysis.commit_patterns) ? (
                <ul className="mt-2 space-y-1">
                  {commit_analysis.commit_patterns.map((pattern, index) => (
                    <li key={index} className="text-white text-sm">• {pattern}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-white mt-1">{commit_analysis.commit_patterns}</p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Team Dynamics</h4>
              {Array.isArray(commit_analysis.team_dynamics) ? (
                <ul className="mt-2 space-y-1">
                  {commit_analysis.team_dynamics.map((dynamic, index) => (
                    <li key={index} className="text-white text-sm">• {dynamic}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-white mt-1">{commit_analysis.team_dynamics}</p>
              )}
            </div>
            {commit_analysis.suggested_improvements && commit_analysis.suggested_improvements.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-400">Suggested Improvements</h4>
                <ul className="mt-2 space-y-1">
                  {commit_analysis.suggested_improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2 text-white">
                      <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Project Plan */}
      {project_plan && project_plan.project_plan && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Project Plan
          </h3>
          
          {/* Milestones */}
          {project_plan.project_plan.milestones.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Milestones</h4>
              <div className="space-y-3">
                {project_plan.project_plan.milestones.map((milestone, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-semibold text-white">{milestone.title}</h5>
                        <p className="text-sm text-gray-400 mt-1">{milestone.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-cyan-400 font-medium">
                          {milestone.estimated_weeks} weeks
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Immediate Tasks */}
          {project_plan.project_plan.immediate_tasks.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Immediate Tasks</h4>
              <ul className="space-y-2">
                {project_plan.project_plan.immediate_tasks.map((task, index) => (
                  <li key={index} className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical Debt */}
          {project_plan.project_plan.technical_debt.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Technical Debt</h4>
              <ul className="space-y-2">
                {project_plan.project_plan.technical_debt.map((debt, index) => (
                  <li key={index} className="flex items-center gap-2 text-white">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">{debt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* Quality Assessment */}
      {quality_assessment && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Quality Assessment
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Strengths</h4>
              <ul className="space-y-2">
                {quality_assessment.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-white">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Concerns */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Concerns</h4>
              <ul className="space-y-2">
                {quality_assessment.concerns.map((concern, index) => (
                  <li key={index} className="flex items-start gap-2 text-white">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                    <span className="text-sm">{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          {quality_assessment.recommendations.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {quality_assessment.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-white">
                    <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
