"""
Student profile schema and models.
"""
from pydantic import BaseModel
from typing import List, Optional

class StudentProfile(BaseModel):
    student_id: str
    name: str
    target_career: str
    current_skills: List[str] = []
