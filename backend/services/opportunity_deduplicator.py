"""
Opportunity Deduplication Service
Identifies duplicate opportunities across sources and retains the Tier 1 canonical record.
"""
from typing import List, Dict, Any
from urllib.parse import urlparse
import re

def normalize_title(title: str) -> str:
    # Lowercase, strip year suffixes like (2026), remove non-alphanumeric
    cleaned = re.sub(r'\(?\b(202[4-9]|2030)\b\)?', '', title, flags=re.IGNORECASE)
    cleaned = re.sub(r'[^a-zA-Z0-9\s]', '', cleaned).lower().strip()
    return re.sub(r'\s+', ' ', cleaned)

def deduplicate_opportunities(opps: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    seen_keys = {}
    deduped = []

    for op in opps:
        url = op.get("officialUrl") or op.get("url") or ""
        parsed = urlparse(url)
        domain = parsed.netloc.lower().replace("www.", "")
        path = parsed.path.rstrip("/").lower()
        title_norm = normalize_title(op.get("title", ""))

        key = f"{domain}:{title_norm}" if domain else title_norm

        if key in seen_keys:
            existing_idx = seen_keys[key]
            existing = deduped[existing_idx]
            # Prioritize Tier 1 Official source over others
            if op.get("sourceTrust") == "official" and existing.get("sourceTrust") != "official":
                deduped[existing_idx] = op
        else:
            seen_keys[key] = len(deduped)
            deduped.append(op)

    return deduped
