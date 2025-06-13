from fastapi import FastAPI
import models
from database import engine
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from routers.simulations import router as simulations_router
from routers.auth import router as auth_router
from routers.portfolio_settings import router as portfolio_settings_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

routers = [simulations_router, auth_router, portfolio_settings_router]
for router in routers:
    app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("API_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
async def health_check():
    return {"Healthy": 200}