"""
Pydantic schemas for Skills and Skill Gaps matching frontend/lib/types.ts
"""
from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

SkillStatus = Literal["completed", "in-progress", "next", "locked"]
SkillPriority = Literal["critical", "high", "recommended"]
SkillLevel = Literal["None", "Beginner", "Intermediate", "Advanced"]

class Skill(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    name: str
    category: str
    description: str
    current_level: SkillLevel = "None"
    required_level: SkillLevel = "Intermediate"
    status: SkillStatus = "locked"
    priority: SkillPriority = "recommended"
    prerequisites: list[str] = []
    dependents: list[str] = []
    estimated_weeks: int = 3
    why_it_matters: str = ""

class SkillGap(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    skill_id: str
    skill: Skill
    priority: SkillPriority
    gap: Literal["full", "partial"]
    gap_explanation: Optional[str] = None

class GapAnalysisRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    destination_id: str
    current_skills: list[str] = []
    skill_levels: Optional[dict[str, str]] = None

class GapAnalysisResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    skills: list[Skill]
    gaps: list[SkillGap]
