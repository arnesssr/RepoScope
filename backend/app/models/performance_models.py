"""
Performance Models - Data structures for performance profiling
"""
from pydantic import BaseModel, Field
from typing import Optional


class PerformanceMetric(BaseModel):
    """Performance metric for a specific function or method"""
    function_name: str
    module_name: str
    repository_url: str
    avg_execution_time: float  # Average execution time in milliseconds
    peak_memory_usage: float  # Peak memory usage in bytes
    call_count: int = 0
    
    def display(self):
        """Display formatted performance metrics"""
        return f"{self.module_name}.{self.function_name} - {self.avg_execution_time}ms, {self.peak_memory_usage / 1024:.2f} KB"


class ProfilingData(BaseModel):
    """Complete profiling data for a repository"""
    repository_url: str
    profiled_at: str
    duration_seconds: float
    performance_metrics: list[PerformanceMetric] = Field(default_factory=list)
    total_functions: int = 0
    
    def calculate_totals(self):
        """Calculate totals from performance_metrics"""
        self.total_functions = len(self.performance_metrics)


class PerformanceTrend(BaseModel):
    """Trends in performance metrics over time"""
    repository_id: str
    time_period: str  # e.g., "30d", "90d", "1y"
    performance_improvements: int
    performance_regressions: int
    trend_direction: str  # "improving", "worsening", "stable"
    execution_time_trend: list[float]
    memory_usage_trend: list[float]
