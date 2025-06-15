from fastapi import APIRouter, HTTPException, Depends, Path
from starlette import status
from sqlalchemy.orm import Session
from typing import Annotated, Literal
from database import SessionLocal
from models import Users, PortfolioSettings
from pydantic import BaseModel, Field

from .simulations import RequestMonteCarlo as PortfolioSettingsRequest
from utils.dependencies import db_dependency, user_dependency

router = APIRouter(
    prefix="/portfolio_settings",
    tags=["portfolio_settings"]
)

MAX_SETTINGS_PER_USER = 10

@router.get("/all", status_code=status.HTTP_200_OK)
async def get_all_settings_of_user(db: db_dependency, user: user_dependency):
    print("test")
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization Failed.")
    return db.query(PortfolioSettings).filter(PortfolioSettings.owner_id == user.get("id")).all()

@router.post("/add", status_code=status.HTTP_201_CREATED)
async def add_portfolio_settings(db: db_dependency, user: user_dependency, settings: PortfolioSettingsRequest):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization Failed.")
    existing_settings = db.query(PortfolioSettings).filter(PortfolioSettings.owner_id == user.get("id")).all()
    if len(existing_settings) >= MAX_SETTINGS_PER_USER:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Only {MAX_SETTINGS_PER_USER} settings are allowed per user.")
    new_settings = PortfolioSettings(**settings.model_dump(), owner_id = user.get("id"))
    db.add(new_settings)
    db.commit()
    db.refresh(new_settings)
    return {"message": "Success"}

@router.put("/update/{settings_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_settings(db: db_dependency, user: user_dependency, new_settings: PortfolioSettingsRequest, settings_id: int = Path(ge=1)):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization Failed.")
    existing_settings =  db.query(PortfolioSettings).filter(PortfolioSettings.id == settings_id).first()
    if existing_settings is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Settings not found.")
    
    existing_settings.tickers = new_settings.tickers
    existing_settings.distribution = new_settings.distribution
    existing_settings.distribution_type = new_settings.distribution_type
    existing_settings.initial_portfolio = new_settings.initial_portfolio

    db.add(existing_settings)
    db.commit()
    db.refresh(existing_settings)
    return {"message": "Success"}

@router.delete("/{settings_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_settings(db: db_dependency, user: user_dependency, settings_id: int):
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    settings_to_delete = db.query(PortfolioSettings).filter(PortfolioSettings.owner_id == user.get("id")).filter(PortfolioSettings.id == settings_id).first()
    if settings_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio settings not found.")
    db.delete(settings_to_delete)
    db.commit()
    return {"message": "Success"}

# only for development
#-------------------------------------------------------------------------
@router.get("/", status_code=status.HTTP_200_OK)
async def get_all_settings(db: db_dependency):
    return db.query(PortfolioSettings).all()
#-------------------------------------------------------------------------