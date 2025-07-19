from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import httpx
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="RepoScope API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
        
        # For now, just return the user data
        # In production, you would:
        # 1. Create/update user in database
        # 2. Generate JWT token
        # 3. Redirect to frontend with token
        
        return {
            "message": "Authentication successful",
            "user": {
                "username": user_data.get("login"),
                "name": user_data.get("name"),
                "email": user_data.get("email"),
                "avatar_url": user_data.get("avatar_url")
            }
        }

@app.get("/api/repositories")
async def list_repositories():
    """List repositories (mock data for now)"""
    return {
        "repositories": [],
        "total": 0,
        "message": "Implement repository listing"
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
