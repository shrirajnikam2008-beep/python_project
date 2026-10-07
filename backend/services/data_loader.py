"""
Data loader service: The single point of entry for reading CSV datasets from data/.
Uses functools.lru_cache for instant in-memory access.
"""
import os
import csv
import functools

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")

@functools.lru_cache(maxsize=1)
def _load_all_data():
    skills_map = {}
    skills_csv = os.path.join(DATA_DIR, "skills.csv")
    if os.path.exists(skills_csv):
        with open(skills_csv, "r", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                skills_map[r["skill_id"]] = {
                    "id": r["skill_id"],
                    "name": r["skill_name"],
                    "category": r["category"],
                    "description": r["description"],
                    "whyItMatters": r["why_it_matters"],
                    "estimatedWeeks": int(r["estimated_weeks"]) if r["estimated_weeks"] else 3,
                }

    prereqs_map = {}
    dependents_map = {}
    prereqs_csv = os.path.join(DATA_DIR, "prerequisites.csv")
    if os.path.exists(prereqs_csv):
        with open(prereqs_csv, "r", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                sid = r["skill_id"]
                pid = r["prerequisite_id"]
                prereqs_map.setdefault(sid, []).append(pid)
                dependents_map.setdefault(pid, []).append(sid)

    dest_reqs_map = {}
    reqs_csv = os.path.join(DATA_DIR, "destination_requirements.csv")
    if os.path.exists(reqs_csv):
        with open(reqs_csv, "r", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                did = r["destination_id"]
                dest_reqs_map.setdefault(did, []).append({
                    "skillId": r["skill_id"],
                    "requiredLevel": r["required_level"],
                    "importance": r["importance"],
                })

    dests_map = {}
    dests_csv = os.path.join(DATA_DIR, "destinations.csv")
    if os.path.exists(dests_csv):
        with open(dests_csv, "r", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                did = r["destination_id"]
                req_count = len(dest_reqs_map.get(did, []))
                dests_map[did] = {
                    "id": did,
                    "title": r["title"],
                    "description": r["description"],
                    "icon": r["icon"],
                    "category": r["category"],
                    "avgSalary": r.get("avg_salary", ""),
                    "tags": [t.strip() for t in r.get("tags", "").split(";") if t.strip()],
                    "requiredSkillCount": req_count,
                }

    opportunities_list = []
    opps_csv = os.path.join(DATA_DIR, "opportunities.csv")
    if os.path.exists(opps_csv):
        with open(opps_csv, "r", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                dests = [d.strip() for d in r.get("destinations", "").split(";") if d.strip()]
                tags = [t.strip() for t in r.get("tags", "").split(";") if t.strip()]
                skills = [s.strip() for s in r.get("skills", "").split(";") if s.strip()]
                domains = [d.strip() for d in r.get("domains", "").split(";") if d.strip()]
                branches = [b.strip() for b in r.get("eligible_branches", "").split(";") if b.strip()]
                trending_score = int(r.get("trending_score", 85)) if r.get("trending_score") else 85
                min_yr = int(r.get("min_year")) if r.get("min_year") else 1
                max_yr = int(r.get("max_year")) if r.get("max_year") else 4
                cgpa_req = float(r.get("cgpa_requirement")) if r.get("cgpa_requirement") else 0.0

                opportunities_list.append({
                    "id": r["opportunity_id"],
                    "title": r["title"],
                    "organization": r["organization"],
                    "type": r["type"],
                    "description": r["description"],
                    "deadline": r["deadline"],
                    "stipendOrPrize": r.get("stipend_or_prize", ""),
                    "location": r.get("location", ""),
                    "eligibility": r.get("eligibility", ""),
                    "url": r.get("url", ""),
                    "officialUrl": r.get("official_url", r.get("url", "")),
                    "sourceUrl": r.get("source_url", r.get("url", "")),
                    "sourceName": r.get("source_name", r["organization"]),
                    "sourceType": r.get("source_type", "Government"),
                    "sourceTrust": r.get("source_trust", "official"),
                    "retrievalMethod": r.get("retrieval_method", "manual_curated"),
                    "mode": r.get("mode", "Online"),
                    "destinations": dests,
                    "tags": tags,
                    "skills": skills,
                    "domains": domains,
                    "structuredEligibility": {
                        "minYear": min_yr,
                        "maxYear": max_yr,
                        "eligibleBranches": branches,
                        "cgpaRequirement": cgpa_req,
                    },
                    "featured": r.get("featured", "").lower() in ("true", "1", "yes"),
                    "trendingScore": trending_score,
                    "postedDate": r.get("posted_date", "2026-09-01"),
                    "isMock": False,
                })

    return skills_map, prereqs_map, dependents_map, dests_map, dest_reqs_map, opportunities_list

def get_skill(skill_id: str) -> dict | None:
    skills, _, _, _, _, _ = _load_all_data()
    return skills.get(skill_id)

def list_skills() -> list[dict]:
    skills, _, _, _, _, _ = _load_all_data()
    return list(skills.values())

def get_prerequisites(skill_id: str) -> list[str]:
    _, prereqs, _, _, _, _ = _load_all_data()
    return prereqs.get(skill_id, [])

def get_dependents(skill_id: str) -> list[str]:
    _, _, dependents, _, _, _ = _load_all_data()
    return dependents.get(skill_id, [])

def list_destinations() -> list[dict]:
    _, _, _, dests, _, _ = _load_all_data()
    return list(dests.values())

def get_destination(destination_id: str) -> dict | None:
    _, _, _, dests, _, _ = _load_all_data()
    return dests.get(destination_id)

def get_requirements(destination_id: str) -> list[dict]:
    _, _, _, _, reqs, _ = _load_all_data()
    return reqs.get(destination_id, [])

def list_opportunities(
    destination_id: str = None,
    opp_type: str = None,
    filter_mode: str = None
) -> list[dict]:
    _, _, _, _, _, opps = _load_all_data()
    res = opps
    if destination_id:
        res = [op for op in res if "all" in op["destinations"] or destination_id in op["destinations"]]
    if opp_type and opp_type != "all":
        res = [op for op in res if op["type"].lower() == opp_type.lower()]
    if filter_mode == "trending":
        res = sorted(res, key=lambda x: x.get("trendingScore", 0), reverse=True)
    return res

def clear_cache():
    _load_all_data.cache_clear()
