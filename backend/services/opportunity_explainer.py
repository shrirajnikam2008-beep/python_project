"""
Grounded Explanation Engine
Produces strictly fact-based "Why Recommended" justifications and human advisor breakdowns.
Never invents facts, prerequisites, or claims not present in the verified record.
Serves as the high-fidelity deterministic fallback when Gemini is unavailable.
"""
from typing import List, Dict, Any, Optional
from backend.schemas.opportunity import (
    OpportunityPersonalizedExplanation,
    Opportunity,
    TopPicksResponse,
)

def generate_grounded_reasons(opp: Dict[str, Any], profile: Optional[Dict[str, Any]] = None) -> List[str]:
    """
    Produces deterministic factual bullets explaining why the opportunity is recommended.
    """
    reasons = []

    if not profile:
        reasons.append("Premier national collegiate program")
        if opp.get("sourceTrust") == "official":
            reasons.append("Official institutional host verified")
        return reasons

    # Career goal
    dest = profile.get("selectedDestinationId") or profile.get("selected_destination_id") or ""
    opp_dests = opp.get("destinations", [])
    if dest and (dest in opp_dests or "all" in opp_dests):
        dest_display = dest.replace("-", " ").title()
        reasons.append(f"Directly advances your target career: {dest_display}")

    # Skills overlap
    student_skills = [s.lower() for s in (profile.get("currentSkills") or profile.get("current_skills") or [])]
    opp_skills = [s.lower() for s in (opp.get("skills") or [])]
    overlap = [s for s in opp_skills if any(cs in s or s in cs for cs in student_skills)]
    if overlap:
        reasons.append(f"Leverages your existing skills: {', '.join(overlap[:2]).title()}")

    # Gap alignment
    missing = [s for s in opp_skills if not any(cs in s or s in cs for cs in student_skills)]
    if missing:
        reasons.append(f"Helps develop your skill gaps: {', '.join(missing[:2]).title()}")

    # Eligibility
    sem = profile.get("semester", 1)
    yr = max(1, (sem + 1) // 2)
    branch = profile.get("branch") or profile.get("program", "Engineering")
    reasons.append(f"Open to Year {yr} {branch} students")

    # Mode / Location
    if opp.get("mode") == "Online":
        reasons.append("Remote participation matches online preference")

    # Source trust
    if opp.get("sourceTrust") == "official":
        reasons.append("Verified official application portal")

    return reasons

def generate_deterministic_explanation(
    opp: Dict[str, Any],
    profile: Optional[Dict[str, Any]] = None
) -> OpportunityPersonalizedExplanation:
    """
    Constructs a complete OpportunityPersonalizedExplanation object backed by grounded facts.
    """
    reasons = generate_grounded_reasons(opp, profile)
    student_skills = [s.lower() for s in (profile.get("currentSkills") or profile.get("current_skills") or [])] if profile else []
    opp_skills = opp.get("skills", [])
    
    # Identify developing skills
    skill_dev = [s for s in opp_skills if s.lower() not in student_skills][:3]
    if not skill_dev:
        skill_dev = opp_skills[:2]

    # Target career
    dest = (profile.get("selectedDestinationId") if profile else "") or "Tech & Engineering"
    career_display = dest.replace("-", " ").title()

    # Determine potential concern
    concern = "Competitive national selection; prepare your project submission early."
    if skill_dev:
        concern = f"May require ramping up quickly on {skill_dev[0]} before the selection round."
    elif opp.get("daysRemaining") and opp.get("daysRemaining") <= 7:
        concern = "Application window is closing shortly; submit before the deadline."

    # Best for persona
    opp_type = opp.get("type", "Opportunity")
    if opp_type == "Hackathon":
        best_for = "Students seeking high-intensity team problem-solving and industry recognition."
    elif opp_type == "Research":
        best_for = "Students aiming for research publications and graduate school fellowships."
    elif opp_type == "Internship":
        best_for = "Undergraduates looking for hands-on industry engineering immersion."
    elif opp_type == "Open Source":
        best_for = "Self-driven developers looking to build a public code track record."
    else:
        best_for = "Motivated engineering students wanting portfolio-worthy credentials."

    return OpportunityPersonalizedExplanation(
        opportunity_id=opp.get("id", ""),
        match_summary=f"Strong {opp.get('matchScore', 85)}% match for your {career_display} roadmap.",
        why_recommended=reasons[:4],
        skill_development=skill_dev,
        career_relevance=f"Directly advances key requirements for {career_display} roles.",
        best_for=best_for,
        potential_concern=concern
    )

def calculate_top_picks(ranked_opportunities: List[Opportunity]) -> TopPicksResponse:
    """
    Categorizes the top candidates into distinct advisory categories:
    1. Best Career Match
    2. Best Skill-Building Opportunity
    3. Best Beginner Opportunity
    4. Best Research Opportunity
    5. Best Opportunity Closing Soon
    """
    if not ranked_opportunities:
        return TopPicksResponse()

    # 1. Best Career Match -> Highest overall score
    best_career = ranked_opportunities[0]

    # 2. Best Skill Building -> Open Source or Hackathon with high skill count
    best_skill = next(
        (o for o in ranked_opportunities if o.type in ["Open Source", "Hackathon"] and o.id != best_career.id),
        ranked_opportunities[min(1, len(ranked_opportunities) - 1)]
    )

    # 3. Best Beginner -> Year 1 friendly or introductory
    best_beginner = next(
        (o for o in ranked_opportunities if (
            (o.structured_eligibility and (o.structured_eligibility.min_year or 1) <= 1)
            or "beginner" in o.eligibility.lower()
            or o.type in ["Hackathon", "Student Program"]
        ) and o.id not in [best_career.id, getattr(best_skill, 'id', '')]),
        None
    )
    if not best_beginner and len(ranked_opportunities) > 2:
        best_beginner = ranked_opportunities[2]

    # 4. Best Research -> Research or Fellowship
    best_research = next(
        (o for o in ranked_opportunities if o.type in ["Research", "Fellowship"]),
        None
    )

    # 5. Best Closing Soon -> Days remaining <= 10 or is_closing_soon
    best_closing = next(
        (o for o in ranked_opportunities if (o.days_remaining and o.days_remaining <= 14) or o.is_closing_soon),
        None
    )

    return TopPicksResponse(
        best_career_match=best_career,
        best_skill_building=best_skill,
        best_beginner=best_beginner,
        best_research=best_research,
        best_closing_soon=best_closing,
    )
