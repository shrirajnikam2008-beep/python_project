"""
Configuration settings for the Waypoint application.
"""
import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic import BaseModel

# Load backend/.env if it exists
backend_dir = Path(__file__).resolve().parent.parent
env_path = backend_dir / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

class Settings(BaseModel):
    app_name: str = "Waypoint"
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./waypoint.db")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-flash-latest")

    # Route builder pacing & slot configuration
    fast_track_slots: int = 3
    fast_track_pace: float = 0.7
    balanced_slots: int = 2
    balanced_pace: float = 1.0
    foundation_slots: int = 2
    foundation_pace: float = 1.3

settings = Settings()
