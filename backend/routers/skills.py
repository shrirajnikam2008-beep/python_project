from fastapi import APIRouter, HTTPException

from backend.schemas.skill import StudentRequest, GapAnalysisResponse
from backend.services.skill_gap import analyze_gaps

router = APIRouter(prefix="/api/skills", tags=["skills"])


@router.post("/gap-analysis", response_model=GapAnalysisResponse, response_model_exclude_none=True)
def gap_analysis(body: StudentRequest):
    try:
        skills, gaps = analyze_gaps(body.destination_id, body.current_skills, body.skill_levels)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))
    return GapAnalysisResponse(skills=skills, gaps=gaps)