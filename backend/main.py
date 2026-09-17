"""
Waypoint Backend API Entrypoint
FastAPI application exposing endpoints for skill gap calculation, route generation,
crowd trails, market signals, and opportunity matching.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Waypoint API",
    description="Interactive Academic & Career Navigation Platform API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "online", "service": "Waypoint API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
