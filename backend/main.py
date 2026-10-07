"""
Waypoint Backend API Entrypoint (Review 2).
FastAPI application exposing endpoints for student profile persistence,
destinations registry, skill gap analysis, route building, and opportunities radar.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.database import Base, engine
from backend.routers import student, destinations, skills, routes, opportunities

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Waypoint API",
    description="Interactive Academic & Career Navigation Platform API",
    version="2.0.0",
)

# CORS configured for Next.js frontend (local dev & Vercel deployment)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Review 2 routers
app.include_router(student.router)
app.include_router(destinations.router)
app.include_router(skills.router)
app.include_router(routes.router)
app.include_router(opportunities.router)
app.include_router(opportunities.legacy_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Waypoint API",
        "version": "2.0.0",
        "review": "Review 2 Ready",
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
