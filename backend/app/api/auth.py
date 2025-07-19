from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.config import settings
import httpx
from typing import Optional

router = APIRouter()


@router.get("/github")
async def github_login():
    """Redirect to GitHub OAuth page"""
    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={settings.GITHUB_CLIENT_ID}"
        f"&redirect_uri={settings.GITHUB_REDIRECT_URI}"
        f"&scope=repo,user:email"
    )
    return RedirectResponse(url=github_auth_url)


@router.get("/github/callback")
async def github_callback(
    code: str = Query(...),
    state: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Handle GitHub OAuth callback"""
    # Exchange code for access token
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://github.com/login/oauth/access_token",
            json={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
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
    
    # TODO: Get user info from GitHub
    # TODO: Create or update user in database
    # TODO: Generate JWT token
    # TODO: Redirect to frontend with token
    
    return {"message": "Authentication successful", "access_token": access_token}


@router.post("/logout")
async def logout():
    """Logout user"""
    # TODO: Implement logout logic (revoke tokens, etc.)
    return {"message": "Logged out successfully"}


@router.get("/me")
async def get_current_user():
    """Get current user info"""
    # TODO: Implement get current user from JWT
    return {"message": "Current user endpoint"}
