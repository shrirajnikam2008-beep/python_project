"""
Opportunity Source Registry & Trust System
Maintains canonical definitions of trusted sources, their domain signatures,
trust tiers, and verified retrieval mechanisms.

Strict Constraint:
Never invent endpoints or assume unpermitted scraping access.
If a source lacks a documented, permitted automated retrieval mechanism,
it is explicitly designated as `manual_curated` and excluded from automated crawlers.
"""
from typing import List, Optional
from backend.schemas.opportunity import OpportunitySource

VERIFIED_SOURCES: List[OpportunitySource] = [
  OpportunitySource(
    id="src_aicte_sih",
    name="Smart India Hackathon Official Portal",
    domain="sih.gov.in",
    source_type="Government",
    trust_level="official",
    retrieval_method="manual_curated",
    verified_url="https://www.sih.gov.in",
    enabled=True,
    last_checked="2026-10-06"
  ),
  OpportunitySource(
    id="src_kavach",
    name="MHA Innovation Cell Official Portal",
    domain="kavach.mic.gov.in",
    source_type="Government",
    trust_level="official",
    retrieval_method="manual_curated",
    verified_url="https://kavach.mic.gov.in",
    enabled=True,
    last_checked="2026-10-06"
  ),
  OpportunitySource(
    id="src_google_gsoc",
    name="Google Summer of Code Portal",
    domain="summerofcode.withgoogle.com",
    source_type="Corporate",
    trust_level="official",
    retrieval_method="manual_curated",
    verified_url="https://summerofcode.withgoogle.com",
    enabled=True,
    last_checked="2026-10-06"
  ),
  OpportunitySource(
    id="src_amazon_science",
    name="Amazon Science University Relations",
    domain="amazon.science",
    source_type="Corporate",
    trust_level="official",
    retrieval_method="manual_curated",
    verified_url="https://www.amazon.science",
    enabled=True,
    last_checked="2026-10-06"
  ),
  OpportunitySource(
    id="src_pmrf",
    name="Prime Minister Research Fellowship Portal",
    domain="pmrf.in",
    source_type="Government",
    trust_level="official",
    retrieval_method="manual_curated",
    verified_url="https://www.pmrf.in",
    enabled=True,
    last_checked="2026-10-06"
  ),
  OpportunitySource(
    id="src_iasc_fellow",
    name="Indian Academy of Sciences SRFP",
    domain="web-japps.ias.ac.in",
    source_type="University",
    trust_level="official",
    retrieval_method="manual_curated",
    verified_url="https://web-japps.ias.ac.in/fellowship2024/",
    enabled=True,
    last_checked="2026-10-06"
  ),
  OpportunitySource(
    id="src_daad_wise",
    name="DAAD Germany WISE Official Portal",
    domain="daad.in",
    source_type="University",
    trust_level="official",
    retrieval_method="manual_curated",
    verified_url="https://www.daad.in",
    enabled=True,
    last_checked="2026-10-06"
  ),
  OpportunitySource(
    id="src_devfolio",
    name="Devfolio Developer Platform",
    domain="devfolio.co",
    source_type="Platform",
    trust_level="recognized",
    retrieval_method="manual_curated",
    verified_url="https://devfolio.co",
    enabled=True,
    last_checked="2026-10-06"
  ),
  OpportunitySource(
    id="src_idex_gov",
    name="iDEX Defence Innovation Portal",
    domain="idex.gov.in",
    source_type="Government",
    trust_level="official",
    retrieval_method="manual_curated",
    verified_url="https://idex.gov.in",
    enabled=True,
    last_checked="2026-10-06"
  ),
]

def list_sources() -> List[OpportunitySource]:
    return [s for s in VERIFIED_SOURCES if s.enabled]

def get_source_by_id(source_id: str) -> Optional[OpportunitySource]:
    for s in VERIFIED_SOURCES:
        if s.id == source_id:
            return s
    return None

def get_source_by_domain(domain: str) -> Optional[OpportunitySource]:
    domain = domain.lower()
    for s in VERIFIED_SOURCES:
        if s.domain in domain or domain in s.domain:
            return s
    return None
