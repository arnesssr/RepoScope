from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import BaseModel


class Repository(Base, BaseModel):
    __tablename__ = "repositories"
    
    # Basic info
    github_id = Column(Integer, unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    full_name = Column(String(500), nullable=False, unique=True, index=True)
    description = Column(String(1000), nullable=True)
    
    # Owner
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="repositories")
    
    # Repository details
    private = Column(Boolean, default=False)
    fork = Column(Boolean, default=False)
    created_at_github = Column(DateTime, nullable=True)
    updated_at_github = Column(DateTime, nullable=True)
    pushed_at = Column(DateTime, nullable=True)
    
    # Repository stats
    size = Column(Integer, default=0)  # KB
    stargazers_count = Column(Integer, default=0)
    watchers_count = Column(Integer, default=0)
    forks_count = Column(Integer, default=0)
    open_issues_count = Column(Integer, default=0)
    
    # Repository metadata
    language = Column(String(100), nullable=True)
    languages = Column(JSON, nullable=True)  # {"Python": 80, "JavaScript": 20}
    topics = Column(JSON, nullable=True)  # ["fastapi", "react", "analytics"]
    
    # Git URLs
    clone_url = Column(String(500), nullable=True)
    git_url = Column(String(500), nullable=True)
    ssh_url = Column(String(500), nullable=True)
    html_url = Column(String(500), nullable=True)
    
    # Analysis metadata
    last_analyzed = Column(DateTime, nullable=True)
    analysis_status = Column(String(50), default="pending")  # pending, analyzing, completed, failed
    
    # Cached metrics
    cached_metrics = Column(JSON, nullable=True)
    
    # Relationships
    analyses = relationship("Analysis", back_populates="repository", cascade="all, delete-orphan")
    commits = relationship("Commit", back_populates="repository", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="repository", cascade="all, delete-orphan")
