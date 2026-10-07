"""
Router for authentic opportunities, AI opportunity search, and personalized recommendations.
Supports /api/v1/opportunities and /api/opportunities.
"""
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query, HTTPException, Body
from backend.services.data_loader import _load_all_data, clear_cache
from backend.services.opportunity_verifier import verify_opportunity
from backend.services.opportunity_ranker import calculate_match_score
from backend.services.opportunity_search import (
    search_verified_opportunities,
    parse_search_intent
)
from backend.services.opportunity_sources import list_sources
from backend.schemas.opportunity import (
    Opportunity,
    OpportunitySource,
    OpportunitySearchRequest,
    OpportunitySearchResponse,
)

router = APIRouter(prefix="/api/v1/opportunities", tags=["Opportunities"])
legacy_router = APIRouter(prefix="/api/opportunities", tags=["Opportunities Legacy"])

def _get_audited_opportunities() -> List[Dict[str, Any]]:
    _, _, _, _, _, raw_opps = _load_all_data()
    audited = []
    for raw in raw_opps:
        meta = verify_opportunity(raw)
        merged = {**raw, **meta}
        audited.append(merged)
    return audited

@router.get("", response_model=List[Opportunity])
@legacy_router.get("", response_model=List[Opportunity])
def get_all_opportunities(
    destination: Optional[str] = Query(None, description="Destination ID filter"),
    type: Optional[str] = Query(None, description="Opportunity type filter"),
    filter: Optional[str] = Query(None, description="Daily filter mode (trending, closing-soon, new-today)"),
    sort_by: Optional[str] = Query("best_match", alias="sortBy", description="Sorting criteria")
):
    """
    Returns authentic hackathons, fellowships, internships, and research grants.
    """
    opps = _get_audited_opportunities()

    if destination and destination != "all":
        opps = [op for op in opps if "all" in op.get("destinations", []) or destination in op.get("destinations", [])]

    if type and type != "all":
        opps = [op for op in opps if op.get("type", "").lower() == type.lower()]

    if filter == "trending":
        opps = [op for op in opps if op.get("isTrending") or op.get("trendingScore", 0) >= 90]
        opps.sort(key=lambda x: x.get("trendingScore", 0), reverse=True)
    elif filter == "closing-soon":
        opps = [op for op in opps if op.get("isClosingSoon") or op.get("daysRemaining", 30) <= 7]
        opps.sort(key=lambda x: x.get("daysRemaining", 30))
    elif filter == "new-today":
        opps = [op for op in opps if op.get("isNewToday")]

    if sort_by == "trending" and filter != "trending":
        opps.sort(key=lambda x: x.get("trendingScore", 0), reverse=True)
    elif sort_by == "closing_soon" and filter != "closing-soon":
        opps.sort(key=lambda x: x.get("daysRemaining", 30))

    return [Opportunity(**op) for op in opps]

@router.get("/sources", response_model=List[OpportunitySource])
def get_opportunity_sources():
    """
    Returns the registry of verified official and recognized sources.
    """
    return list_sources()

@router.post("/recommended", response_model=List[Opportunity])
def get_recommended_opportunities(payload: Dict[str, Any] = Body(...)):
    """
    Returns opportunities ranked deterministically against the student's profile.
    """
    profile = payload.get("profile")
    opps = _get_audited_opportunities()

    ranked = []
    for op in opps:
        score, breakdown, reasons = calculate_match_score(op, profile)
        op_copy = dict(op)
        op_copy["matchScore"] = score
        op_copy["matchBreakdown"] = breakdown.model_dump(by_alias=True)
        op_copy["matchReasons"] = reasons
        ranked.append(op_copy)

    ranked.sort(key=lambda x: x.get("matchScore", 0), reverse=True)
    return [Opportunity(**op) for op in ranked]

@router.post("/search", response_model=OpportunitySearchResponse)
def search_opportunities(payload: OpportunitySearchRequest):
    """
    AI Search: Parses natural language query into structured constraints,
    retrieves verified records, applies eligibility filtering, and ranks deterministically.
    """
    opps = _get_audited_opportunities()
    response = search_verified_opportunities(
        query=payload.query,
        all_opps=opps,
        profile=payload.student_profile,
        criteria_override=payload.criteria
    )
    return response

@router.get("/{opportunity_id}", response_model=Opportunity)
def get_single_opportunity(opportunity_id: str):
    """
    Fetches a single verified opportunity by its ID.
    """
    opps = _get_audited_opportunities()
    for op in opps:
        if op.get("id") == opportunity_id:
            return Opportunity(**op)
    raise HTTPException(status_code=404, detail="Opportunity not found")

@router.post("/refresh")
def refresh_opportunity_cache():
    """
    Clears in-memory data loader cache to reflect any updates to canonical CSVs.
    """
    clear_cache()
    return {"status": "success", "message": "Opportunity cache refreshed successfully."}
