"""
Crowd Trail schemas for historical and synthetic student journeys.
"""
from pydantic import BaseModel
from typing import List

class Trail(BaseModel):
    trail_id: str
    current_skills: List[str]
    target_career: str
    route_sequence: List[str]
    outcome: str
