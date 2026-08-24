from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, topics, progress, trainer, manager, admin, assessment

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise Skill Assessment & Role-Based Learning Platform (SIH Prototype)",
    version="1.0.0"
)

# Enable CORS for frontend clients (Vite / React on 5173, 3000, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(topics.router, prefix=settings.API_V1_PREFIX)
app.include_router(progress.router, prefix=settings.API_V1_PREFIX)
app.include_router(trainer.router, prefix=settings.API_V1_PREFIX)
app.include_router(manager.router, prefix=settings.API_V1_PREFIX)
app.include_router(admin.router, prefix=settings.API_V1_PREFIX)
app.include_router(assessment.router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    return {
        "status": "online",
        "platform": settings.PROJECT_NAME,
        "docs_url": "/docs",
        "api_prefix": settings.API_V1_PREFIX
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "sih-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
