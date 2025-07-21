from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse
# from sqlalchemy.ext.asyncio import AsyncSession
# from app.core.database import get_db
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
    state: Optional[str] = None
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
        
        # Get user info from GitHub
        user_response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json"
            }
        )
        
        if user_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get user information")
        
        user_data = user_response.json()
        
        # Get user email if not public
        email = user_data.get("email")
        if not email:
            email_response = await client.get(
                "https://api.github.com/user/emails",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/json"
                }
            )
            if email_response.status_code == 200:
                emails = email_response.json()
                # Get primary email
                for e in emails:
                    if e.get("primary"):
                        email = e.get("email")
                        break
        
        # Prepare user object in the format expected by frontend
        user = {
            "username": user_data.get("login"),
            "name": user_data.get("name"),
            "email": email,
            "avatar_url": user_data.get("avatar_url")
        }
        
        # TODO: Create or update user in database
        # TODO: Generate JWT token if needed
        
        return {
            "access_token": access_token,
            "user": user
        }


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
