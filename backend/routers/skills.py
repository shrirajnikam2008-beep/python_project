"""
Router for skill gap analysis (Person 2).
"""
from fastapi import APIRouter, HTTPException, status
from backend.schemas.skill import GapAnalysisRequest, GapAnalysisResponse
from backend.services.skill_gap import analyze_gaps
from backend.services.data_loader import get_destination

router = APIRouter(prefix="/api/skills", tags=["Skills"])

@router.post("/gap-analysis", response_model=GapAnalysisResponse)
def run_gap_analysis(req: GapAnalysisRequest):
    """
    Computes exact skill gaps, blockers, and priorities for the student.
    """
    dest = get_destination(req.destination_id)
    if not dest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unknown destination: {req.destination_id}",
        )

    skills, gaps = analyze_gaps(
        destination_id=req.destination_id,
        current_skills=req.current_skills,
        skill_levels=req.skill_levels,
    )

    return GapAnalysisResponse(skills=skills, gaps=gaps)
