"""
Security API
Handles endpoints related to security analysis and vulnerability scanning.
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from typing import List, Optional
from datetime import datetime

from ..services.analysis.security_analyzer import SecurityAnalyzer
# from ..models.security_models import SecurityReport, Vulnerability, SecurityMetrics
from ..services.git.git_service import GitService
# from ..core.database import get_db

router = APIRouter()

# Create a single instance of SecurityAnalyzer to persist data
security_analyzer = SecurityAnalyzer()

@router.post("/analyze")
async def analyze_security(
    repo_name: str,
    branch: Optional[str] = "main",
    authorization: Optional[str] = Header(None),
    # db=Depends(get_db)
):
    """Run security analysis on a repository."""
    try:
        git_service = GitService()
        
        # Clone repository
        # Check if repo_name contains a slash (owner/repo format)
        if '/' in repo_name:
            repo_url = f"https://github.com/{repo_name}"
        else:
            # If no owner specified, we need to get it from somewhere
            # For now, return an error
            raise HTTPException(
                status_code=400, 
                detail="Repository name must be in format 'owner/repository'"
            )
        
        # Extract token from Authorization header
        token = None
        if authorization and authorization.startswith("Bearer "):
            token = authorization.replace("Bearer ", "")
        
        # Clone with token if provided
        repo_path = git_service.clone_repository(repo_url, access_token=token)
        
        # Run security analysis
        report = await security_analyzer.analyze_repository(repo_path)
        
        # Save vulnerabilities to in-memory storage
        await security_analyzer.save_vulnerabilities(repo_name, report.vulnerabilities)

        # Clean up the cloned repository
        try:
            git_service.cleanup(repo_path)
        except:
            pass  # Ignore cleanup errors
        
        return {
            "status": "success",
            "message": "Security analysis completed",
            "report_id": report.id,
            "vulnerabilities_found": len(report.vulnerabilities),
            "risk_score": report.risk_score
        }
    except HTTPException:
        raise
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
        vulnerabilities = await security_analyzer.get_vulnerabilities(
            repo_name, severity, limit, offset
        )
        
        # Get the total count of vulnerabilities before pagination
        all_vulnerabilities = security_analyzer.stored_vulnerabilities.get(repo_name, [])
        if severity:
            all_vulnerabilities = [v for v in all_vulnerabilities if v['severity'] == severity]
        
        return {
            "vulnerabilities": vulnerabilities,
            "total": len(all_vulnerabilities),
            "has_more": len(vulnerabilities) == limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/report/{report_id}")
async def get_security_report(report_id: str):
    """Get a specific security report by ID."""
    try:
        report = await security_analyzer.get_report(report_id)
        
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
        metrics = await security_analyzer.calculate_metrics(repo_name)
        
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
        results = await security_analyzer.scan_dependencies(repo_name)
        
        return {
            "status": "success",
            "vulnerabilities": results.get("vulnerabilities", []),
            "total_dependencies": results.get("total_dependencies", 0),
            "vulnerable_dependencies": results.get("vulnerable_dependencies", 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

