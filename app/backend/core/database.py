import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get DATABASE_URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in environment variables")

# Create async engine (for MySQL with aiomysql)
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Set to True for debugging
    future=True,
)

# Create session factory
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Base class for models
Base = declarative_base()


class DatabaseManager:
    """Simple database manager used by the service layer.

    This wraps the SQLAlchemy async engine and session factory and exposes
    the attributes/methods expected by services.* modules:
      - engine
      - async_session_maker
      - init_db()
      - create_tables()
      - close_db()
    """

    def __init__(self, engine, session_maker):
        self.engine = engine
        self.async_session_maker = session_maker

    async def init_db(self):
        """Initialise the database connection.

        This function currently just verifies that a connection can be
        established; connection pooling is handled by SQLAlchemy.
        """
        async with self.engine.begin() as conn:
            # No-op: connection acquisition is enough to validate connectivity
            await conn.run_sync(lambda conn: None)

    async def create_tables(self):
        """Create all tables defined on the SQLAlchemy Base metadata."""
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def close_db(self):
        """Close the database engine and release all connections."""
        await self.engine.dispose()


# Global database manager instance used across the application
db_manager = DatabaseManager(engine, AsyncSessionLocal)


# Dependency for FastAPI
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
