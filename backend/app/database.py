import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# SQLAlchemy needs the psycopg2 driver specified explicitly
DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True, #makes SQLAlchemy test a connection before using it and silently reconnect if it's gone stale
    pool_recycle=300
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency used in route handlers to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()