from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import httpx
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="RepoScope API")

# CORS configuration
# Get frontend URL from environment
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get GitHub OAuth settings from environment
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI", "http://localhost:3000/auth/callback")

@app.get("/")
def read_root():
    return {
        "message": "RepoScope API",
        "version": "0.1.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/test")
def test_endpoint():
    return {
        "message": "API is working",
        "frontend_url": FRONTEND_URL,
        "github_configured": bool(GITHUB_CLIENT_ID)
    }

@app.get("/api/auth/github")
async def github_login():
    """Redirect to GitHub OAuth page"""
    if not GITHUB_CLIENT_ID:
        raise HTTPException(status_code=500, detail="GitHub Client ID not configured")
    
    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&redirect_uri={GITHUB_REDIRECT_URI}"
        f"&scope=repo,user:email"
    )
    return RedirectResponse(url=github_auth_url)

@app.get("/api/auth/github/callback")
async def github_callback(code: str):
    """Handle GitHub OAuth callback"""
    if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="GitHub OAuth not properly configured")
    
    # Exchange code for access token
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://github.com/login/oauth/access_token",
            json={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code,
            },
            headers={"Accept": "application/json"},
        )
        
        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        token_data = token_response.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            raise HTTPException(status_code=400, detail="No access token received")
        
        # Get user info
        user_response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json"
            }
        )
        
        if user_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        
        user_data = user_response.json()
        
        # Return the access token and user data
        # Frontend expects access_token field
        
        return {
            "access_token": access_token,
            "user": {
                "username": user_data.get("login"),
                "name": user_data.get("name"),
                "email": user_data.get("email"),
                "avatar_url": user_data.get("avatar_url")
            }
        }

@app.get("/api/repositories")
async def list_repositories(authorization: str = Header(None)):
    """List user's GitHub repositories"""
    print(f"Repositories endpoint called with auth header: {bool(authorization)}")
    
    if not authorization or not authorization.startswith("Bearer "):
        print(f"Invalid authorization header: {authorization}")
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")
    
    # Extract the token from the Bearer format
    token = authorization.replace("Bearer ", "")
    print(f"Token extracted: {token[:10]}..." if token else "No token")
    
    async with httpx.AsyncClient() as client:
        # Fetch user's repositories from GitHub
        repos_response = await client.get(
            "https://api.github.com/user/repos",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/json"
            },
            params={
                "per_page": 100,
                "sort": "pushed",
                "direction": "desc"
            }
        )
        
        print(f"GitHub API response status: {repos_response.status_code}")
        
        if repos_response.status_code != 200:
            print(f"GitHub API error: {repos_response.text}")
            raise HTTPException(status_code=400, detail=f"Failed to fetch repositories: {repos_response.status_code}")
        
        repos_data = repos_response.json()
        print(f"Found {len(repos_data)} repositories")
        
        # Transform the data to match frontend expectations
        repositories = []
        for repo in repos_data:
            repositories.append({
                "id": repo["id"],
                "name": repo["name"],
                "full_name": repo["full_name"],
                "description": repo["description"],
                "language": repo["language"],
                "stargazers_count": repo["stargazers_count"],
                "forks_count": repo["forks_count"],
                "updated_at": repo["updated_at"],
                "html_url": repo["html_url"],
                "private": repo["private"],
                "size": repo["size"],
                "default_branch": repo["default_branch"]
            })
        
        return {
            "repositories": repositories,
            "total": len(repositories)
        }

@app.get("/api/analytics/dashboard/{repo_id}")
async def get_dashboard_metrics(repo_id: str):
    """Get dashboard metrics for a repository"""
    return {
        "repository_id": repo_id,
        "metrics": {
            "commits": {"total": 0, "last_30_days": 0},
            "contributors": {"total": 0, "active": 0},
            "code_health": {"score": 0.0},
            "activity": {"last_commit": None}
        }
    }

if __name__ == "__main__":
    import uvicorn
    print(f"GitHub Client ID configured: {bool(GITHUB_CLIENT_ID)}")
    print(f"GitHub Client Secret configured: {bool(GITHUB_CLIENT_SECRET)}")
    uvicorn.run(app, host="0.0.0.0", port=8000)
