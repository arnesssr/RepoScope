"""
Security API
Handles endpoints related to security analysis and vulnerability scanning.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime

from ..services.analysis.security_analyzer import SecurityAnalyzer
# from ..models.security_models import SecurityReport, Vulnerability, SecurityMetrics
from ..services.git.git_service import GitService
# from ..core.database import get_db

router = APIRouter()

@router.post("/analyze")
async def analyze_security(
    repo_name: str,
    branch: Optional[str] = "main",
    # db=Depends(get_db)
):
    """Run security analysis on a repository."""
    try:
        analyzer = SecurityAnalyzer()
        git_service = GitService()
        
        # Clone or update repository
        repo_path = await git_service.clone_or_update_repo(repo_name)
        
        # Run security analysis
        report = await analyzer.analyze_repository(repo_path)
        
        # Save report to database
# Database save to be implemented later
        
        return {
            "status": "success",
            "message": "Security analysis completed",
            "report_id": report.id,
            "vulnerabilities_found": len(report.vulnerabilities),
            "risk_score": report.risk_score
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/vulnerabilities")
async def get_vulnerabilities(
    repo_name: str,
    severity: Optional[str] = None,
    limit: int = 100,
    offset: int = 0
):
    """Get vulnerabilities for a repository."""
    try:
        analyzer = SecurityAnalyzer()
        vulnerabilities = await analyzer.get_vulnerabilities(
            repo_name, severity, limit, offset
        )
        
        return {
            "vulnerabilities": vulnerabilities,
            "total": len(vulnerabilities),
            "has_more": len(vulnerabilities) == limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/report/{report_id}")
async def get_security_report(report_id: str):
    """Get a specific security report by ID."""
    try:
        analyzer = SecurityAnalyzer()
        report = await analyzer.get_report(report_id)
        
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metrics")
async def get_security_metrics(repo_name: str):
    """Get security metrics for a repository."""
    try:
        analyzer = SecurityAnalyzer()
        metrics = await analyzer.calculate_metrics(repo_name)
        
        return {
            "metrics": metrics,
            "last_scan": datetime.utcnow().isoformat(),
            "repository": repo_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/scan/dependencies")
async def scan_dependencies(repo_name: str):
    """Scan repository dependencies for vulnerabilities."""
    try:
        analyzer = SecurityAnalyzer()
        results = await analyzer.scan_dependencies(repo_name)
        
        return {
            "status": "success",
            "vulnerabilities": results.get("vulnerabilities", []),
            "total_dependencies": results.get("total_dependencies", 0),
            "vulnerable_dependencies": results.get("vulnerable_dependencies", 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

