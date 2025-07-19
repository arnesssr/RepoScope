// Repository types
export interface Repository {
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

// Analysis types
export interface AnalysisResult {
  analysis_id: string;
  repository_url: string;
  analyzed_at: string;
  status: 'completed' | 'failed' | 'in_progress';
  error?: string;
  summary?: AnalysisSummary;
  repository_stats?: RepositoryStats;
  commit_analysis?: CommitAnalysis;
  project_plan?: ProjectPlan;
  quality_assessment?: QualityAssessment;
  recent_commits?: Commit[];
}

export interface AnalysisSummary {
  total_commits: number;
  contributors: number;
  primary_language: string;
  project_phase: string;
  quality_score: number;
}

export interface RepositoryStats {
  total_commits: number;
  contributors: Record<string, Contributor>;
  file_types: Record<string, number>;
  default_branch: string;
  branches: string[];
  tags: string[];
}

export interface Contributor {
  name: string;
  commits: number;
  additions: number;
  deletions: number;
}

export interface CommitAnalysis {
  development_focus: string;
  commit_patterns: string;
  team_dynamics: string;
  suggested_improvements: string[];
  project_phase: string;
}

export interface ProjectPlan {
  milestones: Milestone[];
  immediate_tasks: string[];
  technical_debt: string[];
  team_recommendations: string[];
}

export interface Milestone {
  title: string;
  description: string;
  estimated_weeks: number;
}

export interface QualityAssessment {
  quality_score: number;
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  technical_debt_indicators: string[];
}

export interface Commit {
  sha: string;
  author: string;
  author_email: string;
  date: string;
  message: string;
  files_changed: number;
  additions: number;
  deletions: number;
  files: string[];
}

// User types
export interface User {
  username: string;
  name?: string;
  email?: string;
  avatar_url?: string;
}

// App state types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
