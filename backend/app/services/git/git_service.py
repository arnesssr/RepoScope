"""
Git Service - Handles all Git repository operations
Responsibilities:
- Clone repositories
- Fetch commit history
- Extract file changes
- Get contributor information
"""
import os
import tempfile
from typing import List, Dict, Optional
from datetime import datetime
import git
from git import Repo
import logging

logger = logging.getLogger(__name__)


class GitService:
    """Service for interacting with Git repositories"""
    
    def __init__(self):
        self.temp_dir = tempfile.gettempdir()
    
    def clone_repository(self, repo_url: str, access_token: Optional[str] = None) -> str:
        """
        Clone a repository to a temporary directory
        
        Args:
            repo_url: GitHub repository URL
            access_token: GitHub access token for private repos
            
        Returns:
            Path to cloned repository
        """
        # Create unique directory for this repo
        repo_name = repo_url.split('/')[-1].replace('.git', '')
        clone_path = os.path.join(self.temp_dir, f"reposcope_{repo_name}_{datetime.now().timestamp()}")
        
        # Add token to URL if provided (for private repos)
        if access_token and 'github.com' in repo_url:
            # Convert https://github.com/user/repo to https://token@github.com/user/repo
            repo_url = repo_url.replace('https://', f'https://{access_token}@')
        
        try:
            logger.info(f"Cloning repository: {repo_name}")
            repo = Repo.clone_from(repo_url, clone_path, depth=500)  # Limit depth for performance
            return clone_path
        except Exception as e:
            logger.error(f"Failed to clone repository: {str(e)}")
            raise
    
    def get_commit_history(self, repo_path: str, limit: int = 100) -> List[Dict]:
        """
        Extract commit history from repository
        
        Args:
            repo_path: Path to repository
            limit: Maximum number of commits to fetch
            
        Returns:
            List of commit data
        """
        repo = Repo(repo_path)
        commits = []
        
        for commit in list(repo.iter_commits())[:limit]:
            commits.append({
                'sha': commit.hexsha,
                'author': commit.author.name,
                'author_email': commit.author.email,
                'date': commit.authored_datetime.isoformat(),
                'message': commit.message.strip(),
                'files_changed': len(commit.stats.files),
                'additions': commit.stats.total['insertions'],
                'deletions': commit.stats.total['deletions'],
                'files': list(commit.stats.files.keys())
            })
        
        return commits
    
    def get_repository_stats(self, repo_path: str) -> Dict:
        """
        Get overall repository statistics
        
        Args:
            repo_path: Path to repository
            
        Returns:
            Repository statistics
        """
        repo = Repo(repo_path)
        
        # Get contributors
        contributors = {}
        for commit in repo.iter_commits():
            author = commit.author.email
            if author not in contributors:
                contributors[author] = {
                    'name': commit.author.name,
                    'commits': 0,
                    'additions': 0,
                    'deletions': 0
                }
            contributors[author]['commits'] += 1
            contributors[author]['additions'] += commit.stats.total['insertions']
            contributors[author]['deletions'] += commit.stats.total['deletions']
        
        # Get file types
        file_types = {}
        for item in repo.tree().traverse():
            if item.type == 'blob':
                ext = os.path.splitext(item.path)[1]
                if ext:
                    file_types[ext] = file_types.get(ext, 0) + 1
        
        return {
            'total_commits': len(list(repo.iter_commits())),
            'contributors': contributors,
            'file_types': file_types,
            'default_branch': repo.active_branch.name,
            'branches': [b.name for b in repo.branches],
            'tags': [t.name for t in repo.tags]
        }
    
    def cleanup(self, repo_path: str):
        """Clean up cloned repository"""
        import shutil
        try:
            shutil.rmtree(repo_path)
            logger.info(f"Cleaned up repository at {repo_path}")
        except Exception as e:
            logger.error(f"Failed to cleanup repository: {str(e)}")
