from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from utils.monte_carlo import monte_carlo
from pydantic import BaseModel, Field, model_validator
from typing import Literal
from starlette import status

router = APIRouter(
    prefix="/simulations",
    tags=["simulations"]
)

class RequestMonteCarlo(BaseModel):
    ticks: list[str] = Field(min_length=1)
    distribution: list[float]
    distribution_type: Literal["random", "equal", "exact"]
    initial_portfolio: float = Field(gt=0)

    @model_validator(mode='after')
    def check_distribution_length(self):
        if self.distribution_type == "exact" and len(self.distribution) != len(self.ticks):
            raise ValueError("Length of distribution must match length of ticks")
        return self

    model_config = {
        "json_schema_extra": {
            "example": {
                "ticks": ["TSLA", "GOOGL", "META"],
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