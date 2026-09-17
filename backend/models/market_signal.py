"""
Market signal model representing skill demand and trends.
"""
from pydantic import BaseModel

class MarketSignal(BaseModel):
    skill_id: str
    demand_score: float
    trend: str  # rising / stable / falling
    source: str
    date: str
