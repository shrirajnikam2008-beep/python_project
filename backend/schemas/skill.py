from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

Level = Literal["None", "Beginner", "Intermediate", "Advanced"]


class CamelModel(BaseModel):
    """Python uses snake_case, the JSON sent to the frontend uses camelCase."""
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class StudentRequest(CamelModel):
    """Body used by all three engine endpoints."""
    destination_id: str
    current_skills: List[str] = []
    skill_levels: Optional[Dict[str, Level]] = None


class Skill(CamelModel):
    id: str
    name: str
    category: str
    description: str
    current_level: str
    required_level: str
    status: str          # completed / in-progress / next / locked
    priority: str        # critical / high / recommended / none
    importance: str      # core / supporting / optional
    prerequisites: List[str]
    dependents: List[str]
    estimated_weeks: int
    why_it_matters: str


class SkillGap(CamelModel):
    skill_id: str
    skill: Skill
    priority: str
    gap: str             # full / partial
    gap_size: int        # required level - current level
    blocks_count: int    # how many other missing skills need this one first
    gap_explanation: Optional[str] = None


class GapAnalysisResponse(CamelModel):
    skills: List[Skill]
    gaps: List[SkillGap]