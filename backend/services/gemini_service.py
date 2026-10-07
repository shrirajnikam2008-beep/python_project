"""
Gemini Personalization Service
Uses the official Google GenAI Python SDK (`google-genai`).
Acts strictly as an intent interpreter and grounded factual explainer.
NEVER invents opportunities, URLs, organizations, deadlines, or eligibility criteria.
If the API key is missing or calls fail, provides seamless graceful fallback to deterministic services.
"""
import os
import json
import logging
from typing import Optional, Dict, Any, List, Tuple
from google import genai
from google.genai import types

from backend.core.config import settings
from backend.schemas.opportunity import (
    OpportunityAIIntent,
    OpportunityPersonalizedExplanation,
)

logger = logging.getLogger("waypoint.gemini")

# Simple in-memory cache to avoid duplicate calls for identical queries
_intent_cache: Dict[str, OpportunityAIIntent] = {}
_explanation_cache: Dict[str, Tuple[List[OpportunityPersonalizedExplanation], Optional[str]]] = {}

def get_gemini_client() -> Optional[genai.Client]:
    """
    Initializes Google GenAI client if GEMINI_API_KEY is available.
    Returns None if missing.
    """
    api_key = settings.gemini_api_key or os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        return None
    try:
        return genai.Client(api_key=api_key)
    except Exception as e:
        logger.warning(f"Failed to initialize Google GenAI Client: {e}")
        return None

def get_gemini_model_name() -> str:
    """
    Returns configurable Gemini model name, defaulting to gemini-2.5-flash.
    """
    return settings.gemini_model or os.getenv("GEMINI_MODEL", "gemini-flash-latest").strip()

def parse_intent_with_gemini(
    query: str,
    student_profile: Optional[Dict[str, Any]] = None
) -> Tuple[Optional[OpportunityAIIntent], bool]:
    """
    Translates a natural language query + student profile into a structured OpportunityAIIntent.
    Returns (OpportunityAIIntent, is_gemini_used).
    If Gemini fails or is not configured, returns (None, False).
    """
    cache_key = f"{query.strip().lower()}:{student_profile.get('program', '') if student_profile else ''}"
    if cache_key in _intent_cache:
        return _intent_cache[cache_key], True

    client = get_gemini_client()
    if not client:
        return None, False

    model_name = get_gemini_model_name()

    profile_context = ""
    if student_profile:
        profile_context = f"""
Student Profile Context:
- Program/Branch: {student_profile.get('branch', student_profile.get('program', 'Engineering'))}
- Semester: {student_profile.get('semester', 1)}
- CGPA: {student_profile.get('cgpa', 8.0)}
- Current Skills: {', '.join(student_profile.get('currentSkills', []))}
- Target Career Destination: {student_profile.get('selectedDestinationId', 'Not specified')}
"""

    prompt = f"""You are an expert AI Career Advisor for university engineering students.
Your job is to interpret the student's query and extract their search intent into the structured schema OpportunityAIIntent.

ABSOLUTE RULES:
1. Do NOT invent opportunities, companies, URLs, or deadlines.
2. Only interpret the student's stated or implied intent, desired domains, opportunity types, target academic year, mode preference, and goals.
3. If the user mentions "first year" or "1st year", set target_year=1.
4. If the user mentions "weak in DSA" or "improve my ML skills", add those to skill_gap_priorities or learning_goal.
5. If the user mentions "remote" or "online", set remote_preference="required" or "preferred".

User Query: "{query}"
{profile_context}
"""

    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=OpportunityAIIntent,
                temperature=0.1,
            ),
        )
        if response and response.text:
            intent_data = json.loads(response.text)
            intent = OpportunityAIIntent(**intent_data)
            _intent_cache[cache_key] = intent
            return intent, True
    except Exception as e:
        logger.warning(f"Gemini intent parsing failed, falling back to deterministic parser: {e}")
        return None, False

    return None, False

