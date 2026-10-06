from typing import List, Optional

from backend.schemas.skill import CamelModel


class RouteStep(CamelModel):
    skill_id: str
    week_start: int
    week_end: int
    milestone: Optional[str] = None


class Route(CamelModel):
    id: str
    name: str
    tagline: str
    description: str
    workload: str
    total_weeks: int
    skill_count: int
    steps: List[RouteStep]
    is_recommended: bool


class NodePosition(CamelModel):
    x: int
    y: int


class NodeData(CamelModel):
    skill_id: str
    label: str
    category: str
    status: str
    priority: str
    is_start: Optional[bool] = None
    is_goal: Optional[bool] = None


class GraphNode(CamelModel):
    id: str
    type: str = "skillNode"
    position: NodePosition
    data: NodeData


class GraphEdge(CamelModel):
    id: str
    source: str
    target: str
    type: str = "smoothstep"
    animated: bool = False


class Graph(CamelModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]