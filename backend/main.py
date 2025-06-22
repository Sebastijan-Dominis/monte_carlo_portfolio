from fastapi import FastAPI
import models
from database import engine, SessionLocal
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from sqlalchemy import text

from routers.simulations import router as simulations_router
from routers.auth import router as auth_router
from routers.portfolio_settings import router as portfolio_settings_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("API_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

routers = [simulations_router, auth_router, portfolio_settings_router]
for router in routers:
    app.include_router(router)

@app.get("/")
async def health_check():
    return {"Healthy": 200}

@app.get("/health")
def db_health_check():
    try:
        with SessionLocal() as db:
            db.execute(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as e:
        return {"status": "db_error", "detail": str(e)}