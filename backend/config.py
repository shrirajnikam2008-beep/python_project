"""
Configuration settings for the Waypoint application.
"""
import os
from pydantic import BaseModel

class Settings(BaseModel):
    app_name: str = "Waypoint"
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./waypoint.db")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")

settings = Settings()
