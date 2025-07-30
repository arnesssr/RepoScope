"""
Quality API
Handles endpoints related to code quality analysis.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime

from ..services.analysis.code_quality_analyzer import CodeQualityAnalyzer
# from ..models.quality_models import QualityReport, QualityMetrics
from ..services.git.git_service import GitService
# from ..core.database import get_db

router = APIRouter()

@router.post("/analyze")
async def analyze_quality(
    repo_name: str,
    branch: Optional[str] = "main",
    # db=Depends(get_db)
):
    """Run code quality analysis on a repository."""
    try:
        analyzer = CodeQualityAnalyzer()
        git_service = GitService()
        
        # Clone or update repository
        repo_path = await git_service.clone_or_update_repo(repo_name)
        
        # Run quality analysis
        report = await analyzer.analyze_repository(repo_path)
        
        # Save report to database
# Database save to be implemented later
        
        return {
            "status": "success",
            "message": "Code quality analysis completed",
            "report_id": report.id,
            "issues_found": len(report.issues),
            "technical_debt": report.technical_debt
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metrics")
async def get_quality_metrics(
    repo_name: str,
    metric_type: Optional[str] = "complexity"
):
    """Get code quality metrics for a repository."""
    try:
        analyzer = CodeQualityAnalyzer()
        metrics = await analyzer.get_metrics(repo_name, metric_type)
        
        return {
            "metrics": metrics,
            "last_scan": datetime.utcnow().isoformat(),
            "repository": repo_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/report/{report_id}")
async def get_quality_report(report_id: str):
    """Get a specific code quality report by ID."""
    try:
        analyzer = CodeQualityAnalyzer()
        report = await analyzer.get_report(report_id)
        
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/issues")
async def get_quality_issues(
    repo_name: str,
    severity: Optional[str] = None,
    limit: int = 100,
    offset: int = 0
):
    """Get quality issues for a repository."""
    try:
        analyzer = CodeQualityAnalyzer()
        issues = await analyzer.get_issues(repo_name, severity, limit, offset)
        
        return {
            "issues": issues,
            "total": len(issues),
            "has_more": len(issues) == limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

