from fastapi import FastAPI
from routers.simulations import router as simulations_router

app = FastAPI()

routers = [simulations_router]
for router in routers:
    app.include_router(router)