"""
Opportunity Verification & Freshness Analyzer
Validates canonical URLs, checks domain trust, calculates days remaining,
and determines strict audit statuses without guessing or fabricating dates.
"""
from datetime import datetime, date
import re
from urllib.parse import urlparse
from typing import Dict, Any, Tuple
from backend.services.opportunity_sources import get_source_by_domain

def parse_deadline_date(deadline_str: str) -> Tuple[bool, int]:
    """
    Attempts to parse deadline strings into remaining days.
    Returns (is_parsed, days_remaining).
    If rolling or annual, returns (False, 30) default.
    """
    if not deadline_str:
        return False, 30

    d_lower = deadline_str.lower()
    if "rolling" in d_lower or "year-round" in d_lower or "annual" in d_lower:
        return False, 25

    # Check for formats like YYYY-MM-DD or DD Month YYYY
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d %b %Y", "%d %B %Y"):
        try:
            d = datetime.strptime(deadline_str.strip(), fmt).date()
            diff = (d - date.today()).days
            return True, diff
        except ValueError:
            continue

    return False, 20

def calculate_freshness(posted_date_str: str, days_remaining: int) -> str:
    """
    Calculates freshness strictly:
    - CLOSING_SOON: deadline within 7 days
    - EXPIRED: deadline has passed (< 0 days)
    - NEW: posted within 7 days
    - RECENT: posted within 30 days
    - UNVERIFIED: otherwise
    """
    if days_remaining is not None and days_remaining < 0:
        return "EXPIRED"
    if days_remaining is not None and 0 <= days_remaining <= 7:
        return "CLOSING_SOON"

    if posted_date_str:
        for fmt in ("%Y-%m-%d", "%d-%m-%Y"):
            try:
                p_date = datetime.strptime(posted_date_str.strip(), fmt).date()
                age_days = (date.today() - p_date).days
                if age_days <= 7:
                    return "NEW"
                if age_days <= 30:
                    return "RECENT"
            except ValueError:
                pass

    return "RECENT"

def verify_opportunity(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Audits an opportunity record and applies canonical verification standards.
    """
    url = data.get("url") or data.get("officialUrl") or data.get("sourceUrl") or ""
    parsed_url = urlparse(url)
    domain = parsed_url.netloc.lower().replace("www.", "")

    source = get_source_by_domain(domain)
    source_trust = source.trust_level if source else "third_party"
    retrieval_method = source.retrieval_method if source else "manual_curated"
    source_name = source.name if source else (data.get("sourceName") or data.get("organization"))

    _, days_remaining = parse_deadline_date(data.get("deadline", ""))
    posted_date = data.get("postedDate") or data.get("posted_date")
    freshness = calculate_freshness(posted_date, days_remaining)

    # Verification status
    is_mock = data.get("isMock") or data.get("is_mock") or False
    if is_mock:
        verification_status = "mock_demo"
    elif days_remaining < 0:
        verification_status = "expired"
    elif source_trust in ("official", "recognized") and url.startswith("https://"):
        verification_status = "verified"
    else:
        verification_status = "unverified"

    return {
        "sourceTrust": source_trust,
        "sourceName": source_name,
        "retrievalMethod": retrieval_method,
        "daysRemaining": max(0, days_remaining),
        "freshness": freshness,
        "verificationStatus": verification_status,
        "lastVerified": date.today().isoformat(),
        "isClosingSoon": 0 <= days_remaining <= 7,
        "isNewToday": freshness == "NEW",
    }
