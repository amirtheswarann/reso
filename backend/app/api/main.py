from fastapi import APIRouter

from app.api.routes import company_research, history, login, users, utils

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(company_research.router)
api_router.include_router(history.router)
