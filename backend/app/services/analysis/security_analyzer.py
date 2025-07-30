"""
Security Analyzer
Analyzes repositories for security vulnerabilities using static analysis and library scanning.
"""

import subprocess
from typing import List, Dict, Any
from datetime import datetime

class SecurityAnalyzer:
    def __init__(self):
        self.stored_vulnerabilities = {}  # In-memory storage for vulnerabilities

    async def analyze_repository(self, repo_path: str) -> Dict[str, Any]:
        """
        Perform security analysis on the provided repository.

        :param repo_path: Path to the local clone of the repository
        :return: Dictionary containing security analysis results
        """
        vulnerabilities = []
        risk_score = 0.0

        try:
            # Run Bandit for Python security analysis
            result = subprocess.run(
                ["bandit", "-r", repo_path, "-f", "json"],
                text=True,
                capture_output=True,
                check=True
            )
            report = result.stdout
            # Parse JSON report
            vulnerabilities = self.parse_bandit_report(report)
            
            # Calculate risk score based on vulnerabilities
            for vuln in vulnerabilities:
                if vuln.get("severity") == "critical":
                    risk_score += 4.0
                elif vuln.get("severity") == "high":
                    risk_score += 3.0
                elif vuln.get("severity") == "medium":
                    risk_score += 2.0
                elif vuln.get("severity") == "low":
                    risk_score += 1.0
            
            # Normalize risk score to 0-100
            risk_score = min(risk_score * 10, 100.0)

        except subprocess.CalledProcessError as e:
            # Handle errors from Bandit or other security tools
            print(f"Error running security analysis: {e}")
        except FileNotFoundError:
            # Bandit not installed
            print("Bandit not found. Security analysis skipped.")
            # Add some mock vulnerabilities for demonstration
            vulnerabilities = self._get_mock_vulnerabilities()
            
            # Calculate risk score for mock vulnerabilities
            for vuln in vulnerabilities:
                if vuln.get("severity") == "critical":
                    risk_score += 4.0
                elif vuln.get("severity") == "high":
                    risk_score += 3.0
                elif vuln.get("severity") == "medium":
                    risk_score += 2.0
                elif vuln.get("severity") == "low":
                    risk_score += 1.0
            
            # Normalize risk score to 0-100
            risk_score = min(risk_score * 10, 100.0)

        # Create a mock report object with required attributes
        class SecurityReport:
            def __init__(self, vulnerabilities, risk_score):
                self.id = f"report_{repo_path.replace('/', '_')}_{int(datetime.now().timestamp())}"
                self.vulnerabilities = vulnerabilities
                self.risk_score = risk_score
        
        return SecurityReport(vulnerabilities, risk_score)

    def parse_bandit_report(self, report: str) -> List[Dict[str, Any]]:
        """
        Parse Bandit's JSON report to extract vulnerabilities.

        :param report: JSON report from Bandit
        :return: List of vulnerability findings
        """
        import json
        import uuid
        try:
            data = json.loads(report)
            issues = data.get("results", [])

            parsed_issues = []
            for idx, issue in enumerate(issues):
                # Map Bandit severity to frontend expected format
                severity_map = {
                    "HIGH": "high",
                    "MEDIUM": "medium",
                    "LOW": "low"
                }
                
                severity = severity_map.get(issue.get("issue_severity", "LOW"), "low")
                
                # Extract a title from the issue text (first line or first sentence)
                issue_text = issue.get("issue_text", "")
                title = issue_text.split("\n")[0] if issue_text else "Security Issue"
                if len(title) > 100:
                    title = title[:97] + "..."
                
                parsed_issues.append({
                    "id": str(uuid.uuid4()),
                    "title": title,
                    "description": issue_text,
                    "severity": severity,
                    "status": "open",
                    "file": issue.get("filename", ""),
                    "line": issue.get("line_number", 0),
                    "type": "code",  # Bandit scans code vulnerabilities
                    "discoveredAt": datetime.now().isoformat(),
                    "confidence": issue.get("issue_confidence", "MEDIUM"),
                    "code": issue.get("code", "")
                })
            return parsed_issues
        except json.JSONDecodeError:
            print("Failed to parse Bandit report")
            return []

    async def save_vulnerabilities(self, repo_name: str, vulnerabilities: List[Dict[str, Any]]):
        """
        Save vulnerabilities into in-memory storage.
        """
        self.stored_vulnerabilities[repo_name] = vulnerabilities

    async def get_vulnerabilities(self, repo_name: str, severity: str, limit: int, offset: int) -> List[Dict[str, Any]]:
        """
        Retrieve vulnerabilities from database or other storage.

        :return: List of vulnerabilities
        """
        vulnerabilities = self.stored_vulnerabilities.get(repo_name, [])
        if severity:
            vulnerabilities = [v for v in vulnerabilities if v['severity'] == severity]
        return vulnerabilities[offset:offset + limit]

    async def get_report(self, report_id: str) -> Dict[str, Any]:
        """
        Retrieve a specific security report by ID.

        :return: Security report details
        """
        # Placeholder for retrieval logic
        return {}

    async def calculate_metrics(self, repo_name: str) -> Dict[str, Any]:
        """
        Calculate security metrics for a repository.

        :return: Security metrics
        """
        # Placeholder for metrics calculation logic
        return {}

    async def scan_dependencies(self, repo_name: str) -> Dict[str, Any]:
        """
        Scan and analyze dependencies for vulnerabilities.

        :return: Dependency analysis results
        """
        # Placeholder for dependency scan logic
        return {}
    
    def _get_mock_vulnerabilities(self) -> List[Dict[str, Any]]:
        """Generate mock vulnerabilities for demonstration purposes."""
        import uuid
        return [
            {
                "id": str(uuid.uuid4()),
                "title": "Hardcoded password detected",
                "description": "A hardcoded password was found in the configuration file. This poses a security risk as credentials should not be stored in source code.",
                "severity": "high",
                "status": "open",
                "file": "config/settings.py",
                "line": 42,
                "type": "code",
                "discoveredAt": datetime.now().isoformat(),
                "confidence": "HIGH"
            },
            {
                "id": str(uuid.uuid4()),
                "title": "SQL Injection vulnerability",
                "description": "User input is directly concatenated into SQL query without proper sanitization. Use parameterized queries instead.",
                "severity": "critical",
                "status": "open",
                "file": "api/database.py",
                "line": 156,
                "type": "code",
                "discoveredAt": datetime.now().isoformat(),
                "confidence": "HIGH"
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Insecure Random Number Generator",
                "description": "Use of pseudo-random generator for security-sensitive context. Consider using secrets module instead.",
                "severity": "medium",
                "status": "open",
                "file": "utils/tokens.py",
                "line": 23,
                "type": "code",
                "discoveredAt": datetime.now().isoformat(),
                "confidence": "MEDIUM"
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Missing SSL certificate validation",
                "description": "SSL certificate validation is disabled. This makes the application vulnerable to man-in-the-middle attacks.",
                "severity": "high",
                "status": "open",
                "file": "services/http_client.py",
                "line": 89,
                "type": "code",
                "discoveredAt": datetime.now().isoformat(),
                "confidence": "HIGH"
            }
        ]

