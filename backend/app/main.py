from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from app.core.config import settings
from app.api import auth, repositories
from app.api import dependencies, insights, performance, quality, security
# Temporarily disabled due to SQLAlchemy/Python 3.13 compatibility issues
# from app.api import analytics, projects
# Commented out due to Python 3.13 compatibility issues
# from app.core.database import engine
# from app.models.base import BaseModel
# from app.core.database import Base

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application startup and shutdown events"""
    # Startup
    logger.info("Starting up RepoScope API...")
    yield
    # Shutdown
    logger.info("Shutting down RepoScope API...")


# Create FastAPI app
app = FastAPI(
    title="RepoScope API",
    description="Intelligent repository analytics and project planning tool",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],  # Support both ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(repositories.router, prefix="/api/repositories", tags=["Repositories"])
# Temporarily disabled due to SQLAlchemy/Python 3.13 compatibility issues
# app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
# app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])

# Advanced Analytics routers
app.include_router(dependencies.router, prefix="/api/dependencies", tags=["Dependencies"])
app.include_router(insights.router, prefix="/api/insights", tags=["Insights"])
app.include_router(performance.router, prefix="/api/performance", tags=["Performance"])
app.include_router(quality.router, prefix="/api/quality", tags=["Quality"])
app.include_router(security.router, prefix="/api/security", tags=["Security"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to RepoScope API",
        "version": "0.1.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "reposcope-api",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
