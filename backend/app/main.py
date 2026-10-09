from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import tasks

app = FastAPI(
    title="TaskFlow API",
    description="FastAPI Backend for TaskFlow productivity task manager",
    version="1.0.0",
)

# CORS Middleware to allow React Vite frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include task routers
app.include_router(tasks.router, prefix="/api")
app.include_router(tasks.router)  # Also accessible directly at /tasks

@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "service": "TaskFlow Backend API",
        "version": "1.0.0",
        "docs_url": "/docs"
    }
