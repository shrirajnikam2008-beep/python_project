"""
Validator script that reads the four CSVs in data/ and verifies data integrity:
- Foreign key references
- No cycles in prerequisites
- Closure rule (destinations must contain all prereqs of their required skills)
- Allowed values and types
"""
import os
import csv
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

ALLOWED_CATEGORIES = {
    "Programming",
    "Mathematics",
    "Data Science",
    "Machine Learning",
    "Tools",
    "Databases",
    "Foundations",
    "Aptitude & Management",
    "General Studies",
    "Academic Research",
}
ALLOWED_LEVELS = {"Beginner", "Intermediate", "Advanced"}
ALLOWED_IMPORTANCE = {"core", "supporting", "optional"}

def validate():
    errors = []

    # 1. Load skills.csv
    skills_path = os.path.join(DATA_DIR, "skills.csv")
    if not os.path.exists(skills_path):
        print(f"ERROR: {skills_path} does not exist.")
        sys.exit(1)

    skills = {}
    with open(skills_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            sid = row["skill_id"]
            if sid in skills:
                errors.append(f"Duplicate skill_id in skills.csv: {sid}")
            if row["category"] not in ALLOWED_CATEGORIES:
                errors.append(f"Invalid category '{row['category']}' for skill {sid}")
            try:
                weeks = float(row["estimated_weeks"])
                if weeks < 0:
                    errors.append(f"Negative estimated_weeks for skill {sid}")
            except ValueError:
                errors.append(f"Invalid estimated_weeks for skill {sid}")
            skills[sid] = row

    # 2. Load destinations.csv
    dest_path = os.path.join(DATA_DIR, "destinations.csv")
    if not os.path.exists(dest_path):
        print(f"ERROR: {dest_path} does not exist.")
        sys.exit(1)

    destinations = {}
    with open(dest_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            did = row["destination_id"]
            if did in destinations:
                errors.append(f"Duplicate destination_id in destinations.csv: {did}")
            destinations[did] = row

    # 3. Load prerequisites.csv
    prereq_path = os.path.join(DATA_DIR, "prerequisites.csv")
    prereqs = {} # sid -> list of prereq_ids
    seen_prereq_pairs = set()
    with open(prereq_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            sid = row["skill_id"]
            pid = row["prerequisite_id"]
            pair = (sid, pid)
            if pair in seen_prereq_pairs:
                errors.append(f"Duplicate prerequisite pair: {pair}")
            seen_prereq_pairs.add(pair)

            if sid not in skills:
                errors.append(f"Prerequisite references unknown skill_id: {sid}")
            if pid not in skills:
                errors.append(f"Prerequisite references unknown prerequisite_id: {pid}")

            prereqs.setdefault(sid, []).append(pid)

    # 4. Check for prerequisite cycles
    def has_cycle(start, path, visited):
        visited.add(start)
        path.append(start)
        for neighbor in prereqs.get(start, []):
            if neighbor in path:
                cycle_str = " -> ".join(path[path.index(neighbor):] + [neighbor])
                errors.append(f"Prerequisite cycle detected: {cycle_str}")
                return True
            if neighbor not in visited:
                if has_cycle(neighbor, path, visited):
                    return True
        path.pop()
        return False

    visited_nodes = set()
    for s in skills:
        if s not in visited_nodes:
            has_cycle(s, [], visited_nodes)

    # 5. Load destination_requirements.csv
    req_path = os.path.join(DATA_DIR, "destination_requirements.csv")
    dest_reqs = {} # did -> set of sids
    with open(req_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            did = row["destination_id"]
            sid = row["skill_id"]
            lvl = row["required_level"]
            imp = row["importance"]

            if did not in destinations:
                errors.append(f"Requirements references unknown destination_id: {did}")
            if sid not in skills:
                errors.append(f"Requirements references unknown skill_id: {sid}")
            if lvl not in ALLOWED_LEVELS:
                errors.append(f"Invalid required_level '{lvl}' for destination {did}, skill {sid}")
            if imp not in ALLOWED_IMPORTANCE:
                errors.append(f"Invalid importance '{imp}' for destination {did}, skill {sid}")

            dest_reqs.setdefault(did, set()).add(sid)

    # 6. Check destination minimum requirement (at least 5) and closure rule
    for did, req_set in dest_reqs.items():
        if len(req_set) < 5:
            errors.append(f"Destination {did} has fewer than 5 requirements ({len(req_set)})")

        # Closure rule: if destination requires skill S, it must also require all prerequisites of S
        for sid in list(req_set):
            for pid in prereqs.get(sid, []):
                if pid not in req_set:
                    errors.append(f"Closure rule violated in {did}: requires '{sid}' which needs '{pid}', but '{pid}' is missing from {did} requirements.")

    if errors:
        print("❌ Validation FAILED with errors:")
        for err in errors:
            print(f"  - {err}")
        return False
    else:
        print("✅ Validation PASSED: All CSVs satisfy integrity, cycle-free, and closure rules!")
        return True

if __name__ == "__main__":
    if not validate():
        sys.exit(1)
