"""
Dependencies API
Handles endpoints related to project dependencies analysis.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime

from ..services.analysis.dependency_analyzer import DependencyAnalyzer
# from ..models.repository_models import DependencyReport, DependencyGraph
from ..services.git.git_service import GitService
# from ..core.database import get_db

router = APIRouter()

@router.post("/analyze")
async def analyze_dependencies(
    repo_name: str,
    branch: Optional[str] = "main",
    # db=Depends(get_db)
):
    """Run dependencies analysis on a repository."""
    try:
        analyzer = DependencyAnalyzer()
        git_service = GitService()
        
        # Clone or update repository
        repo_path = await git_service.clone_or_update_repo(repo_name)
        
        # Run dependencies analysis
        report = await analyzer.analyze_repository(repo_path)
        
        # Save report to database
# Database save to be implemented later
        
        return {
            "status": "success",
            "message": "Dependencies analysis completed",
            "repository": repo_name,
            "dependencies_found": len(report.dependencies),
            "vulnerable_dependencies": report.vulnerable_dependencies_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/graph")
async def get_dependency_graph(
    repo_name: str,
    include_dev: Optional[bool] = False
):
    """Get the dependency graph for a repository."""
    try:
        analyzer = DependencyAnalyzer()
        graph = await analyzer.get_dependency_graph(repo_name, include_dev)
        
        return {
            "dependency_graph": graph,
            "last_scan": datetime.utcnow().isoformat(),
            "repository": repo_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reports/{report_id}")
async def get_dependencies_report(report_id: str):
    """Get a specific dependencies report by ID."""
    try:
        analyzer = DependencyAnalyzer()
        report = await analyzer.get_report(report_id)
        
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
