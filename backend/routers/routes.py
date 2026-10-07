"""
Router for route scheduling and DAG map graph generation (Person 2).
"""
from fastapi import APIRouter, HTTPException, status
from backend.schemas.skill import GapAnalysisRequest
from backend.schemas.route import Route, RouteGraphResponse
from backend.services.route_builder import build_routes, build_route_graph
from backend.services.data_loader import get_destination

router = APIRouter(prefix="/api/routes", tags=["Routes"])

@router.post("", response_model=list[Route])
def get_routes_for_student(req: GapAnalysisRequest):
    """
    Builds the 3 tailored timeline study routes (Fast Track, Balanced, Foundation First).
    """
    dest = get_destination(req.destination_id)
    if not dest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unknown destination: {req.destination_id}",
        )

    return build_routes(
        destination_id=req.destination_id,
        current_skills=req.current_skills,
        skill_levels=req.skill_levels,
    )

@router.post("/{route_id}/graph", response_model=RouteGraphResponse)
def get_route_graph_for_student(route_id: str, req: GapAnalysisRequest):
    """
    Generates topological nodes and edges for the React Flow canvas map.
    """
    dest = get_destination(req.destination_id)
    if not dest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unknown destination: {req.destination_id}",
        )

    return build_route_graph(
        route_id=route_id,
        destination_id=req.destination_id,
        current_skills=req.current_skills,
        skill_levels=req.skill_levels,
    )
