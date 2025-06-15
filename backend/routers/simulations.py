from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from utils.monte_carlo import monte_carlo
from pydantic import BaseModel, Field, model_validator
from typing import Literal
from starlette import status

from models import PortfolioSettings
from utils.dependencies import db_dependency, user_dependency

router = APIRouter(
    prefix="/simulations",
    tags=["simulations"]
)

class RequestMonteCarlo(BaseModel):
    tickers: list[str] = Field(min_length=1)
    distribution: list[float]
    distribution_type: Literal["random", "equal", "exact"]
    initial_portfolio: float = Field(gt=0)

    @model_validator(mode='after')
    def check_distribution_length(self):
        if self.distribution_type == "exact" and len(self.distribution) != len(self.tickers):
            raise ValueError("Length of distribution must match length of tickers")
        return self

    model_config = {
        "json_schema_extra": {
            "example": {
                "tickers": ["TSLA", "GOOGL", "META"],
                "distribution": [0.4, 0.3, 0.3],
                "distribution_type": "exact",
                "initial_portfolio": 10000
            }
        }
    }

@router.post("/", status_code=status.HTTP_201_CREATED)
async def run_monte_carlo(request_monte_carlo: RequestMonteCarlo):
    img_buf = monte_carlo(request_monte_carlo)
    return StreamingResponse(img_buf, media_type="image/png")

@router.post("/user/{settings_id}", status_code=status.HTTP_201_CREATED)
async def run_monte_carlo_user(db: db_dependency, user: user_dependency, settings_id: int):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization Failed.")
    settings = db.query(PortfolioSettings).filter(PortfolioSettings.owner_id == user.get("id")).filter(PortfolioSettings.id == settings_id).first()
    if settings is None:
        raise HTTPException(status_code=404, detail="Settings not found.")
    img_buf = monte_carlo(settings)
    return StreamingResponse(img_buf, media_type="image/png")