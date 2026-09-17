"""
Opportunity model for scholarships, internships, and programs.
"""
from pydantic import BaseModel
from typing import List

class Opportunity(BaseModel):
    opportunity_id: str
    title: str
    type: str  # internship | scholarship | program
    related_skills: List[str]
    eligibility: str
    link: str
    source: str
    date_added: str
