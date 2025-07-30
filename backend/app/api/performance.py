"""
Performance API
Handles endpoints related to performance analysis and profiling.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict
from datetime import datetime, timedelta

from ..services.analysis.performance_analyzer import PerformanceAnalyzer
# from ..models.performance_models import PerformanceReport, PerformanceMetrics, PerformanceTrend
from ..services.git.git_service import GitService
# from ..core.database import get_db

router = APIRouter()

@router.post("/analyze")
async def analyze_performance(
    repo_name: str,
    branch: Optional[str] = "main",
    profile_type: Optional[str] = "cpu",
    # db=Depends(get_db)
):
    """Run performance analysis on a repository."""
    try:
        analyzer = PerformanceAnalyzer()
        git_service = GitService()
        
        # Clone or update repository
        repo_path = await git_service.clone_or_update_repo(repo_name)
        
        # Run performance analysis
        report = await analyzer.analyze_repository(
            repo_path,
            profile_type=profile_type
        )
        
        # Save report to database
# Database save to be implemented later
        
        return {
            "status": "success",
            "message": "Performance analysis completed",
            "report_id": report.id,
            "execution_time": report.execution_time,
            "memory_usage": report.memory_usage,
            "cpu_usage": report.cpu_usage
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metrics")
async def get_performance_metrics(
    repo_name: str,
    time_range: Optional[int] = 7,  # days
    metric_type: Optional[str] = None
):
    """Get performance metrics for a repository."""
    try:
        analyzer = PerformanceAnalyzer()
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=time_range)
        
        metrics = await analyzer.get_metrics(
            repo_name,
            start_date,
            end_date,
            metric_type
        )
        
        return {
            "metrics": metrics,
            "time_range": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "repository": repo_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/report/{report_id}")
async def get_performance_report(report_id: str):
    """Get a specific performance report by ID."""
    try:
        analyzer = PerformanceAnalyzer()
        report = await analyzer.get_report(report_id)
        
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trends")
async def get_performance_trends(
    repo_name: str,
    metric: str = "execution_time",
    period: int = 30  # days
):
    """Get performance trends over time."""
    try:
        analyzer = PerformanceAnalyzer()
        trends = await analyzer.calculate_trends(
            repo_name,
            metric,
            period
        )
        
        return {
            "trends": trends,
            "metric": metric,
            "period_days": period,
            "repository": repo_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/profile")
async def profile_code(
    repo_name: str,
    file_path: str,
    function_name: Optional[str] = None
):
    """Profile specific code sections."""
    try:
        analyzer = PerformanceAnalyzer()
        profile_data = await analyzer.profile_function(
            repo_name,
            file_path,
            function_name
        )
        
        return {
            "status": "success",
            "profile_data": profile_data,
            "file_path": file_path,
            "function_name": function_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/benchmarks")
async def get_benchmarks(repo_name: str):
    """Get performance benchmarks for a repository."""
    try:
        analyzer = PerformanceAnalyzer()
        benchmarks = await analyzer.get_benchmarks(repo_name)
        
        return {
            "benchmarks": benchmarks,
            "repository": repo_name,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

