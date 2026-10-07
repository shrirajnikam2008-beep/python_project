"""
Opportunity domain model representing verified academic & career opportunities.
"""
from typing import List, Optional
from pydantic import BaseModel

class Opportunity(BaseModel):
    id: str
    title: str
    organization: str
    type: str
    description: str
    deadline: str
    stipend_or_prize: Optional[str] = None
    location: str
    eligibility: str
    url: str
    mode: str = "Online"
    destinations: List[str] = []
    tags: List[str] = []
    skills: List[str] = []
    domains: List[str] = []
    source_url: Optional[str] = None
    official_url: Optional[str] = None
    source_name: Optional[str] = None
    source_type: Optional[str] = None
    source_trust: str = "official"
    retrieval_method: str = "manual_curated"
    last_verified: Optional[str] = None
    verification_status: str = "verified"
    freshness: str = "RECENT"
    posted_date: Optional[str] = None
    min_year: Optional[int] = None
    max_year: Optional[int] = None
    eligible_branches: List[str] = []
    cgpa_requirement: Optional[float] = None
    trending_score: int = 85
    featured: bool = False
    is_mock: bool = False
