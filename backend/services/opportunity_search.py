"""
Opportunity Search & AI Intent Translation Service
Orchestrates:
1. Gemini Intent Understanding (with deterministic rule-based fallback)
2. Hard Eligibility Filtering
3. Deterministic 100-Point Ranking
4. Gemini Grounded Explanations (with deterministic explainer fallback)
5. Top Picks Advisory Categorization
"""
import re
from typing import Dict, Any, List, Optional
from backend.schemas.opportunity import (
    OpportunitySearchCriteria,
    OpportunitySearchResponse,
    OpportunityAIIntent,
    Opportunity,
    OpportunityPersonalizedExplanation,
)
from backend.services.opportunity_ranker import calculate_match_score
from backend.services.opportunity_verifier import verify_opportunity
from backend.services.gemini_service import (
    parse_intent_with_gemini,
    generate_grounded_explanations_with_gemini,
)
from backend.services.opportunity_explainer import (
    generate_deterministic_explanation,
    calculate_top_picks,
)

def parse_search_intent_deterministic(query: str, profile: Optional[Dict[str, Any]] = None) -> OpportunityAIIntent:
    """
    Deterministic fallback parser when Gemini is unavailable.
    Accurately extracts structured intent, types, domains, year, and mode.
    """
    q = query.lower().strip()
    
    types = []
    if any(k in q for k in ["hackathon", "contest", "challenge"]):
        types.append("Hackathon")
    if any(k in q for k in ["intern", "apprenticeship", "summer school"]):
        types.append("Internship")
    if any(k in q for k in ["research", "fellowship", "phd", "paper", "lab", "pmrf"]):
        types.append("Research")
        types.append("Fellowship")
    if any(k in q for k in ["incubator", "startup", "grant", "seed", "nidhi"]):
        types.append("Incubator")
    if any(k in q for k in ["open source", "gsoc", "github"]):
        types.append("Open Source")
    if any(k in q for k in ["scholarship", "financial aid", "grant"]):
        types.append("Scholarship")
    if any(k in q for k in ["student program", "campus ambassador", "mentorship"]):
        types.append("Student Program")

    domains = []
    if any(k in q for k in ["ai", "ml", "machine learning", "deep learning", "neural", "artificial intelligence"]):
        domains.extend(["Artificial Intelligence", "Machine Learning"])
    if any(k in q for k in ["cyber", "security", "forensic", "crypto"]):
        domains.append("Cybersecurity")
    if any(k in q for k in ["cloud", "devops", "aws", "docker", "kubernetes"]):
        domains.append("Cloud Computing")
    if any(k in q for k in ["software", "web", "full stack", "frontend", "backend"]):
        domains.append("Software Engineering")
    if any(k in q for k in ["data", "statistics", "analytics"]):
        domains.append("Data Science")
    if any(k in q for k in ["quantum", "quantum computing"]):
        domains.append("Quantum Computing")

    target_year = None
    if any(k in q for k in ["1st year", "first year", "freshman", "1st-year"]):
        target_year = 1
    elif any(k in q for k in ["2nd year", "second year", "sophomore", "2nd-year"]):
        target_year = 2
    elif any(k in q for k in ["3rd year", "third year", "pre-final", "3rd-year"]):
        target_year = 3
    elif any(k in q for k in ["4th year", "final year", "4th-year"]):
        target_year = 4
    elif profile and profile.get("semester"):
        target_year = max(1, (profile["semester"] + 1) // 2)

    remote_pref = None
    if any(k in q for k in ["remote", "online", "virtual", "wfh"]):
        remote_pref = "required"

    # Skill priorities & gaps
    skills = []
    if "python" in q:
        skills.append("Python")
    if "c++" in q or "cpp" in q:
        skills.append("C++")

    skill_gaps = []
    if "dsa" in q or "data structures" in q:
        skill_gaps.append("Data Structures")
    if "ml" in q or "machine learning" in q:
        skill_gaps.append("Machine Learning")

    experience = None
    if any(k in q for k in ["beginner", "no experience", "start", "starting", "freshman"]):
        experience = "beginner"

    return OpportunityAIIntent(
        query=query,
        opportunity_types=list(set(types)),
        domains=list(set(domains)),
        career_intents=["AI Research"] if "research" in q and "ai" in q else [],
        target_year=target_year,
        remote_preference=remote_pref,
        skill_priorities=skills,
        skill_gap_priorities=skill_gaps,
        experience_level=experience,
        sort_preference="best_match"
    )

def _normalize_opportunity_types(raw_types: List[str]) -> List[str]:
    normalized = set()
    for t in raw_types:
        t_clean = t.lower().replace("-", " ").replace("_", " ").strip()
        if "hackathon" in t_clean or "contest" in t_clean or "challenge" in t_clean:
            normalized.add("Hackathon")
        if "intern" in t_clean or "apprentice" in t_clean or "summer school" in t_clean:
            normalized.add("Internship")
        if "research" in t_clean or "lab" in t_clean or "paper" in t_clean:
            normalized.add("Research")
        if "fellow" in t_clean:
            normalized.add("Fellowship")
        if "scholar" in t_clean:
            normalized.add("Scholarship")
        if "open source" in t_clean or "gsoc" in t_clean:
            normalized.add("Open Source")
        if "incubator" in t_clean or "startup" in t_clean:
            normalized.add("Incubator")
        if "competition" in t_clean:
            normalized.add("Competition")
        if "student program" in t_clean or "ambassador" in t_clean:
            normalized.add("Student Program")
    return list(normalized) if normalized else raw_types

parse_search_intent = parse_search_intent_deterministic

def search_verified_opportunities(
    query: str,
    all_opps: List[Dict[str, Any]],
    profile: Optional[Dict[str, Any]] = None,
    criteria_override: Optional[OpportunitySearchCriteria] = None
) -> OpportunitySearchResponse:
    """
    Complete Search & Personalization Pipeline:
    1. Gemini Intent Understanding (or deterministic fallback)
    2. Convert to Hard Filters
    3. Filter Candidates Deterministically
    4. Deterministic 100-Point Ranking
    5. Grounded Explanations (Gemini or deterministic fallback)
    6. Top Picks Advisory Categorization
    """
    q_trimmed = query.strip()
    profile_dict = profile or {}

    # Step 1: Intent Understanding
    intent: Optional[OpportunityAIIntent] = None
    mode: str = "deterministic_fallback"

    if q_trimmed:
        gemini_intent, gemini_ok = parse_intent_with_gemini(q_trimmed, profile_dict)
        if gemini_ok and gemini_intent:
            intent = gemini_intent
            mode = "gemini"
        else:
            intent = parse_search_intent_deterministic(q_trimmed, profile_dict)
            mode = "deterministic_fallback"
    else:
        intent = parse_search_intent_deterministic("", profile_dict)
        mode = "deterministic_fallback"

    # Step 2: Convert to Structured Criteria
    norm_types = _normalize_opportunity_types(intent.opportunity_types) if intent and intent.opportunity_types else None
    criteria = OpportunitySearchCriteria(
        query=query,
        domains=intent.domains if intent and intent.domains else None,
        types=norm_types,
        target_year=intent.target_year,
        mode=["Online"] if intent and intent.remote_preference in ["required", "preferred"] else None,
        sort_by="best_match"
    )

    q_lower = q_trimmed.lower()

    # Step 3: Hard Eligibility Filtering
    filtered: List[Dict[str, Any]] = []
    for raw_opp in all_opps:
        verified_meta = verify_opportunity(raw_opp)
        opp = {**raw_opp, **verified_meta}

        # Rule 1: Exclude expired
        if opp.get("verificationStatus") == "expired":
            continue

        # Rule 2: Hard Type Filtering (e.g. if user asked for "AI internships", exclude non-internships)
        if criteria.types:
            req_types = [t.lower() for t in criteria.types]
            opp_type = opp.get("type", "").lower()
            if not any(rt in opp_type or opp_type in rt for rt in req_types):
                # Only exclude if user explicitly requested a specific type
                continue

        # Rule 3: Hard Year Eligibility Filtering
        if criteria.target_year is not None:
            struct_elig = opp.get("structuredEligibility") or opp.get("structured_eligibility") or {}
            min_yr = struct_elig.get("minYear") or struct_elig.get("min_year")
            if min_yr and criteria.target_year < min_yr:
                continue

        # Rule 4: Hard Remote Filtering
        if intent and intent.remote_preference == "required":
            if opp.get("mode") not in ["Online", "Hybrid"]:
                continue

        # Rule 5: Relevance matching
        # Check text match or domain match or keyword match
        text_match = (
            q_lower in opp.get("title", "").lower()
            or q_lower in opp.get("organization", "").lower()
            or q_lower in opp.get("description", "").lower()
            or any(q_lower in t.lower() for t in opp.get("tags", []))
            or not q_lower
        )
        domain_match = False
        if criteria.domains:
            opp_domains = [d.lower() for d in opp.get("domains", [])]
            if any(cd.lower() in opp_domains for cd in criteria.domains):
                domain_match = True

        keyword_match = False
        if intent and intent.keywords:
            if any(k.lower() in opp.get("title", "").lower() or k.lower() in opp.get("description", "").lower() for k in intent.keywords):
                keyword_match = True

        # Special query handling (e.g. "quantum computing")
        if "quantum" in q_lower:
            if not ("quantum" in opp.get("title", "").lower() or "quantum" in opp.get("description", "").lower()):
                continue

        if text_match or domain_match or keyword_match or not q_lower:
            filtered.append(opp)

    # If strict filtering produced zero matches (e.g. very narrow combined filters),
    # gracefully fall back to domain/career match without crashing
    if not filtered and all_opps:
        for raw_opp in all_opps:
            verified_meta = verify_opportunity(raw_opp)
            opp = {**raw_opp, **verified_meta}
            if opp.get("verificationStatus") != "expired":
                filtered.append(opp)

    # Step 4: Deterministic 100-Point Ranking
    for opp in filtered:
        score, breakdown, reasons = calculate_match_score(opp, profile_dict)
        opp["matchScore"] = score
        opp["matchBreakdown"] = breakdown.model_dump(by_alias=True)
        opp["matchReasons"] = reasons

    # Sort deterministically
    filtered.sort(key=lambda x: x.get("matchScore", 0), reverse=True)

    # Step 5: Grounded Explanations Generation
    explanations: List[OpportunityPersonalizedExplanation] = []
    personalized_summary: Optional[str] = None
    gemini_explained = False

    if mode == "gemini" and filtered:
        gemini_exps, summary_text, exp_ok = generate_grounded_explanations_with_gemini(
            student_profile=profile_dict,
            intent=intent,
            candidates=filtered[:5]
        )
        if exp_ok and gemini_exps:
            explanations = gemini_exps
            personalized_summary = summary_text
            gemini_explained = True

    # If Gemini explainer was not used, use deterministic explainer
    if not gemini_explained:
        explanations = [
            generate_deterministic_explanation(opp, profile_dict)
            for opp in filtered[:5]
        ]
        target_name = (profile_dict.get("selectedDestinationId") or "Engineering").replace("-", " ").title()
        personalized_summary = f"Personalized recommendations based on your {target_name} roadmap and verified eligibility."

    # Map explanations back to candidate objects
    exp_map = {e.opportunity_id: e for e in explanations}
    items: List[Opportunity] = []
    for opp in filtered:
        exp = exp_map.get(opp.get("id"))
        if exp:
            opp["personalizedExplanation"] = exp.model_dump(by_alias=True)
            opp["aiPersonalized"] = gemini_explained
        items.append(Opportunity(**opp))

    # Step 6: Top Picks Advisory Selection
    top_picks = calculate_top_picks(items)

    return OpportunitySearchResponse(
        mode="gemini" if gemini_explained or mode == "gemini" else "deterministic_fallback",
        query=query,
        parsed_criteria=criteria,
        total=len(items),
        items=items,
        opportunities=items,
        personalized_summary=personalized_summary,
        recommendations=explanations,
        top_picks=top_picks,
        fallback_used=(mode == "deterministic_fallback")
    )
