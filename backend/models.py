from database import Base
from sqlalchemy import Column, String, Integer, Float, Enum, CheckConstraint, ForeignKey
from sqlalchemy.types import JSON

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class PortfolioSettings(Base):
    __tablename__ = "portfolio_settings"
    
    id = Column(Integer, primary_key=True, index=True, nullable=False)
    ticks = Column(JSON, nullable=False)
    distribution_type = Column(String, nullable=False)
    distribution = Column(JSON, nullable=False)
    initial_portfolio = Column(Float, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "distribution_type IN ('random', 'equal', 'exact')",
            name="valid_distribution_type"
        ),
    )