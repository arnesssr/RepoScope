"""
Code Quality Models - Data structures for code quality analysis
"""
from typing import List, Dict, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class CodeQualityMetric(BaseModel):
    """Metrics for code quality evaluation"""
    file_path: str
    repository_url: str
    cyclomatic_complexity: int
    maintainability_index: float
    technical_debt_hours: float
    issues_identified: List[str] = Field(default_factory=list)


class CodeQualityReport(BaseModel):
    """Complete code quality report for a repository"""
    repository_url: str
    analyzed_at: datetime
    quality_metrics: List[CodeQualityMetric] = Field(default_factory=list)
    total_files_analyzed: int = 0
    
    def calculate_overall_stats(self):
        """Consolidate stats from quality metrics"""
        self.total_files_analyzed = len(self.quality_metrics)


class TechnicalDebtTrend(BaseModel):
    """Trends in technical debt over time"""
    repository_id: str
    time_period: str  # "30d", "90d", "1y"
    accumulated_debt_hours: float
    debt_reduction_hours: float
    trend_direction: str  # "increasing", "decreasing", "stable"
    debt_trend_graph: List[float]
