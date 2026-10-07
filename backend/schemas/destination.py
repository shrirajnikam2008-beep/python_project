"""
Pydantic schemas for Destinations matching frontend/lib/types.ts
"""
from typing import Optional
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

class Destination(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    title: str
    description: str
    icon: str
    required_skill_count: int
    category: Optional[str] = ""
    avg_salary: Optional[str] = ""
    tags: list[str] = []
