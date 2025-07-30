"""
Code Parser Service
Analyzes and parses code structure from git repositories.
"""

import ast
import re
from typing import Dict, List, Any, Optional
from pathlib import Path

class CodeParser:
    """Parse and analyze code structure."""
    
    def __init__(self):
        self.language_parsers = {
            '.py': self._parse_python,
            '.js': self._parse_javascript,
            '.ts': self._parse_typescript,
            '.java': self._parse_java,
            '.cpp': self._parse_cpp,
            '.c': self._parse_c,
        }
    
    async def parse_file(self, file_path: str, content: str) -> Dict[str, Any]:
        """Parse a single file and extract structure."""
        extension = Path(file_path).suffix.lower()
        
        if extension in self.language_parsers:
            return await self.language_parsers[extension](content, file_path)
        
        # Default parsing for unknown file types
        return await self._parse_generic(content, file_path)
    
    async def _parse_python(self, content: str, file_path: str) -> Dict[str, Any]:
        """Parse Python code structure."""
        try:
            tree = ast.parse(content)
            
            classes = []
            functions = []
            imports = []
            
            for node in ast.walk(tree):
                if isinstance(node, ast.ClassDef):
                    methods = [n.name for n in node.body if isinstance(n, ast.FunctionDef)]
                    classes.append({
                        'name': node.name,
                        'line': node.lineno,
                        'methods': methods,
                        'docstring': ast.get_docstring(node)
                    })
                elif isinstance(node, ast.FunctionDef):
                    # Only top-level functions
                    if not any(isinstance(parent, ast.ClassDef) for parent in ast.walk(tree)):
                        functions.append({
                            'name': node.name,
                            'line': node.lineno,
                            'args': [arg.arg for arg in node.args.args],
                            'docstring': ast.get_docstring(node)
                        })
                elif isinstance(node, (ast.Import, ast.ImportFrom)):
                    if isinstance(node, ast.Import):
                        imports.extend([alias.name for alias in node.names])
                    else:
                        imports.append(node.module)
            
            return {
                'language': 'python',
                'classes': classes,
                'functions': functions,
                'imports': imports,
                'lines_of_code': len(content.splitlines()),
                'complexity': self._calculate_complexity(content)
            }
        except Exception as e:
            return {'error': str(e), 'language': 'python'}
    
    async def _parse_javascript(self, content: str, file_path: str) -> Dict[str, Any]:
        """Parse JavaScript code structure."""
        # Simplified JS parsing using regex
        function_pattern = r'(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>)'
        class_pattern = r'class\s+(\w+)'
        import_pattern = r'import\s+.*?from\s+[\'"]([^\'\"]+)[\'"]'
        
        functions = re.findall(function_pattern, content)
        classes = re.findall(class_pattern, content)
        imports = re.findall(import_pattern, content)
        
        return {
            'language': 'javascript',
            'classes': [{'name': c} for c in classes],
            'functions': [{'name': f[0] or f[1]} for f in functions],
            'imports': imports,
            'lines_of_code': len(content.splitlines()),
            'complexity': self._calculate_complexity(content)
        }
    
    async def _parse_typescript(self, content: str, file_path: str) -> Dict[str, Any]:
        """Parse TypeScript code structure."""
        # Similar to JavaScript but with type annotations
        return await self._parse_javascript(content, file_path)
    
    async def _parse_java(self, content: str, file_path: str) -> Dict[str, Any]:
        """Parse Java code structure."""
        class_pattern = r'(?:public\s+)?(?:abstract\s+)?class\s+(\w+)'
        method_pattern = r'(?:public|private|protected)?\s*(?:static\s+)?(?:\w+\s+)?(\w+)\s*\([^)]*\)\s*{'
        import_pattern = r'import\s+([\w\.]+);'
        
        classes = re.findall(class_pattern, content)
        methods = re.findall(method_pattern, content)
        imports = re.findall(import_pattern, content)
        
        return {
            'language': 'java',
            'classes': [{'name': c} for c in classes],
            'methods': [{'name': m} for m in methods if m not in classes],
            'imports': imports,
            'lines_of_code': len(content.splitlines()),
            'complexity': self._calculate_complexity(content)
        }
    
    async def _parse_cpp(self, content: str, file_path: str) -> Dict[str, Any]:
        """Parse C++ code structure."""
        class_pattern = r'class\s+(\w+)'
        function_pattern = r'(?:\w+\s+)*(\w+)\s*\([^)]*\)\s*{'
        include_pattern = r'#include\s*[<"]([^>"]+)[>"]'
        
        classes = re.findall(class_pattern, content)
        functions = re.findall(function_pattern, content)
        includes = re.findall(include_pattern, content)
        
        return {
            'language': 'cpp',
            'classes': [{'name': c} for c in classes],
            'functions': [{'name': f} for f in functions],
            'includes': includes,
            'lines_of_code': len(content.splitlines()),
            'complexity': self._calculate_complexity(content)
        }
    
    async def _parse_c(self, content: str, file_path: str) -> Dict[str, Any]:
        """Parse C code structure."""
        function_pattern = r'(?:\w+\s+)*(\w+)\s*\([^)]*\)\s*{'
        include_pattern = r'#include\s*[<"]([^>"]+)[>"]'
        
        functions = re.findall(function_pattern, content)
        includes = re.findall(include_pattern, content)
        
        return {
            'language': 'c',
            'functions': [{'name': f} for f in functions],
            'includes': includes,
            'lines_of_code': len(content.splitlines()),
            'complexity': self._calculate_complexity(content)
        }
    
    async def _parse_generic(self, content: str, file_path: str) -> Dict[str, Any]:
        """Generic parsing for unknown file types."""
        return {
            'language': 'unknown',
            'lines_of_code': len(content.splitlines()),
            'file_size': len(content)
        }
    
    def _calculate_complexity(self, content: str) -> int:
        """Calculate cyclomatic complexity (simplified)."""
        # Count decision points
        complexity = 1
        decision_keywords = ['if', 'elif', 'else', 'for', 'while', 'case', 'catch', 'except']
        
        for keyword in decision_keywords:
            complexity += len(re.findall(rf'\b{keyword}\b', content))
        
        return complexity
    
    async def extract_documentation(self, content: str, language: str) -> List[Dict[str, str]]:
        """Extract documentation from code."""
        docs = []
        
        if language == 'python':
            # Extract docstrings
            docstring_pattern = r'"""(.*?)"""'
            docstrings = re.findall(docstring_pattern, content, re.DOTALL)
            docs.extend([{'type': 'docstring', 'content': d.strip()} for d in docstrings])
        
        # Extract comments
        single_comment_pattern = r'(?://|#)\s*(.+)$'
        multi_comment_pattern = r'/\*(.*?)\*/'
        
        single_comments = re.findall(single_comment_pattern, content, re.MULTILINE)
        multi_comments = re.findall(multi_comment_pattern, content, re.DOTALL)
        
        docs.extend([{'type': 'comment', 'content': c.strip()} for c in single_comments])
        docs.extend([{'type': 'comment', 'content': c.strip()} for c in multi_comments])
        
        return docs
