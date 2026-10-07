"""
Test Script for Gemini Personalization & Fallback Engine
Tests all 8 representative queries specified in Section 19.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

test_queries = [
    "remote AI internships for first year students",
    "I want something to help me get into AI research",
    "I know Python but I am weak in DSA. What should I apply for?",
    "beginner friendly opportunities for IT students",
    "research opportunities related to quantum computing",
    "opportunities that will improve my ML skills",
    "I want something that looks good on my resume",
    "what should I apply for if I am a first-year student?"
]

profile = {
    "name": "Alex",
    "program": "B.Tech IT",
    "branch": "Information Technology",
    "semester": 1,
    "cgpa": 8.5,
    "currentSkills": ["Python", "C", "git"],
    "selectedDestinationId": "ai-ml-engineer"
}

print("==================================================")
print("RUNNING 8 REPRESENTATIVE OPPORTUNITY QUERIES")
print("==================================================")

for i, q in enumerate(test_queries, 1):
    payload = {"query": q, "studentProfile": profile}
    r = client.post("/api/v1/opportunities/search", json=payload)
    assert r.status_code == 200, f"Query {i} failed with status {r.status_code}"
    data = r.json()
    print(f"Q{i}: \"{q}\"")
    print(f"   Status: {r.status_code} | Mode: {data.get('mode')} | Total Matches: {data.get('total')}")
    if data.get("items"):
        top = data["items"][0]
        print(f"   Top Pick: {top['title']} ({top.get('matchScore', 0)}% Match)")
        if top.get("personalizedExplanation"):
            exp = top["personalizedExplanation"]
            reasons = exp.get("whyRecommended", [])
            print(f"   Advisor Summary: {exp.get('matchSummary')}")
            print(f"   Primary Reason: {reasons[0] if reasons else 'N/A'}")
            print(f"   Potential Concern: {exp.get('potentialConcern')}")
        print(f"   Official URL: {top.get('officialUrl')}")
    print()

print("ALL 8 TEST QUERIES PASSED CLEANLY!")
