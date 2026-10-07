"""
Pydantic schemas for Student Profile matching frontend/lib/types.ts
"""
from typing import Optional
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

class StudentProfile(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    name: str = "Student"
    program: Optional[str] = ""
    branch: Optional[str] = ""
    semester: Optional[int] = 1
    cgpa: Optional[float] = 0.0
    credits_completed: Optional[int] = 0
    current_skills: list[str] = []
    selected_destination_id: str = "ai-ml-engineer"
