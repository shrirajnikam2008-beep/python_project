from typing import List

from fastapi import APIRouter, HTTPException

from backend.schemas.skill import StudentRequest
from backend.schemas.route import Route, Graph
from backend.services.route_builder import build_routes
from backend.services.graph_builder import build_graph

router = APIRouter(prefix="/api/routes", tags=["routes"])


@router.post("", response_model=List[Route], response_model_exclude_none=True)
def get_routes(body: StudentRequest):
    try:
        return build_routes(body.destination_id, body.current_skills, body.skill_levels)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.post("/{route_id}/graph", response_model=Graph, response_model_exclude_none=True)
def get_graph(route_id: str, body: StudentRequest):
    try:
        return build_graph(route_id, body.destination_id, body.current_skills, body.skill_levels)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))