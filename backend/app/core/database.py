from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings
import os

# Use SQLite for development if PostgreSQL is not available
if settings.DATABASE_URL.startswith("postgresql://"):
    # Check if we can use PostgreSQL
    try:
        import asyncpg
        database_url = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
    except ImportError:
        # Fall back to SQLite
        print("Warning: PostgreSQL driver not available, using SQLite instead")
        os.makedirs("data", exist_ok=True)
        database_url = "sqlite+aiosqlite:///./data/reposcope.db"
else:
    database_url = settings.DATABASE_URL

# Create async engine
engine = create_async_engine(
    database_url,
    echo=settings.DEBUG,
    future=True,
)

# Create session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Create base class for models
Base = declarative_base()


async def get_db():
    """Dependency to get database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
