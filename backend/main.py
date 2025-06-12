from fastapi import FastAPI
import models
from database import engine

from routers.simulations import router as simulations_router
from routers.auth import router as auth_router
from routers.portfolio_settings import router as portfolio_settings_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

routers = [simulations_router, auth_router, portfolio_settings_router]
for router in routers:
    app.include_router(router)