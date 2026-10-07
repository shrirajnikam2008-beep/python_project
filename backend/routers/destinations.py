"""
Router for destinations registry (Person 3).
"""
from fastapi import APIRouter
from backend.services.data_loader import list_destinations
from backend.schemas.destination import Destination

router = APIRouter(prefix="/api/destinations", tags=["Destinations"])

@router.get("", response_model=list[Destination])
def get_all_destinations():
    """
    Returns all career destinations available in the registry.
    """
    dests = list_destinations()
    return [Destination(**d) for d in dests]
