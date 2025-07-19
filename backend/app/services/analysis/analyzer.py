"""
Repository Analyzer - Orchestrates the analysis process
Responsibilities:
- Coordinate between Git and AI services
- Manage analysis workflow
- Store results
- Handle errors gracefully
"""
from typing import Dict, Optional
import logging
from datetime import datetime
from app.services.git.git_service import GitService
from app.services.ai.gemini_service import GeminiService

logger = logging.getLogger(__name__)


class RepositoryAnalyzer:
    """Main orchestrator for repository analysis"""
    
    def __init__(self):
        self.git_service = GitService()
        self.ai_service = GeminiService()
    
    def analyze_repository(self, repo_url: str, access_token: Optional[str] = None) -> Dict:
        """
        Perform complete analysis of a repository
        
        Args:
            repo_url: GitHub repository URL
            access_token: GitHub access token for private repos
            
        Returns:
            Complete analysis results
        """
        analysis_id = f"analysis_{datetime.now().timestamp()}"
        logger.info(f"Starting analysis {analysis_id} for {repo_url}")
        
        try:
            # Step 1: Clone repository
            logger.info("Step 1: Cloning repository...")
            repo_path = self.git_service.clone_repository(repo_url, access_token)
            
            # Step 2: Extract git data
            logger.info("Step 2: Extracting git history...")
            commits = self.git_service.get_commit_history(repo_path, limit=100)
            repo_stats = self.git_service.get_repository_stats(repo_path)
            
            # Step 3: AI analysis of commits
            logger.info("Step 3: Analyzing commit patterns with AI...")
            commit_analysis = self.ai_service.analyze_commit_patterns(commits)
            
            # Step 4: Generate project plan
            logger.info("Step 4: Generating project plan...")
            project_plan = self.ai_service.generate_project_plan(repo_stats, commit_analysis)
            
            # Step 5: Assess code quality
            logger.info("Step 5: Assessing code quality...")
            quality_assessment = self.ai_service.assess_code_quality(
                commits, 
                repo_stats.get('file_types', {})
            )
            
            # Step 6: Compile results
            results = {
                'analysis_id': analysis_id,
                'repository_url': repo_url,
                'analyzed_at': datetime.now().isoformat(),
                'status': 'completed',
                'summary': {
                    'total_commits': repo_stats['total_commits'],
                    'contributors': len(repo_stats['contributors']),
                    'primary_language': self._get_primary_language(repo_stats['file_types']),
                    'project_phase': commit_analysis.get('project_phase', 'Unknown'),
                    'quality_score': quality_assessment.get('quality_score', 0)
                },
                'repository_stats': repo_stats,
                'commit_analysis': commit_analysis,
                'project_plan': project_plan,
                'quality_assessment': quality_assessment,
                'recent_commits': commits[:10]  # Include last 10 commits
            }
            
            # Cleanup
            self.git_service.cleanup(repo_path)
            
            logger.info(f"Analysis {analysis_id} completed successfully")
            return results
            
        except Exception as e:
            logger.error(f"Analysis failed: {str(e)}")
            return {
                'analysis_id': analysis_id,
                'repository_url': repo_url,
                'analyzed_at': datetime.now().isoformat(),
                'status': 'failed',
                'error': str(e)
            }
    
    def _get_primary_language(self, file_types: Dict) -> str:
        """Determine primary programming language"""
        # Map extensions to languages
        language_map = {
            '.py': 'Python',
            '.js': 'JavaScript',
            '.ts': 'TypeScript',
            '.java': 'Java',
            '.cpp': 'C++',
            '.c': 'C',
            '.go': 'Go',
            '.rs': 'Rust',
            '.rb': 'Ruby',
            '.php': 'PHP'
        }
        
        language_counts = {}
        for ext, count in file_types.items():
            lang = language_map.get(ext, ext)
            language_counts[lang] = language_counts.get(lang, 0) + count
        
        if language_counts:
            return max(language_counts, key=language_counts.get)
        return 'Unknown'
