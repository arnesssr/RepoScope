from pydantic_settings import BaseSettings
from typing import Optional, List
from functools import lru_cache


class Settings(BaseSettings):
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/reposcope"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # GitHub OAuth
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    GITHUB_REDIRECT_URI: str = "http://localhost:3000/auth/callback"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    JWT_SECRET_KEY: str = "your-jwt-secret-key"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # Gemini API
    GEMINI_API_KEY: str
    
    # Frontend URL (for CORS)
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    # Webhook Secret
    WEBHOOK_SECRET: Optional[str] = None
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    # Monitoring
    ENABLE_METRICS: bool = True
    METRICS_PORT: int = 9090
    
    # Repository Analysis
    MAX_COMMITS_TO_ANALYZE: int = 1000
    MAX_FILE_SIZE_MB: int = 10
    ANALYSIS_CACHE_TTL_SECONDS: int = 3600  # 1 hour
    
    # AI Configuration
    GEMINI_MODEL: str = "gemini-pro"
    AI_REQUEST_TIMEOUT: int = 30
    MAX_AI_RETRIES: int = 3
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


settings = get_settings()
