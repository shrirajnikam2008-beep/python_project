"""
Pydantic schemas for Routes and React Flow Graph matching frontend/lib/types.ts
"""
from typing import Optional, Literal, Any
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from backend.schemas.skill import SkillStatus, SkillPriority

class RouteStep(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    skill_id: str
    week_start: int
    week_end: int
    milestone: Optional[str] = None

class Route(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    name: str
    tagline: str
    description: str
    workload: Literal["Low", "Medium", "High"]
    total_weeks: int
    skill_count: int
    steps: list[RouteStep]
    is_recommended: Optional[bool] = False

class RouteNodeData(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    skill_id: str
    label: str
    category: str
    status: SkillStatus
    priority: SkillPriority
    is_goal: Optional[bool] = None
    is_start: Optional[bool] = None

class RouteNodePosition(BaseModel):
    x: float
    y: float

class RouteNode(BaseModel):
    id: str
    type: str = "skillNode"
    position: RouteNodePosition
    data: RouteNodeData

class RouteEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str = "smoothstep"
    animated: Optional[bool] = None

class RouteGraphResponse(BaseModel):
    nodes: list[RouteNode]
    edges: list[RouteEdge]
