from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import base64

router = APIRouter()


@router.get("/")
async def list_repositories(
    token: str = Query(..., description="GitHub access token"),
    skip: int = Query(0, ge=0),
    limit: int = Query(30, ge=1, le=100),
    search: Optional[str] = None
):
    """List user's repositories from GitHub"""
    import httpx
    
    # Decode token if it's base64 encoded
    try:
        decoded_token = base64.b64decode(token).decode('utf-8')
        # Check if it looks like a GitHub token
        if decoded_token.startswith(('gho_', 'ghp_')):
            token = decoded_token
    except:
        # If decoding fails, use token as is
        pass
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            # Fetch user's repositories
            response = await client.get(
                "https://api.github.com/user/repos",
                headers=headers,
                params={
                    "per_page": limit,
                    "page": (skip // limit) + 1,
                    "sort": "updated",
                    "direction": "desc"
                }
            )
            response.raise_for_status()
            
            repositories = response.json()
            
            # Filter by search term if provided
            if search:
                repositories = [
                    repo for repo in repositories 
                    if search.lower() in repo["name"].lower() or 
                    (repo.get("description") and search.lower() in repo["description"].lower())
                ]
            
            # Get total count from headers
            link_header = response.headers.get("Link", "")
            total = len(repositories)  # Simplified for now
            
            return {
                "repositories": repositories,
                "total": total,
                "skip": skip,
                "limit": limit
            }
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch repositories: {str(e)}")


@router.post("/sync")
async def sync_repositories():
    """Sync repositories from GitHub"""
    # TODO: Get current user from JWT
    # TODO: Fetch repositories from GitHub API
    # TODO: Update database
    return {"message": "Repositories synced", "count": 0}


@router.get("/{repo_id}")
async def get_repository(
    repo_id: str
):
    """Get repository details"""
    # TODO: Get repository from database
    # TODO: Check user permissions
    return {"repository": None}


@router.post("/{repo_owner}/{repo_name}/analyze")
async def analyze_repository(
    repo_owner: str,
    repo_name: str,
    token: str = Query(..., description="GitHub access token")
):
    """Trigger repository analysis"""
    from app.services.analysis.analyzer import RepositoryAnalyzer
    
    # Decode token if it's base64 encoded
    try:
        decoded_token = base64.b64decode(token).decode('utf-8')
        # Check if it looks like a GitHub token
        if decoded_token.startswith(('gho_', 'ghp_')):
            token = decoded_token
    except:
        # If decoding fails, use token as is
        pass
    
    # Combine owner and name to get full repository path
    repo_full_name = f"{repo_owner}/{repo_name}"
    
    analyzer = RepositoryAnalyzer()
    
    # Start analysis (in production, this should be queued)
    try:
        # Construct GitHub URL from owner and name
        repo_url = f"https://github.com/{repo_full_name}"
        
        # Run analysis
        result = analyzer.analyze_repository(repo_url, token)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{repo_id}/commits")
async def get_repository_commits(
    repo_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200)
):
    """Get repository commits"""
    # TODO: Get commits from database or GitHub
    return {
        "commits": [],
        "total": 0,
        "skip": skip,
        "limit": limit
    }