def generate_grounded_explanations_with_gemini(
    student_profile: Dict[str, Any],
    intent: Optional[OpportunityAIIntent],
    candidates: List[Dict[str, Any]]
) -> Tuple[List[OpportunityPersonalizedExplanation], Optional[str], bool]:
    """
    Calls Gemini to generate grounded personalized explanations for candidate opportunities.
    Returns (explanations, personalized_summary, is_gemini_used).
    If Gemini is unavailable or fails, returns ([], None, False).
    """
    if not candidates:
        return [], None, False

    client = get_gemini_client()
    if not client:
        return [], None, False

    model_name = get_gemini_model_name()

    # Prepare compact candidate records with deterministic scores
    compact_candidates = []
    for opp in candidates[:5]:
        compact_candidates.append({
            "opportunity_id": opp.get("id"),
            "title": opp.get("title"),
            "organization": opp.get("organization"),
            "type": opp.get("type"),
            "mode": opp.get("mode"),
            "deadline": opp.get("deadline"),
            "eligibility": opp.get("eligibility"),
            "skills": opp.get("skills", []),
            "domains": opp.get("domains", []),
            "match_score": opp.get("matchScore", 80),
            "source_trust": opp.get("sourceTrust", "official"),
            "match_reasons": opp.get("matchReasons", [])
        })

    compact_profile = {
        "branch": student_profile.get("branch", student_profile.get("program", "Engineering")),
        "semester": student_profile.get("semester", 1),
        "year": max(1, (student_profile.get("semester", 1) + 1) // 2),
        "cgpa": student_profile.get("cgpa", 8.0),
        "current_skills": student_profile.get("currentSkills", []),
        "target_career": student_profile.get("selectedDestinationId", "ai-ml-engineer"),
    }

    prompt = f"""You are a grounded career advisor at Waypoint.
Generate personalized, human explanations for the following verified opportunities for this student.

CRITICAL INSTRUCTIONS:
1. Every claim must be grounded in the provided profile and opportunity metadata.
2. DO NOT invent new opportunities, change organizations, alter deadlines, or make up eligibility criteria.
3. Address the student directly with helpful, constructive career advice.
4. Highlight why this opportunity is strong for them, which specific skills it develops, and provide an honest potential concern (e.g. competitive selection, high workload, prerequisite mastery required).
5. If something is unknown, state 'Not specified'.

Student Profile:
{json.dumps(compact_profile, indent=2)}

User Intent:
{intent.model_dump_json(indent=2) if intent else "General recommendations"}

Candidate Opportunities:
{json.dumps(compact_candidates, indent=2)}

Output a JSON array of OpportunityPersonalizedExplanation objects with:
- opportunityId: exact opportunity_id from input
- matchSummary: 1-sentence advisor summary
- whyRecommended: list of 3-4 concise grounded reasons
- skillDevelopment: skills gained that help student's career
- careerRelevance: relevance to target career
- bestFor: concise target profile recommendation
- potentialConcern: honest practical caveat or prerequisite warning
"""

    try:
        class ExplanationListWrapper(types.BaseModel if hasattr(types, 'BaseModel') else types.GenerateContentConfig):
            pass

        # Use JSON schema response
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            ),
        )

        if response and response.text:
            raw_json = json.loads(response.text)
            items_raw = raw_json if isinstance(raw_json, list) else raw_json.get("items", raw_json.get("explanations", []))
            explanations = []
            for item in items_raw:
                # ensure camelCase or snake_case conversion
                opp_id = item.get("opportunityId") or item.get("opportunity_id")
                if opp_id:
                    explanations.append(OpportunityPersonalizedExplanation(
                        opportunity_id=opp_id,
                        match_summary=item.get("matchSummary") or item.get("match_summary", "Strong match for your profile."),
                        why_recommended=item.get("whyRecommended") or item.get("why_recommended", []),
                        skill_development=item.get("skillDevelopment") or item.get("skill_development", []),
                        career_relevance=item.get("careerRelevance") or item.get("career_relevance", "Directly aligns with your career path."),
                        best_for=item.get("bestFor") or item.get("best_for", "Students in your branch."),
                        potential_concern=item.get("potentialConcern") or item.get("potential_concern", "Review prerequisites before applying.")
                    ))

            career_name = compact_profile.get("target_career", "Engineering").replace("-", " ").title()
            summary = f"Selected top opportunities aligned with your {career_name} roadmap, tailored to your semester standing and skill profile."

            return explanations, summary, True
    except Exception as e:
        logger.warning(f"Gemini explanation generation failed, falling back to deterministic explainer: {e}")
        return [], None, False

    return [], None, False
