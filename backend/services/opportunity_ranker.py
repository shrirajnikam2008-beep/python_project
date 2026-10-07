"""
Deterministic Opportunity Ranking Service
Implements a reproducible, mathematically bounded 100-point relevance scoring algorithm:

Profile / Branch Match:       25 pts
Current Skill Match:          10 pts
Skill Gap Alignment:          10 pts (rewards developing skills identified as student gaps)
Career Alignment:             20 pts
Eligibility (Year & CGPA):    15 pts
Freshness:                    10 pts
Deadline Urgency:              5 pts
Source Trust:                  5 pts
────────────────────────────────────
Total:                       100 pts

The LLM is strictly prohibited from altering or guessing this numerical score.
"""
from typing import Dict, Any, List, Tuple
from backend.schemas.opportunity import MatchScoreBreakdown

def calculate_match_score(
    opp: Dict[str, Any],
    profile: Dict[str, Any] = None
) -> Tuple[int, MatchScoreBreakdown, List[str]]:
    reasons: List[str] = []

    if not profile:
        # Default fallback score for anonymous visitors
        score = int(opp.get("trendingScore") or opp.get("trending_score") or 80)
        breakdown = MatchScoreBreakdown(
            score=score,
            profile_match=15,
            current_skill_match=5,
            skill_gap_alignment=5,
            career_alignment=15,
            eligibility_match=10,
            freshness=8,
            deadline_urgency=3,
            source_trust=4,
            reasons=["General relevance to undergraduate engineering pathways."]
        )
        return score, breakdown, breakdown.reasons

    # 1. Profile / Branch Match (Max 25 pts)
    profile_match = 0
    structured_elig = opp.get("structuredEligibility") or opp.get("structured_eligibility") or {}
    eligible_branches = structured_elig.get("eligibleBranches") or structured_elig.get("eligible_branches") or []
    student_branch = (profile.get("branch") or profile.get("program") or "").lower()

    if not eligible_branches or any("all" in b.lower() or "engineering" in b.lower() for b in eligible_branches):
        profile_match = 22
        reasons.append("Open across all engineering disciplines")
    elif any(b.lower() in student_branch or "it" in b.lower() or "computer" in b.lower() for b in eligible_branches):
        profile_match = 25
        reasons.append(f"Direct match for your {profile.get('branch', 'Information Technology')} curriculum")
    else:
        profile_match = 10

    # 2. Current Skill Match (Max 10 pts)
    current_skill_match = 0
    student_skills = [s.lower() for s in (profile.get("currentSkills") or profile.get("current_skills") or [])]
    opp_skills = [s.lower() for s in (opp.get("skills") or [])]
    matched_current = [s for s in opp_skills if any(cs in s or s in cs for cs in student_skills)]

    if matched_current:
        current_skill_match = min(10, len(matched_current) * 5)
        reasons.append(f"Utilizes your current skills: {', '.join(matched_current[:2])}")
    elif student_skills:
        current_skill_match = 4

    # 3. Skill Gap Alignment (Max 10 pts)
    # Rewards opportunities that help develop skills currently missing/target gaps
    skill_gap_alignment = 0
    missing_skills = [s for s in opp_skills if not any(cs in s or s in cs for cs in student_skills)]
    if missing_skills:
        skill_gap_alignment = min(10, len(missing_skills) * 4)
        reasons.append(f"Builds targeted skill gaps: {', '.join(missing_skills[:2])}")
    else:
        skill_gap_alignment = 6

    # 4. Career Alignment (Max 20 pts)
    career_alignment = 0
    student_dest = (profile.get("selectedDestinationId") or profile.get("selected_destination_id") or "").lower()
    opp_dests = [d.lower() for d in (opp.get("destinations") or [])]

    if "all" in opp_dests:
        career_alignment = 16
        reasons.append("Broad cross-domain career applicability")
    elif any(d in student_dest or student_dest in d for d in opp_dests):
        career_alignment = 20
        reasons.append("Directly aligned with your selected career goal")
    else:
        career_alignment = 8

    # 5. Eligibility (Max 15 pts)
    eligibility_match = 15
    student_sem = profile.get("semester") or 1
    student_year = max(1, (student_sem + 1) // 2)
    min_year = structured_elig.get("minYear") or structured_elig.get("min_year") or 1
    max_year = structured_elig.get("maxYear") or structured_elig.get("max_year") or 4
    cgpa_req = float(structured_elig.get("cgpaRequirement") or structured_elig.get("cgpa_requirement") or 0.0)
    student_cgpa = float(profile.get("cgpa") or 8.0)

    if min_year <= student_year <= max_year:
        if student_cgpa >= cgpa_req:
            eligibility_match = 15
            reasons.append(f"Eligible for Year {student_year} undergraduates")
        else:
            eligibility_match = 8
            reasons.append(f"Requires CGPA >= {cgpa_req} (Your CGPA: {student_cgpa})")
    else:
        eligibility_match = 5

    # 6. Freshness (Max 10 pts)
    freshness_pts = 8
    freshness = opp.get("freshness", "RECENT")
    if freshness == "NEW" or opp.get("isNewToday") or opp.get("is_new_today"):
        freshness_pts = 10
        reasons.append("Freshly opened cycle")
    elif freshness == "RECENT":
        freshness_pts = 8
    elif freshness == "CLOSING_SOON":
        freshness_pts = 9

    # 7. Deadline Urgency (Max 5 pts)
    deadline_pts = 3
    days_left = opp.get("daysRemaining") or opp.get("days_remaining") or 30
    if 0 <= days_left <= 7:
        deadline_pts = 5
        reasons.append(f"Action required: closes in {days_left} days")
    elif 8 <= days_left <= 21:
        deadline_pts = 4

    # 8. Source Trust (Max 5 pts)
    source_trust_pts = 3
    source_trust = opp.get("sourceTrust") or opp.get("source_trust") or "official"
    if source_trust == "official":
        source_trust_pts = 5
        reasons.append("Verified official host portal")
    elif source_trust == "recognized":
        source_trust_pts = 4

    total_score = min(100, max(20, (
        profile_match +
        current_skill_match +
        skill_gap_alignment +
        career_alignment +
        eligibility_match +
        freshness_pts +
        deadline_pts +
        source_trust_pts
    )))

    breakdown = MatchScoreBreakdown(
        score=total_score,
        profile_match=profile_match,
        current_skill_match=current_skill_match,
        skill_gap_alignment=skill_gap_alignment,
        career_alignment=career_alignment,
        eligibility_match=eligibility_match,
        freshness=freshness_pts,
        deadline_urgency=deadline_pts,
        source_trust=source_trust_pts,
        reasons=reasons
    )

    return total_score, breakdown, reasons
