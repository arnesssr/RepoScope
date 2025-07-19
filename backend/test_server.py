from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import httpx
import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="RepoScope API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get GitHub OAuth settings
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI", "http://localhost:3000/auth/callback")

@app.get("/")
def read_root():
    return {
        "message": "RepoScope API is running!",
        "status": "Backend setup successful",
        "note": "GitHub OAuth and Gemini API configured"
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
            logger.error(f"GitHub token exchange failed: {token_response.text}")
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        token_data = token_response.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            logger.error(f"No access token in response: {token_data}")
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
            logger.error(f"Failed to get user info: {user_response.text}")
            raise HTTPException(status_code=400, detail="Failed to get user info")
        
        user_data = user_response.json()
        
        # Get user email if not public
        email_response = await client.get(
            "https://api.github.com/user/emails",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json"
            }
        )
        
        email = user_data.get('email')
        if email_response.status_code == 200:
            emails = email_response.json()
            primary_email = next((e['email'] for e in emails if e['primary']), None)
            if primary_email:
                email = primary_email
        
        # Store access token in a simple session (in production, use JWT)
        # For now, we'll pass it as a query param (not secure for production!)
        import base64
        encoded_token = base64.b64encode(access_token.encode()).decode()
        
        # Return JSON response instead of redirect for SPA
        return {
            "access_token": encoded_token,
            "user": {
                "username": user_data.get('login'),
                "name": user_data.get('name'),
                "email": email,
                "avatar_url": user_data.get('avatar_url'),
                "bio": user_data.get('bio'),
                "company": user_data.get('company'),
                "location": user_data.get('location'),
                "blog": user_data.get('blog'),
                "twitter_username": user_data.get('twitter_username'),
                "public_repos": user_data.get('public_repos'),
                "followers": user_data.get('followers'),
                "following": user_data.get('following')
            }
        }

@app.get("/api/repositories")
async def get_repositories(token: str):
    """Get user's repositories from GitHub"""
    import base64
    
    try:
        # Decode the token
        access_token = base64.b64decode(token.encode()).decode()
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    async with httpx.AsyncClient() as client:
        # Get user's repositories
        repos_response = await client.get(
            "https://api.github.com/user/repos",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json"
            },
            params={
                "sort": "updated",
                "per_page": 100
            }
        )
        
        if repos_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch repositories")
        
        repos_data = repos_response.json()
        
        # Extract relevant fields
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

@app.post("/api/analyze")
async def analyze_repository(repo_data: dict, token: str):
    """Analyze a repository using Git and AI"""
    import base64
    from app.services.analysis.analyzer import RepositoryAnalyzer
    
    try:
        # Decode the token
        access_token = base64.b64decode(token.encode()).decode()
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Get repository URL
    repo_url = repo_data.get("html_url") or repo_data.get("clone_url")
    if not repo_url:
        raise HTTPException(status_code=400, detail="Repository URL not provided")
    
    # Initialize analyzer
    analyzer = RepositoryAnalyzer()
    
    # Run analysis (in production, this should be a background task)
    logger.info(f"Starting analysis for repository: {repo_url}")
    results = analyzer.analyze_repository(repo_url, access_token)
    
    return results

if __name__ == "__main__":
    import uvicorn
    print(f"GitHub Client ID configured: {bool(GITHUB_CLIENT_ID)}")
    print(f"GitHub Client Secret configured: {bool(GITHUB_CLIENT_SECRET)}")
    uvicorn.run(app, host="0.0.0.0", port=8000)
