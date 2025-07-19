from sqlalchemy import Column, String, Boolean, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import BaseModel


class User(Base, BaseModel):
    __tablename__ = "users"
    
    # GitHub OAuth fields
    github_id = Column(Integer, unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    # GitHub tokens
    access_token = Column(String(500), nullable=True)  # Encrypted in production
    
    # User settings
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    
    # Additional GitHub data
    company = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    bio = Column(String(1000), nullable=True)
    public_repos = Column(Integer, default=0)
    followers = Column(Integer, default=0)
    following = Column(Integer, default=0)
    
    # Relationships
    repositories = relationship("Repository", back_populates="owner", cascade="all, delete-orphan")
    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
