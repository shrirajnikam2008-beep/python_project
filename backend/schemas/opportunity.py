"""
Pydantic schemas for Opportunities matching frontend/lib/types.ts
Supports strict serialization with camelCase alias generation for seamless Next.js frontend consumption.
"""
from typing import Optional, Literal, List
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

OpportunityType = Literal[
    "Hackathon",
    "Internship",
    "Research",
    "Incubator",
    "Competition",
    "Fellowship",
    "Scholarship",
    "Open Source",
    "Student Program"
]

SourceTrustLevel = Literal["official", "recognized", "third_party"]
VerificationStatus = Literal["verified", "stale", "unverified", "expired", "mock_demo"]
FreshnessCategory = Literal["NEW", "RECENT", "CLOSING_SOON", "EXPIRED", "UNVERIFIED"]
RetrievalMethod = Literal["official_api", "rss_atom", "public_structured", "manual_curated"]

class StructuredEligibility(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    min_year: Optional[int] = None
    max_year: Optional[int] = None
    eligible_branches: Optional[List[str]] = Field(default_factory=list)
    cgpa_requirement: Optional[float] = None
    nationality: Optional[str] = None
    other_requirements: Optional[str] = None

class MatchScoreBreakdown(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    score: int = 0
    profile_match: int = 0          # max 25
    current_skill_match: int = 0    # max 10
    skill_gap_alignment: int = 0    # max 10
    career_alignment: int = 0       # max 20
    eligibility_match: int = 0      # max 15
    freshness: int = 0              # max 10
    deadline_urgency: int = 0       # max 5
    source_trust: int = 0           # max 5
    reasons: List[str] = Field(default_factory=list)

class OpportunitySource(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    name: str
    domain: str
    source_type: Literal["Government", "University", "Corporate", "Foundation", "Platform", "Manual"]
    trust_level: SourceTrustLevel
    retrieval_method: RetrievalMethod
    verified_url: str
    enabled: bool = True
    last_checked: Optional[str] = None

class OpportunityPersonalizedExplanation(BaseModel):
    """
    Grounded human-like personalized explanation produced by Gemini or deterministic fallback.
    Every statement is backed by profile and verified opportunity metadata.
    """
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    opportunity_id: str
    match_summary: str
    why_recommended: List[str] = Field(default_factory=list)
    skill_development: List[str] = Field(default_factory=list)
    career_relevance: str
    best_for: str
    potential_concern: Optional[str] = None

class Opportunity(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    title: str
    organization: str
    type: OpportunityType
    description: str
    deadline: str
    stipend_or_prize: Optional[str] = None
    location: str
    eligibility: str
    url: str
    mode: Literal["Online", "In-person", "Hybrid"]
    destinations: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    featured: Optional[bool] = False
    trending_score: Optional[int] = 85
    daily_badge: Optional[str] = None
    applicants_today: Optional[int] = None
    days_remaining: Optional[int] = None
    is_new_today: Optional[bool] = False
    is_trending: Optional[bool] = False
    is_closing_soon: Optional[bool] = False
    posted_at: Optional[str] = None

    # Opportunity Intelligence Extensions
    skills: List[str] = Field(default_factory=list)
    domains: List[str] = Field(default_factory=list)
    structured_eligibility: Optional[StructuredEligibility] = None
    source_url: Optional[str] = None
    official_url: Optional[str] = None
    source_name: Optional[str] = None
    source_type: Optional[str] = None
    source_trust: Optional[SourceTrustLevel] = "official"
    retrieval_method: Optional[RetrievalMethod] = "manual_curated"
    last_verified: Optional[str] = None
    verification_status: Optional[VerificationStatus] = "verified"
    freshness: Optional[FreshnessCategory] = "RECENT"
    posted_date: Optional[str] = None
    funding: Optional[str] = None
    match_score: Optional[int] = None
    match_breakdown: Optional[MatchScoreBreakdown] = None
    match_reasons: Optional[List[str]] = Field(default_factory=list)
    eligibility_status: Optional[Literal["eligible", "partially_eligible", "not_eligible"]] = "eligible"
    is_mock: Optional[bool] = False

    # Gemini Personalization Extensions
    personalized_explanation: Optional[OpportunityPersonalizedExplanation] = None
    ai_personalized: Optional[bool] = False

class OpportunitySearchCriteria(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    query: Optional[str] = None
    domains: Optional[List[str]] = None
    types: Optional[List[str]] = None
    target_year: Optional[int] = None
    branch: Optional[str] = None
    location_scope: Optional[List[str]] = None
    mode: Optional[List[str]] = None
    min_match_score: Optional[int] = None
    sort_by: Optional[str] = "best_match"

class OpportunityAIIntent(BaseModel):
    """
    Structured Pydantic model for Gemini Intent & Preference Understanding.
    Gemini outputs ONLY this schema.
    """
    query: str
    opportunity_types: List[str] = Field(default_factory=list)
    domains: List[str] = Field(default_factory=list)
    career_intents: List[str] = Field(default_factory=list)
    target_year: Optional[int] = None
    target_semester: Optional[int] = None
    location_preferences: List[str] = Field(default_factory=list)
    remote_preference: Optional[str] = None  # "required", "preferred", "no_preference", "in_person"
    skill_priorities: List[str] = Field(default_factory=list)
    skill_gap_priorities: List[str] = Field(default_factory=list)
    experience_level: Optional[str] = None   # "beginner", "intermediate", "advanced"
    research_preference: Optional[str] = None  # "high", "medium", "low", "none"
    company_preference: Optional[str] = None
    organization_preferences: List[str] = Field(default_factory=list)
    deadline_preference: Optional[str] = None  # "closing_soon", "rolling", "any"
    learning_goal: Optional[str] = None
    career_goal: Optional[str] = None
    keywords: List[str] = Field(default_factory=list)
    exclude_keywords: List[str] = Field(default_factory=list)
    sort_preference: Optional[str] = "best_match"

class TopPicksResponse(BaseModel):
    """
    Top personalized picks above normal opportunity catalog.
    """
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    best_career_match: Optional[Opportunity] = None
    best_skill_building: Optional[Opportunity] = None
    best_beginner: Optional[Opportunity] = None
    best_research: Optional[Opportunity] = None
    best_closing_soon: Optional[Opportunity] = None

class OpportunitySearchRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    query: str
    student_profile: Optional[dict] = None
    criteria: Optional[OpportunitySearchCriteria] = None
    limit: Optional[int] = 50

class OpportunitySearchResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    mode: Literal["gemini", "deterministic_fallback"] = "deterministic_fallback"
    query: str
    parsed_criteria: Optional[OpportunitySearchCriteria] = None
    total: int
    items: List[Opportunity]
    opportunities: Optional[List[Opportunity]] = None  # alias for backwards compatibility
    personalized_summary: Optional[str] = None
    recommendations: Optional[List[OpportunityPersonalizedExplanation]] = None
    top_picks: Optional[TopPicksResponse] = None
    fallback_used: bool = False
