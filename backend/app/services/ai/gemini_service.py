"""
Gemini AI Service - Handles all AI-powered analysis
Responsibilities:
- Analyze commit messages
- Generate project insights
- Create project plans
- Suggest improvements
"""
import google.generativeai as genai
from typing import List, Dict, Optional
import json
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


class GeminiService:
    """Service for AI-powered analysis using Google Gemini"""
    
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
    
    def analyze_commit_patterns(self, commits: List[Dict]) -> Dict:
        """
        Analyze commit messages to understand development patterns
        
        Args:
            commits: List of commit data
            
        Returns:
            Analysis results with patterns and insights
        """
        # Prepare commit messages for analysis
        commit_messages = "\n".join([
            f"- {commit['date']}: {commit['message']} (by {commit['author']})"
            for commit in commits[:50]  # Analyze last 50 commits
        ])
        
        prompt = f"""Analyze these git commit messages and provide insights about the development patterns.
        
Commits:
{commit_messages}

Provide a JSON response with:
1. development_focus: What features/areas the team is working on (as a string)
2. commit_patterns: How the team structures their commits (as a string)
3. team_dynamics: Collaboration patterns (as a string)
4. suggested_improvements: Array of strings with suggestions for improving development process (not objects, just suggestion strings)
5. project_phase: What phase the project appears to be in (early development, mature, maintenance, etc) (as a string)

IMPORTANT: suggested_improvements must be an array of strings, NOT objects.

Return only valid JSON."""

        try:
            response = self.model.generate_content(prompt)
            # Parse JSON from response
            json_str = response.text.strip()
            if json_str.startswith('```json'):
                json_str = json_str[7:-3]  # Remove markdown code block
            
            return json.loads(json_str)
        except Exception as e:
            logger.error(f"Failed to analyze commits: {str(e)}")
            return {
                "error": "Failed to analyze",
                "development_focus": "Unable to determine",
                "commit_patterns": "Analysis failed",
                "team_dynamics": "Unknown",
                "suggested_improvements": [],
                "project_phase": "Unknown"
            }
    
    def generate_project_plan(self, repo_stats: Dict, commit_analysis: Dict) -> Dict:
        """
        Generate a project plan based on repository analysis
        
        Args:
            repo_stats: Repository statistics
            commit_analysis: Results from commit pattern analysis
            
        Returns:
            Generated project plan with milestones and tasks
        """
        prompt = f"""Based on this repository analysis, generate a project plan for the next 3 months.

Repository Stats:
- Total commits: {repo_stats.get('total_commits', 0)}
- Contributors: {len(repo_stats.get('contributors', {}))}
- Main technologies: {', '.join(list(repo_stats.get('file_types', {}).keys())[:5])}

Recent Development Focus:
{json.dumps(commit_analysis.get('development_focus', 'Unknown'), indent=2)}

Current Project Phase: {commit_analysis.get('project_phase', 'Unknown')}

Generate a realistic project plan with:
1. milestones: Array of milestone objects with title, description, and estimated_weeks
2. immediate_tasks: Array of strings describing tasks that should be done in the next 2 weeks (not objects, just task descriptions as strings)
3. technical_debt: Array of strings describing areas that need refactoring or improvement (not objects, just descriptions as strings)
4. team_recommendations: Array of strings with suggestions for team process improvements (not objects, just recommendations as strings)

IMPORTANT: immediate_tasks, technical_debt, and team_recommendations must be arrays of strings, NOT objects.

Return only valid JSON."""

        try:
            response = self.model.generate_content(prompt)
            json_str = response.text.strip()
            if json_str.startswith('```json'):
                json_str = json_str[7:-3]
            
            return json.loads(json_str)
        except Exception as e:
            logger.error(f"Failed to generate project plan: {str(e)}")
            return {
                "error": "Failed to generate plan",
                "milestones": [],
                "immediate_tasks": [],
                "technical_debt": [],
                "team_recommendations": []
            }
    
    def assess_code_quality(self, commits: List[Dict], file_types: Dict) -> Dict:
        """
        Assess code quality based on commit patterns and file changes
        
        Args:
            commits: Recent commits
            file_types: Distribution of file types
            
        Returns:
            Code quality assessment
        """
        # Analyze commit messages for quality indicators
        bug_fixes = sum(1 for c in commits if any(word in c['message'].lower() 
                       for word in ['fix', 'bug', 'error', 'issue']))
        features = sum(1 for c in commits if any(word in c['message'].lower() 
                      for word in ['feature', 'add', 'implement', 'new']))
        refactors = sum(1 for c in commits if any(word in c['message'].lower() 
                       for word in ['refactor', 'clean', 'improve', 'optimize']))
        
        prompt = f"""Assess the code quality and development practices based on this data:

Commit Statistics (last {len(commits)} commits):
- Bug fixes: {bug_fixes}
- New features: {features}
- Refactoring: {refactors}
- Average files changed per commit: {sum(c['files_changed'] for c in commits) / len(commits):.1f}

File Types in Repository:
{json.dumps(dict(list(file_types.items())[:10]), indent=2)}

Provide a JSON response with:
1. quality_score: Overall quality score (0-100)
2. strengths: Array of strings describing positive observations (not objects, just strings)
3. concerns: Array of strings describing potential issues (not objects, just strings)
4. recommendations: Array of strings with specific actions to improve code quality (not objects, just strings)
5. technical_debt_indicators: Array of strings describing signs of technical debt (not objects, just strings)

IMPORTANT: All arrays must contain strings only, NOT objects.

Return only valid JSON."""

        try:
            response = self.model.generate_content(prompt)
            json_str = response.text.strip()
            if json_str.startswith('```json'):
                json_str = json_str[7:-3]
            
            return json.loads(json_str)
        except Exception as e:
            logger.error(f"Failed to assess code quality: {str(e)}")
            return {
                "quality_score": 0,
                "strengths": [],
                "concerns": ["Analysis failed"],
                "recommendations": [],
                "technical_debt_indicators": []
            }
