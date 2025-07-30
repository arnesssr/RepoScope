"""
Security Models - Data structures for security analysis
"""
from typing import List, Dict, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum


class SeverityLevel(str, Enum):
    """Security severity levels"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class VulnerabilityType(str, Enum):
    """Types of security vulnerabilities"""
    SQL_INJECTION = "sql_injection"
    XSS = "cross_site_scripting"
    CSRF = "csrf"
    AUTHENTICATION = "authentication"
    AUTHORIZATION = "authorization"
    ENCRYPTION = "encryption"
    SENSITIVE_DATA = "sensitive_data_exposure"
    INJECTION = "injection"
    BROKEN_ACCESS = "broken_access_control"
    SECURITY_MISCONFIGURATION = "security_misconfiguration"
    INSECURE_DESERIALIZATION = "insecure_deserialization"
    INSUFFICIENT_LOGGING = "insufficient_logging"
    DEPENDENCY = "vulnerable_dependency"
    HARDCODED_SECRET = "hardcoded_secret"
    PATH_TRAVERSAL = "path_traversal"
    OTHER = "other"


class SecurityVulnerability(BaseModel):
    """Individual security vulnerability"""
    id: str = Field(..., description="Unique vulnerability identifier")
    type: VulnerabilityType
    severity: SeverityLevel
    title: str
    description: str
    file_path: str
    line_number: Optional[int] = None
    code_snippet: Optional[str] = None
    cwe_id: Optional[str] = Field(None, description="Common Weakness Enumeration ID")
    owasp_category: Optional[str] = None
    fix_suggestion: str
    references: List[str] = Field(default_factory=list)
    discovered_at: datetime = Field(default_factory=datetime.now)
    false_positive: bool = False
    confidence: float = Field(1.0, ge=0.0, le=1.0, description="Confidence score")


class DependencyVulnerability(BaseModel):
    """Vulnerability in a dependency"""
    package_name: str
    current_version: str
    vulnerability_id: str  # CVE ID
    severity: SeverityLevel
    description: str
    fixed_version: Optional[str] = None
    published_date: Optional[datetime] = None
    references: List[str] = Field(default_factory=list)


class SecurityScan(BaseModel):
    """Complete security scan results"""
    scan_id: str
    repository_url: str
    scanned_at: datetime
    scan_duration: float  # seconds
    vulnerabilities: List[SecurityVulnerability]
    dependency_vulnerabilities: List[DependencyVulnerability]
    
    # Summary statistics
    total_vulnerabilities: int = 0
    critical_count: int = 0
    high_count: int = 0
    medium_count: int = 0
    low_count: int = 0
    
    # Security score (0-100, where 100 is most secure)
    security_score: float = Field(100.0, ge=0.0, le=100.0)
    
    # Compliance checks
    owasp_compliance: Dict[str, bool] = Field(default_factory=dict)
    
    def calculate_statistics(self):
        """Calculate summary statistics"""
        self.total_vulnerabilities = len(self.vulnerabilities)
        self.critical_count = sum(1 for v in self.vulnerabilities if v.severity == SeverityLevel.CRITICAL)
        self.high_count = sum(1 for v in self.vulnerabilities if v.severity == SeverityLevel.HIGH)
        self.medium_count = sum(1 for v in self.vulnerabilities if v.severity == SeverityLevel.MEDIUM)
        self.low_count = sum(1 for v in self.vulnerabilities if v.severity == SeverityLevel.LOW)
        
        # Calculate security score (simple formula, can be enhanced)
        if self.total_vulnerabilities == 0:
            self.security_score = 100.0
        else:
            penalty = (self.critical_count * 25 + 
                      self.high_count * 15 + 
                      self.medium_count * 5 + 
                      self.low_count * 2)
            self.security_score = max(0.0, 100.0 - penalty)


class SecurityTrend(BaseModel):
    """Security trends over time"""
    repository_id: str
    time_period: str  # e.g., "30d", "90d", "1y"
    vulnerability_trends: Dict[str, List[int]]  # severity -> counts over time
    security_score_trend: List[float]
    new_vulnerabilities: int
    fixed_vulnerabilities: int
    trend_direction: str  # "improving", "worsening", "stable"
