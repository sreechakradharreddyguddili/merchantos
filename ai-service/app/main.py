from fastapi import FastAPI

from app.config import settings
from app.routes import router


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "AI intelligence and agent orchestration "
        "service for MerchantOS."
    ),
)


app.include_router(router)


@app.get("/api/health")
async def health_check():
    return {
        "success": True,
        "message": (
            "MerchantOS AI Service is running"
        ),
        "service": "ai-service",
        "version": settings.APP_VERSION,
    }


@app.get("/api")
async def root():
    return {
        "success": True,
        "message": (
            "Welcome to MerchantOS AI Service"
        ),
        "service": settings.APP_NAME,
    }