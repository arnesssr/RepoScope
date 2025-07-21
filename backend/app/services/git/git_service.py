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
        
        # Get contributors - merge by name to avoid duplicates
        contributors_by_name = {}
        email_to_name = {}  # Track email to name mapping
        
        for commit in repo.iter_commits():
            author_email = commit.author.email
            author_name = commit.author.name
            
            # Use name as the key to merge same person with different emails
            if author_name not in contributors_by_name:
                # Try to get GitHub username from email
                github_username = None
                avatar_url = None
                
                # Common GitHub email patterns
                if 'users.noreply.github.com' in author_email:
                    # Extract username from noreply email
                    parts = author_email.split('@')[0].split('+')
                    if len(parts) > 1:
                        github_username = parts[1]
                    else:
                        github_username = parts[0]
                
                # If we have a GitHub username, construct avatar URL
                if github_username:
                    avatar_url = f"https://avatars.githubusercontent.com/{github_username}"
                else:
                    # Use Gravatar as fallback
                    import hashlib
                    email_hash = hashlib.md5(author_email.lower().encode('utf-8')).hexdigest()
                    avatar_url = f"https://www.gravatar.com/avatar/{email_hash}?d=identicon&s=100"
                
                contributors_by_name[author_name] = {
                    'name': author_name,
                    'email': author_email,  # Primary email
                    'emails': [author_email],  # All emails used
                    'github_username': github_username,
                    'avatar_url': avatar_url,
                    'commits': 0,
                    'additions': 0,
                    'deletions': 0
                }
            else:
                # Add email to the list if not already there
                if author_email not in contributors_by_name[author_name]['emails']:
                    contributors_by_name[author_name]['emails'].append(author_email)
            
            # Track email to name mapping
            email_to_name[author_email] = author_name
            
            # Update stats
            contributors_by_name[author_name]['commits'] += 1
            contributors_by_name[author_name]['additions'] += commit.stats.total['insertions']
            contributors_by_name[author_name]['deletions'] += commit.stats.total['deletions']
        
        # Convert back to email-keyed dict for compatibility, but use the primary email
        contributors = {}
        for name, data in contributors_by_name.items():
            primary_email = data['email']
            contributors[primary_email] = data
        
        # Get file types and count lines
        file_types = {}
        total_lines = 0
        total_files = 0
        
        for item in repo.tree().traverse():
            if item.type == 'blob':
                ext = os.path.splitext(item.path)[1]
                if ext:
                    file_types[ext] = file_types.get(ext, 0) + 1
                
                # Count lines in text files
                try:
                    # Only count lines in common text file extensions
                    text_extensions = ['.py', '.js', '.ts', '.jsx', '.tsx', '.java', '.cpp', '.c', 
                                     '.h', '.hpp', '.cs', '.rb', '.go', '.rs', '.php', '.swift', 
                                     '.kt', '.scala', '.r', '.m', '.mm', '.vue', '.dart']
                    if ext in text_extensions:
                        content = item.data_stream.read()
                        if content:
                            lines = content.decode('utf-8', errors='ignore').count('\n')
                            total_lines += lines
                except:
                    pass  # Skip files that can't be read
                
                total_files += 1
        
        # Get repository size info
        repo_size = sum(item.size for item in repo.tree().traverse() if item.type == 'blob')
        
        return {
            'total_commits': len(list(repo.iter_commits())),
            'total_lines': total_lines,
            'total_files': total_files,
            'repository_size': repo_size,  # in bytes
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
