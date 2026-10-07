"""
Base abstract adapter for Opportunity Source Ingestion.
Enforces compliance with robots.txt, rate limits, and permitted access policies.
If an automated channel does not exist, the source is designated as manual/curated.
"""
from abc import ABC, abstractmethod
from typing import List, Dict, Any

class OpportunitySourceAdapter(ABC):
    def __init__(self, source_id: str, name: str, domain: str, retrieval_method: str):
        self.source_id = source_id
        self.name = name
        self.domain = domain
        self.retrieval_method = retrieval_method
        self.is_automated = retrieval_method in ("official_api", "rss_atom", "public_structured")

    @abstractmethod
    def fetch_raw(self) -> List[Dict[str, Any]]:
        """
        Retrieves raw opportunity records via verified official endpoint.
        Returns empty list if source is manual_curated.
        """
        pass

    @abstractmethod
    def normalize(self, raw_record: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalizes external payload into Waypoint canonical schema.
        """
        pass

    @abstractmethod
    def validate(self, normalized_record: Dict[str, Any]) -> bool:
        """
        Strict validation: URL must be valid HTTPS, organization and deadline present.
        """
        pass
