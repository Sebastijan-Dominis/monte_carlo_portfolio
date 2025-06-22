from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

if os.getenv("DEPLOYMENT_ENVIRONMENT") == "DEV":
    engine = create_engine(os.getenv("DB_URL"), connect_args={"check_same_thread": False})
else:
    db_url = os.getenv("DB_URL")
    engine = create_engine(db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()