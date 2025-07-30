"""
Diff Analyzer Service
Analyzes code differences using git diff outputs and structures the changes.
"""

import subprocess
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class DiffAnalyzer:
    """Analyze differences between git commits."""
    
    @staticmethod
    def get_diff(commit_a: str, commit_b: str) -> List[str]:
        """Get raw diff between two git commits."""
        try:
            result = subprocess.run(
                ["git", "diff", commit_a, commit_b],
                text=True,
                capture_output=True,
                check=True
            )
            logger.info(f"Successfully got diff between {commit_a} and {commit_b}")
            return result.stdout.splitlines()
        except subprocess.CalledProcessError as e:
            logger.error(f"Error getting diff: {e}")
            return []
    
    @staticmethod
    def analyze_diff(diff_lines: List[str]) -> Dict[str, Any]:
        """Analyze git diff output and structure changes."""
        changes = {
            'files': {},
            'insertions': 0,
            'deletions': 0
        }
        
        current_file = None
        insertions, deletions = 0, 0
        
        for line in diff_lines:
            if line.startswith('diff --git'):
                tokens = line.split(' ')
                current_file = tokens[2][2:]  # Remove a/ prefix
                changes['files'][current_file] = {'insertions': 0, 'deletions': 0}
            elif line.startswith('+++ '):
                if line[4:] != '/dev/null':
                    current_file = line[6:]
            elif line.startswith('--- '):
                continue
            elif line.startswith('+') and not line.startswith('+++'):
                insertions += 1
                changes['files'][current_file]['insertions'] += 1
            elif line.startswith('-') and not line.startswith('---'):
                deletions += 1
                changes['files'][current_file]['deletions'] += 1

        changes['insertions'] = insertions
        changes['deletions'] = deletions
        
        return changes
